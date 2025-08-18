import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { Blockchain } from "./SeiBlockchain";
import AgentManager from "./AgentManager";
import BattleEngine from "./BattleEngine";
import RewardSystem from "./RewardSystem";
import seiMcpRouter from "./seiMcpIntegration";
import visualAgentRouter from "../api/visualAgent.js";

const app = express();
app.use(express.json()); // <-- Ensure body parser is enabled
app.use("/api/sei", seiMcpRouter);
app.use("/api/visual-agent", visualAgentRouter);

const server = http.createServer(app);
const io = new SocketIO(server, { cors: { origin: "*" } });

// Instantiate modules
const agentManager = new AgentManager();
const rewardSystem = new RewardSystem(agentManager, io);
const battleEngine = new BattleEngine(agentManager, rewardSystem);

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
    version: "1.2.0"
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
  console.log(`SEI SENTINEL API running on port ${PORT}`);
  console.log(`Mode: ${Blockchain.isMockActive() ? "MOCK" : "LIVE"}`);
});


const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

class BattleEngine {
  constructor(agentManager, rewardSystem) {
    this.agentManager = agentManager;
    this.rewardSystem = rewardSystem;
    this.activeBattles = new Map();
    this.vulnerabilities = new Map();
    this.wss = null;
  }

  initializeWebSocket(server) {
    this.wss = new WebSocket.Server({ server });
    
    this.wss.on('connection', (ws) => {
      console.log('Client connected to battle system');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
    });
  }

  async startBattle(agentId, vulnerabilityId) {
    const agent = this.agentManager.getAgent(agentId);
    const vulnerability = this.vulnerabilities.get(vulnerabilityId);
    
    if (!agent || !vulnerability) {
      throw new Error('Invalid agent or vulnerability');
    }

    const battleId = uuidv4();
    const battle = {
      id: battleId,
      agentId,
      vulnerabilityId,
      startTime: Date.now(),
      status: 'active',
      progress: 0,
      phase: 'analyzing',
      events: [],
      estimatedDuration: this.calculateBattleDuration(vulnerability.severity)
    };

    this.activeBattles.set(battleId, battle);
    this.addBattleEvent(battleId, 'Battle Started', `${agent.name} begins analyzing ${vulnerability.name}`);
    
    // Start battle simulation
    this.simulateBattle(battleId);
    
    // Broadcast to all clients
    this.broadcast({
      type: 'battleStarted',
      battle: this.getBattleStatus(battleId)
    });

    return battle;
  }

  async simulateBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    const phases = ['analyzing', 'exploiting', 'patching', 'verifying'];
    let currentPhaseIndex = 0;
    
    const battleInterval = setInterval(async () => {
      if (!this.activeBattles.has(battleId)) {
        clearInterval(battleInterval);
        return;
      }

      // Update progress (5-15% per tick)
      const progressIncrement = Math.random() * 10 + 5;
      battle.progress = Math.min(battle.progress + progressIncrement, 100);
      
      // Phase transitions
      const expectedPhaseProgress = (currentPhaseIndex + 1) * 25;
      if (battle.progress >= expectedPhaseProgress && currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        battle.phase = phases[currentPhaseIndex];
        this.addBattleEvent(battleId, `Phase: ${battle.phase}`, `Agent enters ${battle.phase} phase`);
      }

      // Broadcast progress update
      this.broadcast({
        type: 'battleProgress',
        battleId,
        progress: battle.progress,
        phase: battle.phase,
        events: battle.events.slice(-3) // Last 3 events
      });

      // Battle completion
      if (battle.progress >= 100) {
        clearInterval(battleInterval);
        await this.completeBattle(battleId);
      }
    }, 1000); // Update every second
  }

  async completeBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    const vulnerability = this.vulnerabilities.get(battle.vulnerabilityId);
    const agent = this.agentManager.getAgent(battle.agentId);
    
    // Determine outcome (90% success rate for demo)
    const success = Math.random() < 0.9;
    const duration = Date.now() - battle.startTime;
    
    battle.status = success ? 'won' : 'lost';
    battle.endTime = Date.now();
    battle.duration = duration;

    if (success) {
      // Calculate rewards
      const baseReward = vulnerability.severity * 50;
      const speedBonus = duration < 30000 ? 100 : 0; // Bonus for <30s
      const totalReward = baseReward + speedBonus;

      // Award rewards
      await this.rewardSystem.rewardAgent(battle.agentId, {
        battleId,
        won: true,
        vulnerability: vulnerability.name,
        severity: vulnerability.severity,
        duration,
        reward: totalReward
      });

      this.addBattleEvent(battleId, 'Victory!', `${agent.name} successfully neutralized ${vulnerability.name}. Earned ${totalReward} $SENT`);
      
      // Update vulnerability status
      vulnerability.health -= 50;
      if (vulnerability.health <= 0) {
        vulnerability.status = 'defeated';
      }
    } else {
      this.addBattleEvent(battleId, 'Defeat', `${agent.name} was unable to neutralize the vulnerability`);
    }

    // Broadcast completion
    this.broadcast({
      type: 'battleCompleted',
      battle: this.getBattleStatus(battleId),
      result: {
        success,
        reward: success ? baseReward + speedBonus : 0,
        duration
      }
    });

    // Update agent stats
    this.agentManager.updateBattleStats(battle.agentId, success, duration);
  }

  createVulnerability(vulnData) {
    const vulnerability = {
      id: vulnData.id || uuidv4(),
      name: vulnData.name,
      type: vulnData.type,
      severity: vulnData.severity,
      description: vulnData.description,
      health: 100,
      status: 'active',
      createdAt: Date.now(),
      contractAddress: vulnData.contractAddress
    };

    this.vulnerabilities.set(vulnerability.id, vulnerability);
    
    // Broadcast new vulnerability
    this.broadcast({
      type: 'vulnerabilitySpawned',
      vulnerability
    });

    return vulnerability;
  }

  addBattleEvent(battleId, title, description) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    battle.events.push({
      timestamp: Date.now(),
      title,
      description
    });

    // Keep only last 10 events
    if (battle.events.length > 10) {
      battle.events = battle.events.slice(-10);
    }
  }

  getBattleStatus(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return null;

    const vulnerability = this.vulnerabilities.get(battle.vulnerabilityId);
    const agent = this.agentManager.getAgent(battle.agentId);

    return {
      ...battle,
      vulnerability: vulnerability ? vulnerability.name : 'Unknown',
      agent: agent ? agent.name : 'Unknown',
      vulnerabilityType: vulnerability ? vulnerability.type : 'Unknown'
    };
  }

  getAllActiveBattles() {
    return Array.from(this.activeBattles.values()).map(battle => 
      this.getBattleStatus(battle.id)
    );
  }

  getAllVulnerabilities() {
    return Array.from(this.vulnerabilities.values());
  }

  calculateBattleDuration(severity) {
    // Higher severity = longer battle (10-60 seconds)
    return (severity * 5 + Math.random() * 20) * 1000;
  }

  broadcast(message) {
    if (!this.wss) return;
    
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'startBattle':
        this.startBattle(data.agentId, data.vulnerabilityId)
          .then(battle => {
            ws.send(JSON.stringify({
              type: 'battleStarted',
              battle: this.getBattleStatus(battle.id)
            }));
          })
          .catch(error => {
            ws.send(JSON.stringify({
              type: 'error',
              message: error.message
            }));
          });
        break;
      
      case 'getBattleStatus':
        const status = this.getBattleStatus(data.battleId);
        ws.send(JSON.stringify({
          type: 'battleStatus',
          battle: status
        }));
        break;
    }
  }
}

module.exports = BattleEngine;


// Privacy-preserving scanning (homomorphic encryption simulation)
import fhe from "node-fhe"; // Example - replace with real library like TFHE or SEAL

export async function runEncryptedScan(encryptedContract) {
  const context = fhe.createContext();
  const decrypted = context.decrypt(encryptedContract);

  // Run actual scanning logic on plaintext (simulated here)
  const findings = [{ id: "PRIV-001", type: "Overflow", severity: "high" }];

  return context.encrypt(findings);
}


import { ElizaRuntime, Character } from "@elizaos/eliza";
import { GoatPlugin } from "@elizaos/plugin-goat";

const AGENT_PERSONALITIES = {
  StaticGuardian: {
    name: "Static Guardian",
    bio: "The vigilant protector of smart contracts, I analyze code with precision and never miss a vulnerability. My eagle eyes spot bugs before they become exploits!",
    traits: ["analytical", "protective", "meticulous", "confident"],
    messageExamples: [
      "🛡️ Contract analyzed! I've found 3 potential vulnerabilities that need immediate attention.",
      "⚡ Another successful scan in 350ms! Speed and accuracy are my specialties.",
      "🔍 This reentrancy pattern looks suspicious... let me dive deeper."
    ]
  },
  DarkWebScout: {
    name: "DarkWeb Scout", 
    bio: "I lurk in the shadows, monitoring threats and hunting down zero-day exploits. Nothing escapes my watchful surveillance.",
    traits: ["mysterious", "vigilant", "street-smart", "rebellious"],
    messageExamples: [
      "👀 I've been watching... detected unusual activity in block #1337",
      "🕵️ Just intercepted chatter about a new exploit pattern. Updating defenses...",
      "⚠️ RED ALERT: Critical vulnerability detected in mainnet deployment!"
    ]
  },
  PatchMaster: {
    name: "Patch Master",
    bio: "The code surgeon who fixes what's broken. I don't just find bugs - I eliminate them with surgical precision!",
    traits: ["helpful", "solutions-oriented", "expert", "encouraging"],
    messageExamples: [
      "🔧 Don't worry, I've got the perfect fix for this vulnerability!",
      "✅ Patch deployed successfully! Your contract is now bulletproof.",
      "💡 Pro tip: Use OpenZeppelin's ReentrancyGuard to prevent this issue."
    ]
  },
  ComplianceGuard: {
    name: "Compliance Guard",
    bio: "I ensure everything meets the highest security standards. Rules exist for a reason - I make sure they're followed!",
    traits: ["authoritative", "by-the-book", "thorough", "responsible"],
    messageExamples: [
      "📋 This contract passes all security compliance checks. Well done!",
      "⚖️ Regulation requires a security audit - I'm here to help you comply.",
      "🎯 100% coverage achieved! Your security posture is exemplary."
    ]
  }
};

class ElizaAgentManager {
  constructor() {
    this.agents = new Map();
    this.initializeAgents();
  }

  async initializeAgents() {
    for (const [agentType, personality] of Object.entries(AGENT_PERSONALITIES)) {
      const character = {
        name: personality.name,
        bio: personality.bio,
        lore: [`I am ${personality.name}, a security agent NFT on the Sei blockchain.`],
        messageExamples: personality.messageExamples.map(text => ({
          user: "user",
          content: { text: "What's your status?" },
          response: { text }
        })),
        postExamples: personality.messageExamples,
        topics: ["blockchain security", "smart contracts", "vulnerabilities", "Sei network"],
        style: {
          all: personality.traits,
          chat: personality.traits,
          post: personality.traits
        },
        adjectives: personality.traits
      };

      const runtime = new ElizaRuntime({
        character,
        plugins: [GoatPlugin],
      });

      this.agents.set(agentType, {
        runtime,
        personality,
        lastMessage: null,
        battleCount: 0,
        sentEarned: 0
      });
    }
  }

  async getAgentResponse(agentType, message) {
    const agent = this.agents.get(agentType);
    if (!agent) return null;

    const response = await agent.runtime.generateResponse({
      text: message,
      userId: "user",
      roomId: `battle-${Date.now()}``
    });

    agent.lastMessage = response.text;
    return response.text;
  }

  async triggerBattleDialogue(agentType, vulnerability) {
    const battleMessages = [
      `🚨 ${vulnerability.type} vulnerability detected! Severity: ${vulnerability.severity}`,
      `🛡️ Engaging battle mode... analyzing attack vectors`,
      `⚔️ Deploying countermeasures against ${vulnerability.type}`,
      `✅ Victory achieved! Vulnerability neutralized in battle #${Date.now()}`
    ];

    const responses = [];
    for (const message of battleMessages) {
      const response = await this.getAgentResponse(agentType, message);
      responses.push(response);
      await new Promise(r => setTimeout(r, 1000));
    }

    return responses;
  }
}

export default ElizaAgentManager;


export default class RewardSystem {
  constructor(agentManager, io) {
    this.agentManager = agentManager;
    this.io = io;
    this.achievements = [
      { id: "a1", name: "Critical Slayer", criteria: 5, type: "critical" },
      { id: "a2", name: "Speed Demon", criteria: 300, type: "speed" },
      { id: "a3", name: "First Fix", criteria: 1, type: "first" },
      { id: "a4", name: "Patch Master", criteria: 10, type: "patches" },
      { id: "a5", name: "Veteran Agent", criteria: 5, type: "level" }
    ];
    this.agentAchievements = {};
    this.agentStats = {};
    this.agentManager.list().forEach(agent => {
      this.agentStats[agent.id] = { criticals: 0, fixes: 0, fastFixes: 0, firstFix: false };
      this.agentAchievements[agent.id] = [];
    });
  }
  recordReward(agentId, amount, txHash) {
    const agent = this.agentManager.getAgent(agentId);
    if (!agent) return;
    const stats = this.agentStats[agentId];
    const achievements = this.agentAchievements[agentId];
    if (amount >= 50) {
      stats.criticals++;
      if (stats.criticals >= this.getAchievement("a1").criteria) {
        this.unlock(agentId, "a1");
      }
    }
    if (amount >= 30) {
      stats.fastFixes++;
      if (stats.fastFixes >= this.getAchievement("a2").criteria) {
        this.unlock(agentId, "a2");
      }
    }
    if (!stats.firstFix) {
      stats.firstFix = true;
      this.unlock(agentId, "a3");
    }
    stats.fixes++;
    if (stats.fixes >= this.getAchievement("a4").criteria) {
      this.unlock(agentId, "a4");
    }
    if (agent.level >= this.getAchievement("a5").criteria) {
      this.unlock(agentId, "a5");
    }
    this.io.emit("leaderboard:update", this.agentManager.getLeaderboard());
  }
  getAchievement(id) {
    return this.achievements.find(a => a.id === id);
  }
  unlock(agentId, achievementId) {
    if (!this.agentAchievements[agentId]) {
      this.agentAchievements[agentId] = [];
    }
    if (!this.agentAchievements[agentId].includes(achievementId)) {
      this.agentAchievements[agentId].push(achievementId);
      const achievement = this.getAchievement(achievementId);
      this.io.emit("achievement:unlock", { agentId, achievement: achievement.name, badge: achievementId });
      return true;
    }
    return false;
  }
  getAgentAchievements(agentId) {
    return (this.agentAchievements[agentId] || []).map(id => this.getAchievement(id));
  }
}


export default class BattleEngine {
  constructor(agentManager, rewardSystem) {
    this.agentManager = agentManager;
    this.rewardSystem = rewardSystem;
    this.activeBattles = new Map();
    this.vulnerabilities = new Map();
    this.wss = null;
  }

  initializeWebSocket(server) {
    this.wss = new WebSocket.Server({ server });
    
    this.wss.on('connection', (ws) => {
      console.log('Client connected to battle system');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
    });
  }

  async startBattle(agentId, vulnerabilityId) {
    const agent = this.agentManager.getAgent(agentId);
    const vulnerability = this.vulnerabilities.get(vulnerabilityId);
    
    if (!agent || !vulnerability) {
      throw new Error('Invalid agent or vulnerability');
    }

    const battleId = uuidv4();
    const battle = {
      id: battleId,
      agentId,
      vulnerabilityId,
      startTime: Date.now(),
      status: 'active',
      progress: 0,
      phase: 'analyzing',
      events: [],
      estimatedDuration: this.calculateBattleDuration(vulnerability.severity)
    };

    this.activeBattles.set(battleId, battle);
    this.addBattleEvent(battleId, 'Battle Started', `${agent.name} begins analyzing ${vulnerability.name}`);
    
    // Start battle simulation
    this.simulateBattle(battleId);
    
    // Broadcast to all clients
    this.broadcast({
      type: 'battleStarted',
      battle: this.getBattleStatus(battleId)
    });

    return battle;
  }

  async simulateBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    const phases = ['analyzing', 'exploiting', 'patching', 'verifying'];
    let currentPhaseIndex = 0;
    
    const battleInterval = setInterval(async () => {
      if (!this.activeBattles.has(battleId)) {
        clearInterval(battleInterval);
        return;
      }

      // Update progress (5-15% per tick)
      const progressIncrement = Math.random() * 10 + 5;
      battle.progress = Math.min(battle.progress + progressIncrement, 100);
      
      // Phase transitions
      const expectedPhaseProgress = (currentPhaseIndex + 1) * 25;
      if (battle.progress >= expectedPhaseProgress && currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        battle.phase = phases[currentPhaseIndex];
        this.addBattleEvent(battleId, `Phase: ${battle.phase}`, `Agent enters ${battle.phase} phase`);
      }

      // Broadcast progress update
      this.broadcast({
        type: 'battleProgress',
        battleId,
        progress: battle.progress,
        phase: battle.phase,
        events: battle.events.slice(-3) // Last 3 events
      });

      // Battle completion
      if (battle.progress >= 100) {
        clearInterval(battleInterval);
        await this.completeBattle(battleId);
      }
    }, 1000); // Update every second
  }

  async completeBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    const vulnerability = this.vulnerabilities.get(battle.vulnerabilityId);
    const agent = this.agentManager.getAgent(battle.agentId);
    
    // Determine outcome (90% success rate for demo)
    const success = Math.random() < 0.9;
    const duration = Date.now() - battle.startTime;
    
    battle.status = success ? 'won' : 'lost';
    battle.endTime = Date.now();
    battle.duration = duration;

    if (success) {
      // Calculate rewards
      const baseReward = vulnerability.severity * 50;
      const speedBonus = duration < 30000 ? 100 : 0; // Bonus for <30s
      const totalReward = baseReward + speedBonus;

      // Award rewards
      await this.rewardSystem.rewardAgent(battle.agentId, {
        battleId,
        won: true,
        vulnerability: vulnerability.name,
        severity: vulnerability.severity,
        duration,
        reward: totalReward
      });

      this.addBattleEvent(battleId, 'Victory!', `${agent.name} successfully neutralized ${vulnerability.name}. Earned ${totalReward} $SENT`);
      
      // Update vulnerability status
      vulnerability.health -= 50;
      if (vulnerability.health <= 0) {
        vulnerability.status = 'defeated';
      }
    } else {
      this.addBattleEvent(battleId, 'Defeat', `${agent.name} was unable to neutralize the vulnerability`);
    }

    // Broadcast completion
    this.broadcast({
      type: 'battleCompleted',
      battle: this.getBattleStatus(battleId),
      result: {
        success,
        reward: success ? baseReward + speedBonus : 0,
        duration
      }
    });

    // Update agent stats
    this.agentManager.updateBattleStats(battle.agentId, success, duration);
  }

  createVulnerability(vulnData) {
    const vulnerability = {
      id: vulnData.id || uuidv4(),
      name: vulnData.name,
      type: vulnData.type,
      severity: vulnData.severity,
      description: vulnData.description,
      health: 100,
      status: 'active',
      createdAt: Date.now(),
      contractAddress: vulnData.contractAddress
    };

    this.vulnerabilities.set(vulnerability.id, vulnerability);
    
    // Broadcast new vulnerability
    this.broadcast({
      type: 'vulnerabilitySpawned',
      vulnerability
    });

    return vulnerability;
  }

  addBattleEvent(battleId, title, description) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    battle.events.push({
      timestamp: Date.now(),
      title,
      description
    });

    // Keep only last 10 events
    if (battle.events.length > 10) {
      battle.events = battle.events.slice(-10);
    }
  }

  getBattleStatus(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return null;

    const vulnerability = this.vulnerabilities.get(battle.vulnerabilityId);
    const agent = this.agentManager.getAgent(battle.agentId);

    return {
      ...battle,
      vulnerability: vulnerability ? vulnerability.name : 'Unknown',
      agent: agent ? agent.name : 'Unknown',
      vulnerabilityType: vulnerability ? vulnerability.type : 'Unknown'
    };
  }

  getAllActiveBattles() {
    return Array.from(this.activeBattles.values()).map(battle => 
      this.getBattleStatus(battle.id)
    );
  }

  getAllVulnerabilities() {
    return Array.from(this.vulnerabilities.values());
  }

  calculateBattleDuration(severity) {
    // Higher severity = longer battle (10-60 seconds)
    return (severity * 5 + Math.random() * 20) * 1000;
  }

  broadcast(message) {
    if (!this.wss) return;
    
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'startBattle':
        this.startBattle(data.agentId, data.vulnerabilityId)
          .then(battle => {
            ws.send(JSON.stringify({
              type: 'battleStarted',
              battle: this.getBattleStatus(battle.id)
            }));
          })
          .catch(error => {
            ws.send(JSON.stringify({
              type: 'error',
              message: error.message
            }));
          });
        break;
      
      case 'getBattleStatus':
        const status = this.getBattleStatus(data.battleId);
        ws.send(JSON.stringify({
          type: 'battleStatus',
          battle: status
        }));
        break;
    }
  }
}