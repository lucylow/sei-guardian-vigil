import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient, CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ethers } from "ethers";

// SEI Network Configuration
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
    name: "SEI EVM"
  }
};

// Governance Contract ABI (CosmWasm)
export const GOVERNANCE_CONTRACT_ABI = {
  // Query messages
  get_proposal: { get_proposal: { proposal_id: "number" } },
  get_proposals: { get_proposals: { start_after: "string", limit: "number" } },
  get_vote: { get_vote: { proposal_id: "number", voter: "string" } },
  get_votes: { get_votes: { proposal_id: "number", start_after: "string", limit: "number" } },
  get_config: { get_config: {} },
  
  // Execute messages
  submit_proposal: { submit_proposal: { title: "string", description: "string", metadata: "string" } },
  vote: { vote: { proposal_id: "number", vote: "string", metadata: "string" } },
  execute_proposal: { execute_proposal: { proposal_id: "number" } },
  close_proposal: { close_proposal: { proposal_id: "number" } }
};

// SEI Blockchain Service Class
export class SeiBlockchainService {
  private cosmWasmClient: CosmWasmClient | null = null;
  private signingClient: SigningCosmWasmClient | null = null;
  private stargateClient: StargateClient | null = null;
  private signingStargateClient: SigningStargateClient | null = null;
  private evmProvider: ethers.providers.JsonRpcProvider | null = null;
  private evmSigner: ethers.Signer | null = null;
  private currentNetwork: keyof typeof SEI_NETWORKS = "mainnet";

  constructor(network: keyof typeof SEI_NETWORKS = "mainnet") {
    this.currentNetwork = network;
    this.initializeClients();
  }

  // Initialize blockchain clients
  private async initializeClients() {
    try {
      // Initialize CosmWasm client for read operations
      this.cosmWasmClient = await CosmWasmClient.connect(SEI_NETWORKS[this.currentNetwork].rpc);
      
      // Initialize Stargate client for basic operations
      this.stargateClient = await StargateClient.connect(SEI_NETWORKS[this.currentNetwork].rpc);
      
      // Initialize EVM provider
      this.evmProvider = new ethers.providers.JsonRpcProvider(SEI_NETWORKS.evm.rpc);
      
      console.log("SEI Blockchain clients initialized successfully");
    } catch (error) {
      console.error("Failed to initialize SEI blockchain clients:", error);
      throw error;
    }
  }

  // Connect wallet with mnemonic (CosmWasm)
  async connectWallet(mnemonic: string): Promise<{
    address: string;
    client: SigningCosmWasmClient;
    stargateClient: SigningStargateClient;
  }> {
    try {
      // Create wallet with SEI prefix
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: SEI_NETWORKS[this.currentNetwork].prefix
      });
      
      const [account] = await wallet.getAccounts();
      
      // Initialize signing clients
      this.signingClient = await SigningCosmWasmClient.connectWithSigner(
        SEI_NETWORKS[this.currentNetwork].rpc,
        wallet
      );
      
      this.signingStargateClient = await SigningStargateClient.connectWithSigner(
        SEI_NETWORKS[this.currentNetwork].rpc,
        wallet
      );

      console.log("Wallet connected:", account.address);
      
      return {
        address: account.address,
        client: this.signingClient,
        stargateClient: this.signingStargateClient
      };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }

  // Connect EVM wallet (MetaMask, Compass, etc.)
  async connectEVMWallet(): Promise<{
    address: string;
    signer: ethers.Signer;
    provider: ethers.providers.JsonRpcProvider;
  }> {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        this.evmSigner = signer;
        this.evmProvider = provider;
        
        console.log("EVM wallet connected:", address);
        
        return { address, signer, provider };
      } else {
        throw new Error("No EVM wallet detected");
      }
    } catch (error) {
      console.error("Failed to connect EVM wallet:", error);
      throw error;
    }
  }

  // Query governance proposals
  async getGovernanceProposals(
    contractAddress: string,
    startAfter?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      if (!this.cosmWasmClient) {
        throw new Error("CosmWasm client not initialized");
      }

      const queryMsg = {
        ...GOVERNANCE_CONTRACT_ABI.get_proposals,
        get_proposals: {
          start_after: startAfter || null,
          limit
        }
      };

      const proposals = await this.cosmWasmClient.queryContractSmart(contractAddress, queryMsg);
      return proposals.proposals || [];
    } catch (error) {
      console.error("Failed to get governance proposals:", error);
      throw error;
    }
  }

  // Query specific proposal
  async getGovernanceProposal(
    contractAddress: string,
    proposalId: number
  ): Promise<any> {
    try {
      if (!this.cosmWasmClient) {
        throw new Error("CosmWasm client not initialized");
      }

      const queryMsg = {
        ...GOVERNANCE_CONTRACT_ABI.get_proposal,
        get_proposal: { proposal_id: proposalId }
      };

      const proposal = await this.cosmWasmClient.queryContractSmart(contractAddress, queryMsg);
      return proposal.proposal;
    } catch (error) {
      console.error("Failed to get governance proposal:", error);
      throw error;
    }
  }

  // Submit new governance proposal
  async submitGovernanceProposal(
    contractAddress: string,
    title: string,
    description: string,
    metadata: string = "",
    fee?: any
  ): Promise<any> {
    try {
      if (!this.signingClient) {
        throw new Error("Signing client not initialized");
      }

      const accounts = await this.signingClient.getAccounts();
      const sender = accounts[0].address;

      const executeMsg = {
        ...GOVERNANCE_CONTRACT_ABI.submit_proposal,
        submit_proposal: {
          title,
          description,
          metadata
        }
      };

      const defaultFee = {
        amount: [{ denom: "usei", amount: "5000" }],
        gas: "300000"
      };

      const txResult = await this.signingClient.execute(
        sender,
        contractAddress,
        executeMsg,
        fee || defaultFee
      );

      console.log("Proposal submitted successfully:", txResult);
      return txResult;
    } catch (error) {
      console.error("Failed to submit governance proposal:", error);
      throw error;
    }
  }

  // Vote on governance proposal
  async voteOnProposal(
    contractAddress: string,
    proposalId: number,
    vote: "yes" | "no" | "abstain",
    metadata: string = "",
    fee?: any
  ): Promise<any> {
    try {
      if (!this.signingClient) {
        throw new Error("Signing client not initialized");
      }

      const accounts = await this.signingClient.getAccounts();
      const sender = accounts[0].address;

      const executeMsg = {
        ...GOVERNANCE_CONTRACT_ABI.vote,
        vote: {
          proposal_id: proposalId,
          vote,
          metadata
        }
      };

      const defaultFee = {
        amount: [{ denom: "usei", amount: "2000" }],
        gas: "150000"
      };

      const txResult = await this.signingClient.execute(
        sender,
        contractAddress,
        executeMsg,
        fee || defaultFee
      );

      console.log("Vote submitted successfully:", txResult);
      return txResult;
    } catch (error) {
      console.error("Failed to vote on proposal:", error);
      throw error;
    }
  }

  // Execute passed proposal
  async executeProposal(
    contractAddress: string,
    proposalId: number,
    fee?: any
  ): Promise<any> {
    try {
      if (!this.signingClient) {
        throw new Error("Signing client not initialized");
      }

      const accounts = await this.signingClient.getAccounts();
      const sender = accounts[0].address;

      const executeMsg = {
        ...GOVERNANCE_CONTRACT_ABI.execute_proposal,
        execute_proposal: { proposal_id: proposalId }
      };

      const defaultFee = {
        amount: [{ denom: "usei", amount: "10000" }],
        gas: "500000"
      };

      const txResult = await this.signingClient.execute(
        sender,
        contractAddress,
        executeMsg,
        fee || defaultFee
      );

      console.log("Proposal executed successfully:", txResult);
      return txResult;
    } catch (error) {
      console.error("Failed to execute proposal:", error);
      throw error;
    }
  }

  // Get account balance
  async getAccountBalance(address: string): Promise<any> {
    try {
      if (!this.stargateClient) {
        throw new Error("Stargate client not initialized");
      }

      const balance = await this.stargateClient.getBalance(address, "usei");
      return balance;
    } catch (error) {
      console.error("Failed to get account balance:", error);
      throw error;
    }
  }

  // Get account info
  async getAccountInfo(address: string): Promise<any> {
    try {
      if (!this.stargateClient) {
        throw new Error("Stargate client not initialized");
      }

      const account = await this.stargateClient.getAccount(address);
      return account;
    } catch (error) {
      console.error("Failed to get account info:", error);
      throw error;
    }
  }

  // Estimate gas for transaction
  async estimateGas(
    contractAddress: string,
    executeMsg: any,
    sender: string
  ): Promise<string> {
    try {
      if (!this.signingClient) {
        throw new Error("Signing client not initialized");
      }

      // Simulate the transaction to estimate gas
      const gasEstimate = await this.signingClient.simulate(
        sender,
        [executeMsg],
        ""
      );

      // Add buffer to gas estimate
      const gasWithBuffer = Math.ceil(Number(gasEstimate) * 1.3);
      return gasWithBuffer.toString();
    } catch (error) {
      console.error("Failed to estimate gas:", error);
      // Return default gas estimate
      return "200000";
    }
  }

  // Get transaction details
  async getTransaction(txHash: string): Promise<any> {
    try {
      if (!this.stargateClient) {
        throw new Error("Stargate client not initialized");
      }

      const tx = await this.stargateClient.getTx(txHash);
      return tx;
    } catch (error) {
      console.error("Failed to get transaction:", error);
      throw error;
    }
  }

  // Get block height
  async getBlockHeight(): Promise<number> {
    try {
      if (!this.stargateClient) {
        throw new Error("Stargate client not initialized");
      }

      const height = await this.stargateClient.getHeight();
      return height;
    } catch (error) {
      console.error("Failed to get block height:", error);
      throw error;
    }
  }

  // Switch network
  async switchNetwork(network: keyof typeof SEI_NETWORKS): Promise<void> {
    this.currentNetwork = network;
    await this.initializeClients();
  }

  // Get current network info
  getCurrentNetwork() {
    return SEI_NETWORKS[this.currentNetwork];
  }

  // Get network status
  async getNetworkStatus(): Promise<{
    isOnline: boolean;
    blockHeight: number;
    chainId: string;
    rpc: string;
  }> {
    try {
      const blockHeight = await this.getBlockHeight();
      const network = this.getCurrentNetwork();
      
      return {
        isOnline: true,
        blockHeight,
        chainId: network.chainId,
        rpc: network.rpc
      };
    } catch (error) {
      return {
        isOnline: false,
        blockHeight: 0,
        chainId: "",
        rpc: ""
      };
    }
  }
}

// EVM-specific functions for SEI EVM compatibility
export class SeiEVMService {
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(rpcUrl?: string) {
    if (rpcUrl) {
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    }
  }

  // Connect to EVM wallet
  async connectWallet(): Promise<string> {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        this.signer = provider.getSigner();
        this.provider = provider;
        
        const address = await this.signer.getAddress();
        return address;
      } else {
        throw new Error("No EVM wallet detected");
      }
    } catch (error) {
      console.error("Failed to connect EVM wallet:", error);
      throw error;
    }
  }

  // Get EVM balance
  async getBalance(address: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error("EVM provider not initialized");
      }

      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Failed to get EVM balance:", error);
      throw error;
    }
  }

  // Send EVM transaction
  async sendTransaction(to: string, amount: string): Promise<any> {
    try {
      if (!this.signer) {
        throw new Error("EVM signer not initialized");
      }

      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.utils.parseEther(amount)
      });

      return await tx.wait();
    } catch (error) {
      console.error("Failed to send EVM transaction:", error);
      throw error;
    }
  }
}

// Utility functions
export const formatSEIAmount = (amount: string, decimals: number = 6): string => {
  const num = parseFloat(amount) / Math.pow(10, decimals);
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
};

export const parseSEIAmount = (amount: string, decimals: number = 6): string => {
  const num = parseFloat(amount) * Math.pow(10, decimals);
  return Math.floor(num).toString();
};

export const validateSEIAddress = (address: string): boolean => {
  return /^sei1[a-z0-9]{38}$/.test(address);
};

export const validateEVMAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address);
};

// Export singleton instance
export const seiBlockchain = new SeiBlockchainService();
export const seiEVM = new SeiEVMService(SEI_NETWORKS.evm.rpc);
