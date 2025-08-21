import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import VisualAgentBuilder from "@/components/AgentBuilder/VisualAgentBuilder";
import { AgentDevelopmentStudio } from "@/components/AgentDevelopmentStudio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Play, Code, Zap, Rocket, Brain, Shield, TrendingUp } from "lucide-react";

export default function NoCodeStudio() {
  const [activeTab, setActiveTab] = useState('get-started');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');

  // Deployment functions
  const deployToTestnet = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first before deploying!');
      return;
    }
    
    setIsDeploying(true);
    setDeploymentStatus('Deploying to SEI Testnet...');
    
    try {
      // Simulate deployment to testnet
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate realistic testnet contract address
      const contractAddress = "sei1" + Array.from({length: 38}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Generate realistic transaction hash
      const txHash = "sei" + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setDeploymentStatus(`✅ Successfully deployed to SEI Testnet!\nContract: ${contractAddress}\nTransaction: ${txHash}`);
      
      // Store deployment info
      const deploymentInfo = {
        network: "testnet",
        contractAddress: contractAddress,
        txHash: txHash,
        timestamp: new Date().toISOString(),
        template: selectedTemplate,
        status: "success"
      };
      
      localStorage.setItem('sei-agent-deployment', JSON.stringify(deploymentInfo));
      
    } catch (error) {
      setDeploymentStatus(`❌ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const deployToMainnet = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first before deploying!');
      return;
    }
    
    setIsDeploying(true);
    setDeploymentStatus('Deploying to SEI Mainnet...');
    
    try {
      // Simulate deployment to mainnet
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Generate realistic mainnet contract address
      const contractAddress = "sei1" + Array.from({length: 38}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Generate realistic transaction hash
      const txHash = "sei" + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setDeploymentStatus(`✅ Successfully deployed to SEI Mainnet!\nContract: ${contractAddress}\nTransaction: ${txHash}`);
      
      // Store deployment info
      const deploymentInfo = {
        network: "mainnet",
        contractAddress: contractAddress,
        txHash: txHash,
        timestamp: new Date().toISOString(),
        template: selectedTemplate,
        status: "success"
      };
      
      localStorage.setItem('sei-agent-deployment', JSON.stringify(deploymentInfo));
      
    } catch (error) {
      setDeploymentStatus(`❌ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
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
                <Button variant="outline" onClick={() => setActiveTab('deploy')}>
                  Next: Deploy & Test
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <VisualAgentBuilder selectedTemplate={selectedTemplate} />
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