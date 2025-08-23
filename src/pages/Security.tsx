/* Navigation is now handled by the Layout component */
import { useState } from "react";
import { HumanInterventionPanel } from "@/components/HumanInterventionPanel";
import { ThreatIntelFeed } from "@/components/ThreatIntelFeed";
import { SeiMCPPlugin } from "@/components/SeiMCPPlugin";
import { AIExploitSimulator } from "@/components/AIExploitSimulator";
import { GasOptimizationEngine } from "@/components/GasOptimizationEngine";
import { AIDNReporter } from "@/components/AIDNReporter";
import { WebCrawlerAgent } from "@/components/WebCrawlerAgent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  TrendingUp,
  Lock,
  Eye,
  Brain,
  Zap,
  Target
} from "lucide-react";

export default function Security() {
  const [activeTab, setActiveTab] = useState("OVERVIEW");

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

  // Tab descriptions for each security function
  const tabDescriptions = {
    OVERVIEW: "Comprehensive security dashboard with real-time threat monitoring and system status",
    MONITORING: "Active threat detection and network analysis tools",
    RESPONSE: "Incident response and automated threat mitigation systems",
    ANALYSIS: "AI-powered security analysis and vulnerability assessment tools"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation is now handled by the Layout component */}
      
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

        {/* Tab Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Security Functions</h3>
          <Tabs defaultValue="OVERVIEW" className="w-full">
            <TabsList variant="security" className="w-full">
              <TabsTrigger value="OVERVIEW" variant="security" icon={<Shield className="w-4 h-4" />}>
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger value="MONITORING" variant="security" icon={<Eye className="w-4 h-4" />}>
                MONITORING
              </TabsTrigger>
              <TabsTrigger value="RESPONSE" variant="security" icon={<Zap className="w-4 h-4" />}>
                RESPONSE
              </TabsTrigger>
              <TabsTrigger value="ANALYSIS" variant="security" icon={<Brain className="w-4 h-4" />}>
                ANALYSIS
              </TabsTrigger>
            </TabsList>
            
            <TabDescription variant="security" descriptions={tabDescriptions} />
            
            {/* Connection Line */}
            <TabConnectionLine variant="security" />
            
            {/* Overview Tab */}
            <TabsContent value="OVERVIEW" variant="security">
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
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="MONITORING" variant="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Monitoring</CardTitle>
                    <CardDescription>Real-time network activity and anomaly detection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Network Status: Normal</span>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span>Traffic Analysis: Monitoring</span>
                        </div>
                        <Badge variant="secondary">Analyzing</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <WebCrawlerAgent />
              </div>
            </TabsContent>

            {/* Response Tab */}
            <TabsContent value="RESPONSE" variant="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Incident Response</CardTitle>
                    <CardDescription>Active security incidents and response actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-yellow-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Suspicious Transaction Detected</h4>
                          <Badge variant="destructive">High Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Large value transfer detected from unknown address
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm">Investigate</Button>
                          <Button size="sm" variant="outline">Block Address</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <SeiMCPPlugin />
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="ANALYSIS" variant="security">
              <div className="space-y-6">
                <AIExploitSimulator />
                <GasOptimizationEngine />
                <AIDNReporter />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}