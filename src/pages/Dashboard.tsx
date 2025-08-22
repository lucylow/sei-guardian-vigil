import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Clock, 
  Database, 
  Target, 
  Cpu, 
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  BarChart3,
  Settings,
  Vote,
  Eye
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
                REAL-TIME SECURITY MONITORING & SYSTEM OVERVIEW
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm bg-gradient-to-r from-green-600/20 to-green-700/20 border-green-600/50 text-green-400 font-mono tracking-wide font-bold px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                SYSTEM HEALTHY
              </Badge>
              <Badge variant="secondary" className="text-sm bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-blue-600/50 text-blue-400 font-mono tracking-wide font-bold px-4 py-2">
                <Activity className="w-4 h-4 mr-2" />
                ONLINE
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">24</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">ACTIVE AGENTS</div>
              <div className="text-xs text-green-400 mt-2">+12% from last week</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">156</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">CONTRACTS MONITORED</div>
              <div className="text-xs text-yellow-400 mt-2">3 require attention</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">94%</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">SECURITY SCORE</div>
              <div className="text-xs text-green-400 mt-2">+2% improvement</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">400ms</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">AVG RESPONSE</div>
              <div className="text-xs text-blue-400 mt-2">Ultra-fast</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-black/50 via-red-900/20 to-black/50 border-red-900/50 shadow-xl shadow-red-500/10">
            <TabsTrigger 
              value="overview" 
              className="text-red-400 hover:text-red-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/40 data-[state=active]:to-red-800/20 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide font-bold transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25"
            >
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="text-red-400 hover:text-red-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/40 data-[state=active]:to-red-800/20 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide font-bold transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25"
            >
              MONITORING
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="text-red-400 hover:text-red-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/40 data-[state=active]:to-red-800/20 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide font-bold transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25"
            >
              SECURITY
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-red-400 hover:text-red-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/40 data-[state=active]:to-red-800/20 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide font-bold transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25"
            >
              ANALYTICS
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="text-red-400 hover:text-red-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/40 data-[state=active]:to-red-800/20 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide font-bold transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25"
            >
              TOOLS
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8 space-y-6">
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

            {/* Performance Metrics */}
            <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-red-400" />
                  PERFORMANCE METRICS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">Response Time</span>
                      <span className="text-red-300 font-bold">400ms</span>
                    </div>
                    <Progress value={85} className="h-2 bg-red-900/30">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-500"></div>
                    </Progress>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">Uptime</span>
                      <span className="text-red-300 font-bold">99.9%</span>
                    </div>
                    <Progress value={99} className="h-2 bg-red-900/30">
                      <div className="h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transition-all duration-500"></div>
                    </Progress>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">Security Score</span>
                      <span className="text-red-300 font-bold">94%</span>
                    </div>
                    <Progress value={94} className="h-2 bg-red-900/30">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-500"></div>
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="mt-8">
            <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                  <Eye className="w-6 h-6 text-red-400" />
                  LIVE MONITORING DASHBOARD
                </CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  REAL-TIME SURVEILLANCE OF ALL MONITORED CONTRACTS AND NETWORK ACTIVITY
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">MONITORING ACTIVE</h3>
                  <p className="text-red-600/70 font-medium tracking-wide">
                    156 CONTRACTS UNDER SURVEILLANCE • 24 AGENTS DEPLOYED
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-8">
            <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-red-400" />
                  SECURITY CENTER
                </CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  THREAT DETECTION, VULNERABILITY ASSESSMENT, AND INCIDENT RESPONSE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">SECURITY STATUS: EXCELLENT</h3>
                  <p className="text-red-600/70 font-medium tracking-wide">
                    NO ACTIVE THREATS DETECTED • ALL SYSTEMS SECURED
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-8">
            <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-red-400" />
                  ANALYTICS & INSIGHTS
                </CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  PERFORMANCE METRICS, TREND ANALYSIS, AND PREDICTIVE INSIGHTS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">ANALYTICS ENGINE</h3>
                  <p className="text-red-600/70 font-medium tracking-wide">
                    PROCESSING REAL-TIME DATA • GENERATING INSIGHTS
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-8">
            <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-red-400" />
                  SECURITY TOOLS
                </CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  ADVANCED SECURITY TOOLS AND UTILITIES FOR THREAT MITIGATION
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">TOOL SUITE READY</h3>
                  <p className="text-red-600/70 font-medium tracking-wide">
                    SCANNERS • ANALYZERS • RESPONSE TOOLS • DEPLOYED
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}