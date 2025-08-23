import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  networkInfo: {
    chainId: string;
    chainName: string;
    rpc: string;
  } | null;
  setIsConnected: (connected: boolean) => void;
  setAccount: (account: string | null) => void;
  setNetworkInfo: (info: any) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    console.error('useWallet must be used within a WalletProvider');
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{
    chainId: string;
    chainName: string;
    rpc: string;
  } | null>(null);

  // Check for existing wallet connection on mount
  useEffect(() => {
    console.log('WalletProvider: Checking for existing connection...');
    const checkExistingConnection = async () => {
      try {
        if (window.keplr && window.keplr.getKey) {
          const seiConfig = {
            chainId: "atlantic-1",
            chainName: "Sei Testnet (Atlantic)",
            rpc: "https://rpc.atlantic-1.seinetwork.io",
          };
          
          const key = await window.keplr.getKey(seiConfig.chainId);
          if (key) {
            console.log('WalletProvider: Found existing connection:', key.bech32Address);
            setAccount(key.bech32Address);
            setNetworkInfo({
              chainId: seiConfig.chainId,
              chainName: seiConfig.chainName,
              rpc: seiConfig.rpc
            });
            setIsConnected(true);
          } else {
            console.log('WalletProvider: No existing connection found');
          }
        } else {
          console.log('WalletProvider: Keplr not available');
        }
      } catch (error) {
        console.log("WalletProvider: Error checking existing connection:", error);
      }
    };

    checkExistingConnection();
  }, []);

  // Add debugging for state changes
  useEffect(() => {
    console.log('WalletProvider: isConnected state changed to:', isConnected);
    console.log('WalletProvider: Current state:', { isConnected, account, networkInfo });
  }, [isConnected, account, networkInfo]);

  console.log('WalletProvider: Rendering with state:', { isConnected, account: account ? 'connected' : 'not connected' });

  const value = {
    isConnected,
    account,
    networkInfo,
    setIsConnected: (connected: boolean) => {
      console.log('WalletProvider: setIsConnected called with:', connected);
      console.log('WalletProvider: Previous isConnected:', isConnected);
      setIsConnected(connected);
    },
    setAccount: (account: string | null) => {
      console.log('WalletProvider: setAccount called with:', account);
      console.log('WalletProvider: Previous account:', account);
      setAccount(account);
    },
    setNetworkInfo: (info: any) => {
      console.log('WalletProvider: setNetworkInfo called with:', info);
      console.log('WalletProvider: Previous networkInfo:', networkInfo);
      setNetworkInfo(info);
    },
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export { useWallet, WalletProvider };
