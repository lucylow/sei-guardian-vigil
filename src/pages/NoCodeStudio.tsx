import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import VisualAgentBuilder from "@/components/AgentBuilder/VisualAgentBuilder";
import { AgentDevelopmentStudio } from "@/components/AgentDevelopmentStudio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Play, Code, Zap, Rocket, Brain, Shield, TrendingUp, Search, Filter } from "lucide-react";

export default function NoCodeStudio() {
  const [activeTab, setActiveTab] = useState('get-started');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Agent templates data
  const agentTemplates = [
    {
      id: "defi-arbitrage",
      name: "DeFi Arbitrage Agent",
      description: "High-frequency arbitrage trading across Sei DEXs with sub-400ms execution",
      category: "Trading",
      capabilities: ["Price monitoring", "Cross-DEX arbitrage", "MEV protection", "Parallel execution"],
      seiOptimized: true,
      gasEfficiency: 95,
      icon: "📈"
    },
    {
      id: "security-scanner",
      name: "Smart Contract Security Agent",
      description: "Automated vulnerability detection and fix generation for Sei contracts",
      category: "Security",
      capabilities: ["Static analysis", "Dynamic testing", "AI fix generation", "Formal verification"],
      seiOptimized: true,
      gasEfficiency: 88,
      icon: "🔒"
    },
    {
      id: "portfolio-manager",
      name: "AI Portfolio Manager",
      description: "Autonomous portfolio optimization with risk management",
      category: "Finance",
      capabilities: ["Risk assessment", "Rebalancing", "Yield optimization", "Diversification"],
      seiOptimized: true,
      gasEfficiency: 92,
      icon: "💼"
    },
    {
      id: "data-aggregator",
      name: "Cross-Chain Data Agent",
      description: "Real-time data aggregation from multiple blockchain sources",
      category: "Data",
      capabilities: ["Multi-chain queries", "Data validation", "Oracle feeds", "Analytics"],
      seiOptimized: false,
      gasEfficiency: 76,
      icon: "📊"
    },
    {
      id: "yield-optimizer",
      name: "Yield Farming Optimizer",
      description: "Automated yield farming optimization across multiple protocols",
      category: "Finance",
      capabilities: ["Protocol analysis", "Yield comparison", "Auto-compounding", "Risk management"],
      seiOptimized: true,
      gasEfficiency: 89,
      icon: "🌾"
    },
    {
      id: "cross-chain-bridge",
      name: "Cross-Chain Bridge Monitor",
      description: "Monitor and optimize cross-chain asset transfers",
      category: "Bridge",
      capabilities: ["Bridge monitoring", "Fee optimization", "Security validation", "Route finding"],
      seiOptimized: false,
      gasEfficiency: 82,
      icon: "🌉"
    }
  ];

  // Filter templates based on search and category
  const filteredTemplates = agentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(agentTemplates.map(t => t.category))];

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

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all hover:shadow-xl cursor-pointer ${
                    selectedTemplate === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {template.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex items-center justify-between mb-4">
                    {template.seiOptimized ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sei Optimized</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Multi-Chain</span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{template.gasEfficiency}% Efficient</span>
                  </div>
                  
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full mb-4 block w-fit">
                    {template.category}
                  </span>
                  
                  {/* Capabilities */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.capabilities.map((capability, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template.id);
                        setActiveTab('build');
                      }}
                    >
                      ▶️ Deploy
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template.id);
                        setActiveTab('build');
                      }}
                    >
                      ⚙️ Customize
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Step 3: Build Agent */}
          <TabsContent value="build" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Build Your Agent</h2>
              <p className="text-lg text-muted-foreground">
                Use our visual builder to customize your agent. Drag and drop components, configure logic, and preview your creation.
              </p>
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
                <Button variant="outline" className="border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                  Deploy to Testnet
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
                <Button variant="outline" className="border-green-300 text-green-800 hover:bg-green-200">
                  Deploy to Mainnet
                </Button>
              </div>
            </div>
            
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

          {/* Step 5: Manage - Only Deployed Agents */}
          <TabsContent value="manage" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Manage Your Deployed Agents</h2>
              <p className="text-lg text-muted-foreground">
                Monitor performance, optimize settings, and scale your deployed agents.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Simplified Management - Only Deployed Agents Tab */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Deployed Agents Dashboard</h3>
                    <p className="text-gray-600">Monitor and manage your active AI agents</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      📤 Import Agent
                    </Button>
                    <Button>
                      🧠 Create New Agent
                    </Button>
                  </div>
                </div>

                {/* Deployed Agents List */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <h4 className="font-semibold">DeFi Arbitrage Agent</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">⚙️</Button>
                        <Button size="sm" variant="outline">⏹️</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Performance</p>
                        <p className="font-medium">98.5%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gas Used</p>
                        <p className="font-medium">125,000</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tasks Completed</p>
                        <p className="font-medium">247</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <h4 className="font-semibold">Security Audit Agent</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Idle</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">⚙️</Button>
                        <Button size="sm" variant="outline">▶️</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Performance</p>
                        <p className="font-medium">95.2%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gas Used</p>
                        <p className="font-medium">89,000</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tasks Completed</p>
                        <p className="font-medium">156</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Performance Overview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Total Agents</h5>
                      <div className="text-2xl font-bold">2</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Active</h5>
                      <div className="text-2xl font-bold">1</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Avg Performance</h5>
                      <div className="text-2xl font-bold">96.9%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Total Gas Used</h5>
                      <div className="text-2xl font-bold">214K</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}