import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SeiWalletConnector from "@/components/SeiWalletConnector";
import OnChainGovernance from "@/components/OnChainGovernance";
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
  Play,
  Star,
  Crown,
  UserCheck,
  FileText,
  AlertCircle,
  CheckSquare,
  Square,
  Timer,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: "agent-governance" | "security-policy" | "treasury" | "bounty" | "emergency";
  status: "discussion" | "voting" | "passed" | "rejected" | "executed" | "expired";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endDate: string;
  proposer: string;
  requiredQuorum: number;
  deadline: number;
  userVote?: "for" | "against" | null;
  votingPower?: number;
  category: string;
  tags: string[];
  discussionThread?: string;
  executionData?: any;
}

interface GovernanceRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  requiredStake: number;
  currentHolders: number;
  icon: React.ReactNode;
  color: string;
}

export default function Governance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userVotingPower, setUserVotingPower] = useState(0);
  const [userRole, setUserRole] = useState<string>("voter");
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    type: "agent-governance" as const,
    category: "",
    tags: [] as string[]
  });

  // Mock data initialization
  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: "1",
        title: "Implement Multi-Signature Agent Deployment",
        description: "Require 3 out of 5 validator signatures for deploying high-risk security agents to mainnet. This enhances security by preventing single points of failure in agent deployment.",
        type: "agent-governance",
        status: "voting",
        votesFor: 1250,
        votesAgainst: 320,
        totalVotes: 1570,
        endDate: "2024-02-15",
        proposer: "sei1validator123...",
        requiredQuorum: 2000,
        deadline: Date.now() + 3600000 * 6, // 6 hours
        userVote: null,
        votingPower: 150,
        category: "Security Enhancement",
        tags: ["agents", "security", "multisig"],
        discussionThread: "https://forum.sei-sentinel.com/proposal-1"
      },
      {
        id: "2", 
        title: "Security Bounty Pool Allocation",
        description: "Allocate 10,000 SEI tokens to the security bounty pool for Q1 2024. This will incentivize white-hat hackers and security researchers to find vulnerabilities.",
        type: "bounty",
        status: "passed",
        votesFor: 2100,
        votesAgainst: 450,
        totalVotes: 2550,
        endDate: "2024-01-30",
        proposer: "sei1security456...",
        requiredQuorum: 2000,
        deadline: Date.now() + 3600000 * 12, // 12 hours
        userVote: "for",
        votingPower: 150,
        category: "Funding",
        tags: ["bounty", "funding", "security"],
        discussionThread: "https://forum.sei-sentinel.com/proposal-2"
      },
      {
        id: "3",
        title: "Update Agent Audit Requirements",
        description: "Mandate comprehensive security audits for all DeFi-related agent templates. This ensures higher security standards for financial applications.",
        type: "security-policy",
        status: "voting", 
        votesFor: 890,
        votesAgainst: 1200,
        totalVotes: 2090,
        endDate: "2024-02-20",
        proposer: "sei1auditor789...",
        requiredQuorum: 2000,
        deadline: Date.now() + 3600000 * 24, // 24 hours
        userVote: null,
        votingPower: 150,
        category: "Policy Update",
        tags: ["policy", "audit", "defi"],
        discussionThread: "https://forum.sei-sentinel.com/proposal-3"
      },
      {
        id: "4",
        title: "Emergency: Critical Vulnerability Patch",
        description: "Immediate deployment of security patch for recently discovered reentrancy vulnerability in lending protocol agents.",
        type: "emergency",
        status: "voting",
        votesFor: 1800,
        votesAgainst: 200,
        totalVotes: 2000,
        endDate: "2024-02-10",
        proposer: "sei1emergency001...",
        requiredQuorum: 1500,
        deadline: Date.now() + 3600000 * 2, // 2 hours
        userVote: null,
        votingPower: 150,
        category: "Emergency",
        tags: ["emergency", "patch", "vulnerability"],
        discussionThread: "https://forum.sei-sentinel.com/proposal-4"
      }
    ];
    setProposals(mockProposals);
  }, []);

  // Mock wallet connection
  const connectWallet = () => {
    setWalletAddress("sei1user123456789...");
    setUserVotingPower(150); // Mock voting power
    setUserRole("voter");
  };

  // Enhanced voting function with quadratic voting simulation
  const castVote = (proposalId: string, vote: "for" | "against") => {
    if (!walletAddress) {
      alert("Please connect your wallet to vote");
      return;
    }

    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        const newVote = vote;
        const oldVote = p.userVote;
        
        // Update vote counts
        if (oldVote === "for" && newVote === "against") {
          p.votesFor -= 1;
          p.votesAgainst += 1;
        } else if (oldVote === "against" && newVote === "for") {
          p.votesFor += 1;
          p.votesAgainst -= 1;
        } else if (oldVote === null) {
          if (newVote === "for") p.votesFor += 1;
          else p.votesAgainst += 1;
        }
        
        p.userVote = newVote;
        p.totalVotes = p.votesFor + p.votesAgainst;
      }
      return p;
    }));
  };

  // Format time remaining
  const formatTimeLeft = (deadline: number) => {
    const diff = deadline - Date.now();
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "discussion": return { color: "bg-yellow-500", icon: <Clock className="w-4 h-4" /> };
      case "voting": return { color: "bg-blue-500", icon: <Vote className="w-4 h-4" /> };
      case "passed": return { color: "bg-green-500", icon: <CheckCircle className="w-4 h-4" /> };
      case "rejected": return { color: "bg-red-500", icon: <XCircle className="w-4 h-4" /> };
      case "executed": return { color: "bg-purple-500", icon: <Rocket className="w-4 h-4" /> };
      case "expired": return { color: "bg-gray-500", icon: <Timer className="w-4 h-4" /> };
      default: return { color: "bg-gray-500", icon: <AlertCircle className="w-4 h-4" /> };
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "agent-governance": return <Bot className="w-4 h-4" />;
      case "security-policy": return <Shield className="w-4 h-4" />;
      case "treasury": return <DollarSign className="w-4 h-4" />;
      case "bounty": return <Trophy className="w-4 h-4" />;
      case "emergency": return <AlertTriangle className="w-4 h-4" />;
      default: return <Vote className="w-4 h-4" />;
    }
  };

  // Governance roles data
  const governanceRoles: GovernanceRole[] = [
    {
      id: "voter",
      name: "Voter",
      description: "Basic governance participant with voting rights",
      permissions: ["Vote on proposals", "View governance data"],
      requiredStake: 0,
      currentHolders: 2847,
      icon: <Vote className="w-4 h-4" />,
      color: "text-blue-500"
    },
    {
      id: "proposer",
      name: "Proposer",
      description: "Can submit new governance proposals",
      permissions: ["Submit proposals", "Vote on proposals", "View governance data"],
      requiredStake: 100,
      currentHolders: 156,
      icon: <PlusCircle className="w-4 h-4" />,
      color: "text-green-500"
    },
    {
      id: "validator",
      name: "Validator",
      description: "Network validator with enhanced governance rights",
      permissions: ["Submit proposals", "Vote on proposals", "Execute passed proposals", "Emergency actions"],
      requiredStake: 10000,
      currentHolders: 25,
      icon: <Shield className="w-4 h-4" />,
      color: "text-purple-500"
    },
    {
      id: "guardian",
      name: "Guardian",
      description: "Top-tier governance role with veto power",
      permissions: ["Submit proposals", "Vote on proposals", "Execute proposals", "Veto proposals", "Emergency actions"],
      requiredStake: 50000,
      currentHolders: 5,
      icon: <Crown className="w-4 h-4" />,
      color: "text-yellow-500"
    }
  ];

  // Treasury data
  const treasuryData = {
    totalBalance: 45230,
    allocations: {
      development: 12500,
      bounties: 15000,
      marketing: 8000,
      emergency: 5000,
      unallocated: 4730
    },
    recentTransactions: [
      { type: "in", amount: 2100, description: "Protocol fees", timestamp: "2 hours ago" },
      { type: "out", amount: 5000, description: "Bounty payout", timestamp: "1 day ago" },
      { type: "in", amount: 1500, description: "Donation", timestamp: "3 days ago" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Gavel className="w-10 h-10 text-red-600" />
            SEI Sentinel DAO Governance
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Participate in decentralized governance of the SEI Sentinel ecosystem. Vote on proposals, 
            submit new ideas, and help shape the future of blockchain security.
          </p>
          
          {/* Wallet Connection */}
          {!walletAddress ? (
            <Button onClick={connectWallet} className="mt-4 bg-red-600 hover:bg-red-700">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet to Participate
            </Button>
          ) : (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-red-800">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">Connected: {walletAddress}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Voting Power: {userVotingPower} SEI
                </Badge>
                <Badge variant="outline" className="border-red-300 text-red-700">
                  Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              </div>
            </div>
          )}
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
              <div className="text-2xl font-bold text-blue-600">
                {proposals.filter(p => p.status === "voting").length}
              </div>
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
              <div className="text-2xl font-bold text-yellow-600">{treasuryData.totalBalance.toLocaleString()} SEI</div>
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

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="treasury" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Treasury
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="onchain" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              On-Chain
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Governance Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {proposals.slice(0, 3).map((proposal) => (
                      <div key={proposal.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getStatusInfo(proposal.status).color}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{proposal.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} • {formatTimeLeft(proposal.deadline)}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {proposal.type.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Treasury Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Treasury Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(treasuryData.allocations).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(value / treasuryData.totalBalance) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{value.toLocaleString()} SEI</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab("proposals")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <Vote className="w-6 h-6" />
                    <span>View Proposals</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("create")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <span>Create Proposal</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("treasury")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <DollarSign className="w-6 h-6" />
                    <span>View Treasury</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Proposals</h2>
              <div className="flex gap-2">
                <Badge variant="outline">All</Badge>
                <Badge variant="outline">Active</Badge>
                <Badge variant="outline">Passed</Badge>
                <Badge variant="outline">Rejected</Badge>
              </div>
            </div>

            <div className="space-y-4">
              {proposals.map((proposal) => {
                const statusInfo = getStatusInfo(proposal.status);
                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                const forPercent = totalVotes ? ((proposal.votesFor / totalVotes) * 100).toFixed(0) : 0;
                const againstPercent = totalVotes ? ((proposal.votesAgainst / totalVotes) * 100).toFixed(0) : 0;
                const userVote = proposal.userVote;

                return (
                  <Card key={proposal.id} className="border-l-4" style={{borderLeftColor: statusInfo.color.replace('bg-', '#')}}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getTypeIcon(proposal.type)}
                            <CardTitle className="text-xl">{proposal.title}</CardTitle>
                            <Badge 
                              variant={proposal.status === "voting" ? "default" : "secondary"}
                              className={`${statusInfo.color} text-white`}
                            >
                              {proposal.status.toUpperCase()}
                            </Badge>
                            {proposal.type === "emergency" && (
                              <Badge variant="destructive" className="animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                EMERGENCY
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base">
                            {proposal.description}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Category: {proposal.category}</span>
                            <span>Proposed by: {proposal.proposer}</span>
                            <span>Quorum: {proposal.totalVotes}/{proposal.requiredQuorum}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {proposal.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Voting Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Votes: {proposal.totalVotes} / {proposal.requiredQuorum} (Quorum)</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeLeft(proposal.deadline)}
                            </span>
                          </div>
                          <Progress 
                            value={(proposal.totalVotes / proposal.requiredQuorum) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              For: {proposal.votesFor} ({forPercent}%)
                            </span>
                            <span className="flex items-center gap-1">
                              <XCircle className="w-4 h-4 text-red-500" />
                              Against: {proposal.votesAgainst} ({againstPercent}%)
                            </span>
                          </div>
                        </div>

                        {/* User Vote Status */}
                        {userVote && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-800">
                              <Target className="w-4 h-4" />
                              <span className="font-medium">Your Vote: {userVote.toUpperCase()}</span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {proposal.status === "voting" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className={`${userVote === "for" ? "bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={() => castVote(proposal.id, "for")}
                              disabled={!walletAddress}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {userVote === "for" ? "Voted For" : "Vote For"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className={userVote === "against" ? "bg-red-700" : ""}
                              onClick={() => castVote(proposal.id, "against")}
                              disabled={!walletAddress}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              {userVote === "against" ? "Voted Against" : "Vote Against"}
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Discussion
                            </Button>
                          </div>
                        )}

                        {/* Emergency Actions */}
                        {proposal.type === "emergency" && proposal.status === "voting" && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-medium">Emergency Proposal - Expedited Voting (2 hours)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Create Proposal Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Create New Governance Proposal
                </CardTitle>
                <CardDescription>
                  Submit a new governance proposal for community voting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Proposal Title</Label>
                  <Input
                    id="title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    placeholder="Enter a clear, concise title for your proposal"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Proposal Type</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newProposal.type}
                    onChange={(e) => setNewProposal({...newProposal, type: e.target.value as any})}
                  >
                    <option value="agent-governance">Agent Governance</option>
                    <option value="security-policy">Security Policy</option>
                    <option value="treasury">Treasury Management</option>
                    <option value="bounty">Bounty Program</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProposal.category}
                    onChange={(e) => setNewProposal({...newProposal, category: e.target.value})}
                    placeholder="e.g., Security Enhancement, Funding, Policy Update"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    placeholder="Provide a detailed description of your proposal, including rationale and expected impact"
                    rows={6}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Proposal Requirements</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Minimum 100 SEI tokens staked to submit</li>
                    <li>• Proposal must receive 2,000 votes to reach quorum</li>
                    <li>• Voting period: 7 days from submission</li>
                    <li>• Simple majority (&gt;50%) required to pass</li>
                  </ul>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!walletAddress}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  {walletAddress ? "Submit Proposal (100 SEI)" : "Connect Wallet to Submit"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treasury Tab */}
          <TabsContent value="treasury" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Treasury Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{treasuryData.totalBalance.toLocaleString()} SEI</div>
                    <div className="text-sm text-green-700">Total Balance</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{treasuryData.allocations.bounties.toLocaleString()} SEI</div>
                    <div className="text-sm text-blue-700">Allocated to Bounties</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{treasuryData.allocations.unallocated.toLocaleString()} SEI</div>
                    <div className="text-sm text-purple-700">Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Treasury Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {treasuryData.recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {tx.type === "in" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">{tx.description}</div>
                          <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                        </div>
                      </div>
                      <div className={`font-medium ${tx.type === "in" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "in" ? "+" : "-"}{tx.amount.toLocaleString()} SEI
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {governanceRoles.map((role) => (
                <Card key={role.id} className="border-l-4" style={{borderLeftColor: role.color.replace('text-', '#')}}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={role.color}>
                        {role.icon}
                      </div>
                      {role.name}
                    </CardTitle>
                    <CardDescription>
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Required Stake</span>
                        <span className="font-medium">{role.requiredStake.toLocaleString()} SEI</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Holders</span>
                        <span className="font-medium">{role.currentHolders}</span>
                      </div>
                      <div className="pt-2">
                        <div className="text-sm font-medium mb-2">Permissions:</div>
                        <div className="space-y-1">
                          {role.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckSquare className="w-3 h-3 text-green-500" />
                              {permission}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Role Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>How to Upgrade Your Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Current Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</h4>
                    <p className="text-blue-800 text-sm">
                      You currently have {userVotingPower} SEI staked. To upgrade your role, increase your stake to meet the requirements above.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Lock className="w-6 h-6" />
                      <span>Stake More SEI</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Star className="w-6 h-6" />
                      <span>Earn Rewards</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <UserCheck className="w-6 h-6" />
                      <span>Apply for Role</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* On-Chain Governance Tab */}
          <TabsContent value="onchain" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wallet Connector */}
              <div>
                <SeiWalletConnector />
              </div>
              
              {/* On-Chain Governance Interface */}
              <div>
                <OnChainGovernance />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
