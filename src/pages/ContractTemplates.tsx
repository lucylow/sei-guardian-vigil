import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Shield, Zap, DollarSign, Users, Lock } from "lucide-react";

export default function ContractTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: "Security Agent NFT",
      description: "NFT contract for security agents with battle mechanics",
      category: "Gaming",
      difficulty: "Intermediate",
      icon: Shield,
      features: ["Mintable NFTs", "Battle Stats", "Reward System", "Upgradeable"],
      code: `// Security Agent NFT Contract
contract SecurityAgentNFT {
    struct Agent {
        string name;
        uint256 level;
        uint256 experience;
        uint256 battlesWon;
    }
    
    mapping(uint256 => Agent) public agents;
    
    function mintAgent(string memory name) external {
        // Mint new security agent
    }
    
    function battleVulnerability(uint256 agentId) external {
        // Battle logic
    }
}`
    },
    {
      id: 2,
      name: "Vulnerability Bounty",
      description: "Smart contract for managing bug bounty rewards",
      category: "Security",
      difficulty: "Advanced",
      icon: DollarSign,
      features: ["Escrow System", "Multi-sig Approval", "Automatic Payouts", "Reputation Tracking"],
      code: `// Vulnerability Bounty Contract
contract VulnerabilityBounty {
    struct Bounty {
        uint256 reward;
        address reporter;
        bool verified;
        bool paid;
    }
    
    mapping(bytes32 => Bounty) public bounties;
    
    function reportVulnerability(bytes32 vulnHash) external {
        // Report vulnerability
    }
    
    function verifyAndPay(bytes32 vulnHash) external {
        // Verify and pay bounty
    }
}`
    },
    {
      id: 3,
      name: "SENT Token Staking",
      description: "Staking contract for SENT tokens with rewards",
      category: "DeFi",
      difficulty: "Beginner",
      icon: Zap,
      features: ["Flexible Staking", "Compound Rewards", "Emergency Withdraw", "Governance Rights"],
      code: `// SENT Token Staking Contract
contract SENTStaking {
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public rewardDebt;
    
    function stake(uint256 amount) external {
        // Stake SENT tokens
    }
    
    function unstake(uint256 amount) external {
        // Unstake tokens
    }
    
    function claimRewards() external {
        // Claim staking rewards
    }
}`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Contract Templates</h1>
          <p className="text-muted-foreground">Choose from pre-built smart contract templates optimized for Sei Network</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => setSelectedTemplate(template)}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-8 h-8 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Difficulty:</span>
                      <Badge variant={template.difficulty === 'Beginner' ? 'default' : 
                                   template.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedTemplate && (
          <div className="mt-8 p-6 border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-4">Template Preview: {selectedTemplate.name}</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{selectedTemplate.code}</code>
            </pre>
            <div className="mt-4 flex space-x-3">
              <Button>Deploy to Testnet</Button>
              <Button variant="outline">Customize Template</Button>
              <Button variant="ghost">View Full Code</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
