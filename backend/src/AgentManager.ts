// import { AgentRecord } from "./agentDataModels"; // Not used in this file

interface Agent {
  id: string;
  name: string;
  level: number;
  experience: number;
  sent: number;
}

class AgentManager {
  private agents: Agent[] = [];

  constructor() {
    // Initialize with some default agents
    this.agents = [
      { id: "agent-1", name: "Security Guardian", level: 1, experience: 0, sent: 0 },
      { id: "agent-2", name: "Threat Hunter", level: 1, experience: 0, sent: 0 },
      { id: "agent-3", name: "Vulnerability Scanner", level: 1, experience: 0, sent: 0 }
    ];
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.find(a => a.id === id);
  }

  list(): Agent[] {
    return this.agents;
  }

  addExperience(id: string, xp: number, sent: number): boolean {
    const agent = this.getAgent(id);
    if (!agent) return false;

    agent.experience += xp;
    agent.sent += sent;

    // Level up logic
    if (agent.experience >= agent.level * 100) {
      agent.level += 1;
      agent.experience = 0;
      return true; // Leveled up
    }

    return false;
  }

  getLeaderboard(): Agent[] {
    return [...this.agents]
      .sort((a, b) => b.level - a.level || b.experience - a.experience)
      .slice(0, 10);
  }
}

export default AgentManager;
