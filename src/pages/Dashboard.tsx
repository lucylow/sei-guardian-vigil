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
  Target
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
            <RealTimeMonitor contracts={contracts} />
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

        {/* Cambrian Analytics Section */}
        <div className="mt-8">
          <CambrianAnalytics />
        </div>
      </div>
    </div>
  );
}