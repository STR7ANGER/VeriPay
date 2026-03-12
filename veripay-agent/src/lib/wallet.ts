import { createConfig, fallback, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "@/lib/chains";
import { getClientEnv } from "@/lib/env";

const env = getClientEnv();

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: fallback([http(env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)]),
  },
  ssr: true,
});
