import { AgentRecord, NoCodeAgentConfig, agentRecordToNFTMetadata } from "./agentDataModels";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// In-memory database for agents (in production, use a real database)
const agentsDB: AgentRecord[] = [];

// Configuration
const MCP_SERVER = process.env['SEI_MCP_URL'] || "http://localhost:3001";
const AGENT_NFT_CONTRACT = process.env['AGENT_NFT_CONTRACT'] || "0xYourAgentNFTContractAddress";
const GOAT_CONFIG = {
  network: process.env['SEI_NETWORK'] || "sei-testnet",
  rpcUrl: process.env['SEI_RPC_URL'] || "https://rpc-testnet.sei.io"
};

// Helper function to interact with Sei MCP Server
async function callSeiTool(toolName: string, params: any): Promise<any> {
  try {
    console.log(`Calling MCP tool ${toolName} with params:`, params);
    
    const res = await axios.post(`${MCP_SERVER}/tool`, { 
      tool: toolName, 
      params 
    });
    
    console.log(`MCP tool ${toolName} response:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`Error calling MCP tool ${toolName}:`, error);
    throw new Error(`Failed to call MCP tool ${toolName}: ${error}`);
  }
}

export class AgentService {
  /**
   * Creates and deploys a new agent to the Sei blockchain
   */
  static async createAndDeployAgent(config: NoCodeAgentConfig): Promise<AgentRecord> {
    console.log(`Creating and deploying agent: ${config.name}`);
    
    // Create new agent record
    const newAgent: AgentRecord = {
      id: uuidv4(),
      name: config.name,
      description: config.description,
      agentType: config.agentType,
      ownerWalletAddress: config.ownerWalletAddress,
      configuration: config.configuration,
      status: "Pending",
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      avatarUrl: config.avatarUrl || "",
    };

    // Add to database
    agentsDB.push(newAgent);
    console.log(`Agent ${newAgent.name} (ID: ${newAgent.id}) created with status: ${newAgent.status}`);

    try {
      // Generate NFT metadata
      const nftMetadata = agentRecordToNFTMetadata(newAgent);
      console.log("Generated NFT metadata:", nftMetadata);
      
      // Create metadata URI (base64 encoded for now, in production use IPFS)
      const metadataURI = `data:application/json;base64,${Buffer.from(JSON.stringify(nftMetadata)).toString("base64")}`;
      
      console.log("Minting NFT on Sei blockchain...");
      
      // Mint NFT on Sei blockchain using MCP server
      const mintResp = await callSeiTool("write-contract", {
        contractAddress: AGENT_NFT_CONTRACT,
        abi: JSON.stringify([
          "function mint(address to, string memory tokenURI) public returns (uint256)"
        ]),
        functionName: "mint",
        args: [config.ownerWalletAddress, metadataURI],
        network: GOAT_CONFIG.network,
        value: "0", // No ETH value needed for minting
        gasLimit: "500000"
      });

      console.log("NFT minting response:", mintResp);

      // Update agent with NFT details
      newAgent.nftTokenId = mintResp.tokenId || `token_${Date.now()}`;
      newAgent.seiTxHash = mintResp.txHash || `tx_${Date.now()}`;
      newAgent.status = "Deployed";
      newAgent.lastUpdated = Date.now();

      console.log(`✅ Agent ${newAgent.name} (ID: ${newAgent.id}) deployed successfully!`);
      console.log(`NFT Token ID: ${newAgent.nftTokenId}`);
      console.log(`Sei Transaction Hash: ${newAgent.seiTxHash}`);
      console.log("Agent Configuration:", newAgent.configuration);

      return newAgent;
    } catch (error) {
      console.error("❌ Error during agent deployment:", error);
      
      // Update agent status to error
      newAgent.status = "Error";
      newAgent.lastUpdated = Date.now();
      
      throw new Error(`Failed to deploy agent: ${error}`);
    }
  }

  /**
   * Retrieves an agent by ID
   */
  static async getAgentById(agentId: string): Promise<AgentRecord | undefined> {
    return agentsDB.find(agent => agent.id === agentId);
  }

  /**
   * Retrieves all agents
   */
  static async getAllAgents(): Promise<AgentRecord[]> {
    return agentsDB;
  }

  /**
   * Retrieves agents by owner wallet address
   */
  static async getAgentsByOwner(walletAddress: string): Promise<AgentRecord[]> {
    return agentsDB.filter(agent => agent.ownerWalletAddress === walletAddress);
  }

  /**
   * Updates an existing agent
   */
  static async updateAgent(agentId: string, updates: Partial<AgentRecord>): Promise<AgentRecord> {
    const agentIndex = agentsDB.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) {
      throw new Error("Agent not found.");
    }

    // Update agent
    const existingAgent = agentsDB[agentIndex];
    if (!existingAgent) {
      throw new Error("Agent not found.");
    }
    
    const updatedAgent: AgentRecord = { 
      ...existingAgent, 
      ...updates, 
      lastUpdated: Date.now(),
      avatarUrl: existingAgent.avatarUrl || "" // Ensure avatarUrl is always a string
    };

    agentsDB[agentIndex] = updatedAgent;
    console.log(`Agent ${agentId} updated successfully`);
    return updatedAgent;
  }

  /**
   * Deletes an agent and burns its NFT
   */
  static async deleteAgent(agentId: string): Promise<void> {
    const agentIndex = agentsDB.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) {
      throw new Error("Agent not found.");
    }

    const agentToDelete = agentsDB[agentIndex];
    if (!agentToDelete) {
      throw new Error("Agent not found.");
    }
    
    console.log(`Deleting agent: ${agentToDelete.name} (ID: ${agentId})`);

    // Burn NFT if it exists
    if (agentToDelete.nftTokenId) {
      try {
        console.log(`Burning NFT ${agentToDelete.nftTokenId} for agent ${agentId}...`);
        
        await callSeiTool("write-contract", {
          contractAddress: AGENT_NFT_CONTRACT,
          abi: JSON.stringify([
            "function burn(uint256 tokenId) public"
          ]),
          functionName: "burn",
          args: [agentToDelete.nftTokenId],
          network: GOAT_CONFIG.network,
          gasLimit: "300000"
        });

        console.log(`✅ NFT ${agentToDelete.nftTokenId} burned successfully for agent ${agentId}`);
      } catch (error) {
        console.error(`❌ Failed to burn NFT for agent ${agentId}:`, error);
        // Continue with deletion even if NFT burning fails
      }
    }

    // Remove from database
    agentsDB.splice(agentIndex, 1);
    console.log(`✅ Agent ${agentId} deleted successfully`);
  }

  /**
   * Executes a task for a specific agent
   */
  static async executeAgentTask(agentId: string, taskPayload: any): Promise<any> {
    const agent = await this.getAgentById(agentId);
    if (!agent) {
      throw new Error("Agent not found.");
    }

    console.log(`🚀 Executing task for agent ${agent.name} (ID: ${agent.id})`);
    console.log("Task payload:", taskPayload);

    // Simulate task execution based on agent type
    let taskResult: any;

    if (agent.agentType === "SecurityAuditor" && taskPayload.contractAddress) {
      console.log(`🔍 Simulating security audit for contract ${taskPayload.contractAddress} by ${agent.name}`);
      
      // Simulate audit findings
      const auditResult = {
        contractAddress: taskPayload.contractAddress,
        agentId: agent.id,
        agentName: agent.name,
        findings: [
          `Simulated security finding for ${taskPayload.contractAddress}`,
          "Potential reentrancy vulnerability detected",
          "Access control issues identified"
        ],
        status: "completed",
        timestamp: Date.now()
      };

      taskResult = auditResult;

      // Record audit decision on-chain (optional)
      try {
        const taskHash = "0x" + Math.random().toString(16).substr(2, 32).padStart(32, "0");
        
        await callSeiTool("write-contract", {
          contractAddress: process.env['MEMORY_ANCHOR_CONTRACT'] || "0xYourMemoryAnchorContractAddress",
          abi: JSON.stringify([
            "function recordDecision(bytes32 taskHash, string memory action, string memory rationale) public"
          ]),
          functionName: "recordDecision",
          args: [
            taskHash, 
            "Audit Completed", 
            `Security audit for ${taskPayload.contractAddress} by ${agent.name}`
          ],
          network: GOAT_CONFIG.network,
          gasLimit: "200000"
        });

        console.log(`✅ Audit decision recorded on-chain for task ${taskHash}`);
      } catch (seiError) {
        console.error("⚠️ Failed to record audit decision on Sei:", seiError);
        // Continue execution even if on-chain recording fails
      }

    } else if (agent.agentType === "ThreatResponder") {
      console.log(`🛡️ Simulating threat response by ${agent.name}`);
      
      taskResult = {
        agentId: agent.id,
        agentName: agent.name,
        action: "Threat response executed",
        status: "completed",
        timestamp: Date.now()
      };

    } else if (agent.agentType === "ComplianceGuard") {
      console.log(`📋 Simulating compliance check by ${agent.name}`);
      
      taskResult = {
        agentId: agent.id,
        agentName: agent.name,
        complianceStatus: "Compliant",
        status: "completed",
        timestamp: Date.now()
      };

    } else {
      // Generic task execution
      taskResult = {
        agentId: agent.id,
        agentName: agent.name,
        message: `Task for ${agent.name} executed successfully (simulated)`,
        status: "completed",
        timestamp: Date.now()
      };
    }

    console.log(`✅ Task execution completed for agent ${agent.name}`);
    console.log("Task result:", taskResult);

    return taskResult;
  }

  /**
   * Activates a deployed agent
   */
  static async activateAgent(agentId: string): Promise<AgentRecord> {
    const agent = await this.getAgentById(agentId);
    if (!agent) {
      throw new Error("Agent not found.");
    }

    if (agent.status !== "Deployed") {
      throw new Error(`Agent must be deployed before activation. Current status: ${agent.status}`);
    }

    console.log(`🔄 Activating agent: ${agent.name} (ID: ${agentId})`);

    // Update agent status to active
    const updatedAgent = await this.updateAgent(agentId, { status: "Active" });
    
    console.log(`✅ Agent ${agent.name} activated successfully`);
    return updatedAgent;
  }

  /**
   * Pauses an active agent
   */
  static async pauseAgent(agentId: string): Promise<AgentRecord> {
    const agent = await this.getAgentById(agentId);
    if (!agent) {
      throw new Error("Agent not found.");
    }

    if (agent.status !== "Active") {
      throw new Error(`Agent must be active before pausing. Current status: ${agent.status}`);
    }

    console.log(`⏸️ Pausing agent: ${agent.name} (ID: ${agentId})`);

    // Update agent status to paused
    const updatedAgent = await this.updateAgent(agentId, { status: "Paused" });
    
    console.log(`✅ Agent ${agent.name} paused successfully`);
    return updatedAgent;
  }

  /**
   * Gets agent statistics
   */
  static async getAgentStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const stats = {
      total: agentsDB.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    agentsDB.forEach(agent => {
      // Count by status
      stats.byStatus[agent.status] = (stats.byStatus[agent.status] || 0) + 1;
      
      // Count by type
      stats.byType[agent.agentType] = (stats.byType[agent.agentType] || 0) + 1;
    });

    return stats;
  }
}
