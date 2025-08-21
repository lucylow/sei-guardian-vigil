import { Navigation } from "@/components/Navigation";
import { SystemOverview } from "@/components/SystemOverview";
import { NetworkMetrics } from "@/components/NetworkMetrics";
import { RealTimeMonitor } from "@/components/RealTimeMonitor";
import { VulnerabilityRadar } from "@/components/VulnerabilityRadar";
import { ContractHealthGrid } from "@/components/ContractHealthGrid";
import { ThreatIntelFeed } from "@/components/ThreatIntelFeed";
import { CambrianAnalytics } from "@/components/CambrianAnalytics";
import { ToolsIntegrationPanel } from "@/components/ToolsIntegrationPanel";
import { useSeiData } from "@/hooks/useSeiData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Shield, 
  Users, 
  Clock, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  Globe,
  Cpu,
  Target,
  BarChart3,
  Zap,
  Settings,
  Zap as Lightning,
  Search,
  Eye,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const { contracts, vulnerabilities, networkStats } = useSeiData();

  // Dashboard metrics data
  const dashboardMetrics = [
    { 
      label: "Total Contracts", 
      value: contracts?.length || 0, 
      icon: Database, 
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "Monitored contracts" 
    },
    { 
      label: "Security Score", 
      value: "94%", 
      icon: Shield, 
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "System health" 
    },
    { 
      label: "Active Agents", 
      value: "8", 
      icon: Users, 
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: "Running agents" 
    },
    { 
      label: "System Uptime", 
      value: "99.9%", 
      icon: Clock, 
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      description: "24h availability" 
    },
  ];

  const networkMetrics = [
    { 
      label: "TPS", 
      value: networkStats?.tps?.toLocaleString() || "0", 
      icon: Target, 
      color: "text-blue-400",
      description: "Transactions per second" 
    },
    { 
      label: "Utilization", 
      value: `${networkStats?.utilization?.toFixed(1) || "0"}%`, 
      icon: Cpu, 
      color: "text-green-400",
      description: "Network capacity" 
    },
    { 
      label: "Validators", 
      value: networkStats?.validators || "0", 
      icon: Users, 
      color: "text-purple-400",
      description: "Active validators" 
    },
    { 
      label: "Block Time", 
      value: `${networkStats?.blockTime || "0"}s`, 
      icon: Clock, 
      color: "text-orange-400",
      description: "Average block time" 
    },
  ];

  // Security vulnerability types
  const vulnerabilityTypes = [
    { type: "Overflow", count: 6, severity: "critical", color: "bg-red-500" },
    { type: "Frontrunning", count: 1, severity: "critical", color: "bg-red-500" },
    { type: "Reentrancy", count: 3, severity: "critical", color: "bg-red-500" },
    { type: "Oracle manipulation", count: 4, severity: "critical", color: "bg-red-500" },
    { type: "Logic error", count: 3, severity: "critical", color: "bg-red-500" },
    { type: "Access control", count: 8, severity: "critical", color: "bg-red-500" },
  ];

  // Recent auto-scans data
  const recentScans = [
    {
      name: "FT Marketplace",
      address: "0xBE0eB5...33E8",
      tvl: "$46.9M",
      lastScan: "58 min ago",
      vulnerabilities: 3,
      status: "critical",
      gasOptimized: false
    },
    {
      name: "SeiDerivatives Exchange",
      address: "0x95aD61...C4cE",
      tvl: "$46.2M",
      lastScan: "1 min ago",
      vulnerabilities: 4,
      status: "critical",
      gasOptimized: true
    },
    {
      name: "SeiOracle Bridge",
      address: "0x1f9840...F984",
      tvl: "$45.0M",
      lastScan: "53 min ago",
      vulnerabilities: 2,
      status: "warning",
      gasOptimized: true
    },
    {
      name: "SeiFarms Liquidity",
      address: "0x4f96fe...a6aa",
      tvl: "$42.5M",
      lastScan: "38 min ago",
      vulnerabilities: 2,
      status: "warning",
      gasOptimized: true
    },
    {
      name: "SeiLend Vault",
      address: "0x3f5CE5...f0bE",
      tvl: "$40.1M",
      lastScan: "39 min ago",
      vulnerabilities: 4,
      status: "critical",
      gasOptimized: true
    },
    {
      name: "SeiFarms Liquidity",
      address: "0x4f96fe...a6aa",
      tvl: "$39.3M",
      lastScan: "27 min ago",
      vulnerabilities: 4,
      status: "critical",
      gasOptimized: true
    },
    {
      name: "SeiStake Pool",
      address: "0xA0b86a...db1b",
      tvl: "$36.5M",
      lastScan: "45 min ago",
      vulnerabilities: 4,
      status: "critical",
      gasOptimized: true
    },
    {
      name: "SeiLend Vault",
      address: "0x3f5CE5...f0bE",
      tvl: "$33.1M",
      lastScan: "32 min ago",
      vulnerabilities: 4,
      status: "critical",
      gasOptimized: true
    },
    {
      name: "SeiStake Pool",
      address: "0xA0b86a...db1b",
      tvl: "$31.8M",
      lastScan: "1 min ago",
      vulnerabilities: 4,
      status: "critical",
      gasOptimized: false
    },
    {
      name: "SeiOracle Bridge",
      address: "0x1f9840...F984",
      tvl: "$30.3M",
      lastScan: "57 min ago",
      vulnerabilities: 2,
      status: "warning",
      gasOptimized: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-500 text-white";
      case "warning": return "bg-yellow-500 text-black";
      case "safe": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical": return "CRITICAL";
      case "warning": return "WARNING";
      case "safe": return "SAFE";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <Card key={index} className={`${metric.bgColor} ${metric.borderColor} hover:shadow-lg transition-shadow`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-foreground">{metric.label}</CardTitle>
                      <IconComponent className={`h-4 w-4 ${metric.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Network Status Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  Network Status
                </CardTitle>
                <CardDescription className="text-muted-foreground">Current Sei Network metrics and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {networkMetrics.map((metric, index) => {
                    const IconComponent = metric.icon;
                    return (
                      <div key={index} className="p-4 rounded-lg bg-background/40 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`w-4 h-4 ${metric.color}`} />
                          <span className="text-xs text-muted-foreground">{metric.label}</span>
                        </div>
                        <div className={`text-lg font-bold ${metric.color}`}>
                          {metric.value}
                        </div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="w-5 h-5 text-primary" />
                    Real-Time Monitoring
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Live system monitoring and performance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <RealTimeMonitor contracts={contracts} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              {/* Vulnerability Types Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Vulnerability Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {vulnerabilityTypes.map((vuln, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <div className={`inline-block w-3 h-3 rounded-full ${vuln.color} mb-2`}></div>
                        <div className="text-sm font-medium text-foreground">{vuln.type}</div>
                        <div className="text-xs text-muted-foreground">{vuln.severity}</div>
                        <div className="text-lg font-bold text-red-500">{vuln.count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Block Finality */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Lightning className="w-5 h-5 text-blue-500" />
                    ⚡ Live Block Finality (Twin-Turbo)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        Block #8757814
                      </div>
                      <div className="text-lg text-blue-700 dark:text-blue-300">
                        Finality latency: 346 ms
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Auto-Scans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Search className="w-5 h-5 text-green-500" />
                    🚀 Recent Auto‑Scans
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Latest security scan results for monitored contracts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentScans.map((scan, index) => (
                      <div key={index} className="border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 bg-gradient-to-r from-background to-muted/20">
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-foreground">{scan.name}</h4>
                              <Badge 
                                className={`${getStatusColor(scan.status)} text-xs font-medium px-2 py-1`}
                              >
                                {getStatusText(scan.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-md inline-block">
                              {scan.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground mb-1">{scan.tvl}</div>
                            <div className="text-xs text-muted-foreground font-medium">Total Value Locked</div>
                          </div>
                        </div>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-6 mb-4">
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Last Scan</div>
                            <div className="font-semibold text-foreground">{scan.lastScan}</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Vulnerabilities</div>
                            <div className="font-semibold text-foreground">{scan.vulnerabilities}</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Risk Level</div>
                            <div className={`font-semibold ${scan.status === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>
                              {scan.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Gas Optimization Status */}
                        <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Gas Optimization:</span>
                            <span className={`text-sm font-medium ${scan.gasOptimized ? 'text-green-600' : 'text-orange-600'}`}>
                              {scan.gasOptimized ? "Yes" : "No"}
                            </span>
                          </div>
                          <Badge 
                            variant={scan.gasOptimized ? "default" : "secondary"} 
                            className={`text-xs font-medium px-3 py-1 ${scan.gasOptimized ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Advanced Analytics
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Deep insights and performance analytics</CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Common dashboard actions and tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <span className="font-medium text-foreground">Run Security Scan</span>
                        <p className="text-xs text-muted-foreground text-center">Scan all contracts for vulnerabilities</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <BarChart3 className="w-8 h-8 text-green-400" />
                        <span className="font-medium text-foreground">Generate Report</span>
                        <p className="text-xs text-muted-foreground text-center">Create comprehensive system report</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <Database className="w-8 h-8 text-purple-400" />
                        <span className="font-medium text-foreground">Backup Data</span>
                        <p className="text-xs text-muted-foreground text-center">Create system backup</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <Globe className="w-8 h-8 text-orange-400" />
                        <span className="font-medium text-foreground">Network Status</span>
                        <p className="text-xs text-muted-foreground text-center">Check network health</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <Settings className="w-8 h-8 text-gray-400" />
                        <span className="font-medium text-foreground">System Settings</span>
                        <p className="text-xs text-muted-foreground text-center">Configure dashboard options</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <Activity className="w-8 h-8 text-red-400" />
                        <span className="font-medium text-foreground">Activity Log</span>
                        <p className="text-xs text-muted-foreground text-center">View system activity history</p>
                      </CardContent>
                    </Card>
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