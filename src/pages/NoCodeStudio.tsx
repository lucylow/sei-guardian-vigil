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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">No-Code Studio</h1>
              <p className="text-muted-foreground">Build and deploy smart contract agents on Sei with drag-and-drop vibe coding</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold mb-4">Contract Templates</h2>
                  <p className="text-muted-foreground">
                    Choose from pre-built smart contract templates to get started quickly.
                  </p>
                  <Button className="mt-4" variant="outline">
                    📋 Browse Templates
                  </Button>
                </div>
                <div className="p-6 border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold mb-4">Visual Builder</h2>
                  <p className="text-muted-foreground">
                    Drag and drop components to build your agent logic visually.
                  </p>
                  <Button className="mt-4" onClick={() => setShowBuilder(true)}>
                    🚀 Start Vibe Coding
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
                  <p className="text-muted-foreground">
                    Get help from AI to generate and optimize your smart contracts.
                  </p>
                  <Button className="mt-4" variant="outline">
                    🤖 Get AI Help
                  </Button>
                </div>
                <div className="p-6 border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold mb-4">Deploy & Test</h2>
                  <p className="text-muted-foreground">
                    Test your agents on testnet and deploy to mainnet with one click.
                  </p>
                  <Button className="mt-4" variant="outline">
                    🚀 Deploy Agent
                  </Button>
                </div>
              </div>
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