import { Server as SocketIO } from "socket.io";

interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  requirement: string;
}

class RewardSystem {
  private agentManager: any;
  private io: SocketIO;
  private achievements: Achievement[] = [
    { id: "first-fix", name: "First Fix", description: "Fix your first vulnerability", badge: "🥇", requirement: "1 fix" },
    { id: "speed-demon", name: "Speed Demon", description: "Fix a vulnerability in under 5 seconds", badge: "⚡", requirement: "Fast fix" },
    { id: "critical-hunter", name: "Critical Hunter", description: "Fix 10 critical vulnerabilities", badge: "🔴", requirement: "10 critical fixes" },
    { id: "veteran", name: "Veteran", description: "Reach level 10", badge: "🎖️", requirement: "Level 10" }
  ];
  private agentAchievements: Record<string, string[]> = {};
  private agentStats: Record<string, { criticals: number; fixes: number; fastFixes: number; firstFix: boolean }> = {};

  constructor(agentManager: any, io: SocketIO) {
    this.agentManager = agentManager;
    this.io = io;
    
    // Initialize stats for existing agents
    this.agentManager.list().forEach((agent: any) => {
      this.agentStats[agent.id] = { criticals: 0, fixes: 0, fastFixes: 0, firstFix: false };
      this.agentAchievements[agent.id] = [];
    });
  }

  recordReward(agentId: string, amount: number, _txHash: string): void {
    const agent = this.agentManager.getAgent(agentId);
    if (!agent) return;

    if (!this.agentStats[agentId]) {
      this.agentStats[agentId] = { criticals: 0, fixes: 0, fastFixes: 0, firstFix: false };
    }
    
    const currentStats = this.agentStats[agentId]!;

    // Update stats
    currentStats.fixes += 1;
    if (!currentStats.firstFix) {
      currentStats.firstFix = true;
      this.unlock(agentId, "first-fix");
    }

    // Check for speed demon achievement
    if (amount > 50) { // High reward indicates fast fix
      currentStats.fastFixes += 1;
      if (currentStats.fastFixes >= 5) {
        this.unlock(agentId, "speed-demon");
      }
    }

    // Check for critical hunter achievement
    if (amount > 75) { // High reward indicates critical vulnerability
      currentStats.criticals += 1;
      if (currentStats.criticals >= 10) {
        this.unlock(agentId, "critical-hunter");
      }
    }

    // Check for veteran achievement
    if (agent.level >= 10) {
      this.unlock(agentId, "veteran");
    }

    // Emit leaderboard update
    this.io.emit("leaderboard:update", this.agentManager.getLeaderboard());
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.find(a => a.id === id);
  }

  unlock(agentId: string, achievementId: string): void {
    if (!this.agentAchievements[agentId]) {
      this.agentAchievements[agentId] = [];
    }

    if (!this.agentAchievements[agentId].includes(achievementId)) {
      this.agentAchievements[agentId].push(achievementId);
      
      const achievement = this.getAchievement(achievementId);
      if (achievement) {
        this.io.emit("achievement:unlock", { agentId, achievement: achievement.name, badge: achievementId });
      }
    }
  }

  getAgentAchievements(agentId: string): Achievement[] {
    return (this.agentAchievements[agentId] || []).map(id => this.getAchievement(id)).filter(Boolean) as Achievement[];
  }

  getAgentStats(agentId: string): any {
    return this.agentStats[agentId] || { criticals: 0, fixes: 0, fastFixes: 0, firstFix: false };
  }
}

export default RewardSystem;
