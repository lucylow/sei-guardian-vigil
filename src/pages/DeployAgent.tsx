import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Rocket, TestTube, Globe, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function DeployAgent() {
  const [deploymentConfig, setDeploymentConfig] = useState({
    agentName: "",
    agentType: "",
    targetNetwork: "testnet",
    gasLimit: "300000",
    autoVerify: true
  });
  const [deploymentStatus, setDeploymentStatus] = useState("idle");
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deployedAgents, setDeployedAgents] = useState([
    {
      id: 1,
      name: "Security Monitor Alpha",
      network: "testnet",
      address: "sei1abc...xyz",
      status: "active",
      deployedAt: "2024-01-15 14:30"
    }
  ]);

  const agentTypes = [
    { value: "security-monitor", label: "Security Monitor", description: "Monitors contracts for vulnerabilities" },
    { value: "price-alert", label: "Price Alert", description: "Alerts on price movements" },
    { value: "transaction-monitor", label: "Transaction Monitor", description: "Tracks specific transactions" },
    { value: "governance-bot", label: "Governance Bot", description: "Automates governance actions" }
  ];

  const handleDeploy = async (network) => {
    setDeploymentStatus("deploying");
    setDeploymentProgress(0);
    
    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDeploymentStatus("completed");
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate deployment completion
    setTimeout(() => {
      clearInterval(interval);
      setDeploymentProgress(100);
      setDeploymentStatus("completed");
      
      // Add to deployed agents
      const newAgent = {
        id: Date.now(),
        name: deploymentConfig.agentName || "Unnamed Agent",
        network: network,
        address: `sei1${Math.random().toString(36).substr(2, 9)}...`,
        status: "active",
        deployedAt: new Date().toLocaleString()
      };
      setDeployedAgents(prev => [newAgent, ...prev]);
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
            <Rocket className="w-10 h-10 mr-3 text-blue-500" />
            Deploy Agent
          </h1>
          <p className="text-muted-foreground">Deploy your smart contract agents to Sei Network</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deployment Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>Configure your agent before deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    placeholder="Enter agent name"
                    value={deploymentConfig.agentName}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, agentName: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="agentType">Agent Type</Label>
                  <Select
                    value={deploymentConfig.agentType}
                    onValueChange={(value) => setDeploymentConfig(prev => ({ ...prev, agentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetNetwork">Target Network</Label>
                  <Select
                    value={deploymentConfig.targetNetwork}
                    onValueChange={(value) => setDeploymentConfig(prev => ({ ...prev, targetNetwork: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testnet">
                        <div className="flex items-center space-x-2">
                          <TestTube className="w-4 h-4 text-yellow-500" />
                          <span>Testnet (Recommended for testing)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="mainnet">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-green-500" />
                          <span>Mainnet (Production deployment)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gasLimit">Gas Limit</Label>
                  <Input
                    id="gasLimit"
                    type="number"
                    placeholder="300000"
                    value={deploymentConfig.gasLimit}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, gasLimit: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Deploy Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Deploy</CardTitle>
                <CardDescription>Deploy to specific networks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleDeploy("testnet")}
                  disabled={deploymentStatus === "deploying"}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Deploy to Testnet
                </Button>
                <Button
                  onClick={() => handleDeploy("mainnet")}
                  disabled={deploymentStatus === "deploying"}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Deploy to Mainnet
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Deployment Status & History */}
          <div className="space-y-6">
            {/* Current Deployment Status */}
            {deploymentStatus !== "idle" && (
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{deploymentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${deploymentProgress}%` }}
                      />
                    </div>
                    <div className="text-center">
                      {deploymentStatus === "deploying" && (
                        <div className="flex items-center justify-center space-x-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Deploying to {deploymentConfig.targetNetwork}...</span>
                        </div>
                      )}
                      {deploymentStatus === "completed" && (
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Deployment completed successfully!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deployed Agents */}
            <Card>
              <CardHeader>
                <CardTitle>Deployed Agents</CardTitle>
                <CardDescription>Your active agents on the network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deployedAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(agent.status)}
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.address}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {agent.network}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
