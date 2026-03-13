import { createHash, randomBytes } from "node:crypto";

export function createNonce() {
  return randomBytes(8).toString("hex");
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }

  return value;
}

export function createProofHash(payload: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(sortKeys(payload)))
    .digest("hex");
}
