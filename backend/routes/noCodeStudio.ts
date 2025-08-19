import express from "express";
import { 
  deployAgent, 
  stopAgent, 
  startAgent, 
  deleteAgent, 
  getAgentStatus, 
  getAllAgents, 
  getAgentStats 
} from "../services/agentRuntime.js";
import { getSeiPrice, getSeiMarketData } from "../services/marketData.js";
import { readContract, getWalletBalance } from "../services/contractInteraction.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "SEI No-Code Studio Backend",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Agent Management Endpoints
router.post("/agents/deploy", async (req, res) => {
  try {
    const flowJson = req.body;
    
    if (!flowJson || !flowJson.nodes) {
      return res.status(400).json({
        error: "Invalid flow JSON. Must include nodes array."
      });
    }

    const result = await deployAgent(flowJson);
    
    if (result.status === "success") {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Agent deployment error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

router.post("/agents/:agentId/stop", async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await stopAgent(agentId);
    
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Agent stop error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

router.post("/agents/:agentId/start", async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await startAgent(agentId);
    
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Agent start error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

router.delete("/agents/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await deleteAgent(agentId);
    
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Agent deletion error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

router.get("/agents/:agentId", (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = getAgentStatus(agentId);
    
    if (agent) {
      res.json(agent);
    } else {
      res.status(404).json({
        error: "Agent not found",
        agentId
      });
    }
  } catch (error) {
    console.error("Agent status error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

router.get("/agents", (req, res) => {
  try {
    const agents = getAllAgents();
    res.json({
      agents,
      count: agents.length
    });
  } catch (error) {
    console.error("Get agents error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

router.get("/agents/stats/overview", (req, res) => {
  try {
    const stats = getAgentStats();
    res.json(stats);
  } catch (error) {
    console.error("Agent stats error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

// Market Data Endpoints
router.get("/market/sei/price", async (req, res) => {
  try {
    const price = await getSeiPrice();
    res.json({
      symbol: "SEI",
      price: price,
      currency: "USD",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("SEI price fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch SEI price",
      message: error.message
    });
  }
});

router.get("/market/sei/data", async (req, res) => {
  try {
    const marketData = await getSeiMarketData();
    res.json({
      ...marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("SEI market data fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch SEI market data",
      message: error.message
    });
  }
});

// Contract Interaction Endpoints
router.post("/contracts/:address/read", async (req, res) => {
  try {
    const { address } = req.params;
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: "Query message is required"
      });
    }

    const result = await readContract(address, query);
    res.json({
      contractAddress: address,
      query,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Contract read error:", error);
    res.status(500).json({
      error: "Failed to read contract",
      message: error.message
    });
  }
});

router.get("/wallets/:address/balance", async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await getWalletBalance(address);
    
    res.json({
      walletAddress: address,
      balance: {
        amount: balance.amount,
        denom: balance.denom,
        seiAmount: parseFloat(balance.amount) / 1e6
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Wallet balance fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch wallet balance",
      message: error.message
    });
  }
});

// Template Management Endpoints
router.get("/templates", (req, res) => {
  try {
    const templates = [
      {
        id: "tokenActivityMonitor",
        name: "Token Activity Monitor",
        description: "Monitor wallet for large SEI transfers and send alerts",
        category: "monitoring",
        configSchema: {
          wallet: { type: "string", required: true, description: "Wallet address to monitor" },
          threshold: { type: "number", required: true, description: "Minimum SEI amount to trigger alert" },
          email: { type: "string", required: true, description: "Email for alerts" },
          alertTypes: { type: "array", items: { type: "string" }, default: ["incoming", "outgoing"] },
          cooldownMinutes: { type: "number", default: 5, description: "Minutes between alerts" }
        }
      },
      {
        id: "aiWalletBalance",
        name: "AI Wallet Balance Reporter",
        description: "Generate AI-powered insights about wallet balance and send reports",
        category: "reporting",
        configSchema: {
          wallet: { type: "string", required: true, description: "Wallet address to analyze" },
          email: { type: "string", required: true, description: "Email for reports" },
          scheduled: { type: "boolean", default: false, description: "Enable scheduled reporting" },
          reportFrequency: { type: "string", enum: ["daily", "weekly", "monthly"], default: "daily" },
          includeAIInsights: { type: "boolean", default: true, description: "Include AI-generated insights" },
          customPrompt: { type: "string", description: "Custom prompt for AI analysis" }
        }
      },
      {
        id: "priceMonitor",
        name: "SEI Price Monitor",
        description: "Monitor SEI price changes and trigger callbacks",
        category: "monitoring",
        configSchema: {
          intervalMs: { type: "number", default: 30000, description: "Price check interval in milliseconds" },
          callback: { type: "function", description: "Function to call on price updates" }
        }
      },
      {
        id: "contractReader",
        name: "Contract Reader",
        description: "Read data from smart contracts",
        category: "blockchain",
        configSchema: {
          contractAddress: { type: "string", required: true, description: "Contract address to read from" }
        }
      },
      {
        id: "contractWriter",
        name: "Contract Writer",
        description: "Write data to smart contracts",
        category: "blockchain",
        configSchema: {
          contractAddress: { type: "string", required: true, description: "Contract address to write to" }
        }
      }
    ];

    res.json({
      templates,
      count: templates.length
    });
  } catch (error) {
    console.error("Templates fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch templates",
      message: error.message
    });
  }
});

// Flow Management Endpoints
router.post("/flows/validate", (req, res) => {
  try {
    const flowJson = req.body;
    
    // Basic validation
    const errors = [];
    
    if (!flowJson.name) {
      errors.push("Flow name is required");
    }
    
    if (!flowJson.nodes || flowJson.nodes.length === 0) {
      errors.push("Flow must contain at least one node");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        valid: false,
        errors
      });
    }
    
    res.json({
      valid: true,
      message: "Flow validation passed"
    });
  } catch (error) {
    console.error("Flow validation error:", error);
    res.status(500).json({
      error: "Flow validation failed",
      message: error.message
    });
  }
});

export default router;
