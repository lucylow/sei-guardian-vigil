import { Navigation } from "@/components/Navigation";
import { AgentStatusPanel } from "@/components/AgentStatusPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Shield, Search, MessageSquare, Eye, Zap, Database, CheckCircle } from "lucide-react";

export default function Agents() {
  const agents = [
    { id: 1, name: "Orchestrator", status: "active", tasks: 12, icon: Brain, description: "Coordinates all agent activities" },
    { id: 2, name: "Security Analyst", status: "active", tasks: 8, icon: Shield, description: "Performs vulnerability analysis" },
    { id: 3, name: "Web Crawler", status: "active", tasks: 24, icon: Search, description: "Gathers external threat data" },
    { id: 4, name: "Chatbot", status: "idle", tasks: 0, icon: MessageSquare, description: "Handles user interactions" },
    { id: 5, name: "Monitor", status: "active", tasks: 15, icon: Eye, description: "Watches contract deployments" },
    { id: 6, name: "Fix Generator", status: "busy", tasks: 3, icon: Zap, description: "Creates vulnerability patches" },
    { id: 7, name: "RAG Agent", status: "active", tasks: 7, icon: Database, description: "Manages knowledge retrieval" },
    { id: 8, name: "Guardrail", status: "active", tasks: 2, icon: CheckCircle, description: "Ensures system safety" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "busy": return "secondary";
      case "idle": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agent Management</h1>
          <p className="text-muted-foreground">Monitor and control multi-agent system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">71</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Load</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">Optimal performance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">24h availability</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Tasks:</span>
                      <span className="font-medium">{agent.tasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Memory Usage:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 40 + 30)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CPU Usage:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 50 + 20)}%</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Activity className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <AgentStatusPanel />
        </div>
      </div>
    </div>
  );
}