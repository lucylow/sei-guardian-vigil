import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
    sei?: any;
  }
}

export default function ConnectWalletButton() {
  const { isConnected, account, networkInfo, setIsConnected, setAccount, setNetworkInfo } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    if (!isConnected) {
      checkExistingConnection();
    }
  }, [isConnected]);

  const checkExistingConnection = async () => {
    try {
      if (window.keplr && window.keplr.getKey) {
        const key = await window.keplr.getKey(seiConfig.chainId);
        if (key) {
          // Only set the account and network info, don't set isConnected to true
          // The user should explicitly connect through the connect button
          console.log("Found existing key but not auto-connecting:", key.bech32Address);
        }
      }
    } catch (error) {
      console.log("No existing connection found");
    }
  };

  const connectKeplr = async () => {
    console.log('ConnectWalletButton: Starting wallet connection...');
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.keplr) {
        console.log('ConnectWalletButton: Keplr not found');
        setError("Keplr wallet is not installed");
        toast({
          title: "Wallet Not Found",
          description: "Please install Keplr wallet extension to connect to Sei Network.",
        });
        return;
      }

      console.log('ConnectWalletButton: Keplr found, suggesting chain...');
      // Suggest chain configuration
      await window.keplr.experimentalSuggestChain(seiConfig);
      
      console.log('ConnectWalletButton: Chain suggested, enabling...');
      // Enable the chain
      await window.keplr.enable(seiConfig.chainId);
      
      console.log('ConnectWalletButton: Chain enabled, getting account...');
      // Get account directly from Keplr
      const key = await window.keplr.getKey(seiConfig.chainId);
      
      console.log('ConnectWalletButton: Got key:', key);
      
      if (key && key.bech32Address) {
        console.log('ConnectWalletButton: Setting wallet state...');
        console.log('ConnectWalletButton: Account:', key.bech32Address);
        console.log('ConnectWalletButton: Network Info:', {
          chainId: seiConfig.chainId,
          chainName: seiConfig.chainName,
          rpc: seiConfig.rpc
        });
        
        setAccount(key.bech32Address);
        setNetworkInfo({
          chainId: seiConfig.chainId,
          chainName: seiConfig.chainName,
          rpc: seiConfig.rpc
        });
        setIsConnected(true);
        
        console.log('ConnectWalletButton: Wallet state updated, showing toast...');
        console.log('ConnectWalletButton: isConnected should now be true');
        
        toast({
          title: "Wallet Connected!",
          description: `Successfully connected to ${seiConfig.chainName}. Redirecting to dashboard...`,
        });
        
        console.log('ConnectWalletButton: Wallet connection complete');
      } else {
        console.log('ConnectWalletButton: No account found');
        setError("No account found in wallet");
      }
    } catch (err: any) {
      console.error('ConnectWalletButton: Error during connection:', err);
      const errorMessage = err.message || "Failed to connect wallet";
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetworkInfo(null);
    setIsConnected(false);
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
        setCopied(true);
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
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

  if (isConnected && account) {
    return (
      <div className="flex items-center space-x-3">
        {/* Network Info */}
        <div className="hidden md:flex items-center space-x-3">
          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-900/40 to-red-800/40 border-red-700/50 text-red-300 font-mono tracking-wide shadow-lg shadow-red-500/20 font-bold">
            {networkInfo?.chainName || "SEI NETWORK"}
          </Badge>
        </div>
        
        {/* Wallet Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={openKeplr}
          className="flex items-center space-x-3 border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline font-mono">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </Button>
        
        {/* Copy Address */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyAddress}
          className="px-3 text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 transform hover:scale-105"
        >
          {copied ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
        
        {/* Disconnect */}
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="px-4 text-red-600/70 hover:text-red-500 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
        >
          DISCONNECT
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {error && (
        <div className="flex items-center space-x-2 text-red-500 text-xs font-mono tracking-wide bg-red-900/20 px-3 py-2 rounded-lg border border-red-700/30">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={connectKeplr}
        disabled={isConnecting}
        className="flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 transition-all duration-300 font-mono tracking-wide font-bold shadow-2xl hover:shadow-red-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>CONNECTING...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>CONNECT WALLET</span>
          </>
        )}
      </Button>
      
      {/* Install Keplr Link */}
      {!window.keplr && (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-2 border-red-700/50 text-red-600/70 hover:border-red-600 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
        >
          <a 
            href="https://www.keplr.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="text-xs">INSTALL KEPLR</span>
          </a>
        </Button>
      )}
    </div>
  );
}
