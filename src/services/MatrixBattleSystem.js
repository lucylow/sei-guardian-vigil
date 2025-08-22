// Matrix Battle System for SEI Sentinel Agent Arena
class MatrixBattleSystem {
  constructor() {
    this.activeBattles = new Map();
    this.agents = new Map();
    this.vulnerabilities = new Map();
    this.eventListeners = [];
    this.systemStats = {
      vulnerabilities: 847,
      exploitsBlocked: 156,
      sentDistributed: 45600,
      activeAgents: 4,
      winRate: 94.2
    };
  }

  // Initialize Matrix Battle System
  async initialize() {
    console.log('🕶️ Initializing Matrix Battle System...');
    
    // Load agents from blockchain
    await this.loadAgentsFromSei();
    
    // Start vulnerability monitoring
    this.startVulnerabilityMonitoring();
    
    // Initialize real-time updates
    this.startRealTimeUpdates();
    
    console.log('✅ Matrix Battle System Online');
  }

  // Start a battle between agent and vulnerability
  async startBattle(agentId, vulnerabilityId) {
    const agent = this.agents.get(agentId);
    const vulnerability = this.vulnerabilities.get(vulnerabilityId);
    
    if (!agent || !vulnerability) {
      throw new Error('Invalid agent or vulnerability');
    }

    if (agent.status !== 'active') {
      throw new Error('Agent is not available for battle');
    }

    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const battle = {
      id: battleId,
      agentId,
      vulnerabilityId,
      startTime: Date.now(),
      status: 'active',
      progress: 0,
      phase: 'jacking_in',
      events: [],
      matrixCode: this.generateMatrixCode(),
      title: `${agent.name} vs ${vulnerability.name}`,
      severity: this.getSeverityLevel(vulnerability.severity),
      description: `Digital combat initiated - ${agent.codename} engaging ${vulnerability.type}`
    };

    this.activeBattles.set(battleId, battle);
    
    // Update agent status
    agent.status = 'battling';
    agent.currentBattle = battleId;
    
    // Start battle simulation
    this.simulateBattle(battleId);
    
    // Emit battle started event
    this.emitEvent('battleStarted', { battle, agent, vulnerability });
    
    return battle;
  }

  // Simulate Matrix-style battle
  async simulateBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    const phases = [
      { name: 'jacking_in', duration: 2000, message: 'Jacking into the Matrix...' },
      { name: 'scanning', duration: 3000, message: 'Scanning for vulnerabilities...' },
      { name: 'engaging', duration: 4000, message: 'Engaging hostile code...' },
      { name: 'combat', duration: 5000, message: 'Digital combat in progress...' },
      { name: 'resolving', duration: 2000, message: 'Resolving threat...' }
    ];

    let currentPhaseIndex = 0;
    let totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    let elapsed = 0;

    const battleInterval = setInterval(() => {
      elapsed += 100;
      battle.progress = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Phase transitions
      let phaseElapsed = 0;
      for (let i = 0; i <= currentPhaseIndex; i++) {
        phaseElapsed += phases[i].duration;
      }
      
      if (elapsed >= phaseElapsed && currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        battle.phase = phases[currentPhaseIndex].name;
        
        this.addBattleEvent(battleId, phases[currentPhaseIndex].message);
        this.emitEvent('battleProgress', { battleId, battle });
      }

      // Battle completion
      if (battle.progress >= 100) {
        clearInterval(battleInterval);
        this.completeBattle(battleId);
      }
    }, 100);
  }

  // Complete battle and distribute rewards
  async completeBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    const agent = this.agents.get(battle.agentId);
    const vulnerability = this.vulnerabilities.get(battle.vulnerabilityId);
    
    // Determine outcome (Matrix agents have high success rate)
    const success = Math.random() < 0.92; // 92% success rate
    const duration = Date.now() - battle.startTime;
    
    battle.status = success ? 'victory' : 'defeat';
    battle.endTime = Date.now();
    battle.duration = duration;

    if (success) {
      // Calculate Matrix-style rewards
      const baseReward = vulnerability.reward;
      const speedBonus = duration < 10000 ? Math.floor(baseReward * 0.5) : 0;
      const matrixBonus = Math.floor(baseReward * 0.2); // Matrix event bonus
      const totalReward = baseReward + speedBonus + matrixBonus;

      // Update agent stats
      agent.battlesWon++;
      agent.sentEarned += totalReward;
      agent.experience += vulnerability.severity * 10;
      
      // Level up check
      if (agent.experience >= agent.level * 100) {
        agent.level++;
        this.addBattleEvent(battleId, `${agent.name} leveled up to ${agent.level}!`);
      }

      // Update vulnerability
      vulnerability.health -= 25;
      if (vulnerability.health <= 0) {
        vulnerability.status = 'eliminated';
        this.addBattleEvent(battleId, `${vulnerability.name} has been eliminated from the Matrix!`);
      }

      this.addBattleEvent(battleId, `Victory! Earned ${totalReward} $SENT`);
      
      // Mint reward NFT for special achievements
      if (agent.battlesWon % 10 === 0) {
        await this.mintAchievementNFT(agent.id, 'matrix_warrior');
      }
    } else {
      this.addBattleEvent(battleId, 'The Matrix has you... Try again.');
    }

    // Reset agent status
    agent.status = 'active';
    agent.currentBattle = null;

    // Emit completion event
    this.emitEvent('battleCompleted', { 
      battle, 
      agent, 
      vulnerability, 
      result: { success, reward: success ? totalReward : 0, duration } 
    });

    // Remove from active battles after delay
    setTimeout(() => {
      this.activeBattles.delete(battleId);
    }, 30000);
  }

  // Generate Matrix-style binary code
  generateMatrixCode() {
    const length = 50;
    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.random() > 0.5 ? '1' : '0';
      if (i % 8 === 7) code += ' ';
    }
    return code.trim();
  }

  // Add event to battle log
  addBattleEvent(battleId, message) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) return;

    battle.events.push({
      timestamp: Date.now(),
      message,
      matrixCode: this.generateMatrixCode().substr(0, 20)
    });

    // Keep only last 10 events
    if (battle.events.length > 10) {
      battle.events = battle.events.slice(-10);
    }
  }

  // Get severity level for battle display
  getSeverityLevel(severity) {
    if (severity >= 9) return 'Critical';
    if (severity >= 7) return 'High';
    if (severity >= 5) return 'Medium';
    return 'Low';
  }

  // Emit events to frontend
  emitEvent(eventType, data) {
    this.eventListeners.forEach(listener => {
      if (listener.type === eventType || listener.type === 'all') {
        listener.callback(data);
      }
    });
  }

  // Add event listener
  addEventListener(type, callback) {
    this.eventListeners.push({ type, callback });
  }

  // Remove event listener
  removeEventListener(type, callback) {
    this.eventListeners = this.eventListeners.filter(
      listener => !(listener.type === type && listener.callback === callback)
    );
  }

  // Load agents from Sei blockchain
  async loadAgentsFromSei() {
    console.log('📡 Loading agents from Sei blockchain...');
    
    // Initialize default agents
    const defaultAgents = [
      {
        id: 'neo-guardian',
        name: 'Neo Guardian',
        codename: 'StaticGuardian',
        rarity: 'LEGENDARY',
        level: 42,
        role: 'The One - Security Analyst',
        avatar: '/agents/neo-guardian.png',
        stats: {
          accuracy: 97,
          speed: 85,
          power: 92,
          defense: 88
        },
        abilities: ['Bullet Time Analysis', 'Code Sight', 'System Override'],
        battlesWon: 156,
        sentEarned: 12500,
        status: 'active',
        matrixCode: '01001110 01100101 01101111',
        color: '#00ff41',
        experience: 4200
      },
      {
        id: 'morpheus-scout',
        name: 'Morpheus Scout',
        codename: 'DarkWebScout',
        rarity: 'EPIC',
        level: 38,
        role: 'The Mentor - Threat Intelligence',
        avatar: '/agents/morpheus-scout.png',
        stats: {
          accuracy: 94,
          speed: 92,
          power: 89,
          defense: 85
        },
        abilities: ['Red Pill Vision', 'Deep Web Dive', 'Truth Seeker'],
        battlesWon: 134,
        sentEarned: 9800,
        status: 'battling',
        matrixCode: '01001101 01101111 01110010',
        color: '#ff6b35',
        experience: 3800
      },
      {
        id: 'trinity-patch',
        name: 'Trinity Patch',
        codename: 'PatchMaster',
        rarity: 'EPIC',
        level: 35,
        role: 'The Hacker - Remediation Expert',
        avatar: '/agents/trinity-patch.png',
        stats: {
          accuracy: 96,
          speed: 94,
          power: 87,
          defense: 83
        },
        abilities: ['System Hack', 'Code Injection', 'Digital Resurrection'],
        battlesWon: 98,
        sentEarned: 7500,
        status: 'active',
        matrixCode: '01010100 01110010 01101001',
        color: '#9d4edd',
        experience: 3500
      },
      {
        id: 'agent-compliance',
        name: 'Agent Compliance',
        codename: 'ComplianceGuard',
        rarity: 'RARE',
        level: 29,
        role: 'The Enforcer - Compliance Guard',
        avatar: '/agents/agent-compliance.png',
        stats: {
          accuracy: 91,
          speed: 78,
          power: 85,
          defense: 95
        },
        abilities: ['System Lock', 'Rule Enforcement', 'Order Restoration'],
        battlesWon: 67,
        sentEarned: 4200,
        status: 'resting',
        matrixCode: '01000001 01100111 01100101',
        color: '#06ffa5',
        experience: 2900
      }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
    
    // In real implementation, this would query the Sei network
    // for deployed agent NFTs and their current stats
    
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('✅ Agents loaded from Sei network');
        resolve();
      }, 1000);
    });
  }

  // Start monitoring for new vulnerabilities
  startVulnerabilityMonitoring() {
    console.log('🔍 Starting vulnerability monitoring...');
    
    // Initialize default vulnerabilities
    const defaultVulnerabilities = [
      {
        id: 'agent-smith-virus',
        name: 'Agent Smith Virus',
        type: 'Self-Replicating Exploit',
        severity: 10,
        description: 'Malicious code that duplicates itself across smart contracts',
        health: 100,
        reward: 500,
        status: 'active',
        matrixCode: '01010011 01101101 01101001',
        color: '#ff0000'
      },
      {
        id: 'sentinel-hunter',
        name: 'Sentinel Hunter',
        type: 'Access Control Breach',
        severity: 8,
        description: 'Seeks and destroys security protocols',
        health: 75,
        reward: 300,
        status: 'active',
        matrixCode: '01001000 01110101 01101110',
        color: '#ff4500'
      },
      {
        id: 'oracle-corruption',
        name: 'Oracle Corruption',
        type: 'Data Manipulation',
        severity: 9,
        description: 'Corrupts price feeds and external data sources',
        health: 90,
        reward: 400,
        status: 'active',
        matrixCode: '01001111 01110010 01100001',
        color: '#ffa500'
      }
    ];

    defaultVulnerabilities.forEach(vuln => {
      this.vulnerabilities.set(vuln.id, vuln);
    });
    
    // Simulate real-time vulnerability detection
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        this.spawnNewVulnerability();
      }
    }, 30000); // Check every 30 seconds
  }

  // Spawn new vulnerability
  spawnNewVulnerability() {
    const vulnerabilityTypes = [
      'Reentrancy Virus',
      'Access Control Breach',
      'Integer Overflow Bug',
      'Oracle Manipulation',
      'Flash Loan Attack',
      'Front-Running Bot',
      'MEV Exploit',
      'Smart Contract Worm'
    ];

    const newVuln = {
      id: `vuln_${Date.now()}`,
      name: vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)],
      type: 'Smart Contract Exploit',
      severity: Math.floor(Math.random() * 5) + 6, // 6-10
      health: 100,
      reward: Math.floor(Math.random() * 500) + 100,
      status: 'active',
      spawnTime: Date.now(),
      matrixCode: this.generateMatrixCode(),
      color: '#ff0000'
    };

    this.vulnerabilities.set(newVuln.id, newVuln);
    this.emitEvent('vulnerabilitySpawned', { vulnerability: newVuln });
    
    console.log(`🚨 New vulnerability detected: ${newVuln.name}`);
  }

  // Start real-time updates
  startRealTimeUpdates() {
    setInterval(() => {
      // Update system stats
      const stats = this.getSystemStats();
      this.emitEvent('statsUpdated', { stats });
    }, 5000); // Update every 5 seconds
  }

  // Get current system statistics
  getSystemStats() {
    const totalVulns = this.vulnerabilities.size;
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active').length;
    const totalSentEarned = Array.from(this.agents.values()).reduce((sum, a) => sum + a.sentEarned, 0);
    const totalBattles = Array.from(this.agents.values()).reduce((sum, a) => sum + a.battlesWon, 0);
    const winRate = totalBattles > 0 ? (totalBattles / (totalBattles + 10)) * 100 : 0;

    this.systemStats = {
      vulnerabilities: totalVulns,
      exploitsBlocked: totalBattles,
      sentDistributed: totalSentEarned,
      activeAgents,
      winRate: Math.round(winRate * 10) / 10
    };

    return this.systemStats;
  }

  // Get all agents
  getAgents() {
    return Array.from(this.agents.values());
  }

  // Get all vulnerabilities
  getVulnerabilities() {
    return Array.from(this.vulnerabilities.values());
  }

  // Get active battles
  getActiveBattles() {
    return Array.from(this.activeBattles.values());
  }

  // Get agent by ID
  getAgent(id) {
    return this.agents.get(id);
  }

  // Get vulnerability by ID
  getVulnerability(id) {
    return this.vulnerabilities.get(id);
  }

  // Update agent status
  updateAgentStatus(agentId, status) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      this.emitEvent('agentStatusUpdated', { agentId, status });
    }
  }

  // Mint achievement NFT
  async mintAchievementNFT(agentId, achievementType) {
    console.log(`🏆 Minting achievement NFT: ${achievementType} for agent ${agentId}`);
    
    // In real implementation, this would interact with Sei blockchain
    // to mint an achievement NFT
    
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('✅ Achievement NFT minted successfully');
        this.emitEvent('achievementMinted', { agentId, achievementType });
        resolve();
      }, 2000);
    });
  }

  // Get battle history for an agent
  getAgentBattleHistory(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return [];

    // In real implementation, this would query the blockchain
    // for battle history and achievements
    return [
      {
        id: 'battle_1',
        vulnerability: 'Reentrancy Attack',
        result: 'Victory',
        reward: 500,
        timestamp: Date.now() - 86400000 // 1 day ago
      },
      {
        id: 'battle_2',
        vulnerability: 'Access Control Breach',
        result: 'Victory',
        reward: 300,
        timestamp: Date.now() - 172800000 // 2 days ago
      }
    ];
  }

  // Get leaderboard
  getLeaderboard() {
    const agents = Array.from(this.agents.values());
    return agents
      .sort((a, b) => b.sentEarned - a.sentEarned)
      .slice(0, 10)
      .map((agent, index) => ({
        rank: index + 1,
        agent: agent.name,
        codename: agent.codename,
        sentEarned: agent.sentEarned,
        battlesWon: agent.battlesWon,
        level: agent.level
      }));
  }

  // Cleanup method
  destroy() {
    console.log('🔄 Shutting down Matrix Battle System...');
    // Clear all intervals and event listeners
    this.eventListeners = [];
  }
}

export default MatrixBattleSystem;
