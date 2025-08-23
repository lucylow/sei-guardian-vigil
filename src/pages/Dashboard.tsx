import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabDescription, TabConnectionLine } from '@/components/ui/tabs';
import { 
  Activity, 
  Clock, 
  Shield, 
  Target, 
  TrendingUp, 
  Zap,
  Database,
  Eye,
  Brain,
  Wrench
} from "lucide-react";

// Navigation is now handled by the Layout component
import { SeiNativeIntegration } from '@/components/SeiNativeIntegration';
import { DeveloperTooling } from '@/components/DeveloperTooling';
import { InfrastructureMonitoring } from '@/components/InfrastructureMonitoring';
import { InteractiveDemo } from '@/components/InteractiveDemo';

// Import existing components
import { SystemOverview } from '@/components/SystemOverview';
import { NetworkMetrics } from '@/components/NetworkMetrics';
import { RealTimeMonitor } from '@/components/RealTimeMonitor';
import { VulnerabilityRadar } from '@/components/VulnerabilityRadar';
import { ContractHealthGrid } from '@/components/ContractHealthGrid';
import { ThreatIntelFeed } from '@/components/ThreatIntelFeed';
import { ToolsIntegrationPanel } from '@/components/ToolsIntegrationPanel';
import { CambrianAnalytics } from '@/components/CambrianAnalytics';

// Import hooks
import { useSeiData } from '@/hooks/useSeiData';
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { contracts, vulnerabilities, networkStats } = useSeiData();

  // Tab descriptions for each dashboard section
  const tabDescriptions = {
    overview: "Comprehensive system overview with status monitoring and recent activity",
    monitoring: "Real-time network monitoring and performance metrics",
    security: "Security status, threat detection, and incident reports",
    analytics: "Data analytics, performance trends, and insights",
    tools: "Development tools, utilities, and system management"
  };

  const systemMetrics = [
    {
      label: "Network Status",
      value: "ONLINE",
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      label: "Active Agents",
      value: "24",
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      label: "Security Score",
      value: "94%",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      label: "Avg Response",
      value: "400ms",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    }
  ];

  // Dashboard metrics data
  const dashboardMetrics = [
    { 
      label: "TOTAL CONTRACTS", 
      value: contracts?.length || 0, 
      icon: Database, 
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "MONITORED CONTRACTS" 
    },
    { 
      label: "SECURITY SCORE", 
      value: "94%", 
      icon: Shield, 
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "SYSTEM HEALTH" 
    },
    { 
      label: "ACTIVE AGENTS", 
      value: "8", 
      icon: Users, 
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "RUNNING AGENTS" 
    },
    { 
      label: "SYSTEM UPTIME", 
      value: "99.9%", 
      icon: Clock, 
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "24H AVAILABILITY" 
    },
  ];

  const networkMetrics = [
    { 
      label: "TPS", 
      value: "15,414.722", 
      icon: Target, 
      color: "text-red-400",
      description: "TRANSACTIONS PER SECOND" 
    },
    { 
      label: "UTILIZATION", 
      value: "68.3%", 
      icon: Cpu, 
      color: "text-red-400",
      description: "NETWORK CAPACITY" 
    },
    { 
      label: "VALIDATORS", 
      value: "100", 
      icon: Users, 
      color: "text-red-400",
      description: "ACTIVE VALIDATORS" 
    },
    { 
      label: "BLOCK TIME", 
      value: "594.41S", 
      icon: Clock, 
      color: "text-red-400",
      description: "AVERAGE BLOCK TIME" 
    },
  ];

  // Security vulnerability types
  const vulnerabilityTypes = [
    { type: "ACCESS CONTROL", count: 4, severity: "CRITICAL", color: "bg-red-500" },
    { type: "ORACLE MANIPULATION", count: 4, severity: "CRITICAL", color: "bg-red-500" },
    { type: "OVERFLOW", count: 5, severity: "CRITICAL", color: "bg-red-500" },
    { type: "FRONTRUNNING", count: 4, severity: "HIGH", color: "bg-orange-500" },
    { type: "REENTRANCY", count: 4, severity: "MEDIUM", color: "bg-yellow-500" },
    { type: "LOGIC ERROR", count: 4, severity: "MEDIUM", color: "bg-yellow-500" },
  ];

  // Recent auto-scans data
  const recentScans = [
    {
      name: "SEIDERIVATIVES EXCHANGE",
      address: "0x95aD61...C4cE",
      tvl: "$48.9M",
      lastScan: "46 MIN AGO",
      vulnerabilities: 3,
      status: "CRITICAL",
      gasOptimized: true
    },
    {
      name: "SEINFT MARKETPLACE",
      address: "0xBE0eB5...33E8",
      tvl: "$48.7M",
      lastScan: "30 MIN AGO",
      vulnerabilities: 3,
      status: "CRITICAL",
      gasOptimized: true
    },
    {
      name: "SEISTAKE POOL",
      address: "0xA0b86a...db1b",
      tvl: "$48.4M",
      lastScan: "34 MIN AGO",
      vulnerabilities: 4,
      status: "CRITICAL",
      gasOptimized: true
    },
    {
      name: "SEISWAP PROTOCOL",
      address: "0x742d35...f44e",
      tvl: "$42.9M",
      lastScan: "40 MIN AGO",
      vulnerabilities: 1,
      status: "WARNING",
      gasOptimized: false
    },
    {
      name: "SEISTAKE POOL",
      address: "0xA0b86a...db1b",
      tvl: "$41.4M",
      lastScan: "2 MIN AGO",
      vulnerabilities: 4,
      status: "CRITICAL",
      gasOptimized: false
    },
    {
      name: "SEISWAP PROTOCOL",
      address: "0x742d35...f44e",
      tvl: "$40.7M",
      lastScan: "18 MIN AGO",
      vulnerabilities: 1,
      status: "WARNING",
      gasOptimized: false
    },
    {
      name: "SEIORACLE BRIDGE",
      address: "0x1f9840...F984",
      tvl: "$40.5M",
      lastScan: "58 MIN AGO",
      vulnerabilities: 1,
      status: "WARNING",
      gasOptimized: false
    },
    {
      name: "SEIDAO GOVERNANCE",
      address: "0x28c6c0...1d60",
      tvl: "$39.4M",
      lastScan: "34 MIN AGO",
      vulnerabilities: 3,
      status: "CRITICAL",
      gasOptimized: true
    },
    {
      name: "SEINFT MARKETPLACE",
      address: "0xBE0eB5...33E8",
      tvl: "$35.2M",
      lastScan: "1 MIN AGO",
      vulnerabilities: 0,
      status: "SAFE",
      gasOptimized: true
    },
    {
      name: "SEIFARMS LIQUIDITY",
      address: "0x4f96fe...a6aa",
      tvl: "$33.0M",
      lastScan: "32 MIN AGO",
      vulnerabilities: 3,
      status: "CRITICAL",
      gasOptimized: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL": return "bg-red-500 text-white";
      case "WARNING": return "bg-yellow-500 text-black";
      case "SAFE": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CRITICAL": return "CRITICAL";
      case "WARNING": return "WARNING";
      case "SAFE": return "SAFE";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-3 tracking-wider">
                DASHBOARD
              </h1>
              <p className="text-lg text-red-600/70 font-medium tracking-wide">
                REAL-TIME MONITORING AND SYSTEM OVERVIEW
              </p>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1">
              <Activity className="w-5 h-5 mr-2" />
              REFRESH
            </Button>
          </div>
        </div>

        {/* System Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300`}>
                      <IconComponent className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-300 mb-2">{metric.value}</div>
                  <div className="text-sm text-red-600/70 font-medium tracking-wide">{metric.label}</div>
                  <div className="text-xs text-green-400 mt-2">Active</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">DASHBOARD SECTIONS</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList variant="security" className="w-full">
              <TabsTrigger 
                value="overview" 
                variant="security"
                icon={<Activity className="w-5 h-5" />}
              >
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger 
                value="monitoring" 
                variant="security"
                icon={<Eye className="w-5 h-5" />}
              >
                MONITORING
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                variant="security"
                icon={<Shield className="w-5 h-5" />}
              >
                SECURITY
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                variant="security"
                icon={<Brain className="w-5 h-5" />}
              >
                ANALYTICS
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                variant="security"
                icon={<Wrench className="w-5 h-5" />}
              >
                TOOLS
              </TabsTrigger>
            </TabsList>
            
            <TabConnectionLine variant="security" />
            <TabDescription variant="security" descriptions={tabDescriptions} />
            
            {/* Overview Tab */}
            <TabsContent value="overview" variant="security">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* System Status */}
                  <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                        <Activity className="w-6 h-6 text-red-400" />
                        SYSTEM STATUS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                          <span className="text-red-600/70 font-medium">Network Connectivity</span>
                          <Badge variant="default" className="bg-green-600 text-white font-bold">ONLINE</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                          <span className="text-red-600/70 font-medium">AI Agents</span>
                          <Badge variant="default" className="bg-blue-600 text-white font-bold">ACTIVE</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                          <span className="text-red-600/70 font-medium">Security Protocols</span>
                          <Badge variant="default" className="bg-green-600 text-white font-bold">ENABLED</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-red-400" />
                        RECENT ACTIVITY
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-red-300">Agent Sentinel-01 completed security scan</span>
                          <span className="text-xs text-red-600/70 ml-auto">2m ago</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-red-300">New contract added to monitoring</span>
                          <span className="text-xs text-red-600/70 ml-auto">5m ago</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-red-300">Security alert resolved</span>
                          <span className="text-xs text-red-600/70 ml-auto">12m ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Eye className="w-6 h-6 text-red-400" />
                      NETWORK MONITORING
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">99.9%</div>
                          <div className="text-sm text-red-600/70">Uptime</div>
                        </div>
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">400ms</div>
                          <div className="text-sm text-red-600/70">Avg Response</div>
                        </div>
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">1.2M</div>
                          <div className="text-sm text-red-600/70">Requests/min</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-red-400" />
                      SECURITY STATUS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-900/20 rounded-lg border border-green-800/30">
                          <div className="text-2xl font-bold text-green-300">94%</div>
                          <div className="text-sm text-green-600/70">Security Score</div>
                        </div>
                        <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
                          <div className="text-2xl font-bold text-yellow-300">3</div>
                          <div className="text-sm text-yellow-600/70">Active Alerts</div>
                        </div>
                        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
                          <div className="text-2xl font-bold text-blue-300">156</div>
                          <div className="text-sm text-blue-600/70">Threats Blocked</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Brain className="w-6 h-6 text-red-400" />
                      PERFORMANCE ANALYTICS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">+15%</div>
                          <div className="text-sm text-red-600/70">Performance</div>
                        </div>
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">-23%</div>
                          <div className="text-sm text-red-600/70">Error Rate</div>
                        </div>
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">2.4s</div>
                          <div className="text-sm text-red-600/70">Avg Load Time</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Wrench className="w-6 h-6 text-red-400" />
                      DEVELOPMENT TOOLS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-4 transform hover:scale-105">
                          <Database className="w-5 h-5 mr-2" />
                          Database Manager
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-4 transform hover:scale-105">
                          <Shield className="w-5 h-5 mr-2" />
                          Security Scanner
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}