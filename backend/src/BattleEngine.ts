import { Server as SocketIO } from "socket.io";

interface Battle {
  id: string;
  agentId: string;
  vulnType: string;
  severity: string;
  status: string;
  createdAt: number;
}

interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: string;
  reward: number;
}

class BattleEngine {
  private agentManager: any;
  private io: SocketIO;
  private battles: Battle[] = [];
  private vulnerabilities: Vulnerability[] = [
    { id: "reentrancy", name: "Reentrancy Attack", description: "Contract can be called multiple times", severity: "Critical", reward: 100 },
    { id: "overflow", name: "Integer Overflow", description: "Numeric overflow vulnerability", severity: "High", reward: 75 },
    { id: "access-control", name: "Access Control", description: "Unauthorized access to functions", severity: "Medium", reward: 50 }
  ];

  constructor(agentManager: any, io: SocketIO) {
    this.agentManager = agentManager;
    this.io = io;
  }

  createBattle(agentId: string, vulnType: string, severity: string): Battle {
    const vulnerability = this.vulnerabilities.find(v => v.id === vulnType) || this.vulnerabilities[0];
    
    if (!vulnerability) {
      throw new Error(`Vulnerability type ${vulnType} not found`);
    }
    
    const battle: Battle = {
      id: `battle-${Date.now()}`,
      agentId,
      vulnType: vulnerability.id,
      severity,
      status: "active",
      createdAt: Date.now()
    };

    this.battles.push(battle);
    this.io.emit("battle:created", battle);
    
    return battle;
  }

  progressBattle(battleId: string): void {
    const battle = this.battles.find(b => b.id === battleId);
    if (!battle) return;

    const agent = this.agentManager.getAgent(battle.agentId);
    if (!agent) return;

    // Simulate battle progress
    battle.status = "in-progress";
    this.io.emit("battle:update", battle);

    // Simulate battle completion after some time
    setTimeout(() => {
      const xp = Math.floor(Math.random() * 50) + 25;
      const sent = Math.floor(Math.random() * 20) + 10;
      
      const leveledUp = this.agentManager.addExperience(battle.agentId, xp, sent);
      
      this.io.emit("battle:complete", { ...battle, xp, sent });
      
      if (leveledUp) {
        this.io.emit("agent:levelup", {
          agentId: battle.agentId,
          level: this.agentManager.getAgent(battle.agentId).level
        });
      }

      // Remove completed battle
      this.battles = this.battles.filter(b => b.id !== battleId);
    }, 5000);
  }

  handleAction({ battleId, agentId, action }: { battleId: string; agentId: string; action: string }): void {
    const battle = this.battles.find(b => b.id === battleId);
    if (!battle) return;

    // Handle different actions
    switch (action) {
      case "attack":
        battle.status = "attacking";
        this.io.emit("battle:update", battle);
        break;
      case "defend":
        battle.status = "defending";
        this.io.emit("battle:update", battle);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }
}

export default BattleEngine;
