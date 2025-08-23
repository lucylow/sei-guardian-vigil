import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('ProtectedRoute: Rendering');
  
  const { isConnected } = useWallet();
  console.log('ProtectedRoute: useWallet successful, isConnected:', isConnected);
  
  if (!isConnected) {
    console.log('ProtectedRoute: Not connected, redirecting to landing page');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedRoute: Connected, rendering children');
  return <>{children}</>;
};
