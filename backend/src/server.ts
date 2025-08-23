import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { Blockchain } from "./SeiBlockchain";
import AgentManager from "./AgentManager";
import BattleEngine from "./BattleEngine";
import RewardSystem from "./RewardSystem";
import seiMcpRouter from "./seiMcpIntegration";
import visualAgentRouter from "../api/visualAgent.js";
import agentRouter from "./agentRoutes"; // Import the new agent router

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // <-- Ensure body parser is enabled

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// API Routes
app.use("/api/sei", seiMcpRouter);
app.use("/api/visual-agent", visualAgentRouter);
app.use("/api/agents", agentRouter); // Add the new agent routes

const server = http.createServer(app);
const io = new SocketIO(server, { cors: { origin: "*" } });

// Instantiate modules
const agentManager = new AgentManager();
const battleEngine = new BattleEngine(agentManager, io);
const rewardSystem = new RewardSystem(agentManager, io);

// Real-time vulnerability battle system
const activeBattles = new Map();

io.on("connection", (socket) => {
  socket.emit("agents:update", agentManager.list());
  socket.emit("leaderboard:update", agentManager.getLeaderboard());
  socket.on("battle:action", data => battleEngine.handleAction(data));
  socket.on("join-battle", (battleId) => {
    socket.join(`battle-${battleId}`);
    socket.emit("battle-update", activeBattles.get(battleId));
  });

  socket.on("attack-vulnerability", ({ battleId, agentId, vulnerabilityId }) => {
    const battle = activeBattles.get(battleId);
    if (!battle) return;
    battle.attacks.push({
      agentId,
      vulnerabilityId,
      timestamp: Date.now()
    });
    io.to(`battle-${battleId}`).emit("battle-update", battle);
  });
});

// Blockchain event listener for contract interactions
Blockchain.initWebSocketListener((txData) => {
  console.log("New contract interaction detected:", txData);
  io.emit("blockchain-event", txData);
});

// API Endpoints
app.get("/api/status", (req, res) => {
  res.json({
    status: "operational",
    mockMode: Blockchain.isMockActive(),
    version: "1.2.0",
    features: {
      agents: true,
      battles: true,
      rewards: true,
      seiIntegration: true
    }
  });
});

app.post("/api/scan", async (req, res) => {
  // ...simulate scan logic...
  const { contract, metadata } = req.body;
  try {
    const start = Date.now();
    // Replace with your scan logic
    const result = { findings: [], scanTime: 0 };
    result.scanTime = Date.now() - start;
    // Create vulnerability battle if findings exist
    if (result.findings.length > 0) {
      const battleId = `battle-${Date.now()}`;
      activeBattles.set(battleId, {
        contract: metadata,
        findings: result.findings,
        attacks: [],
        createdAt: Date.now()
      });
      result.battleId = battleId;
    }
    res.json(result);
    io.emit("scan-completed", { metadata, result });
  } catch (error) {
    res.status(500).json({ error: "Scan failed", details: error.message });
  }
});

app.post("/api/battle/reward", async (req, res) => {
  const { agentId, vulnerabilityId } = req.body;
  try {
    const reward = await Blockchain.transferSent(agentId, 100);
    res.json({ reward });
    io.emit("reward-distributed", { agentId, vulnerabilityId, reward });
  } catch (error) {
    res.status(500).json({ error: "Reward failed", details: error.message });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 SEI SENTINEL API running on port ${PORT}`);
  console.log(`Mode: ${Blockchain.isMockActive() ? "MOCK" : "LIVE"}`);
  console.log(`📡 Agent API endpoints available at /api/agents/*`);
  console.log(`🔗 Sei MCP integration available at /api/sei/*`);
  console.log(`🎮 Battle system active on /api/battle/*`);
});