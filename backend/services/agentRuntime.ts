import { tokenActivityMonitor } from "../templates/tokenMonitor.js";
import { aiWalletBalance, createScheduledReporter } from "../templates/aiWalletBalance.js";
import { getSeiPrice, createPriceMonitor } from "../services/marketData.js";
import { readContract, writeContract, deployContract } from "../services/contractInteraction.js";

export interface FlowNode {
  id: string;
  type: string;
  config: any;
  position: { x: number; y: number };
}

export interface FlowJson {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
}

export interface DeployedAgent {
  id: string;
  flowId: string;
  status: "running" | "stopped" | "error";
  startTime: string;
  stopTime?: string;
  error?: string;
  instance: any;
}

class AgentRuntime {
  private deployedAgents: Map<string, DeployedAgent> = new Map();
  private agentCounters: Map<string, number> = new Map();

  constructor() {
    console.log("🚀 Initializing SEI No-Code Studio Agent Runtime");
  }

  async deployAgent(flowJson: FlowJson): Promise<{ status: string; agentId?: string; message: string }> {
    try {
      console.log(`📦 Deploying agent for flow: ${flowJson.name}`);
      
      // Validate flow
      if (!flowJson.nodes || flowJson.nodes.length === 0) {
        throw new Error("Flow must contain at least one node");
      }

      // Generate unique agent ID
      const agentId = this.generateAgentId(flowJson.type || "agent");
      
      // Deploy based on node types
      const deployedInstance = await this.deployFlowNodes(flowJson.nodes, flowJson.id);
      
      if (!deployedInstance) {
        throw new Error("No supported template found for the flow nodes");
      }

      // Store agent instance
      const deployedAgent: DeployedAgent = {
        id: agentId,
        flowId: flowJson.id,
        status: "running",
        startTime: new Date().toISOString(),
        instance: deployedInstance
      };

      this.deployedAgents.set(agentId, deployedAgent);
      
      console.log(`✅ Agent ${agentId} deployed successfully for flow ${flowJson.name}`);
      
      return {
        status: "success",
        agentId,
        message: `Agent deployed successfully with ID: ${agentId}`
      };

    } catch (error) {
      console.error("Failed to deploy agent:", error);
      return {
        status: "error",
        message: error.message || "Unknown deployment error"
      };
    }
  }

  private async deployFlowNodes(nodes: FlowNode[], flowId: string): Promise<any> {
    const deployedInstances = [];

    for (const node of nodes) {
      const instance = await this.deployNode(node, flowId);
      if (instance) {
        deployedInstances.push(instance);
      }
    }

    if (deployedInstances.length === 0) {
      return null;
    }

    // Return the first deployed instance or a combined instance
    return deployedInstances.length === 1 ? deployedInstances[0] : deployedInstances;
  }

  private async deployNode(node: FlowNode, flowId: string): Promise<any> {
    console.log(`🔧 Deploying node: ${node.type}`);

    switch (node.type) {
      case "tokenActivityMonitor":
        return tokenActivityMonitor({
          wallet: node.config.wallet || process.env.TEST_WALLET || "sei1test...",
          threshold: node.config.threshold || 500,
          email: node.config.email || "demo@example.com",
          alertTypes: node.config.alertTypes || ["incoming", "outgoing"],
          cooldownMinutes: node.config.cooldownMinutes || 5
        });

      case "aiWalletBalance":
        if (node.config.scheduled) {
          return createScheduledReporter({
            wallet: node.config.wallet || process.env.TEST_WALLET || "sei1test...",
            email: node.config.email || "demo@example.com",
            reportFrequency: node.config.reportFrequency || "daily",
            includeAIInsights: node.config.includeAIInsights !== false,
            customPrompt: node.config.customPrompt
          });
        } else {
          return aiWalletBalance({
            wallet: node.config.wallet || process.env.TEST_WALLET || "sei1test...",
            email: node.config.email || "demo@example.com",
            includeAIInsights: node.config.includeAIInsights !== false,
            customPrompt: node.config.customPrompt
          });
        }

      case "priceMonitor":
        return createPriceMonitor(
          (price: number) => {
            console.log(`💰 SEI Price Update: $${price}`);
            // Handle price updates based on node config
            if (node.config.callback) {
              node.config.callback(price);
            }
          },
          node.config.intervalMs || 30000
        );

      case "contractReader":
        return {
          read: async (queryMsg: any) => {
            return await readContract(node.config.contractAddress, queryMsg);
          },
          type: "contractReader"
        };

      case "contractWriter":
        return {
          write: async (execMsg: any) => {
            return await writeContract(node.config.contractAddress, execMsg);
          },
          type: "contractWriter"
        };

      case "contractDeployer":
        return {
          deploy: async (wasmByteCode: Buffer, initMsg: any) => {
            return await deployContract(wasmByteCode, initMsg);
          },
          type: "contractDeployer"
        };

      default:
        console.warn(`⚠️ Unknown node type: ${node.type}`);
        return null;
    }
  }

  private generateAgentId(type: string): string {
    const counter = (this.agentCounters.get(type) || 0) + 1;
    this.agentCounters.set(type, counter);
    return `${type}-${Date.now()}-${counter}`;
  }

  async stopAgent(agentId: string): Promise<{ status: string; message: string }> {
    try {
      const agent = this.deployedAgents.get(agentId);
      if (!agent) {
        return { status: "error", message: "Agent not found" };
      }

      if (agent.status === "stopped") {
        return { status: "error", message: "Agent is already stopped" };
      }

      // Stop the agent instance
      if (agent.instance && typeof agent.instance.stop === "function") {
        agent.instance.stop();
      }

      // Update agent status
      agent.status = "stopped";
      agent.stopTime = new Date().toISOString();
      this.deployedAgents.set(agentId, agent);

      console.log(`🛑 Agent ${agentId} stopped successfully`);
      
      return {
        status: "success",
        message: `Agent ${agentId} stopped successfully`
      };

    } catch (error) {
      console.error("Failed to stop agent:", error);
      return {
        status: "error",
        message: error.message || "Unknown error stopping agent"
      };
    }
  }

  async startAgent(agentId: string): Promise<{ status: string; message: string }> {
    try {
      const agent = this.deployedAgents.get(agentId);
      if (!agent) {
        return { status: "error", message: "Agent not found" };
      }

      if (agent.status === "running") {
        return { status: "error", message: "Agent is already running" };
      }

      // Start the agent instance
      if (agent.instance && typeof agent.instance.start === "function") {
        agent.instance.start();
      }

      // Update agent status
      agent.status = "running";
      agent.startTime = new Date().toISOString();
      agent.stopTime = undefined;
      this.deployedAgents.set(agentId, agent);

      console.log(`▶️ Agent ${agentId} started successfully`);
      
      return {
        status: "success",
        message: `Agent ${agentId} started successfully`
      };

    } catch (error) {
      console.error("Failed to start agent:", error);
      return {
        status: "error",
        message: error.message || "Unknown error starting agent"
      };
    }
  }

  async deleteAgent(agentId: string): Promise<{ status: string; message: string }> {
    try {
      const agent = this.deployedAgents.get(agentId);
      if (!agent) {
        return { status: "error", message: "Agent not found" };
      }

      // Stop agent if running
      if (agent.status === "running") {
        await this.stopAgent(agentId);
      }

      // Remove from deployed agents
      this.deployedAgents.delete(agentId);

      console.log(`🗑️ Agent ${agentId} deleted successfully`);
      
      return {
        status: "success",
        message: `Agent ${agentId} deleted successfully`
      };

    } catch (error) {
      console.error("Failed to delete agent:", error);
      return {
        status: "error",
        message: error.message || "Unknown error deleting agent"
      };
    }
  }

  getAgentStatus(agentId: string): DeployedAgent | null {
    return this.deployedAgents.get(agentId) || null;
  }

  getAllAgents(): DeployedAgent[] {
    return Array.from(this.deployedAgents.values());
  }

  getAgentsByStatus(status: string): DeployedAgent[] {
    return this.getAllAgents().filter(agent => agent.status === status);
  }

  getAgentStats(): { total: number; running: number; stopped: number; error: number } {
    const agents = this.getAllAgents();
    return {
      total: agents.length,
      running: agents.filter(a => a.status === "running").length,
      stopped: agents.filter(a => a.status === "stopped").length,
      error: agents.filter(a => a.status === "error").length
    };
  }
}

// Create singleton instance
const agentRuntime = new AgentRuntime();

// Export functions for easy use
export async function deployAgent(flowJson: FlowJson) {
  return await agentRuntime.deployAgent(flowJson);
}

export async function stopAgent(agentId: string) {
  return await agentRuntime.stopAgent(agentId);
}

export async function startAgent(agentId: string) {
  return await agentRuntime.startAgent(agentId);
}

export async function deleteAgent(agentId: string) {
  return await agentRuntime.deleteAgent(agentId);
}

export function getAgentStatus(agentId: string) {
  return agentRuntime.getAgentStatus(agentId);
}

export function getAllAgents() {
  return agentRuntime.getAllAgents();
}

export function getAgentStats() {
  return agentRuntime.getAgentStats();
}

// Export the class for advanced usage
export { AgentRuntime, agentRuntime as default };
