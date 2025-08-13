import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Eye,
  Bot,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

export function AIDNReporter() {
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const sampleReport = {
    contract: {
      name: "Yei Finance Swap",
      address: "sei14ja2a...xqy3",
      deployer: "sei1k82a...9djs"
    },
    executiveSummary: "The Yei Finance Swap contract contains 1 critical and 1 high severity vulnerability. The critical reentrancy vulnerability could allow fund theft, particularly dangerous given Sei's parallel execution environment. The front-running risk could lead to user losses exacerbated by Sei's 400ms finality. Immediate remediation is required.",
    riskOverview: {
      totalVulnerabilities: 8,
      criticalCount: 1,
      highCount: 2,
      mediumCount: 3,
      lowCount: 2,
      securityPosture: "High Risk",
      riskScore: 7.5
    },
    findings: [
      {
        severity: "Critical",
        title: "Reentrancy Vulnerability",
        description: "External call to user address before state changes in swap function",
        impact: "Funds theft possible - up to $500K at risk",
        location: "Swap.sol:42",
        seiContext: "Sei's parallel execution could enable multi-slot reentrancy attacks impossible on sequential chains.",
        remediation: "Apply Checks-Effects-Interactions pattern before external calls"
      },
      {
        severity: "High", 
        title: "Front-Running Risk",
        description: "Transaction ordering dependency in price calculation",
        impact: "Financial loss for users through MEV extraction",
        location: "Oracle.sol:18",
        seiContext: "Sei's 400ms finality creates tighter time windows for front-running attacks.",
        remediation: "Implement commit-reveal scheme or batch processing"
      },
      {
        severity: "Medium",
        title: "Access Control Issue",
        description: "Missing owner validation in critical functions",
        impact: "Unauthorized configuration changes possible",
        location: "Config.sol:25",
        seiContext: "High-frequency operations on Sei amplify unauthorized access impact.",
        remediation: "Add proper access control modifiers"
      }
    ],
    aiInsights: [
      "Sei's parallel execution creates unique attack vectors not present on sequential chains",
      "400ms finality window allows sophisticated MEV strategies",
      "Gas optimization opportunities identified that could reduce costs by 23%",
      "Contract architecture shows patterns common in vulnerable DEX implementations"
    ]
  };

  const generateReport = async () => {
    setGenerating(true);
    // Simulate AI report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGenerating(false);
    setReportGenerated(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "default";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <Shield className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>AIDN Natural Language Reports</span>
          </CardTitle>
          <CardDescription>
            Generate comprehensive vulnerability reports in natural language for stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Contract Analysis Status</p>
              <p className="text-sm text-muted-foreground">
                {reportGenerated ? "Report generated successfully" : "Ready to analyze smart contract"}
              </p>
            </div>
            <Button 
              onClick={generateReport} 
              disabled={generating}
              className="flex items-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {reportGenerated && (
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="findings">Detailed Findings</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            {/* Risk Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Overall security posture analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{sampleReport.riskOverview.criticalCount}</div>
                    <div className="text-sm text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{sampleReport.riskOverview.highCount}</div>
                    <div className="text-sm text-muted-foreground">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{sampleReport.riskOverview.mediumCount}</div>
                    <div className="text-sm text-muted-foreground">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{sampleReport.riskOverview.lowCount}</div>
                    <div className="text-sm text-muted-foreground">Low</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Security Posture</span>
                    <Badge variant="secondary">{sampleReport.riskOverview.securityPosture}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Score</span>
                      <span className="font-medium">{sampleReport.riskOverview.riskScore}/10</span>
                    </div>
                    <Progress value={sampleReport.riskOverview.riskScore * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>AI-generated summary for stakeholders</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Contract:</strong> {sampleReport.contract.name} ({sampleReport.contract.address})
                  </AlertDescription>
                </Alert>
                <p className="text-sm leading-relaxed">{sampleReport.executiveSummary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="findings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Findings</CardTitle>
                <CardDescription>Detailed technical analysis with Sei-specific context</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {sampleReport.findings.map((finding, index) => (
                      <Card key={index} className="border-l-4 border-l-destructive">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getSeverityIcon(finding.severity)}
                              <CardTitle className="text-lg">{finding.title}</CardTitle>
                            </div>
                            <Badge variant={getSeverityColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{finding.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-1">Potential Impact</h4>
                            <p className="text-sm text-muted-foreground">{finding.impact}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-1">Location</h4>
                            <code className="text-sm bg-muted px-2 py-1 rounded">{finding.location}</code>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-1 flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>Sei-Specific Risk</span>
                            </h4>
                            <p className="text-sm text-muted-foreground">{finding.seiContext}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-1">Remediation</h4>
                            <p className="text-sm text-muted-foreground">{finding.remediation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
                <CardDescription>Advanced analysis and recommendations from AIDN</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleReport.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download reports in various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center space-x-2 h-16">
                    <FileText className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">PDF Report</div>
                      <div className="text-sm text-muted-foreground">Executive summary + findings</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2 h-16">
                    <Download className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Technical Report</div>
                      <div className="text-sm text-muted-foreground">Detailed JSON export</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2 h-16">
                    <Eye className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Stakeholder Brief</div>
                      <div className="text-sm text-muted-foreground">Non-technical summary</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2 h-16">
                    <Bot className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">AIDN Integration</div>
                      <div className="text-sm text-muted-foreground">API export format</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}