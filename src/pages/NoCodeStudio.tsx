import React, { useState, useEffect } from "react";
/* Navigation is now handled by the Layout component */
import VisualAgentBuilder from "@/components/AgentBuilder/VisualAgentBuilder";
import { AgentDevelopmentStudio } from "@/components/AgentDevelopmentStudio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Play, Code, Zap, Rocket, Brain, Shield, TrendingUp, Wallet, ExternalLink } from "lucide-react";
import { seiTestnetService } from "@/services/seiTestnetService";
import { useToast } from "@/hooks/use-toast";

export default function NoCodeStudio() {
  const [activeTab, setActiveTab] = useState('get-started');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { toast } = useToast();

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isOnline = await seiTestnetService.checkBackendStatus();
        setBackendStatus(isOnline ? 'online' : 'offline');
        if (!isOnline) {
          toast({
            title: "Backend Offline",
            description: "Please start the backend server on port 4000 to deploy agents.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    
    // Check wallet connection status
    const walletStatus = seiTestnetService.getConnectionStatus();
    setIsWalletConnected(walletStatus.isConnected);
    setWalletAddress(walletStatus.address);
  }, [toast]);

  // Connect Keplr wallet
  const connectKeplrWallet = async () => {
    setIsConnectingWallet(true);
    try {
      const result = await seiTestnetService.connectKeplrWallet();
      setIsWalletConnected(result.isConnected);
      setWalletAddress(result.address);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${result.address.slice(0, 12)}...`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    seiTestnetService.disconnectWallet();
    setIsWalletConnected(false);
    setWalletAddress('');
    toast({
      title: "Wallet Disconnected",
      description: "Keplr wallet has been disconnected",
    });
  };

  // Deployment functions
  const deployToTestnet = async () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template first before deploying!",
        variant: "destructive",
      });
      return;
    }

    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Keplr wallet first!",
        variant: "destructive",
      });
      return;
    }

    if (backendStatus !== 'online') {
      toast({
        title: "Backend Offline",
        description: "Backend server must be running on port 4000 to deploy agents.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeploying(true);
    setDeploymentStatus('🚀 Connecting to SEI Testnet...');
    
    try {
      // Update status
      setDeploymentStatus('📝 Preparing agent configuration...');
      
      // Create agent configuration based on selected template
      const getAgentType = (template: string): 'SecurityAuditor' | 'ThreatResponder' | 'ComplianceGuard' | 'Custom' => {
        if (template === 'security-scanner') return 'SecurityAuditor';
        if (template === 'SecurityAuditor') return 'SecurityAuditor';
        if (template === 'ThreatResponder') return 'ThreatResponder';
        if (template === 'ComplianceGuard') return 'ComplianceGuard';
        return 'Custom';
      };

      const agentConfig = {
        name: `${selectedTemplate} Agent`,
        description: `AI security agent created from ${selectedTemplate} template`,
        agentType: getAgentType(selectedTemplate),
        configuration: {
          template: selectedTemplate,
          createdAt: new Date().toISOString(),
          network: 'sei-testnet',
          capabilities: getTemplateCapabilities(selectedTemplate),
        },
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedTemplate}`,
        ownerWalletAddress: walletAddress
      };

      setDeploymentStatus('🔗 Deploying to SEI Testnet blockchain...');
      
      // Deploy agent using SEI testnet service
      const result = await seiTestnetService.deployAgentToTestnet(agentConfig);
      
      if (result.success) {
        setDeploymentStatus(`✅ Successfully deployed to SEI Testnet!
Agent ID: ${result.agentId}
NFT Token: ${result.nftTokenId}
Transaction: ${result.seiTxHash}
Network: ${result.network}`);
        
        toast({
          title: "Agent Deployed Successfully!",
          description: `Your ${selectedTemplate} agent is now live on SEI testnet`,
        });

        // Store deployment info
        const deploymentInfo = {
          ...result,
          template: selectedTemplate,
        };
        
        localStorage.setItem('sei-agent-deployment', JSON.stringify(deploymentInfo));
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setDeploymentStatus(`❌ Deployment failed: ${errorMessage}`);
      
      toast({
        title: "Deployment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // Helper function to get template capabilities
  const getTemplateCapabilities = (template: string): string[] => {
    switch (template) {
      case 'SecurityAuditor':
        return ['vulnerability-scanning', 'code-analysis', 'security-reporting'];
      case 'ThreatResponder':
        return ['threat-detection', 'incident-response', 'automated-blocking'];
      case 'ComplianceGuard':
        return ['compliance-checking', 'regulatory-monitoring', 'audit-trails'];
      default:
        return ['general-monitoring', 'custom-logic'];
    }
  };

  const deployToMainnet = async () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template first before deploying!",
        variant: "destructive",
      });
      return;
    }

    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Keplr wallet first!",
        variant: "destructive",
      });
      return;
    }

    if (backendStatus !== 'online') {
      toast({
        title: "Backend Offline",
        description: "Backend server must be running on port 4000 to deploy agents.",
        variant: "destructive",
      });
      return;
    }

    // Show warning for mainnet deployment
    const confirmed = confirm(
      "⚠️ MAINNET DEPLOYMENT WARNING ⚠️\n\n" +
      "You are about to deploy to SEI mainnet with real tokens!\n" +
      "This action cannot be undone and will cost real SEI tokens.\n\n" +
      "Are you sure you want to continue?"
    );

    if (!confirmed) {
      return;
    }
    
    setIsDeploying(true);
    setDeploymentStatus('🚀 Preparing for SEI Mainnet deployment...');
    
    try {
      setDeploymentStatus('⚠️ MAINNET DEPLOYMENT - Using real SEI tokens!');
      
      // For now, show that mainnet deployment is not yet implemented
      // In production, you would change the service to use mainnet
      setDeploymentStatus(`⚠️ MAINNET DEPLOYMENT NOT YET IMPLEMENTED
      
This is a demo/testnet version. Mainnet deployment requires:
- Production-ready smart contracts
- Mainnet SEI tokens for gas fees
- Additional security audits

Please use testnet deployment for now.`);
      
      toast({
        title: "Mainnet Not Available",
        description: "Use testnet deployment for now. Mainnet coming soon!",
        variant: "destructive",
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setDeploymentStatus(`❌ Mainnet deployment failed: ${errorMessage}`);
      
      toast({
        title: "Deployment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation is now handled by the Layout component */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">No-Code Studio</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Build and deploy smart contract agents on Sei with drag-and-drop vibe coding
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setActiveTab('get-started')}
            >
              <Play className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setActiveTab('templates')}
            >
              <Code className="w-5 h-5 mr-2" />
              Browse Templates
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="get-started" className="flex items-center">
              <Rocket className="w-4 h-4 mr-2" />
              1. Get Started
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              2. Choose Template
            </TabsTrigger>
            <TabsTrigger value="build" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              3. Build Agent
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              4. Deploy & Test
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              5. Manage
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Get Started */}
          <TabsContent value="get-started" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Welcome to SEI No-Code Studio</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Create powerful AI agents for the Sei blockchain without writing a single line of code. 
                Follow our simple 5-step process to build, deploy, and manage your agents.
              </p>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Fast Development</h3>
                <p className="text-blue-700">
                  Build agents in minutes, not days. Our visual builder makes complex logic simple.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Sei Optimized</h3>
                <p className="text-purple-700">
                  Built specifically for Sei's sub-400ms finality and parallel execution.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2 text-green-900">AI Powered</h3>
                <p className="text-green-700">
                  Get AI assistance for optimization, security, and best practices.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                  <h4 className="font-semibold mb-2">Get Started</h4>
                  <p className="text-sm text-gray-600">Learn the basics and choose your path</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                  <h4 className="font-semibold mb-2">Choose Template</h4>
                  <p className="text-sm text-gray-600">Pick from pre-built agent templates</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                  <h4 className="font-semibold mb-2">Build Agent</h4>
                  <p className="text-sm text-gray-600">Customize with visual builder</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                  <h4 className="font-semibold mb-2">Deploy & Test</h4>
                  <p className="text-sm text-gray-600">Test on testnet, deploy to mainnet</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">5</div>
                  <h4 className="font-semibold mb-2">Manage</h4>
                  <p className="text-sm text-gray-600">Monitor performance and optimize</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('templates')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Step 2: Choose Template */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Choose Your Agent Template</h2>
              <p className="text-lg text-muted-foreground">
                Start with a proven template or create from scratch. All templates are Sei-optimized for maximum performance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-xl font-bold mb-2">DeFi Arbitrage</h3>
                <p className="text-gray-600 mb-4">
                  High-frequency arbitrage trading across Sei DEXs with sub-400ms execution
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sei Optimized</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">95% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('defi-arbitrage');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-xl font-bold mb-2">Security Scanner</h3>
                <p className="text-gray-600 mb-4">
                  Automated vulnerability detection and fix generation for smart contracts
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sei Optimized</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">88% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('security-scanner');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="text-xl font-bold mb-2">Portfolio Manager</h3>
                <p className="text-gray-600 mb-4">
                  Autonomous portfolio optimization with risk management
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sei Optimized</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">92% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('portfolio-manager');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Data Aggregator</h3>
                <p className="text-gray-600 mb-4">
                  Real-time data aggregation from multiple blockchain sources
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Multi-Chain</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">76% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('data-aggregator');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">🌾</div>
                <h3 className="text-xl font-bold mb-2">Yield Optimizer</h3>
                <p className="text-gray-600 mb-4">
                  Automated yield farming optimization across multiple protocols
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sei Optimized</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">89% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('yield-optimizer');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">🌉</div>
                <h3 className="text-xl font-bold mb-2">Cross-Chain Bridge</h3>
                <p className="text-gray-600 mb-4">
                  Monitor and optimize cross-chain asset transfers
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Multi-Chain</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">82% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('cross-chain-bridge');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-xl font-bold mb-2">SEI DeFi Bot</h3>
                <p className="text-gray-600 mb-4">
                  Automated DeFi trading on SEI with yield optimization
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">SEI Optimized</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">96% Efficient</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate('sei-defi-bot');
                    setActiveTab('build');
                  }}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Step 3: Build Agent */}
          <TabsContent value="build" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Build Your Agent</h2>
              <p className="text-lg text-muted-foreground">
                Use our visual builder to customize your agent. Drag and drop components, configure logic, and preview your creation.
              </p>
              
              {/* Template Info Display */}
              {selectedTemplate && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">📋</div>
                      <div>
                        <p className="font-semibold text-blue-900">Template Loaded</p>
                        <p className="text-sm text-blue-700">
                          {selectedTemplate === 'defi-arbitrage' && 'DeFi Arbitrage Agent'}
                          {selectedTemplate === 'security-scanner' && 'Security Scanner Agent'}
                          {selectedTemplate === 'portfolio-manager' && 'AI Portfolio Manager'}
                          {selectedTemplate === 'data-aggregator' && 'Cross-Chain Data Agent'}
                          {selectedTemplate === 'yield-optimizer' && 'Yield Farming Optimizer'}
                          {selectedTemplate === 'cross-chain-bridge' && 'Cross-Chain Bridge Monitor'}
                          {selectedTemplate === 'sei-defi-bot' && 'SEI DeFi Bot'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                      className="text-blue-700 border-blue-300 hover:bg-blue-100"
                    >
                      Clear Template
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Visual Agent Builder</h3>
                <div className="flex items-center space-x-3">
                  {/* Workflow Status Indicator */}
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${selectedTemplate ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={selectedTemplate ? 'text-green-700' : 'text-gray-500'}>
                      {selectedTemplate ? 'Template Loaded' : 'No Template'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('deploy')}
                    disabled={!selectedTemplate}
                    className={selectedTemplate ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-gray-300 text-gray-400 cursor-not-allowed'}
                  >
                    {selectedTemplate ? (
                      <>
                        Next: Deploy & Test
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Select Template First
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Template Requirement Notice */}
              {!selectedTemplate && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📋</div>
                    <div className="flex-1">
                      <div className="text-blue-800 font-medium">Template Required</div>
                      <div className="text-blue-600 text-sm">
                        Please select a template from the "Choose Template" tab before building your agent.
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-300 text-blue-800 hover:bg-blue-100"
                      onClick={() => setActiveTab('templates')}
                    >
                      Browse Templates
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Visual Agent Builder Component */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <VisualAgentBuilder 
                  selectedTemplate={selectedTemplate}
                  onNavigateToDeploy={() => setActiveTab('deploy')}
                />
              </div>
            </div>
          </TabsContent>

          {/* Step 4: Deploy & Test */}
          <TabsContent value="deploy" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Deploy & Test Your Agent</h2>
              <p className="text-lg text-muted-foreground">
                Test your agent on testnet first, then deploy to mainnet with confidence.
              </p>
            </div>

            {/* Wallet Connection & Backend Status */}
            <div className="bg-white rounded-xl shadow-lg p-6 border mb-6">
              <h3 className="text-xl font-bold mb-4">Prerequisites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Wallet Connection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Keplr Wallet</span>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      isWalletConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isWalletConnected ? '✅ Connected' : '❌ Not Connected'}
                    </div>
                  </div>
                  
                  {isWalletConnected ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        Address: {walletAddress.slice(0, 12)}...{walletAddress.slice(-8)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={disconnectWallet}
                        className="w-full"
                      >
                        Disconnect Wallet
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={connectKeplrWallet}
                      disabled={isConnectingWallet}
                      className="w-full"
                    >
                      {isConnectingWallet ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Keplr Wallet
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Backend Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Backend Server</span>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      backendStatus === 'online' ? 'bg-green-100 text-green-800' : 
                      backendStatus === 'offline' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {backendStatus === 'online' ? '✅ Online' : 
                       backendStatus === 'offline' ? '❌ Offline' : '🔄 Checking...'}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {backendStatus === 'online' ? 
                      'Backend is ready for agent deployment' :
                      backendStatus === 'offline' ?
                      'Start backend server on port 4000' :
                      'Checking backend connection...'}
                  </div>
                  
                  {backendStatus === 'offline' && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      Run: <code className="bg-red-100 px-1 rounded">cd backend && npm run dev</code>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Deploy from Builder */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">⚡</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-900">Quick Deploy from Builder</h3>
                  <p className="text-purple-700 text-sm">
                    Deploy directly from the Visual Agent Builder or use the dedicated deployment options below.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-purple-300 text-purple-800 hover:bg-purple-100 h-12"
                  onClick={() => setActiveTab('build')}
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Builder
                </Button>
                
                <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600">
                    <strong>Status:</strong> {selectedTemplate ? '✅ Template Ready' : '❌ No Template'}
                  </div>
                  {selectedTemplate && (
                    <div className="text-xs text-purple-500 mt-1">
                      Template: {selectedTemplate}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="text-4xl mb-4">🧪</div>
                <h3 className="text-xl font-bold mb-3 text-yellow-900">Testnet Testing</h3>
                <ul className="text-yellow-800 space-y-2 mb-4">
                  <li>• Deploy to Sei testnet</li>
                  <li>• Test all functionality</li>
                  <li>• Validate gas efficiency</li>
                  <li>• Debug any issues</li>
                </ul>
                <Button 
                  variant="outline" 
                  className="border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                  onClick={deployToTestnet}
                  disabled={isDeploying || !selectedTemplate}
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deploying...
                    </>
                  ) : (
                    'Deploy to Testnet'
                  )}
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-3 text-green-900">Mainnet Deployment</h3>
                <ul className="text-green-800 space-y-2 mb-4">
                  <li>• Deploy to Sei mainnet</li>
                  <li>• Monitor performance</li>
                  <li>• Track gas usage</li>
                  <li>• Optimize as needed</li>
                </ul>
                <Button 
                  variant="outline" 
                  className="border-green-300 text-green-800 hover:bg-green-200"
                  onClick={deployToMainnet}
                  disabled={isDeploying || !selectedTemplate}
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deploying...
                    </>
                  ) : (
                    'Deploy to Mainnet'
                  )}
                </Button>
              </div>
            </div>

            {/* Deployment Status */}
            {deploymentStatus && (
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-xl font-bold mb-4">Deployment Status</h3>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-line">
                  {deploymentStatus}
                </div>
                {deploymentStatus.includes('✅') && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-800 text-sm">
                      <strong>🎉 Deployment Successful!</strong> Your agent is now live on the SEI blockchain. 
                      You can view the contract address and transaction hash above.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Template Requirement Notice */}
            {!selectedTemplate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-blue-800">
                  <strong>📋 Template Required:</strong> Please go to "Choose Template" and select a template before deploying your agent.
                </div>
                <Button 
                  variant="outline" 
                  className="mt-3 border-blue-300 text-blue-800 hover:bg-blue-100"
                  onClick={() => setActiveTab('templates')}
                >
                  Browse Templates
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => setActiveTab('manage')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Next: Manage Your Agent
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 5: Manage */}
          <TabsContent value="manage" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Manage Your Agents</h2>
              <p className="text-lg text-muted-foreground">
                Monitor performance, optimize settings, and scale your deployed agents.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <AgentDevelopmentStudio />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}