import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Vote, 
  Users, 
  Coins, 
  Shield, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Gavel,
  PlusCircle,
  TrendingUp,
  Lock,
  Unlock,
  DollarSign,
  Wallet,
  Zap,
  Target,
  Activity,
  Bot,
  Eye,
  Rocket,
  Settings,
  Play
} from "lucide-react";
import VisualAgentBuilderWrapper from "@/components/AgentBuilder/VisualAgentBuilderWrapper";

export default function Demo() {
  const [activeTab, setActiveTab] = useState("governance");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">SEI Sentinel Demo</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Experience the power of decentralized governance and AI-powered agent building
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="governance" className="flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              DAO Governance
            </TabsTrigger>
            <TabsTrigger value="agent-builder" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Visual Agent Builder
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Key Features
            </TabsTrigger>
          </TabsList>

          {/* DAO Governance Tab */}
          <TabsContent value="governance" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Decentralized Governance Demo</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience SEI Sentinel's DAO governance system with real-time voting, proposal management, 
                and community-driven decision making.
              </p>
            </div>

            {/* Governance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Vote className="w-5 h-5 text-blue-600" />
                    Active Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Total Voters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">2,847</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    Treasury Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">45,230 SEI</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Participation Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">67.3%</div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Proposals */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Live Demo Proposals</h3>
              
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-4 h-4" />
                        <CardTitle className="text-xl">Implement Multi-Signature Agent Deployment</CardTitle>
                        <Badge className="bg-blue-500 text-white">ACTIVE</Badge>
                      </div>
                      <CardDescription className="text-base">
                        Require 3 out of 5 validator signatures for deploying high-risk security agents to mainnet
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Votes: 1,570 / 2,000 (Quorum)</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          6h left
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78.5%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          For: 1,250
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Against: 320
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Vote For
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        Vote Against
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-4 h-4" />
                        <CardTitle className="text-xl">Security Bounty Pool Allocation</CardTitle>
                        <Badge className="bg-green-500 text-white">PASSED</Badge>
                      </div>
                      <CardDescription className="text-base">
                        Allocate 10,000 SEI tokens to the security bounty pool for Q1 2024
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Votes: 2,550 / 2,000 (Quorum)</span>
                        <span>Ended: 2024-01-30</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          For: 2,100
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Against: 450
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Create Proposal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Submit a new governance proposal for community voting
                  </p>
                  <Button className="w-full">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Start Proposal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect your SEI wallet to participate in governance
                  </p>
                  <Button className="w-full" variant="outline">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Treasury
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    View and manage the DAO treasury
                  </p>
                  <Button className="w-full" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Treasury
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Visual Agent Builder Tab */}
          <TabsContent value="agent-builder" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Visual Agent Builder Demo</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience the power of drag-and-drop AI agent creation with SEI blockchain integration. 
                Build complex workflows without writing code.
              </p>
            </div>

            {/* Agent Builder Interface */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Visual Agent Builder
                </h3>
                <p className="text-blue-100">Drag and drop interface for building AI agents</p>
              </div>
              <div className="h-[600px]">
                <VisualAgentBuilderWrapper />
              </div>
            </div>

            {/* Builder Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Node Palette
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Rich collection of pre-built nodes for triggers, skills, actions, and SEI integrations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-600" />
                    Configuration Panel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed configuration options for each node with SEI-specific parameters
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-purple-600" />
                    Live Simulation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Test your agent workflows in real-time with simulated blockchain events
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Key Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Key Features Overview</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Discover the comprehensive features that make SEI Sentinel the ultimate blockchain security platform
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    AI-Powered Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Advanced AI models for vulnerability detection and smart contract analysis
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Transformer-based detection
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Real-time scanning
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Zero false positives
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-600" />
                    Sub-400ms Scans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Lightning-fast smart contract analysis leveraging SEI's parallel execution
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      400ms block finality
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Parallel processing
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Instant results
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-purple-600" />
                    DAO Governance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Community-driven decision making with transparent voting and proposal system
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      On-chain voting
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Treasury management
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Community proposals
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-orange-600" />
                    No-Code Agent Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Visual drag-and-drop interface for building complex AI agents
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Drag & drop interface
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      SEI integration
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Live simulation
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Join the SEI Sentinel ecosystem and help secure the future of blockchain
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch App
                </Button>
                <Button size="lg" variant="outline">
                  <Eye className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
