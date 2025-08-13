
import { useState, useEffect } from 'react';
import { 
  mockVulnerabilities, 
  mockAgents, 
  mockThreats, 
  mockContracts, 
  mockNetworkMetrics,
  MockVulnerability,
  MockAgent,
  MockThreat,
  MockContract
} from '@/lib/mockData';

export interface Contract {
  address: string;
  name: string;
  status: 'critical' | 'warning' | 'safe';
  lastScan: string;
  vulnerabilities: number;
  tvl: string;
  gasOptimized: boolean;
  type: string;
  transactionCount: number;
}

export interface Vulnerability {
  type: string;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  fullMark: number;
  description?: string;
  contractAddress?: string;
}

export interface NetworkStats {
  blockTime: number;
  tps: number;
  validators: number;
  utilization: number;
  totalContracts: number;
  vulnerabilitiesFound: number;
  systemUptime: number;
}

export interface Alert {
  id: number;
  contract: string;
  type: string;
  status: 'unresolved' | 'monitoring' | 'resolved';
  timestamp: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

export const useSeiData = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({} as NetworkStats);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [agents, setAgents] = useState<MockAgent[]>([]);
  const [threats, setThreats] = useState<MockThreat[]>([]);

  useEffect(() => {
    // Load realistic mock data
    const mappedContracts: Contract[] = mockContracts.slice(0, 10).map((contract, index) => {
      const vulnCount = Math.floor(Math.random() * 5);
      const status: 'critical' | 'warning' | 'safe' = vulnCount > 2 ? 'critical' : vulnCount > 0 ? 'warning' : 'safe';
      
      return {
        address: contract.address.slice(0, 8) + '...' + contract.address.slice(-4),
        name: contract.name,
        status,
        lastScan: `${Math.floor(Math.random() * 60) + 1} min ago`,
        vulnerabilities: vulnCount,
        tvl: `$${(contract.tvl / 1000000).toFixed(1)}M`,
        gasOptimized: contract.gasOptimized,
        type: contract.type,
        transactionCount: contract.transactionCount
      };
    });

    // Group vulnerabilities by type
    const vulnGroups = mockVulnerabilities.reduce((acc, vuln) => {
      const type = vuln.type.charAt(0).toUpperCase() + vuln.type.slice(1).replace('_', ' ');
      if (!acc[type]) {
        acc[type] = { type, count: 0, severity: vuln.severity, fullMark: 20, vulnerabilities: [] };
      }
      acc[type].count++;
      acc[type].vulnerabilities.push(vuln);
      return acc;
    }, {} as Record<string, any>);

    const mappedVulnerabilities: Vulnerability[] = Object.values(vulnGroups).slice(0, 6);

    setContracts(mappedContracts);
    setVulnerabilities(mappedVulnerabilities);
    setAgents(mockAgents);
    setThreats(mockThreats);

    setNetworkStats({
      blockTime: mockNetworkMetrics.avgBlockTime * 1000,
      tps: mockNetworkMetrics.networkTps,
      validators: Math.floor(Math.random() * 50) + 100,
      utilization: Math.floor(Math.random() * 30) + 60,
      totalContracts: mockNetworkMetrics.totalContracts,
      vulnerabilitiesFound: mockNetworkMetrics.vulnerabilitiesFound,
      systemUptime: mockNetworkMetrics.systemUptime,
    });

    // Generate alerts from recent threats and vulnerabilities
    const threatAlerts = mockThreats.slice(0, 3).map((threat, index) => ({
      id: index + 1,
      contract: mockContracts[Math.floor(Math.random() * mockContracts.length)].name,
      type: threat.title,
      status: 'unresolved' as const,
      timestamp: `${Math.floor(Math.random() * 120) + 1} min ago`,
      severity: threat.severity
    }));

    const vulnAlerts = mockVulnerabilities.slice(0, 2).map((vuln, index) => ({
      id: index + 4,
      contract: mappedContracts[Math.floor(Math.random() * mappedContracts.length)].name,
      type: vuln.type.charAt(0).toUpperCase() + vuln.type.slice(1).replace('_', ' '),
      status: Math.random() > 0.5 ? 'monitoring' as const : 'unresolved' as const,
      timestamp: `${Math.floor(Math.random() * 180) + 1} min ago`,
      severity: vuln.severity
    }));

    setAlerts([...threatAlerts, ...vulnAlerts]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        blockTime: prev.blockTime + (Math.random() - 0.5) * 50,
        tps: Math.max(1000, prev.tps + (Math.random() - 0.5) * 500),
        utilization: Math.max(30, Math.min(95, prev.utilization + (Math.random() - 0.5) * 10)),
      }));

      // Update agent activities
      setAgents(prev => prev.map(agent => ({
        ...agent,
        cpuUsage: Math.max(5, Math.min(95, agent.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(10, Math.min(90, agent.memoryUsage + (Math.random() - 0.5) * 8)),
        lastActivity: Math.random() > 0.8 ? new Date() : agent.lastActivity,
        currentTask: Math.random() > 0.7 ? `Task-${Math.floor(Math.random() * 1000)}` : agent.currentTask,
      })));

      // Randomly add new alerts
      if (Math.random() > 0.9) {
        const newAlert = {
          id: Date.now(),
          contract: mappedContracts[Math.floor(Math.random() * mappedContracts.length)].name,
          type: ['Suspicious Activity', 'New Vulnerability', 'Network Anomaly'][Math.floor(Math.random() * 3)],
          status: 'unresolved' as const,
          timestamp: 'Just now',
          severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return { contracts, vulnerabilities, networkStats, alerts, agents, threats };
};
