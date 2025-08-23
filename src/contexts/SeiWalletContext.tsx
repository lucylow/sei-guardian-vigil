import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WalletState {
  address: string;
  client?: any;
  provider?: any;
  signer?: any;
}

interface SeiWalletContextType {
  cosmosWallet: WalletState | null;
  evmWallet: WalletState | null;
  setCosmosWallet: (wallet: WalletState | null) => void;
  setEvmWallet: (wallet: WalletState | null) => void;
  disconnectWallets: () => void;
  isAnyWalletConnected: boolean;
}

const SeiWalletContext = createContext<SeiWalletContextType | undefined>(undefined);

export function useSeiWallet() {
  const context = useContext(SeiWalletContext);
  if (context === undefined) {
    throw new Error('useSeiWallet must be used within a SeiWalletProvider');
  }
  return context;
}

interface SeiWalletProviderProps {
  children: ReactNode;
}

export function SeiWalletProvider({ children }: SeiWalletProviderProps) {
  const [cosmosWallet, setCosmosWallet] = useState<WalletState | null>(null);
  const [evmWallet, setEvmWallet] = useState<WalletState | null>(null);

  const disconnectWallets = useCallback(() => {
    setCosmosWallet(null);
    setEvmWallet(null);
  }, []);

  const isAnyWalletConnected = cosmosWallet !== null || evmWallet !== null;

  const value: SeiWalletContextType = {
    cosmosWallet,
    evmWallet,
    setCosmosWallet,
    setEvmWallet,
    disconnectWallets,
    isAnyWalletConnected,
  };

  return (
    <SeiWalletContext.Provider value={value}>
      {children}
    </SeiWalletContext.Provider>
  );
}
