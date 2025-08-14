import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Code, Zap, Network, MessageSquare, Shield, Activity, Play, Square, Settings, Upload, Download } from "lucide-react";

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  seiOptimized: boolean;
  gasEfficiency: number;
}

interface DeployedAgent {
  id: string;
  name: string;
  status: "active" | "idle" | "training" | "error";
  performance: number;
  gasUsed: number;
  tasksCompleted: number;
}

export function AgentDevelopmentStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [deployedAgents, setDeployedAgents] = useState<DeployedAgent[]>([
    {
      id: "1",
      name: "DeFi Arbitrage Agent",
      status: "active",
      performance: 98.5,
      gasUsed: 125000,
      tasksCompleted: 247
    },
    {
      id: "2", 
      name: "Security Audit Agent",
      status: "idle",
      performance: 95.2,
      gasUsed: 89000,
      tasksCompleted: 156
    }
  ]);

  const agentTemplates: AgentTemplate[] = [
    {
      id: "defi-arbitrage",
      name: "DeFi Arbitrage Agent",
      description: "High-frequency arbitrage trading across Sei DEXs with sub-400ms execution",
      category: "Trading",
      capabilities: ["Price monitoring", "Cross-DEX arbitrage", "MEV protection", "Parallel execution"],
      seiOptimized: true,
      gasEfficiency: 95
    },
    {
      id: "security-scanner",
      name: "Smart Contract Security Agent",
      description: "Automated vulnerability detection and fix generation for Sei contracts",
      category: "Security",
      capabilities: ["Static analysis", "Dynamic testing", "AI fix generation", "Formal verification"],
      seiOptimized: true,
      gasEfficiency: 88
    },
    {
      id: "portfolio-manager",
      name: "AI Portfolio Manager",
      description: "Autonomous portfolio optimization with risk management",
      category: "Finance",
      capabilities: ["Risk assessment", "Rebalancing", "Yield optimization", "Diversification"],
      seiOptimized: true,
      gasEfficiency: 92
    },
    {
      id: "data-aggregator",
      name: "Cross-Chain Data Agent",
      description: "Real-time data aggregation from multiple blockchain sources",
      category: "Data",
      capabilities: ["Multi-chain queries", "Data validation", "Oracle feeds", "Analytics"],
      seiOptimized: false,
      gasEfficiency: 76
    }
  ];

  const handleDeploy = (templateId: string) => {
    const template = agentTemplates.find(t => t.id === templateId);
    if (template) {
      const newAgent: DeployedAgent = {
        id: Date.now().toString(),
        name: template.name,
        status: "training",
        performance: 0,
        gasUsed: 0,
        tasksCompleted: 0
      };
      setDeployedAgents([...deployedAgents, newAgent]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Agent Development Studio</h2>
          <p className="text-muted-foreground">Build, deploy, and manage AI agents on Sei Network</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Agent
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Create New Agent
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Agent Templates</TabsTrigger>
          <TabsTrigger value="deployed">Deployed Agents</TabsTrigger>
          <TabsTrigger value="marketplace">Agent Marketplace</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Pre-built Agent Templates
              </CardTitle>
              <CardDescription>
                Sei-optimized agent templates for rapid deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex space-x-1">
                          {template.seiOptimized && (
                            <Badge variant="default" className="text-xs">
                              Sei Optimized
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {template.gasEfficiency}% Efficient
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {template.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Capabilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.capabilities.map((capability, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeploy(template.id);
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Deploy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-1" />
                          Customize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Deployed Agents
              </CardTitle>
              <CardDescription>
                Monitor and manage your active AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deployedAgents.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No agents deployed yet</p>
                  <Button className="mt-4">Deploy Your First Agent</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {deployedAgents.map((agent) => (
                    <Card key={agent.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              agent.status === 'active' ? 'bg-green-500' :
                              agent.status === 'training' ? 'bg-yellow-500' :
                              agent.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                            }`} />
                            <h3 className="font-semibold">{agent.name}</h3>
                            <Badge variant="outline">{agent.status}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Square className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Performance</p>
                            <p className="font-medium">{agent.performance}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gas Used</p>
                            <p className="font-medium">{agent.gasUsed.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tasks Completed</p>
                            <p className="font-medium">{agent.tasksCompleted}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Agent Marketplace (AIDN)
              </CardTitle>
              <CardDescription>
                Discover and hire specialized AI agents from the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="data">Data Processing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Search agents..." className="flex-1" />
                  <Button>Search</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "MEV Protection Agent",
                      owner: "0x123...abc",
                      rating: 4.9,
                      price: "0.01 SEI/task",
                      tasks: 1247
                    },
                    {
                      name: "Cross-Chain Bridge Monitor", 
                      owner: "0x456...def",
                      rating: 4.7,
                      price: "0.005 SEI/hour",
                      tasks: 892
                    },
                    {
                      name: "Yield Farming Optimizer",
                      owner: "0x789...ghi", 
                      rating: 4.8,
                      price: "0.02 SEI/trade",
                      tasks: 2156
                    }
                  ].map((agent, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">by {agent.owner}</p>
                          <Badge variant="outline">★ {agent.rating}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">{agent.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tasks Completed:</span>
                            <span className="font-medium">{agent.tasks}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          <Zap className="w-4 h-4 mr-2" />
                          Hire Agent
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% improvement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gas Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Above target</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247 SEI</div>
                <p className="text-xs text-muted-foreground">+23% this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Metrics</CardTitle>
              <CardDescription>Real-time performance data for your AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Performance charts will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}