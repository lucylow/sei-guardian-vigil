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