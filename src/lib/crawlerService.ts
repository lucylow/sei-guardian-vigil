// SEI SENTINEL Threat Intelligence Crawler Service
export interface ThreatSource {
  id: string;
  name: string;
  type: 'github' | 'darkweb' | 'forums' | 'news' | 'pastebin';
  url: string;
  enabled: boolean;
  lastCrawled?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
}

export interface ThreatData {
  id: string;
  source: string;
  sourceType: ThreatSource['type'];
  url: string;
  title: string;
  content: string;
  confidence: number;
  riskScore: number;
  entities: {
    contracts: string[];
    exploits: string[];
    versions: string[];
    cves: string[];
  };
  tags: string[];
  timestamp: number;
  status: 'new' | 'analyzed' | 'dismissed' | 'escalated';
}

export interface CrawlResult {
  success: boolean;
  sourceId: string;
  threatsFound: number;
  threats: ThreatData[];
  metadata: {
    crawlTime: number;
    pagesScanned: number;
    falsePositives: number;
  };
  error?: string;
}

export class SeiThreatCrawler {
  private static readonly SEI_KEYWORDS = [
    'Sei exploit', 'Sei vulnerability', 'Sei hack', 'Sei security',
    'Sei patch', 'Sei emergency', 'Sei critical', 'Sei risk', 'Sei audit',
    'sei parallel execution', 'sei reentrancy', 'sei twin-turbo'
  ];

  private static readonly CRAWL_CONFIG = {
    github: { delay: 1200, maxPages: 100 },
    darkweb: { delay: 3000, maxPages: 10 },
    forums: { delay: 800, maxPages: 50 },
    news: { delay: 500, maxPages: 30 },
    pastebin: { delay: 1000, maxPages: 20 }
  };

  static async crawlSource(source: ThreatSource): Promise<CrawlResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🕷️ Starting crawl for ${source.name} (${source.type})`);
      
      // Simulate different crawling strategies based on source type
      let threats: ThreatData[] = [];
      
      switch (source.type) {
        case 'github':
          threats = await this.crawlGitHub(source);
          break;
        case 'darkweb':
          threats = await this.crawlDarkWeb(source);
          break;
        case 'forums':
          threats = await this.crawlForums(source);
          break;
        case 'news':
          threats = await this.crawlNews(source);
          break;
        case 'pastebin':
          threats = await this.crawlPastebin(source);
          break;
        default:
          throw new Error(`Unsupported source type: ${source.type}`);
      }

      const filteredThreats = threats.filter(this.isValidThreat);
      const crawlTime = Date.now() - startTime;

      return {
        success: true,
        sourceId: source.id,
        threatsFound: filteredThreats.length,
        threats: filteredThreats,
        metadata: {
          crawlTime,
          pagesScanned: Math.min(threats.length * 2, this.CRAWL_CONFIG[source.type].maxPages),
          falsePositives: threats.length - filteredThreats.length
        }
      };
    } catch (error) {
      return {
        success: false,
        sourceId: source.id,
        threatsFound: 0,
        threats: [],
        metadata: {
          crawlTime: Date.now() - startTime,
          pagesScanned: 0,
          falsePositives: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static async crawlGitHub(source: ThreatSource): Promise<ThreatData[]> {
    // Simulate GitHub API crawling
    await this.delay(this.CRAWL_CONFIG.github.delay);
    
    const mockThreats: ThreatData[] = [
      {
        id: `github-${Date.now()}-1`,
        source: source.name,
        sourceType: 'github',
        url: 'https://github.com/sei-protocol/security-reports/issues/42',
        title: 'Critical Reentrancy Vulnerability in LendingPool',
        content: 'function withdraw() public { uint amount = balances[msg.sender]; (bool success, ) = msg.sender.call{value: amount}(""); require(success); balances[msg.sender] = 0; }',
        confidence: 0.95,
        riskScore: 9.2,
        entities: {
          contracts: ['sei14ja2a...xqy3'],
          exploits: ['reentrancy'],
          versions: ['v2.1.0'],
          cves: ['CVE-2024-1234']
        },
        tags: ['sei-v2', 'parallel-execution', 'defi'],
        timestamp: Date.now(),
        status: 'new'
      },
      {
        id: `github-${Date.now()}-2`,
        source: source.name,
        sourceType: 'github',
        url: 'https://github.com/vulnerable-contracts/sei-exploits',
        title: 'Sei Parallel Write Conflict Exploit',
        content: 'Exploit targeting Sei\'s optimistic parallel execution...',
        confidence: 0.87,
        riskScore: 8.5,
        entities: {
          contracts: ['sei9k3x...m2n4'],
          exploits: ['parallel_write_conflict'],
          versions: ['v2.0.x'],
          cves: []
        },
        tags: ['sei-v2', 'parallel-execution'],
        timestamp: Date.now() - 300000,
        status: 'new'
      }
    ];

    return mockThreats;
  }

  private static async crawlDarkWeb(source: ThreatSource): Promise<ThreatData[]> {
    // Simulate Tor-based dark web crawling
    await this.delay(this.CRAWL_CONFIG.darkweb.delay);
    
    const mockThreats: ThreatData[] = [
      {
        id: `darkweb-${Date.now()}-1`,
        source: source.name,
        sourceType: 'darkweb',
        url: 'http://exploits4sale.onion/sei-zero-day',
        title: 'Sei Zero-Day Exploit - $500K Bounty',
        content: 'New Sei exploit bypassing Twin-Turbo consensus...',
        confidence: 0.92,
        riskScore: 9.8,
        entities: {
          contracts: [],
          exploits: ['consensus_bypass'],
          versions: ['v2.x'],
          cves: []
        },
        tags: ['zero-day', 'consensus', 'critical'],
        timestamp: Date.now(),
        status: 'new'
      }
    ];

    return mockThreats;
  }

  private static async crawlForums(source: ThreatSource): Promise<ThreatData[]> {
    // Simulate forum crawling (Reddit, Discord, Telegram)
    await this.delay(this.CRAWL_CONFIG.forums.delay);
    
    const mockThreats: ThreatData[] = [
      {
        id: `forum-${Date.now()}-1`,
        source: source.name,
        sourceType: 'forums',
        url: 'https://reddit.com/r/Sei/comments/abc123',
        title: 'Discussion: Potential Sei Gas Optimization Exploit',
        content: 'Has anyone noticed unusual gas patterns in Sei transactions?',
        confidence: 0.65,
        riskScore: 6.2,
        entities: {
          contracts: [],
          exploits: ['gas_manipulation'],
          versions: [],
          cves: []
        },
        tags: ['gas', 'optimization', 'discussion'],
        timestamp: Date.now() - 600000,
        status: 'new'
      }
    ];

    return mockThreats;
  }

  private static async crawlNews(source: ThreatSource): Promise<ThreatData[]> {
    // Simulate news feed crawling
    await this.delay(this.CRAWL_CONFIG.news.delay);
    
    const mockThreats: ThreatData[] = [
      {
        id: `news-${Date.now()}-1`,
        source: source.name,
        sourceType: 'news',
        url: 'https://cryptosecurity.news/sei-vulnerability-disclosure',
        title: 'Sei Network Addresses Critical Security Vulnerability',
        content: 'Sei developers have patched a critical vulnerability...',
        confidence: 0.88,
        riskScore: 7.5,
        entities: {
          contracts: [],
          exploits: ['disclosed_vulnerability'],
          versions: ['v2.1.1'],
          cves: []
        },
        tags: ['official', 'patch', 'disclosure'],
        timestamp: Date.now() - 900000,
        status: 'new'
      }
    ];

    return mockThreats;
  }

  private static async crawlPastebin(source: ThreatSource): Promise<ThreatData[]> {
    // Simulate pastebin crawling for leaked data
    await this.delay(this.CRAWL_CONFIG.pastebin.delay);
    
    return []; // No threats found in this simulation
  }

  private static isValidThreat(threat: ThreatData): boolean {
    // Filter out false positives
    const content = threat.content.toLowerCase();
    
    // Skip test/example content
    if (content.includes('test') || content.includes('example') || content.includes('tutorial')) {
      return false;
    }

    // Require minimum confidence
    if (threat.confidence < 0.6) {
      return false;
    }

    // Validate Sei-specific context
    if (content.includes('v2') && !content.includes('parallel') && !content.includes('twin-turbo')) {
      return false;
    }

    return true;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static extractEntities(content: string): ThreatData['entities'] {
    return {
      contracts: this.extractContracts(content),
      exploits: this.extractExploits(content),
      versions: this.extractVersions(content),
      cves: this.extractCVEs(content)
    };
  }

  private static extractContracts(content: string): string[] {
    const contractRegex = /sei1[a-z0-9]{38,45}/g;
    return content.match(contractRegex) || [];
  }

  private static extractExploits(content: string): string[] {
    const exploitKeywords = ['reentrancy', 'overflow', 'underflow', 'access_control', 'front_running'];
    return exploitKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.replace('_', ' '))
    );
  }

  private static extractVersions(content: string): string[] {
    const versionRegex = /v\d+\.\d+\.\d+/g;
    return content.match(versionRegex) || [];
  }

  private static extractCVEs(content: string): string[] {
    const cveRegex = /CVE-\d{4}-\d{4,7}/g;
    return content.match(cveRegex) || [];
  }

  static calculateRiskScore(threat: ThreatData): number {
    let score = threat.confidence * 10;

    // Boost score based on source type
    const sourceMultipliers = {
      darkweb: 1.5,
      github: 1.2,
      news: 1.1,
      forums: 0.9,
      pastebin: 1.3
    };
    
    score *= sourceMultipliers[threat.sourceType] || 1.0;

    // Boost for contract addresses found
    score += threat.entities.contracts.length * 0.5;

    // Boost for CVEs
    score += threat.entities.cves.length * 1.0;

    return Math.min(score, 10);
  }

  static getDefaultSources(): ThreatSource[] {
    return [
      {
        id: 'github-sei',
        name: 'GitHub Sei Protocol',
        type: 'github',
        url: 'https://api.github.com/search/code',
        enabled: true,
        riskLevel: 'medium',
        keywords: this.SEI_KEYWORDS
      },
      {
        id: 'darkweb-exploits',
        name: 'Dark Web Exploit Markets',
        type: 'darkweb',
        url: 'http://exploits.onion',
        enabled: true,
        riskLevel: 'critical',
        keywords: this.SEI_KEYWORDS
      },
      {
        id: 'reddit-sei',
        name: 'Reddit r/Sei',
        type: 'forums',
        url: 'https://reddit.com/r/Sei',
        enabled: true,
        riskLevel: 'low',
        keywords: this.SEI_KEYWORDS
      },
      {
        id: 'crypto-security-news',
        name: 'Crypto Security News',
        type: 'news',
        url: 'https://cryptosecurity.news/feed',
        enabled: true,
        riskLevel: 'medium',
        keywords: this.SEI_KEYWORDS
      },
      {
        id: 'pastebin-leaks',
        name: 'Pastebin Leak Scanner',
        type: 'pastebin',
        url: 'https://pastebin.com/api',
        enabled: false,
        riskLevel: 'high',
        keywords: this.SEI_KEYWORDS
      }
    ];
  }
}