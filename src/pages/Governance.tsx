import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Activity
} from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: "agent-governance" | "security-policy" | "treasury" | "bounty";
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endDate: string;
  proposer: string;
  requiredQuorum: number;
  deadline: number;
  userVote?: "for" | "against" | null;
}

export default function Governance() {
  const [activeTab, setActiveTab] = useState("proposals");
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    type: "agent-governance" as const
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userVotingPower, setUserVotingPower] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Enhanced mock data with deadlines and user votes
  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: "1",
        title: "Implement Multi-Signature Agent Deployment",
        description: "Require 3 out of 5 validator signatures for deploying high-risk security agents to mainnet",
        type: "agent-governance",
        status: "active",
        votesFor: 1250,
        votesAgainst: 320,
        totalVotes: 1570,
        endDate: "2024-02-15",
        proposer: "sei1validator123...",
        requiredQuorum: 2000,
        deadline: Date.now() + 3600000 * 6, // 6 hours
        userVote: null
      },
      {
        id: "2", 
        title: "Security Bounty Pool Allocation",
        description: "Allocate 10,000 SEI tokens to the security bounty pool for Q1 2024",
        type: "bounty",
        status: "passed",
        votesFor: 2100,
        votesAgainst: 450,
        totalVotes: 2550,
        endDate: "2024-01-30",
        proposer: "sei1security456...",
        requiredQuorum: 2000,
        deadline: Date.now() + 3600000 * 12, // 12 hours
        userVote: "for"
      },
      {
        id: "3",
        title: "Update Agent Audit Requirements",
        description: "Mandate comprehensive security audits for all DeFi-related agent templates",
        type: "security-policy",
        status: "active", 
        votesFor: 890,
        votesAgainst: 1200,
        totalVotes: 2090,
        endDate: "2024-02-20",
        proposer: "sei1auditor789...",
        requiredQuorum: 2000,
        deadline: Date.now() + 3600000 * 24, // 24 hours
        userVote: null
      }
    ];
    setProposals(mockProposals);
  }, []);

  // Mock wallet connection
  const connectWallet = () => {
    setWalletAddress("sei1user123456789...");
    setUserVotingPower(150); // Mock voting power
  };

  // Enhanced voting function
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-500";
      case "passed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "agent-governance": return <Users className="w-4 h-4" />;
      case "security-policy": return <Shield className="w-4 h-4" />;
      case "treasury": return <DollarSign className="w-4 h-4" />;
      case "bounty": return <Trophy className="w-4 h-4" />;
      default: return <Vote className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Gavel className="w-10 h-10 text-blue-600" />
          SEI Sentinel DAO Governance
        </h1>
        <p className="text-lg text-muted-foreground">
          Participate in decentralized governance of the SEI Sentinel ecosystem. Vote on proposals, 
          submit new ideas, and help shape the future of blockchain security.
        </p>
        
        {/* Wallet Connection */}
        {!walletAddress ? (
          <Button onClick={connectWallet} className="mt-4 bg-green-600 hover:bg-green-700">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet to Vote
          </Button>
        ) : (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <Wallet className="w-4 h-4" />
              <span className="font-medium">Connected: {walletAddress}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Voting Power: {userVotingPower} SEI
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
              {proposals.filter(p => p.status === "active").length}
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

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Proposal
          </TabsTrigger>
          <TabsTrigger value="treasury" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Treasury
          </TabsTrigger>
          <TabsTrigger value="validators" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Validators
          </TabsTrigger>
        </TabsList>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Proposals</h2>
            <div className="flex gap-2">
              <Badge variant="outline">All</Badge>
              <Badge variant="outline">Agent Governance</Badge>
              <Badge variant="outline">Security Policy</Badge>
              <Badge variant="outline">Treasury</Badge>
              <Badge variant="outline">Bounty</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="border-l-4" style={{borderLeftColor: getStatusColor(proposal.status).replace('bg-', '#')}}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(proposal.type)}
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <Badge 
                          variant={proposal.status === "active" ? "default" : "secondary"}
                          className={`${getStatusColor(proposal.status)} text-white`}
                        >
                          {proposal.status.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {proposal.description}
                      </CardDescription>
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
                          For: {proposal.votesFor}
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Against: {proposal.votesAgainst}
                        </span>
                      </div>
                    </div>

                    {/* User Vote Status */}
                    {proposal.userVote && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">Your Vote: {proposal.userVote.toUpperCase()}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {proposal.status === "active" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className={`${proposal.userVote === "for" ? "bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
                          onClick={() => castVote(proposal.id, "for")}
                          disabled={!walletAddress}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {proposal.userVote === "for" ? "Voted For" : "Vote For"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className={proposal.userVote === "against" ? "bg-red-700" : ""}
                          onClick={() => castVote(proposal.id, "against")}
                          disabled={!walletAddress}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {proposal.userVote === "against" ? "Voted Against" : "Vote Against"}
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create Proposal Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Create New Proposal
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
                  <div className="text-2xl font-bold text-green-600">45,230 SEI</div>
                  <div className="text-sm text-green-700">Total Balance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12,500 SEI</div>
                  <div className="text-sm text-blue-700">Allocated to Bounties</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">32,730 SEI</div>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">Bounty Pool Allocation</div>
                    <div className="text-sm text-muted-foreground">Proposal #2 - Passed</div>
                  </div>
                  <div className="text-red-600 font-medium">-10,000 SEI</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">Validator Rewards</div>
                    <div className="text-sm text-muted-foreground">Monthly distribution</div>
                  </div>
                  <div className="text-red-600 font-medium">-5,200 SEI</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">Protocol Fees</div>
                    <div className="text-sm text-muted-foreground">Agent deployment fees</div>
                  </div>
                  <div className="text-green-600 font-medium">+2,100 SEI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validators Tab */}
        <TabsContent value="validators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Validator Network
              </CardTitle>
              <CardDescription>
                Security validators responsible for agent governance and network security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sei Guardian Alpha", stake: "125,000 SEI", uptime: "99.8%", status: "active" },
                  { name: "Security Sentinel", stake: "98,500 SEI", uptime: "99.5%", status: "active" },
                  { name: "Blockchain Defender", stake: "87,200 SEI", uptime: "98.9%", status: "active" },
                  { name: "Crypto Shield", stake: "76,800 SEI", uptime: "99.2%", status: "active" },
                  { name: "Network Guardian", stake: "65,300 SEI", uptime: "97.8%", status: "warning" },
                ].map((validator, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${validator.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <div className="font-medium">{validator.name}</div>
                        <div className="text-sm text-muted-foreground">Stake: {validator.stake}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Uptime: {validator.uptime}</div>
                      <Badge variant={validator.status === 'active' ? 'default' : 'secondary'}>
                        {validator.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
