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

  // Initialize blockchain service
  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Get initial network status
        const networkStatus = await seiBlockchain.getNetworkStatus();
        
        setState(prev => ({
          ...prev,
          networkStatus,
          isLoading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize blockchain',
          isLoading: false
        }));
      }
    };

    initializeBlockchain();
  }, []);

  // Connect CosmWasm wallet with mnemonic
  const connectCosmWasmWallet = useCallback(async (mnemonic: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const connection = await seiBlockchain.connectWallet(mnemonic);
      
      const wallet: WalletConnection = {
        address: connection.address,
        type: 'cosmwasm',
        isConnected: true
      };
      
      setState(prev => ({
        ...prev,
        wallet,
        isLoading: false
      }));
      
      return connection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect CosmWasm wallet';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      throw new Error(errorMessage);
    }
  }, []);

  // Connect EVM wallet
  const connectEVMWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const address = await seiEVM.connectWallet();
      
      const wallet: WalletConnection = {
        address,
        type: 'evm',
        isConnected: true
      };
      
      setState(prev => ({
        ...prev,
        wallet,
        isLoading: false
      }));
      
      return { address };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect EVM wallet';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      throw new Error(errorMessage);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setState(prev => ({
      ...prev,
      wallet: null
    }));
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (network: keyof typeof SEI_NETWORKS) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await seiBlockchain.switchNetwork(network);
      
      // Get updated network status
      const networkStatus = await seiBlockchain.getNetworkStatus();
      
      setState(prev => ({
        ...prev,
        currentNetwork: network,
        networkStatus,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      throw new Error(errorMessage);
    }
  }, []);

  // Get account balance
  const getAccountBalance = useCallback(async (address: string) => {
    try {
      if (!validateSEIAddress(address)) {
        throw new Error('Invalid SEI address format');
      }
      
      const balance = await seiBlockchain.getAccountBalance(address);
      return formatSEIAmount(balance.amount);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get account balance';
      throw new Error(errorMessage);
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to get EVM balance';
      throw new Error(errorMessage);
    }
  }, []);

  // Get governance proposals
  const getGovernanceProposals = useCallback(async (
    contractAddress: string,
    startAfter?: string,
    limit: number = 50
  ) => {
    try {
      const proposals = await seiBlockchain.getGovernanceProposals(contractAddress, startAfter, limit);
      return proposals;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get governance proposals';
      throw new Error(errorMessage);
    }
  }, []);

  // Get specific governance proposal
  const getGovernanceProposal = useCallback(async (
    contractAddress: string,
    proposalId: number
  ) => {
    try {
      const proposal = await seiBlockchain.getGovernanceProposal(contractAddress, proposalId);
      return proposal;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get governance proposal';
      throw new Error(errorMessage);
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
      if (!state.wallet || state.wallet.type !== 'cosmwasm') {
        throw new Error('CosmWasm wallet not connected');
      }
      
      const result = await seiBlockchain.submitGovernanceProposal(
        contractAddress,
        title,
        description,
        metadata
      );
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit governance proposal';
      throw new Error(errorMessage);
    }
  }, [state.wallet]);

  // Vote on governance proposal
  const voteOnProposal = useCallback(async (
    contractAddress: string,
    proposalId: number,
    vote: "yes" | "no" | "abstain",
    metadata: string = ""
  ) => {
    try {
      if (!state.wallet || state.wallet.type !== 'cosmwasm') {
        throw new Error('CosmWasm wallet not connected');
      }
      
      const result = await seiBlockchain.voteOnProposal(
        contractAddress,
        proposalId,
        vote,
        metadata
      );
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to vote on proposal';
      throw new Error(errorMessage);
    }
  }, [state.wallet]);

  // Execute governance proposal
  const executeProposal = useCallback(async (
    contractAddress: string,
    proposalId: number
  ) => {
    try {
      if (!state.wallet || state.wallet.type !== 'cosmwasm') {
        throw new Error('CosmWasm wallet not connected');
      }
      
      const result = await seiBlockchain.executeProposal(contractAddress, proposalId);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute proposal';
      throw new Error(errorMessage);
    }
  }, [state.wallet]);

  // Get transaction details
  const getTransaction = useCallback(async (txHash: string) => {
    try {
      const tx = await seiBlockchain.getTransaction(txHash);
      return tx;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get transaction';
      throw new Error(errorMessage);
    }
  }, []);

  // Get block height
  const getBlockHeight = useCallback(async () => {
    try {
      const height = await seiBlockchain.getBlockHeight();
      return height;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get block height';
      throw new Error(errorMessage);
    }
  }, []);

  // Refresh network status
  const refreshNetworkStatus = useCallback(async () => {
    try {
      const networkStatus = await seiBlockchain.getNetworkStatus();
      setState(prev => ({
        ...prev,
        networkStatus
      }));
    } catch (error) {
      console.error('Failed to refresh network status:', error);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
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
    getGovernanceProposal,
    submitGovernanceProposal,
    voteOnProposal,
    executeProposal,
    getTransaction,
    getBlockHeight,
    refreshNetworkStatus,
    clearError,
    
    // Utilities
    formatSEIAmount,
    validateSEIAddress,
    validateEVMAddress,
    SEI_NETWORKS
  };
};
