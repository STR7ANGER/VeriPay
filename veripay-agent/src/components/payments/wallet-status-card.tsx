"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "@/lib/chains";
import { formatAddress } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <Badge>Wallet</Badge>
        <div className="flex flex-col gap-1">
          <CardTitle>
            {isConnected ? "Wallet connected" : "Connect Phantom"}
          </CardTitle>
          <CardDescription>
            The app uses an injected EVM wallet flow so Phantom is preferred,
            but other compatible EVM wallets can work too.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-[1.5rem] bg-stone-100 p-4 text-sm text-stone-700">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{isConnected ? "Connected" : "Disconnected"}</Badge>
            <Badge>{wrongChain ? "Wrong network" : "Base Sepolia ready"}</Badge>
          </div>
          <p className="mt-3 break-all font-mono text-xs">
            {walletAddress
              ? formatAddress(walletAddress)
              : "No wallet connected"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isConnected ? (
            <Button
              type="button"
              onClick={() =>
                connect({
                  connector: injected(),
                  chainId: baseSepolia.id,
                })
              }
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect wallet"}
            </Button>
          ) : (
            <>
              {wrongChain ? (
                <Button
                  type="button"
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  disabled={isSwitching}
                  variant="amber"
                >
                  {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={() => disconnect()}
                variant="outline"
              >
                Disconnect
              </Button>
            </>
          )}
        </div>

        {error ? <p className="text-sm text-red-700">{error.message}</p> : null}
      </CardContent>
    </Card>
  );
}
