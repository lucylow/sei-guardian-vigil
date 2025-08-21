import { Navigation } from "@/components/Navigation";
import { SystemOverview } from "@/components/SystemOverview";
import { NetworkMetrics } from "@/components/NetworkMetrics";
import { RealTimeMonitor } from "@/components/RealTimeMonitor";
import { VulnerabilityRadar } from "@/components/VulnerabilityRadar";
import { ContractHealthGrid } from "@/components/ContractHealthGrid";
import { ThreatIntelFeed } from "@/components/ThreatIntelFeed";
import { CambrianAnalytics } from "@/components/CambrianAnalytics";
import { ToolsIntegrationPanel } from "@/components/ToolsIntegrationPanel";
import { DashboardDemo } from "@/components/DashboardDemo";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useDashboard } from "@/hooks/useDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Zap,
  Database,
  Globe,
  Clock,
  DollarSign,
  BarChart3,
  Target,
  Users,
  Cpu,
  Memory,
  Network,
  HardDrive,
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { 
    metrics,
    isLoading,
    error,
    lastUpdate,
    isInitialized,
    systemHealth,
    activeAgents,
    totalContracts,
    threatsBlocked,
    activeAlerts,
    recentActivities,
    latestBlock,
    networkMetrics,
    securityMetrics,
    agentStatuses,
    addActivity,
    addAlert,
    refreshData,
    retryInitialization
  } = useDashboard();

  const [dashboardStats, setDashboardStats] = useState({
    totalContracts: 0,
    activeAudits: 0,
    threatsBlocked: 0,
    systemUptime: 99.9,
    totalValueProtected: 0,
    averageResponseTime: 0.3,
    activeAgents: 0,
    securityScore: 0
  });

  useEffect(() => {
    if (metrics) {
      setDashboardStats({
        totalContracts: metrics.totalContracts,
        activeAudits: metrics.activeAudits,
        threatsBlocked: metrics.threatsBlocked,
        systemUptime: metrics.systemUptime,
        totalValueProtected: metrics.totalValueProtected,
        averageResponseTime: metrics.averageResponseTime,
        activeAgents: metrics.activeAgents,
        securityScore: metrics.securityScore
      });
    }
  }, [metrics]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'audit': return <Shield className="w-4 h-4" />;
      case 'threat': return <AlertTriangle className="w-4 h-4" />;
      case 'deployment': return <CheckCircle className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Error:</strong> {error}
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The dashboard is having trouble connecting to external services. This is normal when running locally without the backend services.
            </p>
            <div className="flex gap-4">
              <Button onClick={retryInitialization} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </Button>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> The dashboard will work with demo data even when external services are unavailable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Real-time monitoring and system overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">
                <div>System health: {systemHealth}%</div>
              </div>
              <ConnectionStatus 
                isInitialized={isInitialized}
                hasError={!!error}
                lastUpdate={lastUpdate}
              />
              <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Security Alert */}
        {activeAlerts.length > 0 && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong> {activeAlerts.length} active alerts detected. System is monitoring and responding automatically.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{dashboardStats.totalContracts}</div>
              <p className="text-xs text-muted-foreground">Monitored contracts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{dashboardStats.securityScore}%</div>
              <p className="text-xs text-muted-foreground">System health</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{dashboardStats.activeAgents}</div>
              <p className="text-xs text-muted-foreground">Running agents</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{dashboardStats.systemUptime.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">24h availability</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Real-Time</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                <SystemOverview 
                  stats={{
                    totalAgents: 8,
                    activeAgents: dashboardStats.activeAgents,
                    tasksCompleted: 2341,
                    vulnerabilitiesFound: 127,
                    patchesDeployed: 89,
                    systemHealth: dashboardStats.securityScore,
                    totalValueProtected: dashboardStats.totalValueProtected,
                    averageResponseTime: dashboardStats.averageResponseTime,
                    threatLevel: 'medium' as const,
                    lastUpdate: lastUpdate
                  }}
                />
                <NetworkMetrics 
                  stats={{
                    blockTime: networkMetrics.blockTime,
                    tps: networkMetrics.tps,
                    validators: networkMetrics.validators,
                    utilization: networkMetrics.utilization,
                    totalContracts: dashboardStats.totalContracts,
                    vulnerabilitiesFound: 127,
                    systemUptime: dashboardStats.systemUptime
                  }} 
                />
              </div>

              {/* Center Content */}
              <div className="lg:col-span-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Network Status
                    </CardTitle>
                    <CardDescription>Current Sei Network metrics and performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestBlock && (
                      <div className="p-4 rounded-lg bg-background/40 border border-primary/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Latest Block</span>
                          <Badge variant="outline">#{latestBlock.blockNumber}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Hash: {latestBlock.blockHash.slice(0, 16)}...</div>
                          <div>Transactions: {latestBlock.transactionCount}</div>
                          <div>Timestamp: {new Date(latestBlock.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-background/40 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-muted-foreground">TPS</span>
                        </div>
                        <div className="text-lg font-bold text-blue-400">
                          {networkMetrics.tps.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-background/40 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-muted-foreground">Utilization</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                          {networkMetrics.utilization.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VulnerabilityRadar vulnerabilities={[]} />
                  <ContractHealthGrid contracts={[]} />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                <ThreatIntelFeed />
                <ToolsIntegrationPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <RealTimeMonitor contracts={[]} />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Overview
                  </CardTitle>
                  <CardDescription>Current security status and threat levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Security Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Vulnerability Detection</span>
                          <span className="font-medium">{securityMetrics.vulnerabilityDetection}%</span>
                        </div>
                        <Progress value={securityMetrics.vulnerabilityDetection} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Threat Response</span>
                          <span className="font-medium">{securityMetrics.threatResponse}%</span>
                        </div>
                        <Progress value={securityMetrics.threatResponse} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>System Hardening</span>
                          <span className="font-medium">{securityMetrics.systemHardening}%</span>
                        </div>
                        <Progress value={securityMetrics.systemHardening} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Active Alerts</h4>
                      <div className="space-y-3">
                        {activeAlerts.slice(0, 3).map((alert) => (
                          <div key={alert.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {alert.severity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                            </div>
                            <p className="text-sm font-medium">{alert.type}</p>
                            <p className="text-xs text-muted-foreground">{alert.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CambrianAnalytics />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest system activities and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-background/50 transition-colors">
                        <div className={`p-2 rounded-lg ${getStatusBadge(activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.title}</h4>
                            <Badge variant="outline" className={getStatusBadge(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{activity.timestamp}</span>
                            {activity.severity && (
                              <Badge variant="outline" className="text-xs">
                                {activity.severity} severity
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <div className="space-y-6">
              <DashboardDemo />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common dashboard actions and tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Shield className="w-6 h-6" />
                      <span>Run Security Scan</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <BarChart3 className="w-6 h-6" />
                      <span>Generate Report</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Database className="w-6 h-6" />
                      <span>Backup Data</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Network className="w-6 h-6" />
                      <span>Network Status</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <HardDrive className="w-6 h-6" />
                      <span>Storage Info</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Memory className="w-6 h-6" />
                      <span>Memory Usage</span>
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