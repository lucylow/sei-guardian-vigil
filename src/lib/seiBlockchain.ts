import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient, CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ethers, JsonRpcProvider, BrowserProvider, formatEther, parseEther, isAddress } from "ethers";

// SEI Network configurations
export const SEI_NETWORKS = {
  mainnet: {
    rpc: "https://rpc.sei.juno.deuslabs.fi",
    rest: "https://lcd.sei.juno.deuslabs.fi",
    chainId: "sei-1",
    prefix: "sei",
    gasPrice: "0.025usei",
    gasAdjustment: 1.3
  },
  testnet: {
    rpc: "https://testnet-rpc.sei.juno.deuslabs.fi",
    rest: "https://testnet-lcd.sei.juno.deuslabs.fi",
    chainId: "sei-testnet-1",
    prefix: "sei",
    gasPrice: "0.025usei",
    gasAdjustment: 1.3
  },
  evm: {
    rpc: "https://evm-rpc.sei.juno.deuslabs.fi",
    chainId: 713715,
    gasPrice: "20000000000" // 20 gwei
  }
};

// Governance contract ABI for CosmWasm
export const GOVERNANCE_CONTRACT_ABI = {
  // Query messages
  get_proposal: { get_proposal: { proposal_id: "number" } },
  get_proposals: { get_proposals: { start_after: "string", limit: "number" } },
  get_vote: { get_vote: { proposal_id: "number", voter: "string" } },
  get_votes: { get_votes: { proposal_id: "number", start_after: "string", limit: "number" } },
  
  // Execute messages
  submit_proposal: { submit_proposal: { title: "string", description: "string", metadata: "string" } },
  vote: { vote: { proposal_id: "number", vote: "string", metadata: "string" } },
  execute_proposal: { execute_proposal: { proposal_id: "number" } },
  close_proposal: { close_proposal: { proposal_id: "number" } }
};

export class SeiBlockchainService {
  private cosmWasmClient: CosmWasmClient | null = null;
  private signingClient: SigningCosmWasmClient | null = null;
  private stargateClient: StargateClient | null = null;
  private signingStargateClient: SigningStargateClient | null = null;
  private wallet: DirectSecp256k1HdWallet | null = null;
  private currentNetwork: keyof typeof SEI_NETWORKS = "mainnet";

  constructor(network: keyof typeof SEI_NETWORKS = "mainnet") {
    this.currentNetwork = network;
    this.initializeClients();
  }

  private async initializeClients() {
    const network = SEI_NETWORKS[this.currentNetwork];
    
    try {
      // Initialize read-only clients
      this.cosmWasmClient = await CosmWasmClient.connect(network.rpc);
      this.stargateClient = await StargateClient.connect(network.rpc);
      
      console.log(`Connected to SEI ${this.currentNetwork} network`);
    } catch (error) {
      console.error(`Failed to connect to SEI ${this.currentNetwork}:`, error);
      throw error;
    }
  }

  async connectWallet(mnemonic: string) {
    try {
      const network = SEI_NETWORKS[this.currentNetwork];
      
      // Create wallet with SEI prefix
      this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { 
        prefix: network.prefix 
      });
      
      // Initialize signing clients
      this.signingClient = await SigningCosmWasmClient.connectWithSigner(
        network.rpc, 
        this.wallet
      );
      
      this.signingStargateClient = await SigningStargateClient.connectWithSigner(
        network.rpc, 
        this.wallet
      );

      const [account] = await this.wallet.getAccounts();
      
      return {
        address: account.address,
        type: 'cosmwasm' as const,
        isConnected: true
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async connectEVMWallet() {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        return {
          address,
          type: 'evm' as const,
          isConnected: true
        };
      } else {
        throw new Error('MetaMask or EVM wallet not found');
      }
    } catch (error) {
      console.error('Failed to connect EVM wallet:', error);
      throw error;
    }
  }

  async getGovernanceProposals(contractAddress: string, startAfter?: string, limit: number = 50) {
    try {
      if (!this.cosmWasmClient) {
        throw new Error('Client not initialized');
      }

      const queryMsg = { 
        get_proposals: { 
          start_after: startAfter || null, 
          limit 
        } 
      };

      const result = await this.cosmWasmClient.queryContractSmart(contractAddress, queryMsg);
      return result.proposals || [];
    } catch (error) {
      console.error('Failed to get governance proposals:', error);
      throw error;
    }
  }

  async getProposal(contractAddress: string, proposalId: number) {
    try {
      if (!this.cosmWasmClient) {
        throw new Error('Client not initialized');
      }

      const queryMsg = { get_proposal: { proposal_id: proposalId } };
      const result = await this.cosmWasmClient.queryContractSmart(contractAddress, queryMsg);
      return result.proposal;
    } catch (error) {
      console.error('Failed to get proposal:', error);
      throw error;
    }
  }

  async submitGovernanceProposal(
    contractAddress: string, 
    title: string, 
    description: string, 
    metadata: string = ""
  ) {
    try {
      if (!this.signingClient || !this.wallet) {
        throw new Error('Wallet not connected');
      }

      const [account] = await this.wallet.getAccounts();
      const network = SEI_NETWORKS[this.currentNetwork];

      const executeMsg = {
        submit_proposal: { title, description, metadata }
      };

      const fee = {
        amount: [{ denom: "usei", amount: "1000" }],
        gas: "200000"
      };

      const result = await this.signingClient.execute(
        account.address,
        contractAddress,
        executeMsg,
        fee
      );

      return result;
    } catch (error) {
      console.error('Failed to submit proposal:', error);
      throw error;
    }
  }

  async voteOnProposal(
    contractAddress: string, 
    proposalId: number, 
    vote: "yes" | "no" | "abstain", 
    metadata: string = ""
  ) {
    try {
      if (!this.signingClient || !this.wallet) {
        throw new Error('Wallet not connected');
      }

      const [account] = await this.wallet.getAccounts();
      const network = SEI_NETWORKS[this.currentNetwork];

      const executeMsg = {
        vote: { proposal_id: proposalId, vote, metadata }
      };

      const fee = {
        amount: [{ denom: "usei", amount: "500" }],
        gas: "100000"
      };

      const result = await this.signingClient.execute(
        account.address,
        contractAddress,
        executeMsg,
        fee
      );

      return result;
    } catch (error) {
      console.error('Failed to vote on proposal:', error);
      throw error;
    }
  }

  async executeProposal(contractAddress: string, proposalId: number) {
    try {
      if (!this.signingClient || !this.wallet) {
        throw new Error('Wallet not connected');
      }

      const [account] = await this.wallet.getAccounts();

      const executeMsg = {
        execute_proposal: { proposal_id: proposalId }
      };

      const fee = {
        amount: [{ denom: "usei", amount: "1000" }],
        gas: "200000"
      };

      const result = await this.signingClient.execute(
        account.address,
        contractAddress,
        executeMsg,
        fee
      );

      return result;
    } catch (error) {
      console.error('Failed to execute proposal:', error);
      throw error;
    }
  }

  async getAccountBalance(address: string) {
    try {
      if (!this.stargateClient) {
        throw new Error('Client not initialized');
      }

      const balance = await this.stargateClient.getBalance(address, "usei");
      return balance;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      throw error;
    }
  }

  async estimateGas(contractAddress: string, msg: any) {
    try {
      if (!this.cosmWasmClient) {
        throw new Error('Client not initialized');
      }

      // This is a simplified gas estimation
      // In production, you might want to use a more sophisticated approach
      const baseGas = 100000;
      const msgComplexity = JSON.stringify(msg).length;
      const estimatedGas = baseGas + (msgComplexity * 100);

      return estimatedGas.toString();
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      return "200000"; // Default fallback
    }
  }

  async getNetworkStatus() {
    try {
      if (!this.stargateClient) {
        throw new Error('Client not initialized');
      }

      const network = SEI_NETWORKS[this.currentNetwork];
      const blockHeight = await this.stargateClient.getHeight();
      const chainId = await this.stargateClient.getChainId();

      return {
        isOnline: true,
        blockHeight,
        chainId,
        rpc: network.rpc,
        network: this.currentNetwork
      };
    } catch (error) {
      console.error('Failed to get network status:', error);
      return {
        isOnline: false,
        blockHeight: 0,
        chainId: "",
        rpc: "",
        network: this.currentNetwork,
        error: error.message
      };
    }
  }

  async switchNetwork(network: keyof typeof SEI_NETWORKS) {
    this.currentNetwork = network;
    await this.initializeClients();
    
    // Reconnect wallet if connected
    if (this.wallet) {
      await this.connectWallet(await this.wallet.mnemonic());
    }
  }

  disconnectWallet() {
    this.wallet = null;
    this.signingClient = null;
    this.signingStargateClient = null;
  }
}

export class SeiEVMService {
  private provider: JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private currentNetwork: keyof typeof SEI_NETWORKS = "evm";

  constructor(rpcUrl?: string) {
    if (rpcUrl) {
      this.provider = new JsonRpcProvider(rpcUrl);
    }
  }

  async connectWallet() {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        // Check if we're on the correct network
        const network = await provider.getNetwork();
        const seiChainId = SEI_NETWORKS.evm.chainId;
        
        if (network.chainId !== BigInt(seiChainId)) {
          // Try to switch to Sei network
          await this.switchToSeiNetwork();
        }
        
        this.provider = provider;
        this.signer = signer;
        
        return { address, type: 'evm' as const, isConnected: true };
      } else {
        throw new Error('MetaMask or EVM wallet not found');
      }
    } catch (error) {
      console.error('Failed to connect EVM wallet:', error);
      throw error;
    }
  }

  async switchToSeiNetwork() {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        
        // Try to switch to existing network first
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${SEI_NETWORKS.evm.chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            // Add the Sei network to MetaMask
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
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
              }],
            });
          } else {
            throw switchError;
          }
        }
      }
    } catch (error) {
      console.error('Failed to switch to Sei network:', error);
      throw new Error(`Failed to switch to Sei network: ${error.message}`);
    }
  }

  async getBalance(address: string) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const balance = await this.provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      console.error('Failed to get EVM balance:', error);
      throw error;
    }
  }

  async sendTransaction(to: string, amount: string) {
    try {
      if (!this.signer) {
        throw new Error('Signer not connected');
      }

      const tx = await this.signer.sendTransaction({
        to,
        value: parseEther(amount)
      });

      return await tx.wait();
    } catch (error) {
      console.error('Failed to send EVM transaction:', error);
      throw error;
    }
  }

  async getCurrentNetwork() {
    try {
      if (this.provider) {
        const network = await this.provider.getNetwork();
        return {
          chainId: network.chainId.toString(),
          name: network.name || 'Unknown'
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get current network:', error);
      return null;
    }
  }

  async isConnectedToSei() {
    try {
      const network = await this.getCurrentNetwork();
      return network && network.chainId === SEI_NETWORKS.evm.chainId.toString();
    } catch (error) {
      return false;
    }
  }
}

// Utility functions
export const formatSEIAmount = (amount: string, decimals: number = 6): string => {
  const num = parseFloat(amount) / Math.pow(10, decimals);
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  });
};

export const parseSEIAmount = (amount: string, decimals: number = 6): string => {
  const num = parseFloat(amount) * Math.pow(10, decimals);
  return Math.floor(num).toString();
};

export const validateSEIAddress = (address: string): boolean => {
  return /^sei1[a-z0-9]{38}$/.test(address);
};

export const validateEVMAddress = (address: string): boolean => {
  return isAddress(address);
};

// Export singleton instances
export const seiBlockchain = new SeiBlockchainService();
export const seiEVM = new SeiEVMService(SEI_NETWORKS.evm.rpc);
