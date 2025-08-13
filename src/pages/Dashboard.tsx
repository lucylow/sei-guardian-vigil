import { Navigation } from "@/components/Navigation";
import { SystemOverview } from "@/components/SystemOverview";
import { NetworkMetrics } from "@/components/NetworkMetrics";
import { RealTimeMonitor } from "@/components/RealTimeMonitor";
import { VulnerabilityRadar } from "@/components/VulnerabilityRadar";
import { ContractHealthGrid } from "@/components/ContractHealthGrid";
import { ThreatIntelFeed } from "@/components/ThreatIntelFeed";
import { SentinelChatbot } from "@/components/SentinelChatbot";
import { CambrianAnalytics } from "@/components/CambrianAnalytics";
import { ToolsIntegrationPanel } from "@/components/ToolsIntegrationPanel";
import { useSeiData } from "@/hooks/useSeiData";

export default function Dashboard() {
  const { contracts, vulnerabilities, networkStats } = useSeiData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and system overview</p>
        </div>

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
      
      <SentinelChatbot />
    </div>
  );
}