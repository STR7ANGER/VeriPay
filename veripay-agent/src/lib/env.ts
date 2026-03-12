import { z } from "zod";

const serverEnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required."),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: z.string().url(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: z.string().url(),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}

export function getClientEnv() {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL:
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  });
}
