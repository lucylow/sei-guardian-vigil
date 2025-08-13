import { addDays, subDays, subHours, subMinutes } from 'date-fns';

// Types for mock data
export interface MockVulnerability {
  id: string;
  type: 'reentrancy' | 'overflow' | 'frontrunning' | 'oracle_manipulation' | 'access_control' | 'logic_error';
  severity: 'critical' | 'high' | 'medium' | 'low';
  contractAddress: string;
  functionName: string;
  lineNumber: number;
  description: string;
  cveId?: string;
  discoveredAt: Date;
  status: 'active' | 'mitigated' | 'false_positive';
  exploitProbability: number;
  impactScore: number;
}

export interface MockAgent {
  id: string;
  name: string;
  type: 'orchestrator' | 'analyzer' | 'scanner' | 'monitor' | 'crawler' | 'rag' | 'chatbot' | 'guardrail';
  status: 'active' | 'idle' | 'error' | 'maintenance';
  cpuUsage: number;
  memoryUsage: number;
  tasksCompleted: number;
  uptime: number;
  currentTask?: string;
  lastActivity: Date;
  location: string;
}

export interface MockThreat {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  publishedAt: Date;
  affectedNetworks: string[];
  iocs: string[];
}

export interface MockContract {
  address: string;
  name: string;
  type: 'defi' | 'nft' | 'dao' | 'bridge' | 'lending' | 'dex';
  tvl: number;
  riskScore: number;
  lastAuditDate: Date;
  deployedAt: Date;
  transactionCount: number;
  gasOptimized: boolean;
}

// Mock data generators
export class MockDataGenerator {
  private static contractAddresses = [
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
    '0x28c6c06298d514Db089934071355E5743bf21d60',
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    '0xA0b86a33E6441d87C7834c20001C48FFdE12db1b',
    '0x4f96fe3b7a6cf9725f59d353f723c1bDb64ca6aa',
    '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'
  ];

  private static contractNames = [
    'SeiSwap Protocol',
    'SeiLend Vault',
    'SeiNFT Marketplace',
    'SeiDAO Governance',
    'SeiOracle Bridge',
    'SeiStake Pool',
    'SeiFarms Liquidity',
    'SeiDerivatives Exchange'
  ];

  private static functionNames = [
    'transfer', 'withdraw', 'deposit', 'stake', 'unstake', 'claim',
    'swap', 'mint', 'burn', 'approve', 'borrow', 'repay'
  ];

  private static vulnerabilityDescriptions = {
    reentrancy: [
      'External call vulnerability in withdrawal function allows recursive calls',
      'State changes after external call enable reentrancy attacks',
      'Missing reentrancy guard in critical transfer function'
    ],
    overflow: [
      'Integer overflow in calculation could drain contract funds',
      'Unchecked arithmetic operations may cause unexpected behavior',
      'SafeMath not implemented for critical calculations'
    ],
    frontrunning: [
      'Transaction ordering dependency enables MEV exploitation',
      'Price oracle manipulation through transaction reordering',
      'Commit-reveal scheme missing for sensitive operations'
    ],
    oracle_manipulation: [
      'Single oracle dependency creates manipulation risk',
      'Price feed not validated against circuit breaker limits',
      'Oracle data staleness not properly checked'
    ],
    access_control: [
      'Admin privileges not properly restricted',
      'Role-based access control implementation flawed',
      'Missing ownership verification in critical functions'
    ],
    logic_error: [
      'Incorrect condition in validation logic',
      'Edge case not handled in calculation function',
      'State machine logic allows invalid transitions'
    ]
  };

  static generateVulnerabilities(count: number = 20): MockVulnerability[] {
    const vulnerabilities: MockVulnerability[] = [];
    const types: MockVulnerability['type'][] = [
      'reentrancy', 'overflow', 'frontrunning', 'oracle_manipulation', 'access_control', 'logic_error'
    ];
    const severities: MockVulnerability['severity'][] = ['critical', 'high', 'medium', 'low'];
    const statuses: MockVulnerability['status'][] = ['active', 'mitigated', 'false_positive'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      vulnerabilities.push({
        id: `vuln-${i + 1}`,
        type,
        severity,
        contractAddress: this.contractAddresses[Math.floor(Math.random() * this.contractAddresses.length)],
        functionName: this.functionNames[Math.floor(Math.random() * this.functionNames.length)],
        lineNumber: Math.floor(Math.random() * 500) + 1,
        description: this.vulnerabilityDescriptions[type][
          Math.floor(Math.random() * this.vulnerabilityDescriptions[type].length)
        ],
        cveId: Math.random() > 0.7 ? `CVE-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` : undefined,
        discoveredAt: subHours(new Date(), Math.floor(Math.random() * 168)), // Last week
        status,
        exploitProbability: Math.floor(Math.random() * 100),
        impactScore: Math.floor(Math.random() * 10) + 1
      });
    }

    return vulnerabilities.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  static generateAgents(): MockAgent[] {
    const agents: MockAgent[] = [
      {
        id: 'agent-orchestrator',
        name: 'Master Orchestrator',
        type: 'orchestrator',
        status: Math.random() > 0.8 ? 'error' : 'active',
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        memoryUsage: Math.floor(Math.random() * 30) + 40,
        tasksCompleted: Math.floor(Math.random() * 500) + 1000,
        uptime: Math.floor(Math.random() * 720) + 720, // 1-30 days
        currentTask: Math.random() > 0.3 ? `Task-${Math.floor(Math.random() * 1000)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 60)),
        location: 'us-east-1'
      },
      {
        id: 'agent-analyzer-1',
        name: 'Static Analyzer Alpha',
        type: 'analyzer',
        status: Math.random() > 0.9 ? 'maintenance' : 'active',
        cpuUsage: Math.floor(Math.random() * 80) + 10,
        memoryUsage: Math.floor(Math.random() * 50) + 30,
        tasksCompleted: Math.floor(Math.random() * 300) + 800,
        uptime: Math.floor(Math.random() * 600) + 600,
        currentTask: Math.random() > 0.4 ? `Analysis-${Math.floor(Math.random() * 500)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 30)),
        location: 'us-west-2'
      },
      {
        id: 'agent-scanner-beta',
        name: 'Vulnerability Scanner Beta',
        type: 'scanner',
        status: 'active',
        cpuUsage: Math.floor(Math.random() * 60) + 30,
        memoryUsage: Math.floor(Math.random() * 40) + 35,
        tasksCompleted: Math.floor(Math.random() * 400) + 600,
        uptime: Math.floor(Math.random() * 800) + 400,
        currentTask: Math.random() > 0.5 ? `Scan-${Math.floor(Math.random() * 200)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 15)),
        location: 'eu-west-1'
      },
      {
        id: 'agent-monitor-gamma',
        name: 'Network Monitor Gamma',
        type: 'monitor',
        status: 'active',
        cpuUsage: Math.floor(Math.random() * 30) + 15,
        memoryUsage: Math.floor(Math.random() * 25) + 20,
        tasksCompleted: Math.floor(Math.random() * 200) + 1200,
        uptime: Math.floor(Math.random() * 1000) + 500,
        currentTask: Math.random() > 0.2 ? `Monitor-${Math.floor(Math.random() * 100)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 5)),
        location: 'ap-southeast-1'
      },
      {
        id: 'agent-crawler-delta',
        name: 'Threat Crawler Delta',
        type: 'crawler',
        status: Math.random() > 0.9 ? 'idle' : 'active',
        cpuUsage: Math.floor(Math.random() * 50) + 25,
        memoryUsage: Math.floor(Math.random() * 35) + 30,
        tasksCompleted: Math.floor(Math.random() * 150) + 400,
        uptime: Math.floor(Math.random() * 600) + 300,
        currentTask: Math.random() > 0.6 ? `Crawl-${Math.floor(Math.random() * 50)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 45)),
        location: 'us-central-1'
      },
      {
        id: 'agent-rag-epsilon',
        name: 'RAG Knowledge Engine',
        type: 'rag',
        status: 'active',
        cpuUsage: Math.floor(Math.random() * 70) + 20,
        memoryUsage: Math.floor(Math.random() * 60) + 40,
        tasksCompleted: Math.floor(Math.random() * 100) + 300,
        uptime: Math.floor(Math.random() * 400) + 200,
        currentTask: Math.random() > 0.4 ? `Query-${Math.floor(Math.random() * 300)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 20)),
        location: 'eu-central-1'
      },
      {
        id: 'agent-chatbot-zeta',
        name: 'Sentinel Assistant',
        type: 'chatbot',
        status: 'active',
        cpuUsage: Math.floor(Math.random() * 40) + 10,
        memoryUsage: Math.floor(Math.random() * 30) + 25,
        tasksCompleted: Math.floor(Math.random() * 80) + 150,
        uptime: Math.floor(Math.random() * 500) + 300,
        currentTask: Math.random() > 0.7 ? `Chat-${Math.floor(Math.random() * 100)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 10)),
        location: 'us-east-2'
      },
      {
        id: 'agent-guardrail-eta',
        name: 'Safety Guardrail System',
        type: 'guardrail',
        status: 'active',
        cpuUsage: Math.floor(Math.random() * 20) + 5,
        memoryUsage: Math.floor(Math.random() * 20) + 15,
        tasksCompleted: Math.floor(Math.random() * 1000) + 2000,
        uptime: Math.floor(Math.random() * 1200) + 800,
        currentTask: Math.random() > 0.8 ? `Guard-${Math.floor(Math.random() * 50)}` : undefined,
        lastActivity: subMinutes(new Date(), Math.floor(Math.random() * 3)),
        location: 'global'
      }
    ];

    return agents;
  }

  static generateThreats(count: number = 15): MockThreat[] {
    const threats: MockThreat[] = [];
    const sources = ['CertiK', 'PeckShield', 'SlowMist', 'Trail of Bits', 'Consensys Diligence', 'OpenZeppelin'];
    const severities: MockThreat['severity'][] = ['critical', 'high', 'medium', 'low'];
    const networks = ['Ethereum', 'Sei', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'];
    
    const threatTitles = [
      'New Reentrancy Exploit Pattern Discovered',
      'MEV Bot Drains DEX Liquidity Pools',
      'Oracle Manipulation Attack on Price Feeds',
      'Flash Loan Attack Vector Identified',
      'Cross-Chain Bridge Vulnerability Exposed',
      'NFT Metadata Manipulation Exploit',
      'DAO Governance Token Attack',
      'Yield Farming Contract Drainage',
      'Staking Reward Calculation Exploit',
      'Multi-Signature Wallet Bypass',
      'Automated Market Maker Arbitrage Exploit',
      'Lending Protocol Interest Rate Manipulation',
      'Decentralized Exchange Sandwich Attack',
      'Smart Contract Upgrade Vulnerability',
      'Token Standard Implementation Flaw'
    ];

    for (let i = 0; i < count; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const title = threatTitles[Math.floor(Math.random() * threatTitles.length)];
      
      threats.push({
        id: `threat-${i + 1}`,
        title,
        description: `Detailed analysis of ${title.toLowerCase()} affecting multiple protocols in the ecosystem.`,
        source: sources[Math.floor(Math.random() * sources.length)],
        severity,
        tags: this.generateTags(title),
        publishedAt: subHours(new Date(), Math.floor(Math.random() * 72)),
        affectedNetworks: networks.slice(0, Math.floor(Math.random() * 3) + 1),
        iocs: this.generateIOCs()
      });
    }

    return threats.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  static generateContracts(count: number = 50): MockContract[] {
    const contracts: MockContract[] = [];
    const types: MockContract['type'][] = ['defi', 'nft', 'dao', 'bridge', 'lending', 'dex'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      
      contracts.push({
        address: this.contractAddresses[i % this.contractAddresses.length] || `0x${Math.random().toString(16).substr(2, 40)}`,
        name: this.contractNames[i % this.contractNames.length] || `Protocol ${i + 1}`,
        type,
        tvl: Math.floor(Math.random() * 50000000) + 100000, // $100K to $50M
        riskScore: Math.floor(Math.random() * 100),
        lastAuditDate: subDays(new Date(), Math.floor(Math.random() * 90)),
        deployedAt: subDays(new Date(), Math.floor(Math.random() * 365) + 30),
        transactionCount: Math.floor(Math.random() * 100000) + 1000,
        gasOptimized: Math.random() > 0.3
      });
    }

    return contracts.sort((a, b) => b.tvl - a.tvl);
  }

  static generateNetworkMetrics() {
    return {
      totalContracts: Math.floor(Math.random() * 1000) + 5000,
      activeAgents: Math.floor(Math.random() * 3) + 7,
      vulnerabilitiesFound: Math.floor(Math.random() * 50) + 200,
      threatsDetected: Math.floor(Math.random() * 20) + 80,
      systemUptime: 99.7 + Math.random() * 0.25,
      networkTps: Math.floor(Math.random() * 5000) + 15000,
      avgBlockTime: 0.4 + Math.random() * 0.2,
      gasPrice: Math.floor(Math.random() * 50) + 20
    };
  }

  private static generateTags(title: string): string[] {
    const allTags = ['defi', 'nft', 'dao', 'bridge', 'exploit', 'vulnerability', 'attack', 'security', 'critical', 'medium', 'low'];
    const titleWords = title.toLowerCase().split(' ');
    const tags = allTags.filter(tag => titleWords.some(word => word.includes(tag) || tag.includes(word)));
    
    // Add some random tags
    while (tags.length < 3) {
      const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    return tags.slice(0, 5);
  }

  private static generateIOCs(): string[] {
    const iocs = [];
    const ipCount = Math.floor(Math.random() * 3) + 1;
    const hashCount = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < ipCount; i++) {
      iocs.push(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    }
    
    for (let i = 0; i < hashCount; i++) {
      iocs.push(`0x${Math.random().toString(16).substr(2, 64)}`);
    }
    
    return iocs;
  }
}

// Export singleton instances
export const mockVulnerabilities = MockDataGenerator.generateVulnerabilities(25);
export const mockAgents = MockDataGenerator.generateAgents();
export const mockThreats = MockDataGenerator.generateThreats(20);
export const mockContracts = MockDataGenerator.generateContracts(30);
export const mockNetworkMetrics = MockDataGenerator.generateNetworkMetrics();