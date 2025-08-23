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

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    console.error('useWallet must be used within a WalletProvider');
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
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

  console.log('WalletProvider: Rendering with state:', { isConnected, account: account ? 'connected' : 'not connected' });

  const value = {
    isConnected,
    account,
    networkInfo,
    setIsConnected,
    setAccount,
    setNetworkInfo,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
