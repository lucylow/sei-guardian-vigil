import React, { useState } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import LaunchPage from "./LaunchPage";
import { Shield, Lock, Sparkles } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface WalletGateProps {
  children: React.ReactNode;
}

export default function WalletGate({ children }: WalletGateProps) {
  const { isConnected, connectWallet } = useWallet();
  const [showLaunchPage, setShowLaunchPage] = useState(true);

  const handleLaunch = () => {
    setShowLaunchPage(false);
  };

  if (!isConnected) {
    if (showLaunchPage) {
      return <LaunchPage onLaunch={handleLaunch} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Secure access to SEI Sentinel
            </p>
            <p className="text-lg text-muted-foreground">
              Choose your preferred wallet to continue
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <ConnectWalletButton onConnect={connectWallet} />
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-card border">
              <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Secure Access</h3>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to access the security dashboard
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">AI Agents</h3>
              <p className="text-sm text-muted-foreground">
                Deploy and manage intelligent security agents
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Real-time Protection</h3>
              <p className="text-sm text-muted-foreground">
                Monitor and protect smart contracts 24/7
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Supported Wallets: Keplr, MetaMask</p>
            <p className="mt-1">
              <a 
                href="https://sei.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Learn more about Sei Network
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
