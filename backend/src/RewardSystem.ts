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
