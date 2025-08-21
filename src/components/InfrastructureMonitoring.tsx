import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Users, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  Zap,
  BarChart3,
  Settings,
  Vote
} from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'agent' | 'validator' | 'oracle';
  status: 'online' | 'offline' | 'degraded';
  location: string;
  uptime: number;
  performance: number;
  lastSeen: Date;
}

interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endTime: Date;
  proposer: string;
}

interface InfrastructureMetrics {
  totalNodes: number;
  onlineNodes: number;
  totalAgents: number;
  activeAgents: number;
  networkLatency: number;
  throughput: number;
  errorRate: number;
  gasEfficiency: number;
}

export const InfrastructureMonitoring: React.FC = () => {
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [governanceProposals, setGovernanceProposals] = useState<GovernanceProposal[]>([]);
  const [metrics, setMetrics] = useState<InfrastructureMetrics>({
    totalNodes: 0,
    onlineNodes: 0,
    totalAgents: 0,
    activeAgents: 0,
    networkLatency: 0,
    throughput: 0,
    errorRate: 0,
    gasEfficiency: 0
  });
  const [selectedView, setSelectedView] = useState<'overview' | 'nodes' | 'governance' | 'analytics'>('overview');

  // Simulate real-time infrastructure data
  useEffect(() => {
    const mockNodes: NetworkNode[] = [
      {
        id: 'agent-node-001',
        type: 'agent',
        status: 'online',
        location: 'US-East',
        uptime: 99.8,
        performance: 94,
        lastSeen: new Date()
      },
      {
        id: 'agent-node-002',
        type: 'agent',
        status: 'online',
        location: 'EU-West',
        uptime: 99.6,
        performance: 91,
        lastSeen: new Date()
      },
      {
        id: 'validator-node-001',
        type: 'validator',
        status: 'online',
        location: 'Asia-Pacific',
        uptime: 99.9,
        performance: 98,
        lastSeen: new Date()
      },
      {
        id: 'oracle-node-001',
        type: 'oracle',
        status: 'degraded',
        location: 'US-West',
        uptime: 85.2,
        performance: 67,
        lastSeen: new Date(Date.now() - 300000)
      }
    ];

    const mockProposals: GovernanceProposal[] = [
      {
        id: 'prop-001',
        title: 'Add New Security Agent Type',
        description: 'Proposal to whitelist a new AI security agent for reentrancy detection',
        status: 'active',
        votesFor: 1250,
        votesAgainst: 89,
        totalVotes: 1339,
        endTime: new Date(Date.now() + 86400000),
        proposer: '0x1234...5678'
      },
      {
        id: 'prop-002',
        title: 'Update Reward Parameters',
        description: 'Adjust $SENT token distribution for high-performing agents',
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        endTime: new Date(Date.now() + 172800000),
        proposer: '0x8765...4321'
      }
    ];

    setNetworkNodes(mockNodes);
    setGovernanceProposals(mockProposals);

    // Simulate real-time metrics updates
    const updateMetrics = () => {
      setMetrics(prev => ({
        totalNodes: 156,
        onlineNodes: Math.floor(Math.random() * 20) + 140,
        totalAgents: 89,
        activeAgents: Math.floor(Math.random() * 20) + 75,
        networkLatency: Math.random() * 50 + 150,
        throughput: Math.floor(Math.random() * 1000) + 8000,
        errorRate: Math.random() * 2 + 0.5,
        gasEfficiency: Math.random() * 15 + 85
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'degraded': return 'Degraded';
      default: return 'Unknown';
    }
  };

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          🏗️ Infrastructure & Governance
        </h2>
        <p className="text-muted-foreground">
          Decentralized agent network, on-chain governance, and real-time infrastructure monitoring
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'nodes', label: 'Network Nodes', icon: Network },
            { key: 'governance', label: 'Governance', icon: Vote },
            { key: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={selectedView === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedView(key as any)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Nodes</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.totalNodes}</p>
                  </div>
                  <Network className="w-8 h-8 text-blue-500" />
                </div>
                <Progress value={(metrics.onlineNodes / metrics.totalNodes) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.onlineNodes} online ({((metrics.onlineNodes / metrics.totalNodes) * 100).toFixed(1)}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.activeAgents}</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={(metrics.activeAgents / metrics.totalAgents) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  of {metrics.totalAgents} total agents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Network Latency</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.networkLatency.toFixed(0)}ms</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">Optimal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gas Efficiency</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.gasEfficiency.toFixed(1)}%</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <Progress value={metrics.gasEfficiency} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  vs traditional methods
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Network Health Overview */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                Network Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {((metrics.onlineNodes / metrics.totalNodes) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {metrics.throughput.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">TPS</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {metrics.errorRate.toFixed(2)}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Error Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Network Nodes Tab */}
      {selectedView === 'nodes' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Network Node Status
              </CardTitle>
              <CardDescription>
                Real-time monitoring of all network participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkNodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`}></div>
                      <div>
                        <h4 className="font-medium text-foreground">{node.id}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="capitalize">{node.type}</span>
                          <span>•</span>
                          <span>{node.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground">{node.uptime.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground">{node.performance}%</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                      <Badge variant="outline">
                        {getStatusText(node.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Governance Tab */}
      {selectedView === 'governance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5" />
                Active Governance Proposals
              </CardTitle>
              <CardDescription>
                Community-driven decisions for the SEI Guardian Vigil network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {governanceProposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{proposal.title}</h4>
                          <Badge 
                            className={`${getProposalStatusColor(proposal.status)} text-white`}
                          >
                            {proposal.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{proposal.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Proposed by: {proposal.proposer}
                        </div>
                      </div>
                    </div>
                    
                    {proposal.status === 'active' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Votes For: {proposal.votesFor.toLocaleString()}</span>
                          <span>Votes Against: {proposal.votesAgainst.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(proposal.votesFor / proposal.totalVotes) * 100} 
                          className="h-2" 
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Total Votes: {proposal.totalVotes.toLocaleString()}</span>
                          <span>{formatTimeRemaining(proposal.endTime)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">Vote For</Button>
                          <Button size="sm" variant="outline">Vote Against</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedView === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Detailed metrics and performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Network Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Peak TPS</span>
                      <span className="font-medium">15,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Block Time</span>
                      <span className="font-medium">594ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gas Price</span>
                      <span className="font-medium">0.000001 SEI</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Agent Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Scan Time</span>
                      <span className="font-medium">156ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Detection Rate</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">False Positives</span>
                      <span className="font-medium">2.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
