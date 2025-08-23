import React, { useState } from "react";
/* Navigation is now handled by the Layout component */
import VisualAgentBuilder from "@/components/AgentBuilder/VisualAgentBuilder";
import { AgentDevelopmentStudio } from "@/components/AgentDevelopmentStudio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { ArrowRight, Play, Code, Zap, Rocket, Brain, Shield, TrendingUp } from "lucide-react";

export default function NoCodeStudio() {
  const [activeTab, setActiveTab] = useState('get-started');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');

  // Template mapping - display names to template IDs
  const templateMapping = {
    "Security Sentinel": "security-scanner",
    "Trading Bot": "defi-arbitrage", 
    "Data Oracle": "data-oracle",
    "Compliance Monitor": "compliance-monitor",
    "Risk Manager": "portfolio-manager",
    "Market Maker": "market-maker"
  };

  // Tab descriptions for each step
  const tabDescriptions = {
    'get-started': "Welcome to SEI No-Code Studio - Learn how to build AI agents without coding",
    'templates': "Browse and select from pre-built agent templates for quick deployment",
    'build': "Use our visual builder to customize your agent with drag-and-drop components",
    'deploy': "Deploy your agent to SEI testnet or mainnet with automated testing",
    'manage': "Monitor, update, and manage your deployed agents and their performance"
  };

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-3 tracking-wider">
            NO-CODE STUDIO
          </h1>
          <p className="text-lg text-red-600/70 font-medium tracking-wide mb-6">
            BUILD AND DEPLOY SMART CONTRACT AGENTS ON SEI WITH DRAG-AND-DROP VIBE CODING
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1"
              onClick={() => setActiveTab('get-started')}
            >
              <Play className="w-5 h-5 mr-2" />
              GET STARTED
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1"
              onClick={() => setActiveTab('templates')}
            >
              <Code className="w-5 h-5 mr-2" />
              BROWSE TEMPLATES
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">AGENT BUILDING PROCESS</h3>
          <Tabs defaultValue="get-started" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList variant="security" className="w-full">
              <TabsTrigger value="get-started" variant="security" icon={<Rocket className="w-5 h-5" />}>
                1. GET STARTED
              </TabsTrigger>
              <TabsTrigger value="templates" variant="security" icon={<Code className="w-5 h-5" />}>
                2. CHOOSE TEMPLATE
              </TabsTrigger>
              <TabsTrigger value="build" variant="security" icon={<Zap className="w-5 h-5" />}>
                3. BUILD AGENT
              </TabsTrigger>
              <TabsTrigger value="deploy" variant="security" icon={<Shield className="w-5 h-5" />}>
                4. DEPLOY & TEST
              </TabsTrigger>
              <TabsTrigger value="manage" variant="security" icon={<TrendingUp className="w-5 h-5" />}>
                5. MANAGE
              </TabsTrigger>
            </TabsList>
            
            <TabConnectionLine variant="security" />
            <TabDescription variant="security" descriptions={tabDescriptions} />
            
            {/* Step 1: Get Started */}
            <TabsContent value="get-started" variant="security">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-red-300">Welcome to SEI No-Code Studio</h2>
                  <p className="text-lg text-red-600/70 max-w-3xl mx-auto">
                    Create powerful AI agents for the Sei blockchain without writing a single line of code. 
                    Follow our simple 5-step process to build, deploy, and manage your agents.
                  </p>
                </div>

                {/* Feature Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl p-6 border border-red-800/30 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-2 text-red-300">Fast Development</h3>
                    <p className="text-red-600/70">
                      Build agents in minutes, not days. Our visual builder makes complex logic simple.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl p-6 border border-red-800/30 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2 text-red-300">Sei Optimized</h3>
                    <p className="text-red-600/70">
                      Built specifically for Sei's sub-400ms finality and parallel execution.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl p-6 border border-red-800/30 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold mb-2 text-red-300">AI Powered</h3>
                    <p className="text-red-600/70">
                      Get AI assistance for optimization, security, and best practices.
                    </p>
                  </div>
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center text-red-300">How It Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">1</div>
                      <p className="text-sm text-red-600/70">Get Started</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">2</div>
                      <p className="text-sm text-red-600/70">Choose Template</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">3</div>
                      <p className="text-sm text-red-600/70">Build Agent</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">4</div>
                      <p className="text-sm text-red-600/70">Deploy & Test</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">5</div>
                      <p className="text-sm text-red-600/70">Manage</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Step 2: Choose Template */}
            <TabsContent value="templates" variant="security">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-4 text-red-300">Choose Your Agent Template</h2>
                  <p className="text-lg text-red-600/70">
                    Select from our curated collection of pre-built agent templates
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Security Sentinel", description: "AI-powered security monitoring agent", icon: "🛡️", category: "Security" },
                    { name: "Trading Bot", description: "Automated trading and arbitrage agent", icon: "📈", category: "Trading" },
                    { name: "Data Oracle", description: "Real-time data feed and validation agent", icon: "🔮", category: "Data" },
                    { name: "Compliance Monitor", description: "Regulatory compliance and audit agent", icon: "📋", category: "Compliance" },
                    { name: "Risk Manager", description: "Portfolio risk assessment and management", icon: "⚠️", category: "Risk" },
                    { name: "Market Maker", description: "Automated market making and liquidity provision", icon: "💧", category: "Trading" }
                  ].map((template, index) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                        selectedTemplate === template.name
                          ? 'border-red-500 bg-red-900/20 shadow-xl shadow-red-500/30'
                          : 'border-red-800/30 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20'
                      }`}
                      onClick={() => setSelectedTemplate(template.name)}
                    >
                      <div className="text-4xl mb-3">{template.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-red-300">{template.name}</h3>
                      <p className="text-red-600/70 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-500 font-medium">{template.category}</span>
                        {selectedTemplate === template.name && (
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTemplate && (
                  <div className="text-center mt-8">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-8 py-4 transform hover:scale-105 hover:-translate-y-1"
                      onClick={() => setActiveTab('build')}
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Continue to Build Agent
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 3: Build Agent */}
            <TabsContent value="build" variant="security">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-4 text-red-300">Build Your Agent</h2>
                  <p className="text-lg text-red-600/70">
                    Use our visual builder to customize your agent. Drag and drop components, configure logic, and preview your creation.
                  </p>
                </div>

                {!selectedTemplate ? (
                  <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-red-300">Template Required</h3>
                    <p className="text-red-600/70 mb-6">
                      Please select a template from the 'Choose Template' tab before building your agent.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1"
                      onClick={() => setActiveTab('templates')}
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Browse Templates
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-red-300">Visual Agent Builder</h3>
                      <p className="text-red-600/70 mb-4">
                        Template: <span className="text-red-300 font-semibold">{selectedTemplate}</span>
                      </p>
                      <VisualAgentBuilder selectedTemplate={templateMapping[selectedTemplate as keyof typeof templateMapping]} />
                    </div>

                    <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-red-300">Agent Canvas</h3>
                      <p className="text-red-600/70 mb-4">
                        Drag nodes from the palette to build your agent. Configure parameters and test logic.
                      </p>
                      <div className="flex space-x-4">
                        <Button 
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-4 py-2 transform hover:scale-105"
                          onClick={() => setActiveTab('deploy')}
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Continue to Deploy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 4: Deploy & Test */}
            <TabsContent value="deploy" variant="security">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-4 text-red-300">Deploy & Test Your Agent</h2>
                  <p className="text-lg text-red-600/70">
                    Deploy your agent to SEI testnet or mainnet with automated testing and validation.
                  </p>
                </div>

                {!selectedTemplate ? (
                  <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-red-300">Build Required</h3>
                    <p className="text-red-600/70 mb-6">
                      Please build your agent first before proceeding to deployment.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1"
                      onClick={() => setActiveTab('build')}
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Build Agent First
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-red-300">Testnet Deployment</h3>
                        <p className="text-red-600/70 mb-4">
                          Deploy to SEI testnet for testing and validation before mainnet.
                        </p>
                        <Button 
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105"
                          onClick={deployToTestnet}
                          disabled={isDeploying}
                        >
                          {isDeploying ? 'Deploying...' : 'Deploy to Testnet'}
                        </Button>
                      </div>

                      <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-red-300">Mainnet Deployment</h3>
                        <p className="text-red-600/70 mb-4">
                          Deploy to SEI mainnet for production use (requires testnet validation).
                        </p>
                        <Button 
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105"
                          onClick={deployToMainnet}
                          disabled={isDeploying}
                        >
                          {isDeploying ? 'Deploying...' : 'Deploy to Mainnet'}
                        </Button>
                      </div>
                    </div>

                    {deploymentStatus && (
                      <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-red-300">Deployment Status</h3>
                        <pre className="text-red-300 font-mono text-sm whitespace-pre-wrap">{deploymentStatus}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 5: Manage */}
            <TabsContent value="manage" variant="security">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-4 text-red-300">Manage Your Agents</h2>
                  <p className="text-lg text-red-600/70">
                    Monitor, update, and manage your deployed agents and their performance.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-300">Agent Management Dashboard</h3>
                  <p className="text-red-600/70 mb-4">
                    Track your agents' performance, update configurations, and monitor network activity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                      <div className="text-2xl font-bold text-red-300">0</div>
                      <div className="text-sm text-red-600/70">Active Agents</div>
                    </div>
                    <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                      <div className="text-2xl font-bold text-red-300">0</div>
                      <div className="text-sm text-red-600/70">Total Deployments</div>
                    </div>
                    <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                      <div className="text-2xl font-bold text-red-300">$0</div>
                      <div className="text-sm text-red-600/70">Total Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}