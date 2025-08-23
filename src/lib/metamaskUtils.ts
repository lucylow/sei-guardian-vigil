import { SEI_NETWORKS } from './seiBlockchain';

export interface SeiNetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrls?: string[];
}

export const SEI_METAMASK_CONFIG: SeiNetworkConfig = {
  chainId: `0x${SEI_NETWORKS.evm.chainId.toString(16)}`,
  chainName: 'Sei EVM',
  nativeCurrency: {
    name: 'SEI',
    symbol: 'SEI',
    decimals: 18
  },
  rpcUrls: [SEI_NETWORKS.evm.rpc],
  blockExplorerUrls: ['https://sei.evmscan.io/'],
  iconUrls: ['https://sei.io/favicon.ico']
};

export const checkMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).ethereum;
};

export const getCurrentChainId = async (): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      return chainId;
    }
    return null;
  } catch (error) {
    console.error('Failed to get current chain ID:', error);
    return null;
  }
};

export const isConnectedToSei = async (): Promise<boolean> => {
  try {
    const currentChainId = await getCurrentChainId();
    return currentChainId === SEI_METAMASK_CONFIG.chainId;
  } catch (error) {
    return false;
  }
};

export const addSeiNetworkToMetaMask = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SEI_METAMASK_CONFIG],
      });
    } else {
      throw new Error('MetaMask not found');
    }
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected adding Sei network');
    } else if (error.code === -32602) {
      throw new Error('Invalid network parameters');
    } else {
      throw new Error(`Failed to add Sei network: ${error.message}`);
    }
  }
};

export const switchToSeiNetwork = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEI_METAMASK_CONFIG.chainId }],
      });
    } else {
      throw new Error('MetaMask not found');
    }
  } catch (error: any) {
    if (error.code === 4902) {
      // Network not added, add it first
      await addSeiNetworkToMetaMask();
    } else if (error.code === 4001) {
      throw new Error('User rejected switching to Sei network');
    } else {
      throw new Error(`Failed to switch to Sei network: ${error.message}`);
    }
  }
};

export const requestAccounts = async (): Promise<string[]> => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });
      return accounts;
    } else {
      throw new Error('MetaMask not found');
    }
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected connection request');
    } else {
      throw new Error(`Failed to request accounts: ${error.message}`);
    }
  }
};

export const getAccountBalance = async (address: string): Promise<string> => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const balance = await (window as any).ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      return balance;
    } else {
      throw new Error('MetaMask not found');
    }
  } catch (error: any) {
    throw new Error(`Failed to get balance: ${error.message}`);
  }
};

export const formatBalance = (balance: string, decimals: number = 18): string => {
  try {
    const wei = BigInt(balance);
    const eth = Number(wei) / Math.pow(10, decimals);
    return eth.toFixed(6);
  } catch (error) {
    return '0.000000';
  }
};

export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const validateEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const setupMetaMaskListeners = (
  onAccountsChanged?: (accounts: string[]) => void,
  onChainChanged?: (chainId: string) => void,
  onDisconnect?: () => void
) => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const ethereum = (window as any).ethereum;
    
    if (onAccountsChanged) {
      ethereum.on('accountsChanged', onAccountsChanged);
    }
    
    if (onChainChanged) {
      ethereum.on('chainChanged', onChainChanged);
    }
    
    if (onDisconnect) {
      ethereum.on('disconnect', onDisconnect);
    }
    
    // Return cleanup function
    return () => {
      if (onAccountsChanged) {
        ethereum.removeListener('accountsChanged', onAccountsChanged);
      }
      if (onChainChanged) {
        ethereum.removeListener('chainChanged', onChainChanged);
      }
      if (onDisconnect) {
        ethereum.removeListener('disconnect', onDisconnect);
      }
    };
  }
  
  return () => {};
};
