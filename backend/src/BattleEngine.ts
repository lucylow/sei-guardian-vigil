export default class BattleEngine {
  constructor(agentManager, io) {
    this.agentManager = agentManager;
    this.io = io;
    this.battles = [];
    this.vulnerabilities = [
      { id: "v1", name: "Reentrancy", difficulty: 8 },
      { id: "v2", name: "Integer Overflow", difficulty: 6 },
      { id: "v3", name: "Access Control", difficulty: 5 },
      { id: "v4", name: "Oracle Manipulation", difficulty: 9 },
      { id: "v5", name: "Front-Running", difficulty: 7 }
    ];
  }
  createBattle(agentId, vulnType, severity) {
    const id = `battle-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const vulnerability = this.vulnerabilities.find(v => v.id === vulnType) || this.vulnerabilities[0];
    const battle = {
      id,
      agentId,
      vulnType: vulnerability.id,
      vulnName: vulnerability.name,
      severity,
      status: "started",
      progress: 0,
      steps: ["Analyzing", "Exploiting", "Patching", "Verifying"],
      startTime: Date.now(),
      difficulty: vulnerability.difficulty * severity
    };
    this.battles.push(battle);
    this.progressBattle(id);
    return battle;
  }
  progressBattle(battleId) {
    const battle = this.battles.find(b => b.id === battleId);
    if (!battle) return;
    if (battle.progress < battle.steps.length) {
      const agent = this.agentManager.getAgent(battle.agentId);
      const speed = Math.max(1, Math.floor(agent.level / battle.difficulty * 1000));
      battle.progress++;
      battle.currentStep = battle.steps[battle.progress - 1];
      this.io.emit("battle:update", battle);
      setTimeout(() => this.progressBattle(battleId), speed);
    } else {
      battle.status = "completed";
      battle.endTime = Date.now();
      battle.duration = battle.endTime - battle.startTime;
      const rewardMultiplier = Math.max(0.5, 10 - (battle.duration / 1000));
      const xp = Math.floor(battle.difficulty * 5 * rewardMultiplier);
      const sent = Math.floor(battle.difficulty * 2 * rewardMultiplier);
      const leveledUp = this.agentManager.addExperience(battle.agentId, xp, sent);
      this.io.emit("battle:complete", { ...battle, xp, sent });
      if (leveledUp) {
        this.io.emit("agent:levelup", {
          agentId: battle.agentId,
          level: this.agentManager.getAgent(battle.agentId).level
        });
      }
      setTimeout(() => {
        this.battles = this.battles.filter(b => b.id !== battleId);
      }, 10000);
    }
  }
  handleAction({ battleId, agentId, action }) {
    const battle = this.battles.find(b => b.id === battleId);
    if (!battle || battle.agentId !== agentId) return;
    switch(action) {
      case "boost":
        if (battle.progress < battle.steps.length) {
          battle.progress++;
          this.io.emit("battle:update", battle);
        }
        break;
      case "fix":
        clearTimeout(battle.timeout);
        this.progressBattle(battleId);
        break;
      default:
        break;
    }
  }
}
