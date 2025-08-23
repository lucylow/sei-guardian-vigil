import express from "express";
import { AgentService } from "./agentService";
import { NoCodeAgentConfig } from "./agentDataModels";

const router = express.Router();

// Middleware to check required environment variables
router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env['SEI_MCP_URL'] || !process.env['AGENT_NFT_CONTRACT']) {
    return res.status(500).json({ 
      error: "Backend configuration incomplete. SEI_MCP_URL and AGENT_NFT_CONTRACT environment variables must be set." 
    });
  }
  return next();
});

// Middleware to validate wallet addresses
const validateWalletAddress = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { ownerWalletAddress } = req.body;
  if (ownerWalletAddress && !ownerWalletAddress.startsWith('sei1')) {
    return res.status(400).json({ 
      error: "Invalid wallet address. Must be a valid Sei address starting with 'sei1'" 
    });
  }
  return next();
};

/**
 * POST /api/agents/create
 * Creates and deploys a new agent to the Sei blockchain
 */
router.post("/create", validateWalletAddress, async (req, res) => {
  try {
    console.log("Received agent creation request:", req.body);
    
    const agentConfig: NoCodeAgentConfig = req.body;
    
    // Validate required fields
    if (!agentConfig.name || !agentConfig.ownerWalletAddress || !agentConfig.agentType) {
      return res.status(400).json({ 
        error: "Missing required fields: name, ownerWalletAddress, and agentType are required" 
      });
    }

    // Validate agent type
    const validAgentTypes = ['SecurityAuditor', 'ThreatResponder', 'ComplianceGuard', 'Custom'];
    if (!validAgentTypes.includes(agentConfig.agentType)) {
      return res.status(400).json({ 
        error: `Invalid agent type. Must be one of: ${validAgentTypes.join(', ')}` 
      });
    }

    // Create and deploy the agent
    const deployedAgent = await AgentService.createAndDeployAgent(agentConfig);
    
    console.log(`✅ Agent created and deployed successfully: ${deployedAgent.name}`);
    
    res.status(201).json({
      success: true,
      message: "Agent created and deployed successfully",
      agent: deployedAgent
    });
  } catch (error: any) {
    console.error("❌ Error creating agent:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to create agent",
      details: process.env['NODE_ENV'] === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/agents/:id
 * Retrieves a specific agent by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching agent with ID: ${id}`);
    
    const agent = await AgentService.getAgentById(id);
    
    if (!agent) {
      return res.status(404).json({ 
        success: false,
        error: "Agent not found" 
      });
    }

    res.json({
      success: true,
      agent: agent
    });
  } catch (error: any) {
    console.error(`❌ Error fetching agent ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to fetch agent" 
    });
  }
});

/**
 * GET /api/agents
 * Retrieves all agents with optional filtering
 */
router.get("/", async (req, res) => {
  try {
    const { owner, status, type } = req.query;
    console.log("Fetching agents with filters:", { owner, status, type });
    
    let agents = await AgentService.getAllAgents();
    
    // Apply filters
    if (owner) {
      agents = agents.filter(agent => agent.ownerWalletAddress === owner);
    }
    
    if (status) {
      agents = agents.filter(agent => agent.status === status);
    }
    
    if (type) {
      agents = agents.filter(agent => agent.agentType === type);
    }

    res.json({
      success: true,
      count: agents.length,
      agents: agents
    });
  } catch (error: any) {
    console.error("❌ Error fetching agents:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to fetch agents" 
    });
  }
});

/**
 * GET /api/agents/owner/:walletAddress
 * Retrieves all agents owned by a specific wallet address
 */
router.get("/owner/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    console.log(`Fetching agents for wallet: ${walletAddress}`);
    
    if (!walletAddress.startsWith('sei1')) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid wallet address format" 
      });
    }
    
    const agents = await AgentService.getAgentsByOwner(walletAddress);
    
    res.json({
      success: true,
      count: agents.length,
      walletAddress: walletAddress,
      agents: agents
    });
  } catch (error: any) {
    console.error(`❌ Error fetching agents for wallet ${req.params.walletAddress}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to fetch agents for wallet" 
    });
  }
});

/**
 * PUT /api/agents/:id
 * Updates an existing agent
 */
router.put("/:id", validateWalletAddress, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log(`Updating agent ${id} with:`, updates);
    
    // Remove immutable fields from updates
    const { id: _, createdAt, nftTokenId, seiTxHash, ...allowedUpdates } = updates;
    
    const updatedAgent = await AgentService.updateAgent(id, allowedUpdates);
    
    console.log(`✅ Agent ${id} updated successfully`);
    
    res.json({
      success: true,
      message: "Agent updated successfully",
      agent: updatedAgent
    });
  } catch (error: any) {
    console.error(`❌ Error updating agent ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to update agent" 
    });
  }
});

/**
 * DELETE /api/agents/:id
 * Deletes an agent and burns its NFT
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting agent with ID: ${id}`);
    
    await AgentService.deleteAgent(id);
    
    console.log(`✅ Agent ${id} deleted successfully`);
    
    res.json({
      success: true,
      message: "Agent deleted successfully"
    });
  } catch (error: any) {
    console.error(`❌ Error deleting agent ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to delete agent" 
    });
  }
});

/**
 * POST /api/agents/:id/execute-task
 * Executes a task for a specific agent
 */
router.post("/:id/execute-task", async (req, res) => {
  try {
    const { id } = req.params;
    const taskPayload = req.body;
    console.log(`Executing task for agent ${id}:`, taskPayload);
    
    const result = await AgentService.executeAgentTask(id, taskPayload);
    
    console.log(`✅ Task executed successfully for agent ${id}`);
    
    res.json({
      success: true,
      message: "Task executed successfully",
      result: result
    });
  } catch (error: any) {
    console.error(`❌ Error executing task for agent ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to execute task" 
    });
  }
});

/**
 * POST /api/agents/:id/activate
 * Activates a deployed agent
 */
router.post("/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Activating agent ${id}`);
    
    const activatedAgent = await AgentService.activateAgent(id);
    
    console.log(`✅ Agent ${id} activated successfully`);
    
    res.json({
      success: true,
      message: "Agent activated successfully",
      agent: activatedAgent
    });
  } catch (error: any) {
    console.error(`❌ Error activating agent ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to activate agent" 
    });
  }
});

/**
 * POST /api/agents/:id/pause
 * Pauses an active agent
 */
router.post("/:id/pause", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Pausing agent ${id}`);
    
    const pausedAgent = await AgentService.pauseAgent(id);
    
    console.log(`✅ Agent ${id} paused successfully`);
    
    res.json({
      success: true,
      message: "Agent paused successfully",
      agent: pausedAgent
    });
  } catch (error: any) {
    console.error(`❌ Error pausing agent ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to pause agent" 
    });
  }
});

/**
 * GET /api/agents/stats/overview
 * Gets overview statistics for all agents
 */
router.get("/stats/overview", async (req, res) => {
  try {
    console.log("Fetching agent statistics");
    
    const stats = await AgentService.getAgentStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error: any) {
    console.error("❌ Error fetching agent statistics:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to fetch agent statistics" 
    });
  }
});

/**
 * POST /api/agents/bulk-deploy
 * Deploys multiple agents in batch
 */
router.post("/bulk-deploy", validateWalletAddress, async (req, res) => {
  try {
    const { agents } = req.body;
    console.log(`Bulk deploying ${agents?.length || 0} agents`);
    
    if (!Array.isArray(agents) || agents.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Agents array is required and must not be empty" 
      });
    }
    
    if (agents.length > 10) {
      return res.status(400).json({ 
        success: false,
        error: "Maximum 10 agents can be deployed in a single request" 
      });
    }
    
    const results = [];
    const errors = [];
    
    for (const agentConfig of agents) {
      try {
        const deployedAgent = await AgentService.createAndDeployAgent(agentConfig);
        results.push(deployedAgent);
      } catch (error: any) {
        errors.push({
          name: agentConfig.name,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      message: `Bulk deployment completed. ${results.length} successful, ${errors.length} failed.`,
      results: results,
      errors: errors
    });
  } catch (error: any) {
    console.error("❌ Error in bulk deployment:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to execute bulk deployment" 
    });
  }
});

/**
 * POST /api/agents/deploy
 * Deploys an agent from the visual builder flow data
 */
router.post("/deploy", validateWalletAddress, async (req, res) => {
  try {
    console.log("Received agent deployment request from visual builder:", req.body);
    
    const { flow, seiConfig, ownerWalletAddress } = req.body;
    
    // Validate required fields
    if (!flow || !flow.nodes || !flow.edges) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required flow data: nodes and edges are required" 
      });
    }

    if (!ownerWalletAddress) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required field: ownerWalletAddress" 
      });
    }

    // Extract agent configuration from flow
    const agentName = flow.config?.name || `Agent_${Date.now()}`;
    const agentDescription = flow.config?.description || `AI Agent created via No-Code Studio`;
    const agentType = flow.config?.type || 'Custom';
    
    // Create agent configuration
    const agentConfig: NoCodeAgentConfig = {
      name: agentName,
      description: agentDescription,
      agentType: agentType as any,
      ownerWalletAddress: ownerWalletAddress,
      configuration: {
        flow: flow,
        seiConfig: seiConfig || {},
        nodeCount: flow.nodes.length,
        edgeCount: flow.edges.length,
        createdAt: Date.now()
      },
      avatarUrl: flow.config?.avatarUrl
    };

    console.log("Created agent config from flow:", agentConfig);

    // Create and deploy the agent
    const deployedAgent = await AgentService.createAndDeployAgent(agentConfig);
    
    console.log(`✅ Agent deployed successfully from visual builder: ${deployedAgent.name}`);
    
    res.status(201).json({
      success: true,
      message: "Agent deployed successfully from visual builder",
      agent: deployedAgent,
      deploymentDetails: {
        nftTokenId: deployedAgent.nftTokenId,
        seiTxHash: deployedAgent.seiTxHash,
        status: deployedAgent.status
      }
    });
  } catch (error: any) {
    console.error("❌ Error deploying agent from visual builder:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to deploy agent from visual builder",
      details: process.env['NODE_ENV'] === 'development' ? error.stack : undefined
    });
  }
});

export default router;
