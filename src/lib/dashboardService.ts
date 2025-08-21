// Dashboard Service - Integrates real data from various services
import { seiMcpService } from './seiMcpService';
import { auditService } from './auditService';
import { SeiThreatCrawler } from './crawlerService';

export interface DashboardMetrics {
  // Network Metrics
  latestBlock: {
    blockNumber: number;
    blockHash: string;
    timestamp: number;
    transactionCount: number;
  } | null;
  
  // System Metrics
  totalContracts: number;
  activeAudits: number;
  threatsBlocked: number;
  systemUptime: number;
  totalValueProtected: number;
  averageResponseTime: number;
  activeAgents: number;
  securityScore: number;
  
  // Security Metrics
  vulnerabilityDetection: number;
  threatResponse: number;
  systemHardening: number;
  monitoringCoverage: number;
  
  // Performance Metrics
  networkTps: number;
  blockTime: number;
  networkUtilization: number;
  validatorCount: number;
  
  // Agent Metrics
  agentStatuses: {
    orchestrator: 'active' | 'idle' | 'busy';
    securityAnalyst: 'active' | 'idle' | 'busy';
    webCrawler: 'active' | 'idle' | 'busy';
    chatbot: 'active' | 'idle' | 'busy';
    monitor: 'active' | 'idle' | 'busy';
    fixGenerator: 'active' | 'idle' | 'busy';
    ragAgent: 'active' | 'idle' | 'busy';
    guardrail: 'active' | 'idle' | 'busy';
  };
  
  // Recent Activity
  recentActivities: Array<{
    id: string;
    type: 'audit' | 'threat' | 'deployment' | 'optimization' | 'scan' | 'patch';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error' | 'info';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    contractAddress?: string;
  }>;
  
  // Alerts
  activeAlerts: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: string;
    status: 'new' | 'investigating' | 'resolved';
    contractAddress?: string;
  }>;
}

export interface RealTimeUpdate {
  type: 'metrics' | 'activity' | 'alert' | 'security';
  data: Partial<DashboardMetrics>;
  timestamp: Date;
}

class DashboardService {
  private static instance: DashboardService;
  private metrics: DashboardMetrics;
  private updateCallbacks: Array<(update: RealTimeUpdate) => void> = [];
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.metrics = this.getDefaultMetrics();
  }

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  private getDefaultMetrics(): DashboardMetrics {
    return {
      latestBlock: null,
      totalContracts: 0,
      activeAudits: 0,
      threatsBlocked: 0,
      systemUptime: 99.9,
      totalValueProtected: 0,
      averageResponseTime: 0.3,
      activeAgents: 0,
      securityScore: 94,
      vulnerabilityDetection: 94,
      threatResponse: 89,
      systemHardening: 96,
      monitoringCoverage: 98,
      networkTps: 0,
      blockTime: 0,
      networkUtilization: 0,
      validatorCount: 0,
      agentStatuses: {
        orchestrator: 'active',
        securityAnalyst: 'active',
        webCrawler: 'active',
        chatbot: 'idle',
        monitor: 'active',
        fixGenerator: 'busy',
        ragAgent: 'active',
        guardrail: 'active',
      },
      recentActivities: [],
      activeAlerts: []
    };
  }

  async initialize(): Promise<void> {
    try {
      // Load initial data
      await this.loadInitialData();
      
      // Start real-time updates
      this.startRealTimeUpdates();
      
      // Set up periodic data refresh
      this.updateInterval = setInterval(() => {
        this.refreshData();
      }, 30000); // Refresh every 30 seconds
      
    } catch (error) {
      console.error('Failed to initialize dashboard service:', error);
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      // Load latest block data
      const blockData = await seiMcpService.getLatestBlock();
      this.metrics.latestBlock = blockData;
      
      // Load audit data
      const auditData = await this.getAuditMetrics();
      this.metrics.activeAudits = auditData.activeAudits;
      
      // Load threat data
      const threatData = await this.getThreatMetrics();
      this.metrics.threatsBlocked = threatData.threatsBlocked;
      this.metrics.activeAlerts = threatData.activeAlerts;
      
      // Generate recent activities
      this.metrics.recentActivities = this.generateRecentActivities();
      
      // Calculate derived metrics
      this.calculateDerivedMetrics();
      
    } catch (error) {
      console.error('Error loading initial dashboard data:', error);
    }
  }

  private async getAuditMetrics(): Promise<{ activeAudits: number }> {
    try {
      // This would integrate with the real audit service
      // For now, return realistic mock data
      return {
        activeAudits: Math.floor(Math.random() * 10) + 5
      };
    } catch (error) {
      console.error('Error getting audit metrics:', error);
      return { activeAudits: 0 };
    }
  }

  private async getThreatMetrics(): Promise<{ 
    threatsBlocked: number; 
    activeAlerts: Array<any> 
  }> {
    try {
      // This would integrate with the real threat intelligence service
      // For now, return realistic mock data
      const threatsBlocked = Math.floor(Math.random() * 50) + 100;
      
      const activeAlerts = [
        {
          id: '1',
          type: 'Suspicious Transaction',
          severity: 'medium' as const,
          description: 'Large value transfer detected',
          timestamp: '2 min ago',
          status: 'investigating' as const
        },
        {
          id: '2',
          type: 'Contract Anomaly',
          severity: 'high' as const,
          description: 'Unusual gas consumption pattern',
          timestamp: '15 min ago',
          status: 'new' as const
        }
      ];
      
      return { threatsBlocked, activeAlerts };
    } catch (error) {
      console.error('Error getting threat metrics:', error);
      return { threatsBlocked: 0, activeAlerts: [] };
    }
  }

  private generateRecentActivities(): Array<any> {
    const activities = [
      {
        id: '1',
        type: 'audit' as const,
        title: 'New Contract Audit Started',
        description: 'Auditing SeiStake Pool contract',
        timestamp: '2 min ago',
        status: 'info' as const
      },
      {
        id: '2',
        type: 'threat' as const,
        title: 'Threat Detected & Blocked',
        description: 'Suspicious activity detected and neutralized',
        timestamp: '5 min ago',
        status: 'success' as const,
        severity: 'medium' as const
      },
      {
        id: '3',
        type: 'deployment' as const,
        title: 'Contract Deployed Successfully',
        description: 'New smart contract deployed to Sei Network',
        timestamp: '15 min ago',
        status: 'success' as const
      },
      {
        id: '4',
        type: 'optimization' as const,
        title: 'Gas Optimization Complete',
        description: 'Contract optimized, 25% gas savings achieved',
        timestamp: '1 hour ago',
        status: 'success' as const
      }
    ];
    
    return activities;
  }

  private calculateDerivedMetrics(): void {
    // Calculate security score based on various factors
    const baseScore = 100;
    const vulnPenalty = this.metrics.activeAlerts.length * 2;
    const responseBonus = this.metrics.threatResponse > 90 ? 5 : 0;
    
    this.metrics.securityScore = Math.max(80, Math.min(100, baseScore - vulnPenalty + responseBonus));
    
    // Calculate active agents
    this.metrics.activeAgents = Object.values(this.metrics.agentStatuses)
      .filter(status => status === 'active').length;
  }

  private startRealTimeUpdates(): void {
    // Simulate real-time updates
    setInterval(() => {
      this.updateMetrics();
    }, 10000); // Update every 10 seconds
  }

  private updateMetrics(): void {
    // Simulate real-time metric changes
    this.metrics.systemUptime += (Math.random() - 0.5) * 0.1;
    this.metrics.securityScore = Math.max(80, Math.min(100, 
      this.metrics.securityScore + (Math.random() - 0.5) * 2));
    
    // Update agent statuses randomly
    Object.keys(this.metrics.agentStatuses).forEach(key => {
      if (Math.random() > 0.95) {
        const statuses: Array<'active' | 'idle' | 'busy'> = ['active', 'idle', 'busy'];
        (this.metrics.agentStatuses as any)[key] = statuses[Math.floor(Math.random() * statuses.length)];
      }
    });
    
    // Notify subscribers
    this.notifyUpdate({
      type: 'metrics',
      data: this.metrics,
      timestamp: new Date()
    });
  }

  private async refreshData(): Promise<void> {
    try {
      // Refresh blockchain data
      const blockData = await seiMcpService.getLatestBlock();
      if (blockData) {
        this.metrics.latestBlock = blockData;
      }
      
      // Refresh other metrics
      await this.loadInitialData();
      
      // Notify subscribers
      this.notifyUpdate({
        type: 'metrics',
        data: this.metrics,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }

  // Public methods
  getMetrics(): DashboardMetrics {
    return { ...this.metrics };
  }

  subscribeToUpdates(callback: (update: RealTimeUpdate) => void): () => void {
    this.updateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  private notifyUpdate(update: RealTimeUpdate): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in dashboard update callback:', error);
      }
    });
  }

  async addActivity(activity: Omit<any, 'id' | 'timestamp'>): Promise<void> {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    this.metrics.recentActivities.unshift(newActivity);
    
    // Keep only last 10 activities
    if (this.metrics.recentActivities.length > 10) {
      this.metrics.recentActivities = this.metrics.recentActivities.slice(0, 10);
    }
    
    this.notifyUpdate({
      type: 'activity',
      data: { recentActivities: this.metrics.recentActivities },
      timestamp: new Date()
    });
  }

  async addAlert(alert: Omit<any, 'id' | 'timestamp'>): Promise<void> {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    this.metrics.activeAlerts.unshift(newAlert);
    
    // Keep only last 20 alerts
    if (this.metrics.activeAlerts.length > 20) {
      this.metrics.activeAlerts = this.metrics.activeAlerts.slice(0, 20);
    }
    
    this.notifyUpdate({
      type: 'alert',
      data: { activeAlerts: this.metrics.activeAlerts },
      timestamp: new Date()
    });
  }

  async updateSecurityMetrics(metrics: Partial<DashboardMetrics>): Promise<void> {
    Object.assign(this.metrics, metrics);
    
    this.notifyUpdate({
      type: 'security',
      data: metrics,
      timestamp: new Date()
    });
  }

  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.updateCallbacks = [];
  }
}

export const dashboardService = DashboardService.getInstance();
