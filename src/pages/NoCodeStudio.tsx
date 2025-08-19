import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import VisualAgentBuilder from "@/components/AgentBuilder/VisualAgentBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Wrench, Bot, Rocket } from "lucide-react";

export default function NoCodeStudio() {
  const [showBuilder, setShowBuilder] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      title: "Contract Templates",
      description: "Choose from pre-built smart contract templates to get started quickly.",
      icon: FileText,
      buttonText: "Browse Templates",
      route: "/contract-templates",
      color: "bg-blue-500"
    },
    {
      title: "Visual Builder",
      description: "Drag and drop components to build your agent logic visually.",
      icon: Wrench,
      buttonText: "Start Vibe Coding",
      route: "/visual-builder",
      color: "bg-purple-500"
    },
    {
      title: "AI Assistant",
      description: "Get help from AI to generate and optimize your smart contracts.",
      icon: Bot,
      buttonText: "Get AI Help",
      route: "/ai-assistant",
      color: "bg-green-500"
    },
    {
      title: "Deploy & Test",
      description: "Test your agents on testnet and deploy to mainnet with one click.",
      icon: Rocket,
      buttonText: "Deploy Agent",
      route: "/deploy-agent",
      color: "bg-red-500"
    }
  ];

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
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => navigate(feature.route)}
                      >
                        {feature.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
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