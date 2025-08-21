import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
    ethereum?: any;
  }
}

interface WalletConnectionProps {
  onConnect: (walletType: string, address: string) => void;
}

export default function ConnectWalletButton({ onConnect }: WalletConnectionProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    const savedWallet = localStorage.getItem('sei-sentinel-wallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setAccount(walletData.address);
        setWalletType(walletData.type);
        onConnect(walletData.type, walletData.address);
      } catch (err) {
        localStorage.removeItem('sei-sentinel-wallet');
      }
    }
  }, [onConnect]);

  async function connectKeplr() {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.keplr) {
        setError("Keplr wallet is not installed. Please install it from the Chrome Web Store.");
        return;
      }

      await window.keplr.experimentalSuggestChain({
        chainId: "atlantic-1",
        chainName: "Sei Testnet (Atlantic)",
        rpc: "https://rpc.atlantic-1.seinetwork.io",
        rest: "https://lcd.atlantic-1.seinetwork.io",
        bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: "sei",
          bech32PrefixAccPub: "seipub",
          bech32PrefixValAddr: "seivaloper",
          bech32PrefixValPub: "seivaloperpub",
          bech32PrefixConsAddr: "seivalcons",
          bech32PrefixConsPub: "seivalconspub"
        },
        currencies: [{
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
        }],
        feeCurrencies: [{
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
          gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 }
        }],
        stakeCurrency: {
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
        },
        features: ["stargate", "ibc-transfer"]
      });

      await window.keplr.enable("atlantic-1");
      const offlineSigner = window.getOfflineSigner("atlantic-1");
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setAccount(address);
        setWalletType("Keplr");
        localStorage.setItem('sei-sentinel-wallet', JSON.stringify({
          type: "Keplr",
          address: address
        }));
        onConnect("Keplr", address);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect Keplr wallet");
    } finally {
      setIsConnecting(false);
    }
  }

  async function connectMetaMask() {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install it from the Chrome Web Store.");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        setWalletType("MetaMask");
        localStorage.setItem('sei-sentinel-wallet', JSON.stringify({
          type: "MetaMask",
          address: address
        }));
        onConnect("MetaMask", address);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect MetaMask");
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setWalletType(null);
    localStorage.removeItem('sei-sentinel-wallet');
    onConnect("", "");
  }

  if (account) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            {walletType} - {account.slice(0, 6)}...{account.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={disconnectWallet} 
            variant="outline" 
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          Choose your preferred wallet to access SEI Sentinel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={connectKeplr} 
          disabled={isConnecting}
          className="w-full h-12 text-base"
          variant="outline"
        >
          {isConnecting ? "Connecting..." : "Connect Keplr"}
        </Button>
        
        <Button 
          onClick={connectMetaMask} 
          disabled={isConnecting}
          className="w-full h-12 text-base"
          variant="outline"
        >
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>Don't have a wallet?</p>
          <div className="flex gap-4 justify-center mt-2">
            <a 
              href="https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcchachbdmoa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Install Keplr <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Install MetaMask <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
