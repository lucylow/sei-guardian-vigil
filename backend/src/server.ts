import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import AgentManager from "./AgentManager";
import BattleEngine from "./BattleEngine";
import RewardSystem from "./RewardSystem";
import { SeiBlockchain } from "./SeiBlockchain";
import seiMcpRouter from "./seiMcpIntegration";

const app = express();
app.use(express.json());
app.use("/api/sei", seiMcpRouter);

const server = http.createServer(app);
const io = new SocketIO(server, { cors: { origin: "*" } });

// Instantiate modules
const agentManager = new AgentManager();
const battleEngine = new BattleEngine(agentManager, io);
const rewardSystem = new RewardSystem(agentManager, io);
const blockchain = new SeiBlockchain();

// REST endpoint: Start battle
app.post("/api/battle/start", async (req, res) => {
  const { agentId, vulnType, severity } = req.body;
  const battle = battleEngine.createBattle(agentId, vulnType, severity);
  io.emit("battle:new", battle);
  res.json(battle);
});

// REST endpoint: Claim SENT reward
app.post("/api/reward/claim", async (req, res) => {
  const { agentId, amount } = req.body;
  const agent = agentManager.getAgent(agentId);
  const tx = await blockchain.sendSENT(agent.wallet, amount);
  rewardSystem.recordReward(agentId, amount, tx.txHash);
  res.json({ agentId, amount, txHash: tx.txHash });
});

// REST endpoint: Mint NFT for agent
app.post("/api/agent/mint-nft", async (req, res) => {
  const agent = agentManager.getAgent(req.body.agentId);
  const nftTx = await blockchain.mintAgentNFT(agent.wallet, agent.metadataURI);
  agent.nftTokenId = nftTx.tokenId;
  res.json(nftTx);
});

// REST endpoint: Get agent NFT metadata
app.get("/api/agent/nft/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  const meta = await blockchain.getNFTMetadata(tokenId);
  res.json(meta);
});

// REST endpoint: Get transaction info
app.get("/api/tx/:txHash", async (req, res) => {
  const { txHash } = req.params;
  const tx = await blockchain.getTransaction(txHash);
  res.json(tx);
});

// REST endpoint: Status (mock/live)
app.get("/api/status", (req, res) => {
  res.json({ seiMockMode: blockchain.isMockMode?.() });
});

// REST endpoint: Reset mock mode
app.post("/api/reset-mock", (req, res) => {
  blockchain.resetMock?.();
  res.json({ msg: "Reset to live mode; will try real MCP again." });
});

// WebSocket for real-time UI
io.on("connection", (socket) => {
  socket.emit("agents:update", agentManager.list());
  socket.emit("leaderboard:update", agentManager.getLeaderboard());
  socket.on("battle:action", data => battleEngine.handleAction(data));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Sentinel backend running on port ${PORT}`));