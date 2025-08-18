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
        events: battle.events.slice(-3)
      });

      // Battle completion
      if (battle.progress >= 100) {
        clearInterval(battleInterval);
        await this.completeBattle(battleId);
      }
    }, 1000);
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
      const speedBonus = duration < 30000 ? 100 : 0;
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
      
      vulnerability.health -= 50;
      if (vulnerability.health <= 0) {
        vulnerability.status = 'defeated';
      }
    } else {
      this.addBattleEvent(battleId, 'Defeat', `${agent.name} was unable to neutralize the vulnerability`);
    }

    this.broadcast({
      type: 'battleCompleted',
      battle: this.getBattleStatus(battleId),
      result: {
        success,
        reward: success ? baseReward + speedBonus : 0,
        duration
      }
    });

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
