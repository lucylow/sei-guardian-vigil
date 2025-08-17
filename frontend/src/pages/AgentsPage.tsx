import React, { useState, useRef, useEffect } from 'react';
import VisualAgentBuilder from '../components/AgentBuilder/VisualAgentBuilder';

export default function AgentsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
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
    setShowBuilder(true);
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // Handler for Get AI Help
  const handleGetAIHelp = () => {
    setShowBuilder(true);
    setTimeout(() => {
      window.alert('AI Assistant coming soon!');
    }, 300);
  };

  // Handler for Deploy Agent
  const handleDeployAgent = () => {
    setShowBuilder(true);
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* No-Code Studio Overview & Feature Cards */}
        {!showBuilder && (
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2 text-center">No-Code Studio</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Build and deploy smart contract agents on Sei with drag-and-drop vibe coding
            </p>
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
                  onClick={() => setShowBuilder(true)}
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
          </div>
        )}
        {!showBuilder ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">🤖 SEI SENTINEL Agents</h1>
            <p className="text-xl text-gray-600 mb-8">
              Build powerful AI agents for the Sei blockchain with zero code
            </p>
            <button
              onClick={() => setShowBuilder(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
            >
              🚀 Start Building Your Agent
            </button>
            {/* Existing agent gallery can go here */}
          </div>
        ) : (
          <div ref={builderRef}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Visual Agent Builder</h2>
              <button
                onClick={() => setShowBuilder(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Agents
              </button>
            </div>
            <VisualAgentBuilder />
          </div>
        )}
      </div>
    </div>
  );
}