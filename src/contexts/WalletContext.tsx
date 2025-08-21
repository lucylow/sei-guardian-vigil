import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletInfo {
  type: string;
  address: string;
}

interface WalletContextType {
  walletInfo: WalletInfo | null;
  isConnected: boolean;
  connectWallet: (type: string, address: string) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for existing wallet connection on mount
    const savedWallet = localStorage.getItem('sei-sentinel-wallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWalletInfo(walletData);
        setIsConnected(true);
      } catch (err) {
        localStorage.removeItem('sei-sentinel-wallet');
      }
    }
  }, []);

  const connectWallet = (type: string, address: string) => {
    if (type && address) {
      const walletData = { type, address };
      setWalletInfo(walletData);
      setIsConnected(true);
      localStorage.setItem('sei-sentinel-wallet', JSON.stringify(walletData));
    }
  };

  const disconnectWallet = () => {
    setWalletInfo(null);
    setIsConnected(false);
    localStorage.removeItem('sei-sentinel-wallet');
  };

  const value: WalletContextType = {
    walletInfo,
    isConnected,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
