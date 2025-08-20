import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState('templates');
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
          <h2 className="text-2xl font-bold text-gray-900">AI Agent Development Studio</h2>
          <p className="text-gray-600">Build, deploy, and manage AI agents on Sei Network</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            📤 Import Agent
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            🧠 Create New Agent
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Agent Templates
          </button>
          <button
            onClick={() => setActiveTab('deployed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deployed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Deployed Agents
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'marketplace'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Agent Marketplace
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                💻 Pre-built Agent Templates
              </h3>
              <p className="text-gray-600">
                Sei-optimized agent templates for rapid deployment
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{template.name}</h4>
                      <div className="flex space-x-1">
                        {template.seiOptimized && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Sei Optimized
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {template.gasEfficiency}% Efficient
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium">Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.capabilities.map((capability, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeploy(template.id);
                      }}
                    >
                      ▶️ Deploy
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                      ⚙️ Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deployed' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                📊 Deployed Agents
              </h3>
              <p className="text-gray-600">
                Monitor and manage your active AI agents
              </p>
            </div>
            {deployedAgents.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🧠</div>
                <p className="text-gray-500">No agents deployed yet</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Deploy Your First Agent
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {deployedAgents.map((agent) => (
                  <div key={agent.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500' :
                          agent.status === 'training' ? 'bg-yellow-500' :
                          agent.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <h4 className="font-semibold">{agent.name}</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {agent.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                          ⚙️
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                          ⏹️
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Performance</p>
                        <p className="font-medium">{agent.performance}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gas Used</p>
                        <p className="font-medium">{agent.gasUsed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tasks Completed</p>
                        <p className="font-medium">{agent.tasksCompleted}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                🌐 Agent Marketplace (AIDN)
              </h3>
              <p className="text-gray-600">
                Discover and hire specialized AI agents from the network
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-md">
                  <option>Category</option>
                  <option value="trading">Trading</option>
                  <option value="security">Security</option>
                  <option value="analytics">Analytics</option>
                  <option value="data">Data Processing</option>
                </select>
                <input placeholder="Search agents..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Search</button>
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
                  <div key={index} className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      <h4 className="font-semibold text-lg">{agent.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">by {agent.owner}</p>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          ★ {agent.rating}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium">{agent.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tasks Completed:</span>
                        <span className="font-medium">{agent.tasks}</span>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                      ⚡ Hire Agent
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Agents</h4>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-gray-500">+12 this week</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Average Performance</h4>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-gray-500">+2.1% improvement</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Gas Efficiency</h4>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-gray-500">Above target</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Revenue Generated</h4>
              <div className="text-2xl font-bold">1,247 SEI</div>
              <p className="text-xs text-gray-500">+23% this month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Agent Performance Metrics</h3>
              <p className="text-gray-600">Real-time performance data for your AI agents</p>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500">Performance charts will appear here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
