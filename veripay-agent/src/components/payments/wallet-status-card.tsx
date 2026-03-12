"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "@/lib/chains";
import { formatAddress } from "@/lib/utils";

type WalletStatusCardProps = {
  walletAddress?: string;
  onWalletConnected: (address?: string) => void;
};

export function WalletStatusCard({
  walletAddress,
  onWalletConnected,
}: WalletStatusCardProps) {
  const { address, chainId, isConnected } = useAccount();
  const { connect, isPending: isConnecting, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  useEffect(() => {
    onWalletConnected(address);
  }, [address, onWalletConnected]);

  const wrongChain = isConnected && chainId !== baseSepolia.id;

  return (
    <div className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-6 shadow-[0_30px_80px_rgba(53,33,9,0.14)] backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase">
        Wallet
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">
            {isConnected ? "Wallet connected" : "Connect Phantom"}
          </h2>
          <p className="text-sm leading-6 text-stone-700">
            The app uses an injected EVM wallet flow so Phantom is preferred,
            but other compatible EVM wallets can work too.
          </p>
        </div>

        <div className="rounded-[1.5rem] bg-stone-100 p-4 text-sm text-stone-700">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill label={isConnected ? "Connected" : "Disconnected"} />
            <StatusPill
              label={wrongChain ? "Wrong network" : "Base Sepolia ready"}
            />
          </div>
          <p className="mt-3 break-all font-mono text-xs">
            {walletAddress
              ? formatAddress(walletAddress)
              : "No wallet connected"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isConnected ? (
            <button
              type="button"
              onClick={() =>
                connect({
                  connector: injected(),
                  chainId: baseSepolia.id,
                })
              }
              disabled={isConnecting}
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {isConnecting ? "Connecting..." : "Connect wallet"}
            </button>
          ) : (
            <>
              {wrongChain ? (
                <button
                  type="button"
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  disabled={isSwitching}
                  className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-200"
                >
                  {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => disconnect()}
                className="rounded-full border border-stone-900/10 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
              >
                Disconnect
              </button>
            </>
          )}
        </div>

        {error ? <p className="text-sm text-red-700">{error.message}</p> : null}
      </div>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-stone-900/10 bg-white px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase text-stone-600">
      {label}
    </span>
  );
}
