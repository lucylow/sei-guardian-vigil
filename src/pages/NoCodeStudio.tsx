import { Navigation } from "@/components/Navigation";

export default function NoCodeStudio() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">No-Code Studio</h1>
          <p className="text-muted-foreground">Build and deploy smart contracts without code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">Contract Templates</h2>
              <p className="text-muted-foreground">
                Choose from pre-built smart contract templates to get started quickly.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">Visual Builder</h2>
              <p className="text-muted-foreground">
                Drag and drop components to build your smart contract logic visually.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
              <p className="text-muted-foreground">
                Get help from AI to generate and optimize your smart contracts.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">Deploy & Test</h2>
              <p className="text-muted-foreground">
                Test your contracts on testnet and deploy to mainnet with one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}