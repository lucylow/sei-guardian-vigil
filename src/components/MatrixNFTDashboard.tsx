import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown,
  Star,
  Flame,
  Brain,
  Cpu,
  Network,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Users,
  Award,
  Gamepad2,
  Filter,
  Search,
  Wallet,
  RefreshCw,
  Plus
} from "lucide-react";
import { AgentCard } from "./AgentCard";

interface MatrixNFTDashboardProps {
  className?: string;
}

export const MatrixNFTDashboard: React.FC<MatrixNFTDashboardProps> = ({ className }) => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Enhanced agent data with Matrix theme
  const [agents] = useState([
    {
      id: "static_analyzer_v1",
      name: "StaticGuardian",
      role: "security_analyst",
      level: 42,
      xp: 1850,
      xpToNext: 2000,
      traits: {
        accuracy: 0.97,
        speed: 0.85,
        specialty: "Static Analysis",
        matrixAffinity: 0.89
      },
      stats: {
        vulnerabilitiesDetected: 142,
        criticalFixes: 8,
        reputation: 950,
        tokensEarned: 2340,
        winStreak: 7,
        matrixBreaches: 2
      },
      nftTokenId: "0x1234...5678",
      imageUrl: "/agents/static-guardian.png",
      rarity: "epic",
      matrixStatus: "oracle"
    },
    {
      id: "threat_hunter_v1", 
      name: "DarkWebScout",
      role: "threat_intel",
      level: 38,
      xp: 1620,
      xpToNext: 1800,
      traits: {
        accuracy: 0.94,
        speed: 0.92,
        specialty: "Threat Intelligence",
        matrixAffinity: 0.91
      },
      stats: {
        vulnerabilitiesDetected: 87,
        criticalFixes: 3,
        reputation: 780,
        tokensEarned: 1890,
        winStreak: 12,
        matrixBreaches: 1
      },
      nftTokenId: "0x8765...4321",
      imageUrl: "/agents/threat-hunter.png",
      rarity: "rare",
      matrixStatus: "active"
    },
    {
      id: "patch_master_v1",
      name: "PatchMaster",
      role: "remediation", 
      level: 35,
      xp: 1400,
      xpToNext: 1600,
      traits: {
        accuracy: 0.96,
        speed: 0.88,
        specialty: "Code Remediation",
        matrixAffinity: 0.78
      },
      stats: {
        vulnerabilitiesDetected: 34,
        criticalFixes: 12,
        reputation: 1200,
        tokensEarned: 3200,
        winStreak: 5,
        matrixBreaches: 0
      },
      nftTokenId: "0x9876...5432",
      imageUrl: "/agents/patch-master.png",
      rarity: "legendary",
      matrixStatus: "active"
    },
    {
      id: "compliance_guardian_v1",
      name: "ComplianceGuard",
      role: "compliance",
      level: 29,
      xp: 1100,
      xpToNext: 1300,
      traits: {
        accuracy: 0.99,
        speed: 0.75,
        specialty: "Formal Verification",
        matrixAffinity: 0.82
      },
      stats: {
        vulnerabilitiesDetected: 67,
        criticalFixes: 5,
        reputation: 890,
        tokensEarned: 2100,
        winStreak: 3,
        matrixBreaches: 1
      },
      nftTokenId: "0x5432...1098",
      imageUrl: "/agents/compliance-guard.png",
      rarity: "common",
      matrixStatus: "upgrading"
    }
  ]);

  useEffect(() => {
    filterAgents();
  }, [searchTerm, activeFilter]);

  const filterAgents = () => {
    let filtered = agents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.traits.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(agent => agent.role === activeFilter);
    }

    setFilteredAgents(filtered);
  };

  const handleBattle = (agent: any) => {
    console.log(`Starting battle with ${agent.name}`);
    alert(`${agent.name} is entering the Matrix to battle vulnerabilities!`);
  };

  const connectWallet = () => {
    setIsWalletConnected(true);
    setWalletAddress("sei1sentinel...");
  };

  const mintNewAgent = () => {
    alert("Minting new Digital Sentinel NFT...");
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case "security_analyst": return <Shield className="w-4 h-4" />;
      case "threat_intel": return <Target className="w-4 h-4" />;
      case "remediation": return <Cpu className="w-4 h-4" />;
      case "compliance": return <Award className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Matrix Theme */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Gamepad2 className="w-8 h-8 text-green-400" />
          <h1 className="text-4xl font-bold text-foreground">
            Digital Sentinels
          </h1>
          <Gamepad2 className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose your Oracle. Level Up by Hunting Exploits. Protect the Matrix.
        </p>
        
        {/* Matrix Breach Alert */}
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">Matrix Breach Alert</span>
          </div>
          <p className="text-sm text-red-300 mt-1">
            New vulnerabilities detected. Deploy your Sentinels now!
          </p>
        </div>
      </div>

      {/* Wallet Connection & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {!isWalletConnected ? (
            <Button onClick={connectWallet} className="bg-gradient-to-r from-green-600 to-blue-600">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                <Network className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              <span className="text-sm text-muted-foreground">{walletAddress}</span>
            </div>
          )}
          
          <Button variant="outline" onClick={mintNewAgent}>
            <Plus className="w-4 h-4 mr-2" />
            Mint Sentinel
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search Sentinels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
          <Button variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="security_analyst" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="threat_intel" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Intel</span>
          </TabsTrigger>
          <TabsTrigger value="remediation" className="flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>Remediation</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Compliance</span>
          </TabsTrigger>
        </TabsList>

        {/* Agent Grid */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSelect={setSelectedAgent}
                onBattle={handleBattle}
                isSelected={selectedAgent?.id === agent.id}
              />
            ))}
          </div>
        </div>
      </Tabs>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <Card className="mt-8 border-green-500/20 bg-gradient-to-r from-green-900/5 to-blue-900/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 flex items-center justify-center border border-green-500/30`}>
                {getFilterIcon(selectedAgent.role)}
              </div>
              <div>
                <div className="text-2xl">{selectedAgent.name}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {selectedAgent.role.replace('_', ' ')} • Level {selectedAgent.level} • {selectedAgent.rarity.toUpperCase()}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Matrix Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2 text-green-400">
                  <Brain className="w-4 h-4" />
                  <span>Matrix Stats</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matrix Affinity</span>
                    <span className="font-semibold text-green-400">{(selectedAgent.traits.matrixAffinity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Streak</span>
                    <span className="font-semibold text-orange-400">{selectedAgent.stats.winStreak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matrix Breaches</span>
                    <span className="font-semibold text-red-400">{selectedAgent.stats.matrixBreaches}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Performance</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Detection Accuracy</span>
                    <span className="font-semibold">{(selectedAgent.traits.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Speed</span>
                    <span className="font-semibold">{(selectedAgent.traits.speed * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reputation Score</span>
                    <span className="font-semibold">{selectedAgent.stats.reputation}</span>
                  </div>
                </div>
              </div>

              {/* NFT Information */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2 text-purple-400">
                  <Award className="w-4 h-4" />
                  <span>NFT Details</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-mono text-xs">{selectedAgent.nftTokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rarity</span>
                    <Badge variant="outline" className={`
                      ${selectedAgent.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400/50' : ''}
                      ${selectedAgent.rarity === 'epic' ? 'text-purple-400 border-purple-400/50' : ''}
                      ${selectedAgent.rarity === 'rare' ? 'text-blue-400 border-blue-400/50' : ''}
                      ${selectedAgent.rarity === 'common' ? 'text-gray-400 border-gray-400/50' : ''}
                    `}>
                      {selectedAgent.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={`
                      ${selectedAgent.matrixStatus === 'oracle' ? 'text-green-400 bg-green-400/10 border-green-400/30' : ''}
                      ${selectedAgent.matrixStatus === 'active' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' : ''}
                      ${selectedAgent.matrixStatus === 'upgrading' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : ''}
                      ${selectedAgent.matrixStatus === 'breached' ? 'text-red-400 bg-red-400/10 border-red-400/30' : ''}
                    `}>
                      {selectedAgent.matrixStatus.charAt(0).toUpperCase() + selectedAgent.matrixStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-green-500/20">
              <Button 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                onClick={() => handleBattle(selectedAgent)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Deploy to Battle
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Upgrade Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zion Uprising Event Banner */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Flame className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-purple-400">Zion Uprising Event</h3>
          <Flame className="w-6 h-6 text-pink-400" />
        </div>
        <p className="text-purple-300 mb-4">
          Special rewards for agents who achieve 10+ win streaks during this event!
        </p>
        <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
          <Award className="w-4 h-4 mr-2" />
          View Event Details
        </Button>
      </div>
    </div>
  );
};
