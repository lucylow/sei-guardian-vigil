import { Navigation } from "@/components/Navigation";
import { HumanInterventionPanel } from "@/components/HumanInterventionPanel";
import { ThreatIntelFeed } from "@/components/ThreatIntelFeed";
import { SeiMCPPlugin } from "@/components/SeiMCPPlugin";
import { AIExploitSimulator } from "@/components/AIExploitSimulator";
import { GasOptimizationEngine } from "@/components/GasOptimizationEngine";
import { AIDNReporter } from "@/components/AIDNReporter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  TrendingUp,
  Lock,
  Eye
} from "lucide-react";

export default function Security() {
  const securityMetrics = [
    { label: "Threat Level", value: "Medium", icon: Shield, color: "secondary" },
    { label: "Active Threats", value: "7", icon: AlertTriangle, color: "destructive" },
    { label: "Blocked Attacks", value: "142", icon: CheckCircle, color: "default" },
    { label: "System Status", value: "Secure", icon: Lock, color: "default" },
  ];

  const securityEvents = [
    {
      id: 1,
      type: "Suspicious Transaction",
      severity: "high",
      description: "Large value transfer detected",
      timestamp: "2 min ago",
      status: "investigating"
    },
    {
      id: 2,
      type: "Contract Anomaly",
      severity: "medium",
      description: "Unusual gas consumption pattern",
      timestamp: "15 min ago",
      status: "resolved"
    },
    {
      id: 3,
      type: "Access Pattern",
      severity: "low",
      description: "Multiple failed authentication attempts",
      timestamp: "1 hour ago",
      status: "monitoring"
    },
  ];

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
      case "investigating": return <Activity className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      case "monitoring": return <Eye className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Center</h1>
          <p className="text-muted-foreground">Threat monitoring and security incident management</p>
        </div>

        {/* Security Alert */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> 7 active threats detected. System is monitoring and responding automatically.
          </AlertDescription>
        </Alert>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <Badge variant={metric.color as any} className="mt-2">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest threats and security incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      {getStatusIcon(event.status)}
                      <span className="capitalize">{event.status}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Threat Intelligence & Human Intervention */}
          <div className="space-y-6">
            <ThreatIntelFeed />
            <HumanInterventionPanel />
          </div>
        </div>

        {/* Sei MCP Plugin Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Sei MCP Integration</h2>
            <p className="text-muted-foreground">Live deployment monitoring with anomaly detection</p>
          </div>
          <SeiMCPPlugin />
        </div>

        {/* AI Exploit Simulator Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">AI Exploit Simulator</h2>
            <p className="text-muted-foreground">Test contracts against 10K+ attack vectors including flash loan surges</p>
          </div>
          <AIExploitSimulator />
        </div>

        {/* Gas Optimization Engine Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Gas Optimization Engine</h2>
            <p className="text-muted-foreground">Auto-refactors code to cut gas fees by 15-30% with Sei-specific optimizations</p>
          </div>
          <GasOptimizationEngine />
        </div>

        {/* AIDN Natural Language Reports Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">AIDN Natural Language Reports</h2>
            <p className="text-muted-foreground">AI-powered vulnerability reports in natural language for stakeholders</p>
          </div>
          <AIDNReporter />
        </div>

        {/* Security Health Score */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Health Score</CardTitle>
            <CardDescription>Overall system security assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Vulnerability Detection</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              
              <div className="flex justify-between text-sm">
                <span>Threat Response</span>
                <span className="font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
              
              <div className="flex justify-between text-sm">
                <span>System Hardening</span>
                <span className="font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
              
              <div className="flex justify-between text-sm">
                <span>Monitoring Coverage</span>
                <span className="font-medium">98%</span>
              </div>
              <Progress value={98} className="h-2" />
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Overall Score</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">94%</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}