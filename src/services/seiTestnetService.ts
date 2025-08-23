import { seiBlockchain } from '@/lib/seiBlockchain';
import { seiMcpService } from '@/lib/seiMcpService';

// SEI Testnet Configuration
const SEI_TESTNET_CONFIG = {
  rpc: "https://rpc-testnet.sei.io",
  rest: "https://rest-testnet.sei.io",
  chainId: "sei-testnet-1",
  prefix: "sei",
  gasPrice: "0.025usei",
  gasAdjustment: 1.3
};

// Keplr window interface
declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
  }
}

// Agent Deployment Interface
export interface AgentDeploymentConfig {
  name: string;
  description: string;
  agentType: 'SecurityAuditor' | 'ThreatResponder' | 'ComplianceGuard' | 'Custom';
  configuration: Record<string, any>;
  avatarUrl?: string;
  ownerWalletAddress: string;
}

// Deployment Result Interface
export interface DeploymentResult {
  success: boolean;
  agentId: string;
  nftTokenId: string;
  seiTxHash: string;
  contractAddress: string;
  network: string;
  message: string;
  timestamp: string;
}

// SEI Testnet Integration Service
export class SeiTestnetService {
  private isConnected: boolean = false;
  private currentWallet: any = null;
  private backendUrl: string = 'http://localhost:4000';
  private walletAddress: string = '';

  constructor(backendUrl?: string) {
    if (backendUrl) {
      this.backendUrl = backendUrl;
    }
  }

  // Connect to Keplr wallet for SEI testnet
  async connectKeplrWallet(): Promise<{ address: string; isConnected: boolean }> {
    try {
      if (typeof window === 'undefined' || !window.keplr) {
        throw new Error('Keplr wallet not found. Please install Keplr extension.');
      }

      // Add SEI testnet to Keplr if not already added
      await this.addSeiTestnetToKeplr();

      // Enable Keplr for SEI testnet
      await window.keplr.enable(SEI_TESTNET_CONFIG.chainId);
      
      // Get offline signer
      const offlineSigner = window.keplr.getOfflineSigner(SEI_TESTNET_CONFIG.chainId);
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found in Keplr wallet.');
      }

      this.currentWallet = offlineSigner;
      this.walletAddress = accounts[0].address;
      this.isConnected = true;

      console.log('✅ Connected to Keplr wallet for SEI testnet');
      console.log('Wallet address:', this.walletAddress);

      return {
        address: this.walletAddress,
        isConnected: true
      };
    } catch (error) {
      console.error('❌ Failed to connect Keplr wallet:', error);
      throw error;
    }
  }

  // Add SEI testnet configuration to Keplr
  private async addSeiTestnetToKeplr() {
    if (!window.keplr) return;

    try {
      await window.keplr.experimentalSuggestChain({
        chainId: SEI_TESTNET_CONFIG.chainId,
        chainName: "SEI Testnet",
        rpc: SEI_TESTNET_CONFIG.rpc,
        rest: SEI_TESTNET_CONFIG.rest,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "sei",
          bech32PrefixAccPub: "seipub",
          bech32PrefixValAddr: "seivaloper",
          bech32PrefixValPub: "seivaloperpub",
          bech32PrefixConsAddr: "seivalcons",
          bech32PrefixConsPub: "seivalconspub",
        },
        currencies: [
          {
            coinDenom: "SEI",
            coinMinimalDenom: "usei",
            coinDecimals: 6,
            coinGeckoId: "sei-network",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "SEI",
            coinMinimalDenom: "usei",
            coinDecimals: 6,
            coinGeckoId: "sei-network",
            gasPriceStep: {
              low: 0.02,
              average: 0.025,
              high: 0.04,
            },
          },
        ],
        stakeCurrency: {
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
          coinGeckoId: "sei-network",
        },
      });
    } catch (error) {
      console.log('SEI testnet already added to Keplr or failed to add:', error);
    }
  }

  // Check if backend is running
  async checkBackendStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/status`);
      const data = await response.json();
      console.log('✅ Backend status:', data);
      return data.status === 'operational';
    } catch (error) {
      console.error('❌ Backend not accessible:', error);
      return false;
    }
  }

  // Deploy agent to SEI testnet via backend
  async deployAgentToTestnet(config: AgentDeploymentConfig): Promise<DeploymentResult> {
    try {
      // Check if wallet is connected
      if (!this.isConnected || !this.walletAddress) {
        throw new Error('Keplr wallet not connected. Please connect wallet first.');
      }

      // Check if backend is running
      const backendRunning = await this.checkBackendStatus();
      if (!backendRunning) {
        throw new Error('Backend server not running. Please start backend server on port 4000.');
      }

      console.log('🚀 Deploying agent to SEI testnet...');
      console.log('Agent config:', config);

      // Prepare agent configuration for backend
      const agentConfig = {
        name: config.name,
        description: config.description,
        agentType: config.agentType,
        ownerWalletAddress: this.walletAddress,
        configuration: config.configuration,
        avatarUrl: config.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${config.name}`
      };

      // Call backend to create and deploy agent
      const response = await fetch(`${this.backendUrl}/api/agents/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deploy agent');
      }

      const result = await response.json();
      console.log('✅ Agent deployment result:', result);

      // Return deployment result
      return {
        success: true,
        agentId: result.agent.id,
        nftTokenId: result.agent.nftTokenId || 'pending',
        seiTxHash: result.agent.seiTxHash || 'pending',
        contractAddress: result.agent.ownerWalletAddress,
        network: 'sei-testnet',
        message: `Agent "${config.name}" deployed successfully to SEI testnet!`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Failed to deploy agent:', error);
      
      // Return error result
      return {
        success: false,
        agentId: '',
        nftTokenId: '',
        seiTxHash: '',
        contractAddress: '',
        network: 'sei-testnet',
        message: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get deployed agents from backend
  async getDeployedAgents(): Promise<any[]> {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents`);
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      return data.agents || [];
    } catch (error) {
      console.error('❌ Failed to fetch agents:', error);
      return [];
    }
  }

  // Get wallet balance
  async getWalletBalance(): Promise<string> {
    if (!this.isConnected || !this.walletAddress) {
      return '0';
    }

    try {
      // Use seiBlockchain service to get balance
      const balance = await seiBlockchain.getBalance(this.walletAddress);
      return balance;
    } catch (error) {
      console.error('❌ Failed to get wallet balance:', error);
      return '0';
    }
  }

  // Disconnect wallet
  disconnectWallet(): void {
    this.isConnected = false;
    this.currentWallet = null;
    this.walletAddress = '';
    console.log('🔌 Wallet disconnected');
  }

  // Get connection status
  getConnectionStatus(): { isConnected: boolean; address: string } {
    return {
      isConnected: this.isConnected,
      address: this.walletAddress
    };
  }
}

// Export singleton instance
export const seiTestnetService = new SeiTestnetService();
