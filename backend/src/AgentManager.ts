export default class AgentManager {
  constructor() {
    this.agents = [
      { id: "1", name: "StaticGuardian", role: "scanner", wallet: "sei1vqtwt8y7dl4y7qyq7e59ecf0w2ud0wj8h0sx7a", experience: 120, accuracy: 0.99, sent: 200, level: 3, metadataURI: "ipfs://QmXyZabc123Agent1", nftTokenId: null },
      { id: "2", name: "DarkWebScout", role: "monitor", wallet: "sei1k9a0q9z5w5j8h0sx7a0w2ud0wj8h0sx7a0w2u", experience: 90, accuracy: 0.96, sent: 120, level: 2, metadataURI: "ipfs://QmXyZabc456Agent2", nftTokenId: null },
      { id: "3", name: "ZeroDayHunter", role: "researcher", wallet: "sei1d0wj8h0sx7a0w2ud0wj8h0sx7a0w2ud0wj8h", experience: 210, accuracy: 0.92, sent: 350, level: 4, metadataURI: "ipfs://QmXyZabc789Agent3", nftTokenId: "12345" },
      { id: "4", name: "ByteShield", role: "defender", wallet: "sei1a0w2ud0wj8h0sx7a0w2ud0wj8h0sx7a0w2u", experience: 75, accuracy: 0.97, sent: 90, level: 2, metadataURI: "ipfs://QmXyZabc012Agent4", nftTokenId: null },
      { id: "5", name: "CryptoVigil", role: "watcher", wallet: "sei1j8h0sx7a0w2ud0wj8h0sx7a0w2ud0wj8h0s", experience: 180, accuracy: 0.94, sent: 280, level: 3, metadataURI: "ipfs://QmXyZabc345Agent5", nftTokenId: "67890" }
    ];
  }
  getAgent(id) { return this.agents.find(a => a.id === id); }
  list() { return this.agents; }
  addExperience(id, xp, sent) {
    const agent = this.getAgent(id);
    if (!agent) return;
    agent.experience += xp;
    agent.sent += sent;
    if (agent.experience > agent.level * 100) {
      agent.level++;
      return true;
    }
    return false;
  }
  getLeaderboard() {
    return [...this.agents]
      .sort((a, b) => b.sent - a.sent || b.experience - a.experience)
      .map(agent => ({
        id: agent.id,
        name: agent.name,
        level: agent.level,
        sent: agent.sent,
        nftTokenId: agent.nftTokenId
      }));
  }
}
