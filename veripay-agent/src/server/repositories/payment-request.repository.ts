import type { PaymentRequestRecord } from "@/server/validators/payment-intent";

type PaymentStore = Map<string, PaymentRequestRecord>;

const globalStore = globalThis as typeof globalThis & {
  __veripayPaymentStore?: PaymentStore;
};

function getStore() {
  if (!globalStore.__veripayPaymentStore) {
    globalStore.__veripayPaymentStore = new Map<string, PaymentRequestRecord>();
  }

  return globalStore.__veripayPaymentStore;
}

export function savePaymentRequest(record: PaymentRequestRecord) {
  getStore().set(record.paymentRequestId, structuredClone(record));
  return structuredClone(record);
}

export function getPaymentRequest(paymentRequestId: string) {
  const record = getStore().get(paymentRequestId);
  return record ? structuredClone(record) : null;
}
