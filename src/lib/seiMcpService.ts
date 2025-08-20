const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export interface AgentNFTMintRequest {
  agentWallet: string;
  metadataURI: string;
}

export interface AgentRewardRequest {
  toAddress: string;
  amount: number;
}

export interface AgentNFTInfo {
  tokenId: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface BlockInfo {
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  transactionCount: number;
}

export class SeiMcpService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async mintAgentNFT(request: AgentNFTMintRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sei/mint-agent-nft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to mint agent NFT: ${errorData.error || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error minting agent NFT:", error);
      throw error;
    }
  }

  async rewardAgent(request: AgentRewardRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sei/reward-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to reward agent: ${errorData.error || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error rewarding agent:", error);
      throw error;
    }
  }

  async getAgentNFT(tokenId: string): Promise<AgentNFTInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sei/agent-nft/${tokenId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get agent NFT: ${errorData.error || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting agent NFT:", error);
      throw error;
    }
  }

  async getLatestBlock(): Promise<BlockInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sei/block-latest`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get latest block: ${errorData.error || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting latest block:", error);
      throw error;
    }
  }
}

export const seiMcpService = new SeiMcpService();