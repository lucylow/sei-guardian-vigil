import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Wallet, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  Zap,
  Shield,
  LogOut,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Wallet types supported
export type WalletType = 'keplr' | 'metamask' | 'compass' | null;

interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  type: WalletType;
}

interface WalletConfig {
  name: string;
  icon: string;
  description: string;
  installUrl: string;
  checkFunction: () => boolean;
  connectFunction: () => Promise<WalletInfo>;
}

declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
    compass?: any;
  }
}

export function MultiWalletConnect() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const { toast } = useToast();

  const walletConfigs: Record<WalletType, WalletConfig> = {
    keplr: {
      name: 'Keplr Wallet',
      icon: '🔮',
      description: 'Native Cosmos wallet with Sei Network support',
      installUrl: 'https://www.keplr.app/',
      checkFunction: () => !!window.keplr,
      connectFunction: async () => {
        if (!window.keplr) {
          throw new Error('Keplr wallet not found');
        }
        
        // Enable Keplr for Sei Testnet (updated chain ID)
        await window.keplr.enable('sei-testnet-1');
        
        // Get account info
        const offlineSigner = window.keplr.getOfflineSigner('sei-testnet-1');
        const accounts = await offlineSigner.getAccounts();
        
        // Get balance (mock for demo)
        const mockBalance = '1,234.56 SEI';
        
        return {
          address: accounts[0].address,
          balance: mockBalance,
          network: 'Sei Testnet',
          type: 'keplr' as WalletType
        };
      }
    },
    metamask: {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Popular Ethereum wallet with SEI EVM support',
      installUrl: 'https://metamask.io/',
      checkFunction: () => !!window.ethereum?.isMetaMask,
      connectFunction: async () => {
        if (!window.ethereum?.isMetaMask) {
          throw new Error('MetaMask not found');
        }
        
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        // Switch to Sei network if needed
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xAE516' }], // Sei Testnet chain ID (713710)
          });
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xAE516', // Sei Testnet chain ID (713710)
                chainName: 'Sei Testnet',
                nativeCurrency: {
                  name: 'SEI',
                  symbol: 'SEI',
                  decimals: 18
                },
                rpcUrls: ['https://testnet-rpc.sei.juno.deuslabs.fi'],
                blockExplorerUrls: ['https://testnet.seitrace.com']
              }]
            });
          }
        }
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        
        const balanceInSei = (parseInt(balance, 16) / 1e18).toFixed(4);
        
        return {
          address: accounts[0],
          balance: `${balanceInSei} SEI`,
          network: 'Sei Devnet (EVM)',
          type: 'metamask' as WalletType
        };
      }
    },
    compass: {
      name: 'Compass Wallet',
      icon: '🧭',
      description: 'Multi-chain wallet with Sei integration',
      installUrl: 'https://compasswallet.io/',
      checkFunction: () => !!window.compass,
      connectFunction: async () => {
        if (!window.compass) {
          throw new Error('Compass wallet not found');
        }
        
        // Enable Compass for Sei Testnet
        await window.compass.enable('sei-testnet-1');
        
        const accounts = await window.compass.getAccounts('sei-testnet-1');
        const mockBalance = '987.65 SEI';
        
        return {
          address: accounts[0].address,
          balance: mockBalance,
          network: 'Sei Testnet',
          type: 'compass' as WalletType
        };
      }
    }
  };

  const connectWallet = async (walletType: WalletType) => {
    if (!walletType) return;
    
    setIsConnecting(true);
    try {
      const config = walletConfigs[walletType];
      
      if (!config.checkFunction()) {
        toast({
          title: "Wallet Not Found",
          description: `${config.name} is not installed. Please install it first.`,
          variant: "destructive"
        });
        return;
      }
      
      const info = await config.connectFunction();
      setWalletInfo(info);
      setShowWalletDialog(false);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${config.name}`,
      });
      
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || 'Failed to connect wallet',
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletInfo(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check for wallet connections on mount
  useEffect(() => {
    const checkExistingConnections = async () => {
      // Check Keplr
      if (window.keplr) {
        try {
          const offlineSigner = window.keplr.getOfflineSigner('sei-testnet-1');
          const accounts = await offlineSigner.getAccounts();
          if (accounts.length > 0) {
            const info = await walletConfigs.keplr.connectFunction();
            setWalletInfo(info);
            return;
          }
        } catch (error) {
          // Not connected
        }
      }
      
      // Check MetaMask
      if (window.ethereum?.isMetaMask) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const info = await walletConfigs.metamask.connectFunction();
            setWalletInfo(info);
            return;
          }
        } catch (error) {
          // Not connected
        }
      }
    };

    checkExistingConnections();
  }, []);

  if (walletInfo) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="sei-button-secondary">
            <Wallet className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">{formatAddress(walletInfo.address)}</span>
            <Badge variant="secondary" className="ml-2 sei-badge">
              {walletInfo.balance}
            </Badge>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-card border-border" align="end">
          <DropdownMenuLabel className="font-mono tracking-wide">
            Connected Wallet
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {walletConfigs[walletInfo.type]?.icon}
                </span>
                <span className="font-medium">
                  {walletConfigs[walletInfo.type]?.name}
                </span>
              </div>
              <Badge variant="secondary" className="sei-status-online">
                Connected
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-mono">{walletInfo.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-mono text-primary font-bold">{walletInfo.balance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Address:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 px-2 font-mono text-xs"
                >
                  {formatAddress(walletInfo.address)}
                  <Copy className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
      <DialogTrigger asChild>
        <Button className="sei-button-primary">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Connect Your Wallet</span>
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to SEI Guardian Vigil. All wallets support Sei Testnet for development and testing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {Object.entries(walletConfigs).map(([key, config]) => {
            const walletType = key as WalletType;
            const isInstalled = config.checkFunction();
            
            return (
              <Card key={key} className="sei-card-enhanced group cursor-pointer" onClick={() => isInstalled ? connectWallet(walletType) : window.open(config.installUrl, '_blank')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <div className="font-semibold tracking-wide">{config.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {config.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!isInstalled && (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">Not Installed</span>
                        </>
                      )}
                      {isInstalled && (
                        <>
                          <Zap className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500">Ready</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {key === 'keplr' && (
                    <Badge variant="secondary" className="mt-2 sei-badge">
                      <Shield className="w-3 h-3 mr-1" />
                      Recommended for Sei
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong>Note:</strong> Make sure your wallet is connected to Sei Testnet. 
              MetaMask users will be prompted to add/switch to Sei Testnet automatically.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}