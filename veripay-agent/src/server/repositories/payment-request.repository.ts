import { createSupabaseClient } from "@/lib/db";
import type { PaymentRequestRecord } from "@/server/validators/payment-intent";

type PaymentStore = Map<string, PaymentRequestRecord>;
const TABLE_NAME = "payment_requests";

const globalStore = globalThis as typeof globalThis & {
  __veripayPaymentStore?: PaymentStore;
};

const supabase = createSupabaseClient("service");

function getStore() {
  if (!globalStore.__veripayPaymentStore) {
    globalStore.__veripayPaymentStore = new Map<string, PaymentRequestRecord>();
  }

  return globalStore.__veripayPaymentStore;
}

function cloneRecord(record: PaymentRequestRecord) {
  return structuredClone(record);
}

function isNotFoundError(error: { code?: string; status?: number }) {
  return error.code === "PGRST116" || error.status === 406;
}

export async function savePaymentRequest(record: PaymentRequestRecord) {
  if (!supabase) {
    getStore().set(record.paymentRequestId, cloneRecord(record));
    return cloneRecord(record);
  }

  const payload = {
    payment_request_id: record.paymentRequestId,
    record,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(payload, { onConflict: "payment_request_id" })
    .select("record")
    .single();

  if (error) {
    throw new Error(`Supabase save failed: ${error.message}`);
  }

  return data?.record ? cloneRecord(data.record) : cloneRecord(record);
}

export async function getPaymentRequest(paymentRequestId: string) {
  if (!supabase) {
    const record = getStore().get(paymentRequestId);
    return record ? cloneRecord(record) : null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("record")
    .eq("payment_request_id", paymentRequestId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw new Error(`Supabase read failed: ${error.message}`);
  }

  return data?.record ? cloneRecord(data.record) : null;
}
