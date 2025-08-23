// Wallet connection utilities for Sei networks

export interface SeiNetworkInfo {
  chainId: string;
  rpc: string;
  rest?: string;
  chainName?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer?: string;
  prefix?: string;
}

export const SEI_NETWORKS: Record<string, SeiNetworkInfo> = {
  mainnet: {
    chainId: 'sei-1',
    rpc: 'https://rpc.sei.juno.deuslabs.fi',
    rest: 'https://lcd.sei.juno.deuslabs.fi',
    prefix: 'sei'
  },
  testnet: {
    chainId: 'sei-testnet-1',
    rpc: 'https://testnet-rpc.sei.juno.deuslabs.fi',
    rest: 'https://testnet-lcd.sei.juno.deuslabs.fi',
    prefix: 'sei'
  },
  evm: {
    chainId: '0xAE4C3', // 713715 in hex
    rpc: 'https://evm-rpc.sei.juno.deuslabs.fi',
    chainName: 'Sei EVM',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18
    },
    blockExplorer: 'https://sei.evmscan.io'
  }
};

// Check if a wallet is installed
export const checkWalletInstalled = (walletType: 'keplr' | 'metamask' | 'compass'): boolean => {
  if (typeof window === 'undefined') return false;
  
  switch (walletType) {
    case 'keplr':
      return !!window.keplr;
    case 'metamask':
      return !!window.ethereum?.isMetaMask;
    case 'compass':
      return !!window.compass;
    default:
      return false;
  }
};

// Test network connectivity
export const testNetworkConnectivity = async (network: SeiNetworkInfo): Promise<boolean> => {
  try {
    if (network.rest) {
      // Test REST API
      const response = await fetch(`${network.rest}/cosmos/base/tendermint/v1beta1/node_info`);
      return response.ok;
    } else if (network.rpc) {
      // Test RPC
      const response = await fetch(network.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_chainId',
          params: []
        })
      });
      return response.ok;
    }
    return false;
  } catch (error) {
    console.error(`Network connectivity test failed for ${network.chainId}:`, error);
    return false;
  }
};

// Get wallet account info
export const getWalletAccountInfo = async (
  walletType: 'keplr' | 'metamask' | 'compass',
  network: SeiNetworkInfo
): Promise<{ address: string; balance: string } | null> => {
  try {
    switch (walletType) {
      case 'keplr':
        if (!window.keplr) return null;
        await window.keplr.enable(network.chainId);
        const offlineSigner = window.keplr.getOfflineSigner(network.chainId);
        const accounts = await offlineSigner.getAccounts();
        if (accounts.length === 0) return null;
        
        // Get balance
        if (network.rest) {
          try {
            const response = await fetch(`${network.rest}/cosmos/bank/v1beta1/balances/${accounts[0].address}/by_denom?denom=usei`);
            const balanceData = await response.json();
            const balance = balanceData.balance?.amount || '0';
            const balanceInSei = (parseInt(balance) / 1000000).toFixed(6);
            return { address: accounts[0].address, balance: `${balanceInSei} SEI` };
          } catch (error) {
            return { address: accounts[0].address, balance: '0.000000 SEI' };
          }
        }
        return { address: accounts[0].address, balance: '0.000000 SEI' };
        
      case 'metamask':
        if (!window.ethereum?.isMetaMask) return null;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) return null;
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInSei = (parseInt(balance, 16) / 1e18).toFixed(6);
        return { address: accounts[0], balance: `${balanceInSei} SEI` };
        
      case 'compass':
        if (!window.compass) return null;
        await window.compass.enable(network.chainId);
        const compassAccounts = await window.compass.getAccounts(network.chainId);
        if (!compassAccounts || compassAccounts.length === 0) return null;
        
        // Get balance
        if (network.rest) {
          try {
            const response = await fetch(`${network.rest}/cosmos/bank/v1beta1/balances/${compassAccounts[0].address}/by_denom?denom=usei`);
            const balanceData = await response.json();
            const balance = balanceData.balance?.amount || '0';
            const balanceInSei = (parseInt(balance) / 1000000).toFixed(6);
            return { address: compassAccounts[0].address, balance: `${balanceInSei} SEI` };
          } catch (error) {
            return { address: compassAccounts[0].address, balance: '0.000000 SEI' };
          }
        }
        return { address: compassAccounts[0].address, balance: '0.000000 SEI' };
        
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to get account info for ${walletType}:`, error);
    return null;
  }
};

// Validate network configuration
export const validateNetworkConfig = (network: SeiNetworkInfo): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!network.chainId) {
    errors.push('Chain ID is required');
  }
  
  if (!network.rpc) {
    errors.push('RPC URL is required');
  }
  
  if (network.chainId.startsWith('0x')) {
    // EVM network validation
    if (!network.chainName) {
      errors.push('Chain name is required for EVM networks');
    }
    if (!network.nativeCurrency) {
      errors.push('Native currency is required for EVM networks');
    }
  } else {
    // Cosmos network validation
    if (!network.rest) {
      errors.push('REST endpoint is required for Cosmos networks');
    }
    if (!network.prefix) {
      errors.push('Address prefix is required for Cosmos networks');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format balance for display
export const formatBalance = (balance: string, decimals: number = 6): string => {
  try {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0.000000';
    return (num / Math.pow(10, decimals)).toFixed(6);
  } catch (error) {
    return '0.000000';
  }
};

// Shorten address for display
export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Get network display name
export const getNetworkDisplayName = (network: SeiNetworkInfo): string => {
  if (network.chainId === 'sei-1') return 'Sei Mainnet';
  if (network.chainId === 'sei-testnet-1') return 'Sei Testnet';
  if (network.chainId === '0xAE4C3') return 'Sei EVM';
  return network.chainName || network.chainId;
};

// Check if wallet is connected to correct network
export const isWalletOnCorrectNetwork = async (
  walletType: 'keplr' | 'metamask' | 'compass',
  expectedNetwork: SeiNetworkInfo
): Promise<boolean> => {
  try {
    switch (walletType) {
      case 'keplr':
        if (!window.keplr) return false;
        const keplrChainId = await window.keplr.getChainId();
        return keplrChainId === expectedNetwork.chainId;
        
      case 'metamask':
        if (!window.ethereum?.isMetaMask) return false;
        const metamaskChainId = await window.ethereum.request({ method: 'eth_chainId' });
        return metamaskChainId === expectedNetwork.chainId;
        
      case 'compass':
        if (!window.compass) return false;
        // Compass doesn't have a direct method to get current chain ID
        // We'll assume it's correct if we can get accounts
        try {
          await window.compass.enable(expectedNetwork.chainId);
          const accounts = await window.compass.getAccounts(expectedNetwork.chainId);
          return accounts && accounts.length > 0;
        } catch {
          return false;
        }
        
      default:
        return false;
    }
  } catch (error) {
    console.error(`Failed to check network for ${walletType}:`, error);
    return false;
  }
};

// Get wallet connection status
export const getWalletConnectionStatus = async (): Promise<{
  keplr: { installed: boolean; connected: boolean; network: string | null };
  metamask: { installed: boolean; connected: boolean; network: string | null };
  compass: { installed: boolean; connected: boolean; network: string | null };
}> => {
  const status = {
    keplr: { installed: false, connected: false, network: null },
    metamask: { installed: false, connected: false, network: null },
    compass: { installed: false, connected: false, network: null }
  };
  
  // Check Keplr
  if (checkWalletInstalled('keplr')) {
    status.keplr.installed = true;
    try {
      const accountInfo = await getWalletAccountInfo('keplr', SEI_NETWORKS.testnet);
      if (accountInfo) {
        status.keplr.connected = true;
        status.keplr.network = 'Sei Testnet';
      }
    } catch (error) {
      // Not connected
    }
  }
  
  // Check MetaMask
  if (checkWalletInstalled('metamask')) {
    status.metamask.installed = true;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        status.metamask.connected = true;
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === SEI_NETWORKS.evm.chainId) {
          status.metamask.network = 'Sei EVM';
        } else {
          status.metamask.network = 'Other Network';
        }
      }
    } catch (error) {
      // Not connected
    }
  }
  
  // Check Compass
  if (checkWalletInstalled('compass')) {
    status.compass.installed = true;
    try {
      const accountInfo = await getWalletAccountInfo('compass', SEI_NETWORKS.testnet);
      if (accountInfo) {
        status.compass.connected = true;
        status.compass.network = 'Sei Testnet';
      }
    } catch (error) {
      // Not connected
    }
  }
  
  return status;
};
