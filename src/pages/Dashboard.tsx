import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { 
  Shield, 
  Activity, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Target,
  Eye,
  Brain,
  BarChart3,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Database,
  Lock,
  Unlock,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Trophy,
  Calendar,
  FileText,
  Code,
  Bot,
  Sword,
  Crown,
  Gauge,
  LineChart,
  PieChart,
  Radar,
  RefreshCw
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [systemMetrics, setSystemMetrics] = useState({
    networkStatus: "ONLINE",
    activeAgents: 24,
    securityScore: 94,
    avgResponse: 400,
    threatsBlocked: 142,
    contractsMonitored: 156,
    uptime: 99.97,
    lastIncident: "2 hours ago"
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "Security Scan",
      status: "completed",
      timestamp: "2 min ago",
      details: "Full system security audit completed",
      priority: "low"
    },
    {
      id: 2,
      type: "Threat Detected",
      status: "resolved",
      timestamp: "15 min ago",
      details: "Suspicious transaction pattern blocked",
      priority: "high"
    },
    {
      id: 3,
      type: "Agent Update",
      status: "completed",
      timestamp: "1 hour ago",
      details: "AI agent GUARDIAN-02 updated to v2.1.4",
      priority: "medium"
    },
    {
      id: 4,
      type: "Contract Audit",
      status: "in-progress",
      timestamp: "2 hours ago",
      details: "DeFi lending protocol audit in progress",
      priority: "high"
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpu: 23,
    memory: 67,
    network: 45,
    storage: 34,
    blockchain: 89,
    aiProcessing: 78
  });

  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      severity: "low",
      title: "New DeFi protocol detected",
      description: "Automated monitoring activated for new lending protocol",
      timestamp: "5 min ago",
      status: "monitoring"
    },
    {
      id: 2,
      severity: "medium",
      title: "Unusual gas consumption",
      description: "Spike in gas usage detected on monitored contracts",
      timestamp: "1 hour ago",
      status: "investigating"
    },
    {
      id: 3,
      severity: "high",
      title: "Potential reentrancy attempt",
      description: "Suspicious call pattern detected in lending contract",
      timestamp: "3 hours ago",
      status: "blocked"
    }
  ]);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        avgResponse: Math.floor(Math.random() * 100) + 350,
        securityScore: Math.floor(Math.random() * 5) + 92
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "blocked": return <Shield className="w-4 h-4 text-red-500" />;
      case "monitoring": return <Eye className="w-4 h-4 text-blue-500" />;
      case "investigating": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-3 tracking-wider">
                SEI SENTINEL DASHBOARD
              </h1>
              <p className="text-lg text-red-400/70 tracking-wide">
                Real-time security monitoring and system analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                SYSTEM HEALTHY
              </Badge>
              <Button variant="outline" className="border-red-600/50 text-red-400 hover:bg-red-600/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Network Status</CardTitle>
              <Network className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{systemMetrics.networkStatus}</div>
              <p className="text-xs text-red-400/70 mt-1">Uptime: {systemMetrics.uptime}%</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Active Agents</CardTitle>
              <Bot className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{systemMetrics.activeAgents}</div>
              <p className="text-xs text-red-400/70 mt-1">AI-powered security</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{systemMetrics.securityScore}%</div>
              <Progress value={systemMetrics.securityScore} className="h-2 mt-2 bg-red-900/30" />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Avg Response</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{systemMetrics.avgResponse}ms</div>
              <p className="text-xs text-red-400/70 mt-1">Sub-second threat response</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/40 border-red-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Threats Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{systemMetrics.threatsBlocked}</div>
              <p className="text-xs text-red-400/70 mt-1">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Contracts Monitored</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{systemMetrics.contractsMonitored}</div>
              <p className="text-xs text-red-400/70 mt-1">Active monitoring</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Last Incident</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{systemMetrics.lastIncident}</div>
              <p className="text-xs text-red-400/70 mt-1">System clean</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList variant="security" className="w-full">
            <TabsTrigger value="overview" variant="security" icon={<BarChart3 className="w-4 h-4" />}>
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger value="performance" variant="security" icon={<Gauge className="w-4 h-4" />}>
              PERFORMANCE
            </TabsTrigger>
            <TabsTrigger value="security" variant="security" icon={<Shield className="w-4 h-4" />}>
              SECURITY
            </TabsTrigger>
            <TabsTrigger value="activity" variant="security" icon={<Activity className="w-4 h-4" />}>
              ACTIVITY
            </TabsTrigger>
          </TabsList>

          {/* Tab Description */}
          <TabDescription 
            variant="security" 
            descriptions={{
              overview: "System overview and key performance indicators",
              performance: "Real-time system performance metrics and resource usage",
              security: "Security alerts, threats, and incident response status",
              activity: "Recent system activities and agent operations"
            }} 
          />

          {/* Connection Line */}
          <TabConnectionLine variant="security" />

          {/* Overview Tab */}
          <TabsContent value="overview" variant="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health Overview */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Activity className="w-5 h-5" />
                    System Health Overview
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    Real-time system status and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">CPU Usage</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.cpu}%</span>
                    </div>
                    <Progress value={performanceMetrics.cpu} className="h-2 bg-red-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">Memory Usage</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.memory}%</span>
                    </div>
                    <Progress value={performanceMetrics.memory} className="h-2 bg-red-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">Network Load</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.network}%</span>
                    </div>
                    <Progress value={performanceMetrics.network} className="h-2 bg-red-900/30" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    Common dashboard operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-600/50 text-red-400 hover:bg-red-600/20">
                      <Shield className="w-6 h-6" />
                      <span className="text-sm">Security Scan</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-600/50 text-red-400 hover:bg-red-600/20">
                      <Bot className="w-6 h-6" />
                      <span className="text-sm">Agent Status</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-600/50 text-red-400 hover:bg-red-600/20">
                      <Eye className="w-6 h-6" />
                      <span className="text-sm">Monitor</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-600/50 text-red-400 hover:bg-red-600/20">
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" variant="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resource Usage */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Cpu className="w-5 h-5" />
                    Resource Usage
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    System resource consumption and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">CPU</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.cpu}%</span>
                    </div>
                    <Progress value={performanceMetrics.cpu} className="h-2 bg-red-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">Memory</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.memory}%</span>
                    </div>
                    <Progress value={performanceMetrics.memory} className="h-2 bg-red-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">Storage</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.storage}%</span>
                    </div>
                    <Progress value={performanceMetrics.storage} className="h-2 bg-red-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">Network</span>
                      <span className="text-sm font-medium text-red-300">{performanceMetrics.network}%</span>
                    </div>
                    <Progress value={performanceMetrics.network} className="h-2 bg-red-900/30" />
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Performance */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Globe className="w-5 h-5" />
                    Blockchain Performance
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    SEI network and smart contract performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">Blockchain Sync</span>
                      <span className="text-sm font-medium text-green-400">{performanceMetrics.blockchain}%</span>
                    </div>
                    <Progress value={performanceMetrics.blockchain} className="h-2 bg-green-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400/70">AI Processing</span>
                      <span className="text-sm font-medium text-blue-400">{performanceMetrics.aiProcessing}%</span>
                    </div>
                    <Progress value={performanceMetrics.aiProcessing} className="h-2 bg-blue-900/30" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" variant="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Alerts */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <AlertTriangle className="w-5 h-5" />
                    Security Alerts
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    Recent security incidents and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 border border-red-800/30 rounded-lg bg-red-900/20">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-red-400/70">{alert.timestamp}</span>
                        </div>
                        <h4 className="font-medium text-red-300 text-sm mb-1">{alert.title}</h4>
                        <p className="text-xs text-red-400/70">{alert.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(alert.status)}
                          <span className="text-xs text-red-400/70 capitalize">{alert.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Metrics */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Shield className="w-5 h-5" />
                    Security Metrics
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    Key security performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{systemMetrics.threatsBlocked}</div>
                      <div className="text-xs text-red-400/70">Threats Blocked</div>
                    </div>
                    <div className="text-center p-3 bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{systemMetrics.contractsMonitored}</div>
                      <div className="text-xs text-red-400/70">Contracts Monitored</div>
                    </div>
                    <div className="text-center p-3 bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{systemMetrics.avgResponse}ms</div>
                      <div className="text-xs text-red-400/70">Avg Response</div>
                    </div>
                    <div className="text-center p-3 bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">{systemMetrics.securityScore}%</div>
                      <div className="text-xs text-red-400/70">Security Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" variant="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    Latest system activities and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border border-red-800/30 rounded-lg bg-red-900/20">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.priority === 'high' ? 'bg-red-500' :
                          activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-red-300">{activity.type}</div>
                          <div className="text-xs text-red-400/70">{activity.details}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getPriorityColor(activity.priority)} className="text-xs mb-1">
                            {activity.priority.toUpperCase()}
                          </Badge>
                          <div className="text-xs text-red-400/70">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agent Status */}
              <Card className="bg-black/40 border-red-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Bot className="w-5 h-5" />
                    Agent Status
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    AI agent operational status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                      <span className="text-sm text-green-300">Security Agents</span>
                      <Badge variant="secondary" className="bg-green-600/20 text-green-400">8 Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                      <span className="text-sm text-blue-300">Monitoring Agents</span>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">6 Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
                      <span className="text-sm text-purple-300">Analysis Agents</span>
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">4 Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
                      <span className="text-sm text-yellow-300">Response Agents</span>
                      <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">6 Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}