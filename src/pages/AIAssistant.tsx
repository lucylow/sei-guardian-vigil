import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Code, Shield, Zap, Send, Copy } from "lucide-react";

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Create a security agent NFT contract",
    "Generate a vulnerability bounty system",
    "Build a SENT token staking contract",
    "Optimize gas usage for my contract",
    "Add access control to my functions",
    "Implement emergency pause functionality"
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setResponse(`// AI Generated Smart Contract
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecurityAgentNFT is ERC721, Ownable {
    struct Agent {
        string name;
        uint256 level;
        uint256 experience;
        uint256 battlesWon;
        uint256 sentEarned;
    }
    
    mapping(uint256 => Agent) public agents;
    uint256 private _tokenIdCounter;
    
    constructor() ERC721("SecurityAgent", "SAGENT") {}
    
    function mintAgent(string memory name) external {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        agents[tokenId] = Agent({
            name: name,
            level: 1,
            experience: 0,
            battlesWon: 0,
            sentEarned: 0
        });
    }
    
    function battleVulnerability(uint256 agentId, uint256 vulnerabilitySeverity) external {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");
        
        Agent storage agent = agents[agentId];
        
        // Battle logic
        bool victory = block.timestamp % 10 > 3; // 70% win rate
        
        if (victory) {
            agent.battlesWon++;
            agent.experience += vulnerabilitySeverity * 10;
            agent.sentEarned += vulnerabilitySeverity * 50;
            
            // Level up logic
            if (agent.experience >= agent.level * 100) {
                agent.level++;
            }
        }
    }
    
    function getAgentStats(uint256 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }
}`);
      setIsLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
            <Bot className="w-10 h-10 mr-3 text-blue-500" />
            AI Smart Contract Assistant
          </h1>
          <p className="text-muted-foreground">Generate, optimize, and secure your smart contracts with AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe what you want to build... e.g., 'Create a security agent NFT contract with battle mechanics and reward system'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full">
                  {isLoading ? (
                    <>Generating... <Bot className="w-4 h-4 ml-2 animate-spin" /></>
                  ) : (
                    <>Generate Contract <Send className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </CardContent>
            </Card>

            {response && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Contract</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button size="sm">
                        <Code className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{response}</code>
                  </pre>
                  <div className="mt-4 flex space-x-3">
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Audit
                    </Button>
                    <Button variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Gas
                    </Button>
                    <Button variant="outline">
                      <Code className="w-4 h-4 mr-2" />
                      Generate Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickPrompts.map((promptText, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setPrompt(promptText)}
                  >
                    {promptText}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Security Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Gas Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Code Generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Smart Suggestions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
