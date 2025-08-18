import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import VisualAgentBuilder from "@/components/AgentBuilder/VisualAgentBuilder";
import { Button } from "@/components/ui/button";

export default function NoCodeStudio() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        {!showBuilder ? (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">No-Code Studio</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Build and deploy smart contract agents on Sei with drag-and-drop vibe coding
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">📋</span>
                <h3 className="font-bold mb-1">Contract Templates</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Choose from pre-built smart contract templates to get started quickly.
                </p>
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setShowBuilder(true)}
                >
                  Browse Templates
                </Button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🛠️</span>
                <h3 className="font-bold mb-1">Visual Builder</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Drag and drop components to build your agent logic visually.
                </p>
                <Button
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  onClick={() => setShowBuilder(true)}
                >
                  Start Vibe Coding
                </Button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🤖</span>
                <h3 className="font-bold mb-1">AI Assistant</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Get help from AI to generate and optimize your smart contracts.
                </p>
                <Button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => window.alert('AI Assistant coming soon!')}
                >
                  Get AI Help
                </Button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🚀</span>
                <h3 className="font-bold mb-1">Deploy & Test</h3>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Test your agents on testnet and deploy to mainnet with one click.
                </p>
                <Button
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  onClick={() => setShowBuilder(true)}
                >
                  Deploy Agent
                </Button>
              </div>
            </div>
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold mb-2">How It Works</h2>
              <ol className="list-decimal list-inside text-muted-foreground text-lg mx-auto max-w-2xl">
                <li>Pick a contract template or start from scratch.</li>
                <li>Drag and drop agent components onto the canvas.</li>
                <li>Configure triggers, actions, and blockchain integrations.</li>
                <li>Preview, test, and deploy your agent to Sei.</li>
              </ol>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Visual Agent Builder</h2>
              <Button variant="outline" onClick={() => setShowBuilder(false)}>
                ← Back to Studio
              </Button>
            </div>
            <VisualAgentBuilder />
          </div>
        )}
      </div>
    </div>
  );
}