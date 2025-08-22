import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
    sei?: any;
  }
}

export default function ConnectWalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{
    chainId: string;
    chainName: string;
    rpc: string;
  } | null>(null);

  // Sei Network configuration
  const seiConfig = {
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
    features: ["stargate", "ibc-transfer", "cosmwasm"]
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      if (window.keplr && window.keplr.getKey) {
        const key = await window.keplr.getKey(seiConfig.chainId);
        if (key) {
          setAccount(key.bech32Address);
          setNetworkInfo({
            chainId: seiConfig.chainId,
            chainName: seiConfig.chainName,
            rpc: seiConfig.rpc
          });
        }
      }
    } catch (error) {
      console.log("No existing connection found");
    }
  };

  const connectKeplr = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.keplr) {
        setError("Keplr wallet is not installed");
        toast({
          title: "Wallet Not Found",
          description: "Please install Keplr wallet extension to connect to Sei Network.",
          variant: "destructive",
        });
        return;
      }

      // Suggest chain configuration
      await window.keplr.experimentalSuggestChain(seiConfig);
      
      // Enable the chain
      await window.keplr.enable(seiConfig.chainId);
      
      // Get offline signer
      const offlineSigner = window.getOfflineSigner(seiConfig.chainId);
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account.bech32Address);
        setNetworkInfo({
          chainId: seiConfig.chainId,
          chainName: seiConfig.chainName,
          rpc: seiConfig.rpc
        });
        
        toast({
          title: "Wallet Connected!",
          description: `Successfully connected to ${seiConfig.chainName}`,
        });
      } else {
        setError("No accounts found in wallet");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to connect wallet";
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetworkInfo(null);
    setError(null);
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from Sei Network",
    });
  };

  const copyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy address to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const openKeplr = () => {
    if (window.keplr) {
      window.keplr.openPopup();
    }
  };

  if (account) {
    return (
      <div className="flex items-center space-x-2">
        {/* Network Info */}
        <div className="hidden md:flex items-center space-x-2 text-sm">
          <Badge variant="secondary" className="text-xs">
            {networkInfo?.chainName || "Sei Network"}
          </Badge>
        </div>
        
        {/* Wallet Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={openKeplr}
          className="flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </Button>
        
        {/* Copy Address */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyAddress}
          className="px-2"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        {/* Disconnect */}
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={connectKeplr}
        disabled={isConnecting}
        className="flex items-center space-x-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      
      {/* Install Keplr Link */}
      {!window.keplr && (
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a 
            href="https://www.keplr.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="text-xs">Install Keplr</span>
          </a>
        </Button>
      )}
    </div>
  );
}
