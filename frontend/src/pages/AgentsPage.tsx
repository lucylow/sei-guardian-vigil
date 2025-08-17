import React, { useState } from 'react';
import VisualAgentBuilder from '../components/AgentBuilder/VisualAgentBuilder';

export default function AgentsPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
          <div>
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