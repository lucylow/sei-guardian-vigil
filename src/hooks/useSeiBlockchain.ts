import { useState, useEffect, useCallback } from 'react';
import { 
  seiBlockchain, 
  seiEVM, 
  SEI_NETWORKS, 
  formatSEIAmount, 
  validateSEIAddress, 
  validateEVMAddress 
} from '@/lib/seiBlockchain';

export interface WalletConnection {
  address: string;
  type: 'cosmwasm' | 'evm';
  isConnected: boolean;
}

export interface NetworkStatus {
  isOnline: boolean;
  blockHeight: number;
  chainId: string;
  rpc: string;
  network: string;
  error?: string;
}

export interface BlockchainState {
  wallet: WalletConnection | null;
  networkStatus: NetworkStatus | null;
  currentNetwork: keyof typeof SEI_NETWORKS;
  isLoading: boolean;
  error: string | null;
}

export const useSeiBlockchain = () => {
  const [state, setState] = useState<BlockchainState>({
    wallet: null,
    networkStatus: null,
    currentNetwork: 'mainnet',
    isLoading: false,
    error: null
  });

  // Initialize blockchain and get network status
  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const networkStatus = await seiBlockchain.getNetworkStatus();
        setState(prev => ({ 
          ...prev, 
          networkStatus, 
          currentNetwork: networkStatus.network as keyof typeof SEI_NETWORKS,
          isLoading: false 
        }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          isLoading: false 
        }));
      }
    };

    initializeBlockchain();
  }, []);

  // Connect CosmWasm wallet
  const connectCosmWasmWallet = useCallback(async (mnemonic: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const connection = await seiBlockchain.connectWallet(mnemonic);
      
      setState(prev => ({ 
        ...prev, 
        wallet: connection, 
        isLoading: false 
      }));

      return connection;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  // Connect EVM wallet
  const connectEVMWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const connection = await seiEVM.connectWallet();
      
      setState(prev => ({ 
        ...prev, 
        wallet: connection, 
        isLoading: false 
      }));

      return connection;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    seiBlockchain.disconnectWallet();
    setState(prev => ({ ...prev, wallet: null }));
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (network: keyof typeof SEI_NETWORKS) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await seiBlockchain.switchNetwork(network);
      
      const networkStatus = await seiBlockchain.getNetworkStatus();
      
      setState(prev => ({ 
        ...prev, 
        currentNetwork: network,
        networkStatus, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  // Get account balance
  const getAccountBalance = useCallback(async (address: string) => {
    try {
      if (!validateSEIAddress(address)) {
        throw new Error('Invalid SEI address format');
      }
      
      const balance = await seiBlockchain.getAccountBalance(address);
      return balance;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  // Get EVM balance
  const getEVMBalance = useCallback(async (address: string) => {
    try {
      if (!validateEVMAddress(address)) {
        throw new Error('Invalid EVM address format');
      }
      
      const balance = await seiEVM.getBalance(address);
      return balance;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  // Get governance proposals
  const getGovernanceProposals = useCallback(async (
    contractAddress: string, 
    startAfter?: string, 
    limit: number = 50
  ) => {
    try {
      if (!validateSEIAddress(contractAddress)) {
        throw new Error('Invalid contract address format');
      }
      
      const proposals = await seiBlockchain.getGovernanceProposals(contractAddress, startAfter, limit);
      return proposals;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  // Submit governance proposal
  const submitGovernanceProposal = useCallback(async (
    contractAddress: string, 
    title: string, 
    description: string, 
    metadata: string = ""
  ) => {
    try {
      if (!state.wallet) {
        throw new Error('Wallet not connected');
      }
      
      if (!validateSEIAddress(contractAddress)) {
        throw new Error('Invalid contract address format');
      }
      
      const result = await seiBlockchain.submitGovernanceProposal(
        contractAddress, 
        title, 
        description, 
        metadata
      );
      
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, [state.wallet]);

  // Vote on proposal
  const voteOnProposal = useCallback(async (
    contractAddress: string, 
    proposalId: number, 
    vote: "yes" | "no" | "abstain", 
    metadata: string = ""
  ) => {
    try {
      if (!state.wallet) {
        throw new Error('Wallet not connected');
      }
      
      if (!validateSEIAddress(contractAddress)) {
        throw new Error('Invalid contract address format');
      }
      
      const result = await seiBlockchain.voteOnProposal(
        contractAddress, 
        proposalId, 
        vote, 
        metadata
      );
      
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, [state.wallet]);

  // Execute proposal
  const executeProposal = useCallback(async (
    contractAddress: string, 
    proposalId: number
  ) => {
    try {
      if (!state.wallet) {
        throw new Error('Wallet not connected');
      }
      
      if (!validateSEIAddress(contractAddress)) {
        throw new Error('Invalid contract address format');
      }
      
      const result = await seiBlockchain.executeProposal(contractAddress, proposalId);
      
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, [state.wallet]);

  // Get proposal details
  const getProposal = useCallback(async (
    contractAddress: string, 
    proposalId: number
  ) => {
    try {
      if (!validateSEIAddress(contractAddress)) {
        throw new Error('Invalid contract address format');
      }
      
      const proposal = await seiBlockchain.getProposal(contractAddress, proposalId);
      return proposal;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  // Estimate gas
  const estimateGas = useCallback(async (contractAddress: string, msg: any) => {
    try {
      if (!validateSEIAddress(contractAddress)) {
        throw new Error('Invalid contract address format');
      }
      
      const gas = await seiBlockchain.estimateGas(contractAddress, msg);
      return gas;
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh network status
  const refreshNetworkStatus = useCallback(async () => {
    try {
      const networkStatus = await seiBlockchain.getNetworkStatus();
      setState(prev => ({ ...prev, networkStatus }));
    } catch (error) {
      console.error('Failed to refresh network status:', error);
    }
  }, []);

  // Auto-refresh network status every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshNetworkStatus, 30000);
    return () => clearInterval(interval);
  }, [refreshNetworkStatus]);

  return {
    // State
    wallet: state.wallet,
    networkStatus: state.networkStatus,
    currentNetwork: state.currentNetwork,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    connectCosmWasmWallet,
    connectEVMWallet,
    disconnectWallet,
    switchNetwork,
    getAccountBalance,
    getEVMBalance,
    getGovernanceProposals,
    submitGovernanceProposal,
    voteOnProposal,
    executeProposal,
    getProposal,
    estimateGas,
    clearError,
    refreshNetworkStatus,
    
    // Constants
    SEI_NETWORKS,
    
    // Utilities
    formatSEIAmount,
    validateSEIAddress,
    validateEVMAddress
  };
};
