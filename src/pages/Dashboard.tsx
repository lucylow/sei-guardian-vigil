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
  Settings
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and system overview</p>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Overview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Current security status and threat monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VulnerabilityRadar vulnerabilities={vulnerabilities} />
                    <ContractHealthGrid contracts={contracts} />
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