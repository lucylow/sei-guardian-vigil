import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Terminal, 
  Api, 
  Download, 
  Play, 
  Copy,
  CheckCircle,
  ExternalLink,
  Github,
  Package,
  Zap,
  Shield,
  Bot
} from 'lucide-react';

interface CodeSnippet {
  language: string;
  title: string;
  description: string;
  code: string;
  output?: string;
}

export const DeveloperTooling: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [contractCode, setContractCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const codeSnippets: CodeSnippet[] = [
    {
      language: 'typescript',
      title: 'Agent SDK - Basic Usage',
      description: 'Initialize and use the SEI Guardian Vigil Agent SDK',
      code: `import { SeiGuardianSDK } from '@sei-guardian/sdk';

const sdk = new SeiGuardianSDK({
  apiKey: 'your-api-key',
  network: 'sei-mainnet',
  agentType: 'security'
});

// Submit contract for audit
const auditResult = await sdk.submitContractForAudit({
  contractCode: contractSource,
  contractAddress: '0x...',
  priority: 'high'
});

console.log('Vulnerabilities found:', auditResult.vulnerabilities);`
    },
    {
      language: 'typescript',
      title: 'Custom Agent Registration',
      description: 'Register your own AI security agent with the platform',
      code: `// Register custom agent
const agentConfig = {
  name: 'MyCustomSecurityAgent',
  description: 'Advanced reentrancy detection',
  capabilities: ['reentrancy', 'overflow', 'access-control'],
  endpoint: 'https://my-agent.com/webhook',
  apiKey: 'agent-secret-key'
};

const registeredAgent = await sdk.registerAgent(agentConfig);

// Deploy agent to Sei network
const deployment = await sdk.deployAgent(registeredAgent.id, {
  gasLimit: 500000,
  priority: 'high'
});

console.log('Agent deployed:', deployment.txHash);`
    },
    {
      language: 'typescript',
      title: 'LangChain Integration',
      description: 'Integrate with LangChain for AI-powered security analysis',
      code: `import { OpenAI } from 'langchain/llms';
import { SeiGuardianAgent } from '@sei-guardian/langchain';

const llm = new OpenAI({ temperature: 0 });
const agent = new SeiGuardianAgent({
  llm,
  tools: ['contract-audit', 'vulnerability-scan', 'threat-detection'],
  seichain: seiChain
});

// Run security analysis
const result = await agent.run(\`
  Analyze this smart contract for security vulnerabilities:
  \${contractCode}
\`);

console.log('AI Analysis:', result.output);`
    },
    {
      language: 'bash',
      title: 'CLI Tool - Agent Management',
      description: 'Command-line interface for managing agents and contracts',
      code: `# Install CLI tool
npm install -g @sei-guardian/cli

# Authenticate with your API key
sei-guardian auth --api-key YOUR_API_KEY

# Deploy a new agent
sei-guardian agent deploy --config agent-config.json

# Submit contract for audit
sei-guardian audit submit --contract ./contracts/MyContract.sol

# Get audit results
sei-guardian audit results --contract-id CONTRACT_ID

# Monitor agent performance
sei-guardian agent monitor --agent-id AGENT_ID

# View network statistics
sei-guardian network stats`
    },
    {
      language: 'json',
      title: 'Agent Configuration',
      description: 'JSON configuration for deploying custom agents',
      code: `{
  "name": "AdvancedSecurityAgent",
  "version": "1.0.0",
  "description": "Multi-layer security analysis agent",
  "capabilities": [
    "static-analysis",
    "dynamic-testing",
    "formal-verification",
    "threat-modeling"
  ],
  "endpoints": {
    "webhook": "https://my-agent.com/sei-webhook",
    "health": "https://my-agent.com/health",
    "metrics": "https://my-agent.com/metrics"
  },
  "seichain": {
    "network": "sei-mainnet",
    "gasLimit": 1000000,
    "priority": "high"
  },
  "ai": {
    "model": "gpt-4",
    "temperature": 0.1,
    "maxTokens": 4000
  }
}`
    },
    {
      language: 'typescript',
      title: 'Real-time Monitoring',
      description: 'Subscribe to real-time security events and agent activities',
      code: `// Subscribe to real-time events
const eventStream = sdk.subscribeToEvents({
  eventTypes: ['vulnerability-detected', 'agent-action', 'threat-alert'],
  contractAddress: '0x...',
  callback: (event) => {
    console.log('Security Event:', event);
    
    if (event.type === 'vulnerability-detected') {
      // Take immediate action
      sdk.triggerEmergencyResponse(event.contractAddress, {
        action: 'pause-contract',
        reason: event.description,
        severity: event.severity
      });
    }
  }
});

// Monitor agent performance
const performanceStream = sdk.monitorAgentPerformance({
  agentId: 'my-agent-id',
  metrics: ['scan-time', 'vulnerabilities-found', 'false-positives'],
  interval: 5000
});`
    }
  ];

  const copyToClipboard = async (code: string, snippetTitle: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSnippet(snippetTitle);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const simulateContractScan = async () => {
    if (!contractCode.trim()) return;
    
    setIsScanning(true);
    // Simulate API call delay
    setTimeout(() => {
      setScanResult({
        status: 'completed',
        vulnerabilities: [
          {
            type: 'reentrancy',
            severity: 'critical',
            line: 45,
            description: 'Potential reentrancy attack vector detected'
          },
          {
            type: 'overflow',
            severity: 'high',
            line: 78,
            description: 'Integer overflow possible in calculation'
          }
        ],
        scanTime: 156,
        gasUsed: 45000,
        seiLatency: 142
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          🛠️ Developer Tooling & Infrastructure
        </h2>
        <p className="text-muted-foreground">
          Complete toolkit for building AI agents on Sei Network with SEI Guardian Vigil
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
            <Package className="w-12 h-12 text-blue-500" />
            <h3 className="text-lg font-semibold text-center">Install SDK</h3>
            <p className="text-sm text-muted-foreground text-center">
              Get started with our TypeScript/JavaScript SDK
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              npm install @sei-guardian/sdk
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
            <Terminal className="w-12 h-12 text-green-500" />
            <h3 className="text-lg font-semibold text-center">CLI Tool</h3>
            <p className="text-sm text-muted-foreground text-center">
              Command-line interface for agent management
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              npm install -g @sei-guardian/cli
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
            <Github className="w-12 h-12 text-purple-500" />
            <h3 className="text-lg font-semibold text-center">Templates</h3>
            <p className="text-sm text-muted-foreground text-center">
              Pre-built agent templates and examples
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Templates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Play className="w-5 h-5" />
            🚀 Interactive Contract Scanner Demo
          </CardTitle>
          <CardDescription>
            Test the SEI Guardian Vigil security scanning capabilities in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Contract Code</label>
              <Textarea
                placeholder="Paste your smart contract code here..."
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={simulateContractScan} 
              disabled={!contractCode.trim() || isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scanning Contract...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Scan for Vulnerabilities
                </>
              )}
            </Button>

            {scanResult && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Scan Results</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {scanResult.scanTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Scan Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {scanResult.vulnerabilities.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {scanResult.gasUsed.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Gas Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {scanResult.seiLatency}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Sei Latency</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {scanResult.vulnerabilities.map((vuln: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-background rounded border">
                      <Badge variant={vuln.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {vuln.severity}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{vuln.type}</div>
                        <div className="text-sm text-muted-foreground">{vuln.description}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">Line {vuln.line}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Code Examples Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            📚 Code Examples & Integration
          </CardTitle>
          <CardDescription>
            Complete examples for integrating with SEI Guardian Vigil platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sdk" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sdk">SDK</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="cli">CLI</TabsTrigger>
              <TabsTrigger value="ai">AI Integration</TabsTrigger>
            </TabsList>

            {codeSnippets.map((snippet, index) => (
              <TabsContent key={index} value={snippet.language === 'typescript' ? 'sdk' : 
                snippet.language === 'bash' ? 'cli' : 'api'} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{snippet.title}</h4>
                      <p className="text-sm text-muted-foreground">{snippet.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(snippet.code, snippet.title)}
                    >
                      {copiedSnippet === snippet.title ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code className={`language-${snippet.language}`}>{snippet.code}</code>
                    </pre>
                  </div>

                  {snippet.output && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Output:</h5>
                      <pre className="text-sm text-green-700 dark:text-green-300">{snippet.output}</pre>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Frameworks */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Zap className="w-5 h-5" />
            🔌 AI Framework Integration
          </CardTitle>
          <CardDescription>
            Seamlessly integrate with popular AI development frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="font-semibold mb-2">LangChain</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Native integration with LangChain for AI-powered security analysis
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Integration
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-semibold mb-2">CrewAI</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Multi-agent orchestration with CrewAI for complex security workflows
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Integration
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-semibold mb-2">Auto-GPT</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Autonomous agent development with Auto-GPT for Sei security
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Bot className="w-5 h-5" />
            📖 Documentation & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Github className="w-6 h-6" />
              <span>GitHub Repository</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <ExternalLink className="w-6 h-6" />
              <span>API Documentation</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Code className="w-6 h-6" />
              <span>Code Examples</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              <span>Security Guidelines</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
