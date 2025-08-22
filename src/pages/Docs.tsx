import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Code, 
  Download, 
  ExternalLink, 
  FileText, 
  Github, 
  Globe, 
  Play,
  Shield,
  Zap,
  Users,
  Rocket,
  Terminal,
  Database,
  Network,
  Cpu
} from "lucide-react";

export default function Docs() {
  const quickStartSteps = [
    {
      step: 1,
      title: "Install Dependencies",
      description: "Install the required packages for your project",
      code: "npm install @sei-guardian-vigil/sdk",
      language: "bash"
    },
    {
      step: 2,
      title: "Initialize SDK",
      description: "Create an instance of the SeiAgentSDK",
      code: `import { SeiAgentSDK } from '@sei-guardian-vigil/sdk';

const sdk = new SeiAgentSDK('https://rpc.sei.io');`,
      language: "typescript"
    },
    {
      step: 3,
      title: "Register Agent",
      description: "Register your AI agent on the Sei Network",
      code: `const agentAddress = await sdk.registerAgent(
  'MySecurityAgent',
  'ipfs://QmMyAgentMetadata',
  '0xYourWalletAddress'
);`,
      language: "typescript"
    },
    {
      step: 4,
      title: "Submit Audit",
      description: "Submit a contract for security audit",
      code: `const auditId = await sdk.submitContractForAudit(
  agentAddress,
  '0xContractAddress',
  'high'
);`,
      language: "typescript"
    }
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/agents/register",
      description: "Register a new AI agent",
      parameters: ["name", "description", "capabilities", "metadataURI"]
    },
    {
      method: "POST",
      endpoint: "/api/audits/submit",
      description: "Submit contract for audit",
      parameters: ["agentId", "contractAddress", "priority"]
    },
    {
      method: "GET",
      endpoint: "/api/audits/{auditId}",
      description: "Get audit results",
      parameters: ["auditId"]
    },
    {
      method: "GET",
      endpoint: "/api/network/metrics",
      description: "Get Sei Network metrics",
      parameters: []
    },
    {
      method: "GET",
      endpoint: "/api/agents/discover",
      description: "Discover active agents",
      parameters: []
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "AI-Powered Security",
      description: "Advanced vulnerability detection using machine learning algorithms",
      benefits: ["Real-time threat detection", "Automated response", "Continuous monitoring"]
    },
    {
      icon: Zap,
      title: "Parallel Execution",
      description: "Leverage Sei's parallelized EVM for simultaneous contract audits",
      benefits: ["Massive scalability", "Faster processing", "Cost efficiency"]
    },
    {
      icon: Network,
      title: "Fast Finality",
      description: "400ms finality enables near-instant security operations",
      benefits: ["Quick response times", "Real-time updates", "Enhanced user experience"]
    },
    {
      icon: Users,
      title: "Agent Coordination",
      description: "Multi-agent systems working together for comprehensive security",
      benefits: ["Collaborative analysis", "Specialized expertise", "Redundancy"]
    }
  ];

  const integrations = [
    {
      name: "LangChain",
      description: "Integrate with LangChain for advanced AI workflows",
      icon: Code,
      link: "https://langchain.com/",
      examples: ["Agent chains", "Memory systems", "Tool integration"]
    },
    {
      name: "CrewAI",
      description: "Build autonomous AI crews for complex security tasks",
      icon: Users,
      link: "https://crewai.com/",
      examples: ["Role-based agents", "Task delegation", "Collaborative workflows"]
    },
    {
      name: "Auto-GPT",
      description: "Create autonomous agents with goal-oriented behavior",
      icon: Rocket,
      link: "https://github.com/Significant-Gravitas/Auto-GPT",
      examples: ["Goal setting", "Autonomous execution", "Learning capabilities"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold">SEI Guardian Vigil Documentation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guide to building AI agents on Sei Network. Learn how to leverage 
          parallelized EVM, fast finality, and native order matching for next-generation security.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button asChild>
            <a href="https://github.com/sei-network" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/demo" className="flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Try Demo
            </a>
          </Button>
        </div>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-green-600" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get up and running with SEI Guardian Vigil in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quickStartSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <div className="bg-muted p-3 rounded-lg">
                    <code className="text-sm">{step.code}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <feature.icon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-600" />
            API Reference
          </CardTitle>
          <CardDescription>
            Complete API documentation for integrating with SEI Guardian Vigil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="endpoints" className="space-y-4">
              <div className="space-y-3">
                {apiEndpoints.map((endpoint) => (
                  <div key={endpoint.endpoint} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.parameters.map((param) => (
                        <Badge key={param} variant="outline" className="text-xs">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">TypeScript SDK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`import { SeiAgentSDK } from '@sei-guardian-vigil/sdk';

const sdk = new SeiAgentSDK('https://rpc.sei.io');
const metrics = await sdk.getSeiNetworkMetrics();
console.log('Current TPS:', metrics.currentTPS);`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Python SDK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`from sei_guardian_vigil import SeiAgentSDK

sdk = SeiAgentSDK('https://rpc.sei.io')
metrics = await sdk.get_network_metrics()
print(f"Current TPS: {metrics['current_tps']}")`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" />
            Integrations & Frameworks
          </CardTitle>
          <CardDescription>
            Connect SEI Guardian Vigil with popular AI frameworks and tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.name} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <integration.icon className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Examples:</h4>
                      <ul className="space-y-1">
                        {integration.examples.map((example) => (
                          <li key={example} className="text-xs text-muted-foreground flex items-center space-x-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={integration.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Learn More
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            Explore more resources to master SEI Guardian Vigil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Documentation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/demo" className="text-blue-600 hover:underline flex items-center">
                    <Play className="w-3 h-3 mr-2" />
                    Interactive Demo
                  </a>
                </li>
                <li>
                  <a href="https://github.com/sei-network" className="text-blue-600 hover:underline flex items-center">
                    <Github className="w-3 h-3 mr-2" />
                    Source Code
                  </a>
                </li>
                <li>
                  <a href="https://sei.io" className="text-blue-600 hover:underline flex items-center">
                    <Globe className="w-3 h-3 mr-2" />
                    Sei Network
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://discord.gg/sei" className="text-blue-600 hover:underline">
                    Discord Community
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/SeiNetwork" className="text-blue-600 hover:underline">
                    Twitter Updates
                  </a>
                </li>
                <li>
                  <a href="https://forum.sei.io" className="text-blue-600 hover:underline">
                    Developer Forum
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
