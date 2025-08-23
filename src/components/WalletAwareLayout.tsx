import React from 'react';
import { Layout } from './Layout';

interface WalletAwareLayoutProps {
  children: React.ReactNode;
}

export const WalletAwareLayout: React.FC<WalletAwareLayoutProps> = ({ children }) => {
  // This component will be wrapped by WalletProvider, so it's safe to use useWallet here
  try {
    return <Layout>{children}</Layout>;
  } catch (error) {
    console.error('WalletAwareLayout: Error rendering Layout:', error);
    // Fallback to a simple layout without wallet features
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black font-mono text-red-400">
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black">
          {children}
        </main>
      </div>
    );
  }
};
