import { Navigation } from "@/components/Navigation";
import { AuditQueuePanel } from "@/components/AuditQueuePanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileSearch, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function Audits() {
  const auditStats = [
    { label: "Total Audits", value: "1,247", icon: FileSearch, trend: "+12%" },
    { label: "Critical Issues", value: "23", icon: AlertTriangle, trend: "-8%" },
    { label: "Resolved", value: "1,198", icon: CheckCircle, trend: "+15%" },
    { label: "Pending", value: "26", icon: Clock, trend: "+3%" },
  ];

  const recentAudits = [
    {
      id: 1,
      contract: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      status: "completed",
      severity: "low",
      issues: 2,
      progress: 100,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      contract: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
      status: "in-progress",
      severity: "medium",
      issues: 5,
      progress: 68,
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      contract: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
      status: "failed",
      severity: "high",
      issues: 12,
      progress: 45,
      timestamp: "6 hours ago"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Audit Management</h1>
          <p className="text-muted-foreground">Smart contract security audits and vulnerability analysis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {auditStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.trend} from last month
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audit Queue */}
          <div className="space-y-6">
            <AuditQueuePanel />
          </div>

          {/* Recent Audits */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Results</CardTitle>
              <CardDescription>Latest completed and ongoing security audits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAudits.map((audit) => (
                <div key={audit.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {audit.contract.slice(0, 10)}...
                      </code>
                      <Badge variant={getStatusColor(audit.status)}>
                        {audit.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{audit.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span>Severity:</span>
                      <Badge variant={getSeverityColor(audit.severity)}>
                        {audit.severity}
                      </Badge>
                    </div>
                    <span>{audit.issues} issues found</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{audit.progress}%</span>
                    </div>
                    <Progress value={audit.progress} className="h-2" />
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}