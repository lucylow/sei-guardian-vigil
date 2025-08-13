import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Link, Zap, CheckCircle, AlertTriangle, Code, Database, Network } from "lucide-react";

interface MCPConnection {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  protocol: string;
  endpoint: string;
  capabilities: string[];
}

interface MCPQuery {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  status: "success" | "pending" | "error";
  gasUsed?: number;
}

export function MCPIntegration() {
  const [connections, setConnections] = useState<MCPConnection[]>([
    {
      id: "1",
      name: "Sei RPC Provider",
      status: "connected",
      protocol: "sei-mcp",
      endpoint: "wss://sei-mcp.quicknode.com",
      capabilities: ["contract-queries", "balance-checks", "transaction-simulation"]
    },
    {
      id: "2", 
      name: "Cambrian Analytics",
      status: "connected",
      protocol: "http-mcp",
      endpoint: "https://api.cambrian.xyz/mcp",
      capabilities: ["market-data", "analytics", "historical-queries"]
    },
    {
      id: "3",
      name: "Hive Intelligence",
      status: "disconnected", 
      protocol: "grpc-mcp",
      endpoint: "grpc://api.hiveintel.io",
      capabilities: ["threat-detection", "pattern-matching", "exploit-analysis"]
    }
  ]);

  const [queryHistory, setQueryHistory] = useState<MCPQuery[]>([
    {
      id: "1",
      query: "What's the current balance of contract 0x123...abc?",
      response: "Current balance: 1,247.5 SEI across 3 addresses",
      timestamp: "2024-01-15 14:30:22",
      status: "success",
      gasUsed: 21000
    },
    {
      id: "2",
      query: "Analyze transaction patterns for the last 24 hours",
      response: "Detected 15 high-frequency trading patterns, 3 potential MEV opportunities",
      timestamp: "2024-01-15 14:25:18", 
      status: "success",
      gasUsed: 45000
    },
    {
      id: "3",
      query: "Check for vulnerabilities in recently deployed contracts",
      response: "Processing...",
      timestamp: "2024-01-15 14:35:10",
      status: "pending"
    }
  ]);

  const [newQuery, setNewQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("1");

  const handleSendQuery = () => {
    if (!newQuery.trim()) return;

    const query: MCPQuery = {
      id: Date.now().toString(),
      query: newQuery,
      response: "Processing...",
      timestamp: new Date().toLocaleString(),
      status: "pending"
    };

    setQueryHistory([query, ...queryHistory]);
    setNewQuery("");

    // Simulate response after 2 seconds
    setTimeout(() => {
      setQueryHistory(prev => prev.map(q => 
        q.id === query.id 
          ? { ...q, response: "Query processed successfully. Results available.", status: "success" as const, gasUsed: Math.floor(Math.random() * 50000) + 10000 }
          : q
      ));
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "disconnected": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Model Context Protocol (MCP)</h2>
          <p className="text-muted-foreground">Standardized blockchain access for AI agents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Link className="w-4 h-4 mr-2" />
            Add Connection
          </Button>
          <Button>
            <Code className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections">Active Connections</TabsTrigger>
          <TabsTrigger value="queries">Query Interface</TabsTrigger>
          <TabsTrigger value="examples">Example Queries</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="w-5 h-5 mr-2" />
                MCP Providers
              </CardTitle>
              <CardDescription>
                Manage connections to blockchain data providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <Card key={connection.id} className="border">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(connection.status)}
                          <div>
                            <h3 className="font-semibold">{connection.name}</h3>
                            <p className="text-sm text-muted-foreground">{connection.endpoint}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={connection.status === "connected" ? "default" : "secondary"}>
                            {connection.status}
                          </Badge>
                          <Badge variant="outline">{connection.protocol}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Capabilities:</p>
                        <div className="flex flex-wrap gap-2">
                          {connection.capabilities.map((capability, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          Test Connection
                        </Button>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Natural Language Query Interface
              </CardTitle>
              <CardDescription>
                Ask questions about blockchain data in natural language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask anything about the Sei blockchain... (e.g., 'What's the gas usage for contract 0x123?' or 'Show me the top DeFi protocols by TVL')"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Powered by {connections.find(c => c.id === selectedProvider)?.name || "MCP Provider"}
                  </div>
                  <Button onClick={handleSendQuery} disabled={!newQuery.trim()}>
                    <Zap className="w-4 h-4 mr-2" />
                    Send Query
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query History</CardTitle>
              <CardDescription>Recent queries and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {queryHistory.map((query) => (
                  <div key={query.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{query.query}</p>
                        <p className="text-sm text-muted-foreground">{query.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {query.gasUsed && (
                          <Badge variant="outline" className="text-xs">
                            {query.gasUsed.toLocaleString()} gas
                          </Badge>
                        )}
                        <Badge variant={query.status === "success" ? "default" : query.status === "pending" ? "secondary" : "destructive"}>
                          {query.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-muted rounded p-3">
                      <p className="text-sm">{query.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Example Queries</CardTitle>
              <CardDescription>Pre-built queries to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    category: "Contract Analysis",
                    queries: [
                      "What's the total value locked in contract 0x123...abc?",
                      "Show me all function calls to this contract in the last hour",
                      "Analyze the gas usage patterns for this DeFi protocol"
                    ]
                  },
                  {
                    category: "Security Monitoring", 
                    queries: [
                      "Check for any suspicious transactions in the last 24 hours",
                      "Identify contracts with potential reentrancy vulnerabilities",
                      "Monitor large token transfers above 10,000 SEI"
                    ]
                  },
                  {
                    category: "Market Analysis",
                    queries: [
                      "What's the current APY for the top 5 yield farming pools?",
                      "Show me arbitrage opportunities between DEXs",
                      "Track price impact for large trades on Sei DEXs"
                    ]
                  }
                ].map((category, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.queries.map((query, queryIndex) => (
                          <div key={queryIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                            <p className="text-sm">{query}</p>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setNewQuery(query)}
                            >
                              Use
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Queries Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+23% from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245ms</div>
                <p className="text-xs text-muted-foreground">Within SLA target</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">Excellent reliability</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gas Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15%</div>
                <p className="text-xs text-muted-foreground">Savings vs direct calls</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              MCP is operating within optimal parameters. All providers are responding normally with sub-400ms latency.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}