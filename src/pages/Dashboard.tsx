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
  Vote
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

export default function Dashboard() {
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
    <div className="min-h-screen bg-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-red-300 mb-2 tracking-wider">DASHBOARD</h1>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/50 border-red-900/50">
            <TabsTrigger value="overview" className="text-red-400 hover:text-red-300 data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide">OVERVIEW</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-red-400 hover:text-red-300 data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide">MONITORING</TabsTrigger>
            <TabsTrigger value="security" className="text-red-400 hover:text-red-300 data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide">SECURITY</TabsTrigger>
            <TabsTrigger value="analytics" className="text-red-400 hover:text-red-300 data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide">ANALYTICS</TabsTrigger>
            <TabsTrigger value="tools" className="text-red-400 hover:text-red-300 data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300 data-[state=active]:border-red-500 font-mono tracking-wide">TOOLS</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <Card key={index} className={`sei-card ${metric.bgColor} ${metric.borderColor}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-300 font-mono tracking-wide">{metric.label}</CardTitle>
                      <IconComponent className={`h-4 w-4 ${metric.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${metric.color} font-mono tracking-wide`}>{metric.value}</div>
                      <p className="text-xs text-red-600/70 font-mono tracking-wide">{metric.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Network Status Card */}
            <Card className="mb-8 sei-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                  <Shield className="w-5 h-5 text-red-500" />
                  NETWORK STATUS
                </CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">CURRENT SEI NETWORK METRICS AND PERFORMANCE</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {networkMetrics.map((metric, index) => {
                    const IconComponent = metric.icon;
                    return (
                      <div key={index} className="p-4 rounded-lg bg-black/40 border border-red-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`w-4 h-4 ${metric.color}`} />
                          <span className="text-xs text-red-600/70 font-mono tracking-wide">{metric.label}</span>
                        </div>
                        <div className={`text-lg font-bold ${metric.color} font-mono tracking-wide`}>
                          {metric.value}
                        </div>
                        <p className="text-xs text-red-600/70 font-mono tracking-wide">{metric.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* System Overview Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                <SystemOverview />
                <NetworkMetrics stats={networkStats} />
              </div>

              {/* Center Content */}
              <div className="lg:col-span-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VulnerabilityRadar vulnerabilities={vulnerabilities} />
                  <ContractHealthGrid contracts={contracts} />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                <ThreatIntelFeed />
                <ToolsIntegrationPanel />
              </div>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="mt-6">
            <div className="space-y-6">
              {/* Live Block Finality */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <Zap className="w-5 h-5 text-red-500" />
                    ⚡ LIVE BLOCK FINALITY (TWIN-TURBO)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2 font-mono tracking-wide">
                        BLOCK #8980916
                      </div>
                      <div className="text-lg text-red-500 font-mono tracking-wide">
                        FINALITY LATENCY: 512 MS
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-Time Monitoring */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <Activity className="w-5 h-5 text-red-500" />
                    REAL-TIME MONITORING
                  </CardTitle>
                  <CardDescription className="text-red-600/70 font-mono tracking-wide">LIVE SYSTEM MONITORING AND PERFORMANCE TRACKING</CardDescription>
                </CardHeader>
                <CardContent>
                  <RealTimeMonitor contracts={contracts} />
                </CardContent>
              </Card>

              {/* Network Performance Indicators */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <BarChart3 className="w-5 h-5 text-red-500" />
                    NETWORK PERFORMANCE INDICATORS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-red-500/20 rounded-lg">
                      <div className="text-2xl mb-2">🟡</div>
                      <div className="text-sm text-red-600/70 mb-1 font-mono tracking-wide">BLOCK TIME</div>
                      <div className="font-bold text-red-300 font-mono tracking-wide">594MS</div>
                    </div>
                    <div className="text-center p-4 border border-red-500/20 rounded-lg">
                      <div className="text-2xl mb-2">🟢</div>
                      <div className="text-sm text-red-600/70 mb-1 font-mono tracking-wide">TPS</div>
                      <div className="font-bold text-red-300 font-mono tracking-wide">15,415</div>
                    </div>
                    <div className="text-center p-4 border border-red-500/20 rounded-lg">
                      <div className="text-2xl mb-2">⚪</div>
                      <div className="text-sm text-red-600/70 mb-1 font-mono tracking-wide">VALIDATORS</div>
                      <div className="font-bold text-red-300 font-mono tracking-wide">100</div>
                    </div>
                    <div className="text-center p-4 border border-red-500/20 rounded-lg">
                      <div className="text-2xl mb-2">🟢</div>
                      <div className="text-sm text-red-600/70 mb-1 font-mono tracking-wide">UTILIZATION</div>
                      <div className="font-bold text-red-300 font-mono tracking-wide">68%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              {/* Vulnerability Types Grid */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    VULNERABILITY TYPES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {vulnerabilityTypes.map((vuln, index) => (
                      <div key={index} className="text-center p-4 border border-red-500/20 rounded-lg">
                        <div className={`inline-block w-3 h-3 rounded-full ${vuln.color} mb-2`}></div>
                        <div className="text-sm font-medium text-red-300 font-mono tracking-wide">{vuln.type}</div>
                        <div className="text-xs text-red-600/70 font-mono tracking-wide">{vuln.severity}</div>
                        <div className="text-lg font-bold text-red-500 font-mono tracking-wide">{vuln.count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Auto-Scans */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    🚀 RECENT AUTO‑SCANS
                  </CardTitle>
                  <CardDescription className="text-red-600/70 font-mono tracking-wide">
                    LATEST SECURITY SCAN RESULTS FOR MONITORED CONTRACTS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentScans.map((scan, index) => (
                      <div key={index} className="border border-red-500/20 rounded-xl p-6 hover:shadow-lg hover:border-red-500/30 transition-all duration-200 bg-gradient-to-r from-black to-red-900/10">
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-red-300 font-mono tracking-wide">{scan.name}</h4>
                              <Badge 
                                className={`${getStatusColor(scan.status)} text-xs font-medium px-2 py-1 font-mono tracking-wide`}
                              >
                                {getStatusText(scan.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-red-600/70 font-mono bg-red-900/20 px-3 py-1 rounded-md inline-block tracking-wide">
                              {scan.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-300 mb-1 font-mono tracking-wide">{scan.tvl}</div>
                            <div className="text-xs text-red-600/70 font-medium font-mono tracking-wide">TOTAL VALUE LOCKED</div>
                          </div>
                        </div>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-6 mb-4">
                          <div className="text-center p-3 bg-red-900/20 rounded-lg">
                            <div className="text-xs text-red-600/70 mb-1 font-mono tracking-wide">LAST SCAN</div>
                            <div className="font-semibold text-red-300 font-mono tracking-wide">{scan.lastScan}</div>
                          </div>
                          <div className="text-center p-3 bg-red-900/20 rounded-lg">
                            <div className="text-xs text-red-600/70 mb-1 font-mono tracking-wide">VULNERABILITIES</div>
                            <div className="font-semibold text-red-300 font-mono tracking-wide">{scan.vulnerabilities}</div>
                          </div>
                          <div className="text-center p-3 bg-red-900/20 rounded-lg">
                            <div className="text-xs text-red-600/70 mb-1 font-mono tracking-wide">RISK LEVEL</div>
                            <div className={`font-semibold ${scan.status === 'CRITICAL' ? 'text-red-500' : scan.status === 'WARNING' ? 'text-yellow-500' : 'text-green-500'} font-mono tracking-wide`}>
                              {scan.status}
                            </div>
                          </div>
                        </div>
                        
                        {/* Gas Optimization Status */}
                        <div className="flex items-center justify-between pt-4 border-t border-red-500/20">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-red-600/70 font-mono tracking-wide">GAS OPTIMIZATION:</span>
                            <span className={`text-sm font-medium ${scan.gasOptimized ? 'text-red-400' : 'text-orange-400'} font-mono tracking-wide`}>
                              {scan.gasOptimized ? "YES" : "NO"}
                            </span>
                          </div>
                          <Badge 
                            variant={scan.gasOptimized ? "default" : "secondary"} 
                            className={`text-xs font-medium px-3 py-1 ${scan.gasOptimized ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'} font-mono tracking-wide`}
                          >
                            {scan.gasOptimized ? "OPTIMIZED" : "PENDING"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Sei-Native Integration */}
              <SeiNativeIntegration />
              
              {/* Infrastructure Monitoring */}
              <InfrastructureMonitoring />
              
              {/* Cambrian Analytics */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    ADVANCED ANALYTICS
                  </CardTitle>
                  <CardDescription className="text-red-600/70 font-mono tracking-wide">DEEP INSIGHTS AND PERFORMANCE ANALYSIS</CardDescription>
                </CardHeader>
                <CardContent>
                  <CambrianAnalytics />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-6">
            <div className="space-y-6">
              {/* Interactive Demo */}
              <InteractiveDemo />
              
              {/* Developer Tooling */}
              <DeveloperTooling />
              
              {/* Quick Actions */}
              <Card className="sei-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300 font-mono tracking-wide">
                    <Zap className="w-5 h-5 text-red-500" />
                    QUICK ACTIONS
                  </CardTitle>
                  <CardDescription className="text-red-600/70 font-mono tracking-wide">COMMON TASKS AND OPERATIONS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide">
                      <Shield className="w-6 h-6" />
                      <span>RUN SECURITY SCAN</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide">
                      <BarChart3 className="w-6 h-6" />
                      <span>GENERATE REPORT</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide">
                      <Database className="w-6 h-6" />
                      <span>BACKUP DATA</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide">
                      <Settings className="w-6 h-6" />
                      <span>SYSTEM SETTINGS</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide">
                      <Activity className="w-6 h-6" />
                      <span>ACTIVITY LOG</span>
                    </Button>
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