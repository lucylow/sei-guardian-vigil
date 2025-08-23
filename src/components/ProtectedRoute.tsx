import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
