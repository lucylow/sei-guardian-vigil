import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vote, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Play,
  Settings,
  Users,
  TrendingUp,
  FileText,
  Zap,
  Target
} from 'lucide-react';
import { useSeiBlockchain } from '@/hooks/useSeiBlockchain';

interface GovernanceProposal {
  id: number;
  title: string;
  description: string;
  creator: string;
  status: 'pending' | 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  startTime: number;
  endTime: number;
  metadata?: string;
}

interface UserVote {
  proposalId: number;
  vote: 'yes' | 'no' | 'abstain';
  timestamp: number;
}

export default function OnChainGovernance() {
  const [contractAddress, setContractAddress] = useState('');
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New proposal form
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    metadata: ''
  });

  const {
    wallet,
    networkStatus,
    currentNetwork,
    getGovernanceProposals,
    getGovernanceProposal,
    submitGovernanceProposal,
    voteOnProposal,
    executeProposal,
    clearError
  } = useSeiBlockchain();

  // Load proposals from blockchain
  const loadProposals = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter a governance contract address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const proposalsData = await getGovernanceProposals(contractAddress);
      
      // Transform blockchain data to our interface
      const transformedProposals: GovernanceProposal[] = proposalsData.map((proposal: any) => ({
        id: proposal.id,
        title: proposal.title || 'Untitled Proposal',
        description: proposal.description || 'No description provided',
        creator: proposal.creator || 'Unknown',
        status: proposal.status || 'pending',
        votesFor: proposal.votes_for || 0,
        votesAgainst: proposal.votes_against || 0,
        votesAbstain: proposal.votes_abstain || 0,
        totalVotes: (proposal.votes_for || 0) + (proposal.votes_against || 0) + (proposal.votes_abstain || 0),
        quorum: proposal.quorum || 100,
        startTime: proposal.start_time || Date.now(),
        endTime: proposal.end_time || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days default
        metadata: proposal.metadata || ''
      }));

      setProposals(transformedProposals);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load proposals');
      console.error('Failed to load proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new proposal
  const handleSubmitProposal = async () => {
    if (!wallet || wallet.type !== 'cosmwasm') {
      setError('Please connect a CosmWasm wallet to submit proposals');
      return;
    }

    if (!contractAddress.trim()) {
      setError('Please enter a governance contract address');
      return;
    }

    if (!newProposal.title.trim()) {
      setError('Please enter a proposal title');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await submitGovernanceProposal(
        contractAddress,
        newProposal.title,
        newProposal.description,
        newProposal.metadata
      );

      console.log('Proposal submitted successfully:', result);
      
      // Reset form
      setNewProposal({ title: '', description: '', metadata: '' });
      
      // Reload proposals
      await loadProposals();
      
      // You could add a success toast here
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit proposal');
      console.error('Failed to submit proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Vote on proposal
  const handleVote = async (proposalId: number, vote: 'yes' | 'no' | 'abstain') => {
    if (!wallet || wallet.type !== 'cosmwasm') {
      setError('Please connect a CosmWasm wallet to vote');
      return;
    }

    if (!contractAddress.trim()) {
      setError('Please enter a governance contract address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await voteOnProposal(
        contractAddress,
        proposalId,
        vote,
        `Vote cast by ${wallet.address}`
      );

      console.log('Vote submitted successfully:', result);
      
      // Update local state
      const newVote: UserVote = {
        proposalId,
        vote,
        timestamp: Date.now()
      };
      
      setUserVotes(prev => {
        const existing = prev.find(v => v.proposalId === proposalId);
        if (existing) {
          return prev.map(v => v.proposalId === proposalId ? newVote : v);
        }
        return [...prev, newVote];
      });

      // Reload proposals to get updated vote counts
      await loadProposals();
      
      // You could add a success toast here
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit vote');
      console.error('Failed to submit vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute proposal
  const handleExecuteProposal = async (proposalId: number) => {
    if (!wallet || wallet.type !== 'cosmwasm') {
      setError('Please connect a CosmWasm wallet to execute proposals');
      return;
    }

    if (!contractAddress.trim()) {
      setError('Please enter a governance contract address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await executeProposal(contractAddress, proposalId);
      console.log('Proposal executed successfully:', result);
      
      // Reload proposals
      await loadProposals();
      
      // You could add a success toast here
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to execute proposal');
      console.error('Failed to execute proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time remaining
  const formatTimeLeft = (endTime: number) => {
    const diff = endTime - Date.now();
    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  // Get proposal status info
  const getProposalStatusInfo = (proposal: GovernanceProposal) => {
    const now = Date.now();
    const isActive = proposal.status === 'active' && now >= proposal.startTime && now <= proposal.endTime;
    const isExpired = now > proposal.endTime;
    const hasQuorum = proposal.totalVotes >= proposal.quorum;
    const canExecute = proposal.status === 'passed' && hasQuorum;

    return { isActive, isExpired, hasQuorum, canExecute };
  };

  // Get user's vote for a proposal
  const getUserVote = (proposalId: number) => {
    return userVotes.find(v => v.proposalId === proposalId);
  };

  // Calculate vote percentages
  const getVotePercentages = (proposal: GovernanceProposal) => {
    const total = proposal.totalVotes || 1;
    return {
      for: (proposal.votesFor / total) * 100,
      against: (proposal.votesAgainst / total) * 100,
      abstain: (proposal.votesAbstain / total) * 100
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">On-Chain Governance</h1>
        <p className="text-muted-foreground">
          Participate in decentralized governance on SEI blockchain
        </p>
      </div>

      {/* Contract Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Governance Contract Configuration
          </CardTitle>
          <CardDescription>
            Enter the address of your governance smart contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="contractAddress">Contract Address</Label>
              <Input
                id="contractAddress"
                placeholder="sei1..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={loadProposals}
                disabled={!contractAddress.trim() || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Load Proposals
              </Button>
            </div>
          </div>

          {/* Network Status */}
          {networkStatus && (
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Network Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={networkStatus.isOnline ? "default" : "destructive"}>
                  {networkStatus.isOnline ? 'Online' : 'Offline'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {currentNetwork} • #{networkStatus.blockHeight.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            Proposals ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="submit" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Submit Proposal
          </TabsTrigger>
        </TabsList>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          {proposals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {contractAddress.trim() ? 'No proposals found' : 'Enter a contract address to load proposals'}
                </p>
              </CardContent>
            </Card>
          ) : (
            proposals.map((proposal) => {
              const statusInfo = getProposalStatusInfo(proposal);
              const userVote = getUserVote(proposal.id);
              const votePercentages = getVotePercentages(proposal);

              return (
                <Card key={proposal.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{proposal.title}</CardTitle>
                          <Badge
                            variant={
                              proposal.status === 'passed' ? 'default' :
                              proposal.status === 'rejected' ? 'destructive' :
                              proposal.status === 'executed' ? 'secondary' :
                              'outline'
                            }
                          >
                            {proposal.status.toUpperCase()}
                          </Badge>
                          {statusInfo.isActive && (
                            <Badge variant="default" className="bg-green-600">
                              <Clock className="w-3 h-3 mr-1" />
                              ACTIVE
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base mb-2">
                          {proposal.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Creator: {proposal.creator}</span>
                          <span>Quorum: {proposal.totalVotes}/{proposal.quorum}</span>
                          <span>Ends: {formatTimeLeft(proposal.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Vote Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Votes: {proposal.totalVotes} / {proposal.quorum} (Quorum)</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeLeft(proposal.endTime)}
                        </span>
                      </div>
                      <Progress
                        value={(proposal.totalVotes / proposal.quorum) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          For: {proposal.votesFor} ({votePercentages.for.toFixed(1)}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Against: {proposal.votesAgainst} ({votePercentages.against.toFixed(1)}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          Abstain: {proposal.votesAbstain} ({votePercentages.abstain.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {/* User Vote Status */}
                    {userVote && (
                      <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">Your Vote: {userVote.vote.toUpperCase()}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {statusInfo.isActive && !userVote && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVote(proposal.id, 'yes')}
                            disabled={!wallet || wallet.type !== 'cosmwasm' || isLoading}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Vote Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleVote(proposal.id, 'no')}
                            disabled={!wallet || wallet.type !== 'cosmwasm' || isLoading}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Vote No
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVote(proposal.id, 'abstain')}
                            disabled={!wallet || wallet.type !== 'cosmwasm' || isLoading}
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Abstain
                          </Button>
                        </>
                      )}

                      {statusInfo.canExecute && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleExecuteProposal(proposal.id)}
                          disabled={!wallet || wallet.type !== 'cosmwasm' || isLoading}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Execute
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Submit Proposal Tab */}
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Submit New Governance Proposal
              </CardTitle>
              <CardDescription>
                Create a new proposal for community voting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!wallet ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please connect a CosmWasm wallet to submit proposals
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div>
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, concise title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your proposal"
                      rows={4}
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="metadata">Metadata (Optional)</Label>
                    <Input
                      id="metadata"
                      placeholder="Additional metadata or links"
                      value={newProposal.metadata}
                      onChange={(e) => setNewProposal({...newProposal, metadata: e.target.value})}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitProposal}
                    disabled={!newProposal.title.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Proposal
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
