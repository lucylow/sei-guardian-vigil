import React, { useState, useRef, useEffect } from 'react';
import VisualAgentBuilder from '../components/AgentBuilder/VisualAgentBuilder';
import { AgentDevelopmentStudio } from '../components/AgentDevelopmentStudio';

export default function AgentsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const builderRef = useRef<HTMLDivElement>(null);

  // Scroll to builder section when builder is shown
  useEffect(() => {
    if (showBuilder && builderRef.current) {
      setTimeout(() => {
        builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showBuilder]);

  // Handler for Browse Templates
  const handleBrowseTemplates = () => {
    setActiveTab('templates');
    setShowBuilder(false);
  };

  // Handler for Get AI Help
  const handleGetAIHelp = () => {
    setActiveTab('dev-studio');
    setShowBuilder(false);
  };

  // Handler for Deploy Agent
  const handleDeployAgent = () => {
    setActiveTab('dev-studio');
    setShowBuilder(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">No-Code Studio</h1>
          <p className="text-lg text-gray-600 mb-4">
            Build and deploy smart contract agents on Sei with drag-and-drop vibe coding
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('dev-studio')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dev-studio'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dev Studio
            </button>
            <button
              onClick={() => setActiveTab('visual-builder')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'visual-builder'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Visual Builder
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Templates
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">📋</span>
                <h3 className="font-bold mb-1">Contract Templates</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Choose from pre-built smart contract templates to get started quickly.
                </p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleBrowseTemplates}
                >
                  Browse Templates
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🛠️</span>
                <h3 className="font-bold mb-1">Visual Builder</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Drag and drop components to build your agent logic visually.
                </p>
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  onClick={() => setActiveTab('visual-builder')}
                >
                  Start Vibe Coding
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🤖</span>
                <h3 className="font-bold mb-1">AI Assistant</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Get help from AI to generate and optimize your smart contracts.
                </p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleGetAIHelp}
                >
                  Get AI Help
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🚀</span>
                <h3 className="font-bold mb-1">Deploy & Test</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Test your agents on testnet and deploy to mainnet with one click.
                </p>
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  onClick={handleDeployAgent}
                >
                  Deploy Agent
                </button>
              </div>
            </div>
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold mb-2">How It Works</h2>
              <ol className="list-decimal list-inside text-gray-600 text-lg mx-auto max-w-2xl">
                <li>Pick a contract template or start from scratch.</li>
                <li>Drag and drop agent components onto the canvas.</li>
                <li>Configure triggers, actions, and blockchain integrations.</li>
                <li>Preview, test, and deploy your agent to Sei.</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'dev-studio' && (
          <div className="space-y-6">
            <AgentDevelopmentStudio />
          </div>
        )}

        {activeTab === 'visual-builder' && (
          <div ref={builderRef}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Visual Agent Builder</h2>
              <button
                onClick={() => setActiveTab('overview')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Overview
              </button>
            </div>
            <VisualAgentBuilder />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Smart Contract Templates</h2>
              <p className="text-gray-600 mb-6">
                Pre-built templates for common DeFi, security, and data processing use cases
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">DeFi Arbitrage</h3>
                <p className="text-sm text-gray-500 mb-4">
                  High-frequency arbitrage trading across Sei DEXs with sub-400ms execution
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Use Template
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Security Scanner</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Automated vulnerability detection and fix generation for smart contracts
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Use Template
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Portfolio Manager</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Autonomous portfolio optimization with risk management
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Use Template
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Data Aggregator</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Real-time data aggregation from multiple blockchain sources
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Use Template
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Yield Optimizer</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Automated yield farming optimization across multiple protocols
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Use Template
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Cross-Chain Bridge</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Monitor and optimize cross-chain asset transfers
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}