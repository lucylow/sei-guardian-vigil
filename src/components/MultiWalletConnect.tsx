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

// Sei Network Configurations
const SEI_NETWORKS = {
  mainnet: {
    chainId: 'sei-1',
    rpc: 'https://rpc.sei.juno.deuslabs.fi',
    rest: 'https://lcd.sei.juno.deuslabs.fi',
    prefix: 'sei'
  },
  testnet: {
    chainId: 'sei-testnet-1',
    rpc: 'https://testnet-rpc.sei.juno.deuslabs.fi',
    rest: 'https://testnet-lcd.sei.juno.deuslabs.fi',
    prefix: 'sei'
  },
  evm: {
    chainId: '0xAE4C3', // 713715 in hex
    rpc: 'https://evm-rpc.sei.juno.deuslabs.fi',
    chainName: 'Sei EVM',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18
    },
    blockExplorer: 'https://sei.evmscan.io'
  }
};

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
      description: 'Native Cosmos wallet with Sei Testnet support',
      installUrl: 'https://www.keplr.app/',
      checkFunction: () => !!window.keplr,
      connectFunction: async () => {
        if (!window.keplr) {
          throw new Error('Keplr wallet not found');
        }
        
        try {
          // Enable Keplr for Sei Testnet
          await window.keplr.enable(SEI_NETWORKS.testnet.chainId);
          
          // Get account info
          const offlineSigner = window.keplr.getOfflineSigner(SEI_NETWORKS.testnet.chainId);
          const accounts = await offlineSigner.getAccounts();
          
          if (accounts.length === 0) {
            throw new Error('No accounts found in Keplr wallet');
          }
          
          // Get balance using RPC
          try {
            const response = await fetch(`${SEI_NETWORKS.testnet.rest}/cosmos/bank/v1beta1/balances/${accounts[0].address}/by_denom?denom=usei`);
            const balanceData = await response.json();
            const balance = balanceData.balance?.amount || '0';
            const balanceInSei = (parseInt(balance) / 1000000).toFixed(6);
            
            return {
              address: accounts[0].address,
              balance: `${balanceInSei} SEI`,
              network: 'Sei Testnet',
              type: 'keplr' as WalletType
            };
          } catch (balanceError) {
            // Fallback to mock balance if RPC fails
            console.warn('Failed to fetch balance, using mock:', balanceError);
            return {
              address: accounts[0].address,
              balance: '0.000000 SEI',
              network: 'Sei Testnet',
              type: 'keplr' as WalletType
            };
          }
        } catch (error: any) {
          if (error.message.includes('User rejected')) {
            throw new Error('User rejected the connection request');
          } else if (error.message.includes('No accounts found')) {
            throw new Error('No accounts found in Keplr wallet');
          } else {
            throw new Error(`Failed to connect Keplr: ${error.message}`);
          }
        }
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
        
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found in MetaMask');
          }
          
          // Switch to Sei EVM network if needed
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: SEI_NETWORKS.evm.chainId }],
            });
          } catch (switchError: any) {
            // If network doesn't exist, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: SEI_NETWORKS.evm.chainId,
                  chainName: SEI_NETWORKS.evm.chainName,
                  nativeCurrency: SEI_NETWORKS.evm.nativeCurrency,
                  rpcUrls: [SEI_NETWORKS.evm.rpc],
                  blockExplorerUrls: [SEI_NETWORKS.evm.blockExplorer]
                }]
              });
            } else {
              throw switchError;
            }
          }
          
          // Get balance
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest'],
          });
          
          const balanceInSei = (parseInt(balance, 16) / 1e18).toFixed(6);
          
          return {
            address: accounts[0],
            balance: `${balanceInSei} SEI`,
            network: 'Sei EVM',
            type: 'metamask' as WalletType
          };
        } catch (error: any) {
          if (error.message.includes('User rejected')) {
            throw new Error('User rejected the connection request');
          } else if (error.message.includes('No accounts found')) {
            throw new Error('No accounts found in MetaMask');
          } else {
            throw new Error(`Failed to connect MetaMask: ${error.message}`);
          }
        }
      }
    },
    compass: {
      name: 'Compass Wallet',
      icon: '🧭',
      description: 'Multi-chain wallet with Sei Testnet integration',
      installUrl: 'https://compasswallet.io/',
      checkFunction: () => !!window.compass,
      connectFunction: async () => {
        if (!window.compass) {
          throw new Error('Compass wallet not found');
        }
        
        try {
          // Enable Compass for Sei Testnet
          await window.compass.enable(SEI_NETWORKS.testnet.chainId);
          
          // Get accounts
          const accounts = await window.compass.getAccounts(SEI_NETWORKS.testnet.chainId);
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found in Compass wallet');
          }
          
          // Get balance using RPC
          try {
            const response = await fetch(`${SEI_NETWORKS.testnet.rest}/cosmos/bank/v1beta1/balances/${accounts[0].address}/by_denom?denom=usei`);
            const balanceData = await response.json();
            const balance = balanceData.balance?.amount || '0';
            const balanceInSei = (parseInt(balance) / 1000000).toFixed(6);
            
            return {
              address: accounts[0].address,
              balance: `${balanceInSei} SEI`,
              network: 'Sei Testnet',
              type: 'compass' as WalletType
            };
          } catch (balanceError) {
            // Fallback to mock balance if RPC fails
            console.warn('Failed to fetch balance, using mock:', balanceError);
            return {
              address: accounts[0].address,
              balance: '0.000000 SEI',
              network: 'Sei Testnet',
              type: 'compass' as WalletType
            };
          }
        } catch (error: any) {
          if (error.message.includes('User rejected')) {
            throw new Error('User rejected the connection request');
          } else if (error.message.includes('No accounts found')) {
            throw new Error('No accounts found in Compass wallet');
          } else {
            throw new Error(`Failed to connect Compass: ${error.message}`);
          }
        }
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
          const offlineSigner = window.keplr.getOfflineSigner(SEI_NETWORKS.testnet.chainId);
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
      
      // Check Compass
      if (window.compass) {
        try {
          const accounts = await window.compass.getAccounts(SEI_NETWORKS.testnet.chainId);
          if (accounts && accounts.length > 0) {
            const info = await walletConfigs.compass.connectFunction();
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
            Choose a wallet to connect to SEI Guardian Vigil. All wallets support Sei networks for development and testing.
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
              <strong>Note:</strong> Make sure your wallet is connected to the correct Sei network. 
              MetaMask users will be prompted to add/switch to Sei EVM automatically.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}