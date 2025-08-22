import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Download, BookOpen, Zap, Shield, Users } from "lucide-react";

const DeveloperSDK: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'javascript' | 'python'>('typescript');

  const codeExamples = {
    typescript: `// Install the SDK
npm install @sei-sentinel/sdk

// Initialize the client
import { SeiSentinelSDK } from '@sei-sentinel/sdk';

const sentinel = new SeiSentinelSDK({
  network: 'sei-mainnet',
  apiKey: 'your-api-key'
});

// Submit a contract for security audit
const scanResult = await sentinel.submitContractForAudit(
  contractCode,
  contractAddress
);

// Get real-time security alerts
sentinel.onSecurityAlert((alert) => {
  console.log('Security Alert:', alert);
  // Handle the alert (e.g., pause contract, notify users)
});

// Register your own security agent
const agent = await sentinel.registerAgent({
  name: 'MySecurityAgent',
  capabilities: ['reentrancy-detection', 'access-control'],
  walletAddress: 'sei1...'
});`,
    
    javascript: `// Install the SDK
npm install @sei-sentinel/sdk

// Initialize the client
const { SeiSentinelSDK } = require('@sei-sentinel/sdk');

const sentinel = new SeiSentinelSDK({
  network: 'sei-mainnet',
  apiKey: 'your-api-key'
});

// Submit a contract for security audit
const scanResult = await sentinel.submitContractForAudit(
  contractCode,
  contractAddress
);

// Get real-time security alerts
sentinel.onSecurityAlert((alert) => {
  console.log('Security Alert:', alert);
  // Handle the alert (e.g., pause contract, notify users)
});

// Register your own security agent
const agent = await sentinel.registerAgent({
  name: 'MySecurityAgent',
  capabilities: ['reentrancy-detection', 'access-control'],
  walletAddress: 'sei1...'
});`,
    
    python: `# Install the SDK
pip install sei-sentinel-sdk

# Initialize the client
from sei_sentinel_sdk import SeiSentinelSDK

sentinel = SeiSentinelSDK(
    network='sei-mainnet',
    api_key='your-api-key'
)

# Submit a contract for security audit
scan_result = sentinel.submit_contract_for_audit(
    contract_code,
    contract_address
)

# Get real-time security alerts
@sentinel.on_security_alert
def handle_security_alert(alert):
    print(f'Security Alert: {alert}')
    # Handle the alert (e.g., pause contract, notify users)

# Register your own security agent
agent = sentinel.register_agent({
    'name': 'MySecurityAgent',
    'capabilities': ['reentrancy-detection', 'access-control'],
    'wallet_address': 'sei1...'
})`
  };

  const features = [
    {
      title: "Contract Security Scanning",
      description: "Automatically scan smart contracts for vulnerabilities using AI-powered analysis",
      icon: Shield,
      color: "text-blue-600"
    },
    {
      title: "Real-time Threat Monitoring",
      description: "Get instant alerts when security threats are detected on your contracts",
      icon: Zap,
      color: "text-green-600"
    },
    {
      title: "Agent Integration",
      description: "Deploy your own security agents to participate in the SEI Sentinel ecosystem",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Audit Trail",
      description: "Maintain immutable records of all security actions and decisions",
      icon: BookOpen,
      color: "text-orange-600"
    }
  ];

  const integrationSteps = [
    {
      step: 1,
      title: "Install SDK",
      description: "Add the SEI Sentinel SDK to your project",
      code: "npm install @sei-sentinel/sdk"
    },
    {
      step: 2,
      title: "Initialize Client",
      description: "Set up the client with your network and API credentials",
      code: "const sentinel = new SeiSentinelSDK({ network: 'sei-mainnet' })"
    },
    {
      step: 3,
      title: "Submit Contracts",
      description: "Send your smart contracts for automated security analysis",
      code: "await sentinel.submitContractForAudit(contractCode)"
    },
    {
      step: 4,
      title: "Handle Alerts",
      description: "Implement real-time security alert handling",
      code: "sentinel.onSecurityAlert(handleAlert)"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Developer SDK</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Integrate SEI Sentinel's security capabilities into your Sei applications. 
          Protect your smart contracts with AI-powered security scanning and real-time threat detection.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="default" className="text-sm">TypeScript</Badge>
          <Badge variant="secondary" className="text-sm">JavaScript</Badge>
          <Badge variant="outline" className="text-sm">Python</Badge>
          <Badge variant="outline" className="text-sm">Rust</Badge>
          <Badge variant="outline" className="text-sm">Go</Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Quick Start Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedLanguage} className="mt-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{codeExamples[selectedLanguage]}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {integrationSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <code className="text-sm text-gray-800">{step.code}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Why Use SEI Sentinel SDK?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Zero Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Get started in minutes with pre-configured security agents
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Real-time Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Instant threat detection and automated response capabilities
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Cost Effective</h4>
                <p className="text-sm text-muted-foreground">
                  Leverage Sei's low transaction costs for security operations
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Community Driven</h4>
                <p className="text-sm text-muted-foreground">
                  Benefit from collective security intelligence and agent improvements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Fast Finality (0.5s)</h4>
                <p className="text-sm text-muted-foreground">
                  Near-instant security responses enabled by Sei's fast finality
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">High Throughput</h4>
                <p className="text-sm text-muted-foreground">
                  20,000 TPS supports massive scale security monitoring
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Parallel Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple security agents operate simultaneously
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Low Cost</h4>
                <p className="text-sm text-muted-foreground">
                  500x cheaper than Ethereum for security operations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Secure Your Smart Contracts?</h3>
          <p className="text-muted-foreground mb-6">
            Join hundreds of developers already using SEI Sentinel to protect their applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download SDK
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              View Documentation
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              GitHub Repository
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperSDK;
