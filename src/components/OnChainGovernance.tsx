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
  id: string;
  title: string;
  description: string;
  status: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  total_votes: number;
  end_time: number;
  creator: string;
  metadata?: string;
}

interface UserVote {
  proposalId: string;
  vote: 'yes' | 'no' | 'abstain';
  timestamp: number;
}

export default function OnChainGovernance() {
  const [contractAddress, setContractAddress] = useState('');
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    submitGovernanceProposal, 
    voteOnProposal, 
    executeProposal, 
    clearError 
  } = useSeiBlockchain();

  // Load proposals from blockchain
  const loadProposals = async () => {
    if (!contractAddress.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const blockchainProposals = await getGovernanceProposals(contractAddress);
      
      // Transform blockchain data to our interface
      const transformedProposals = blockchainProposals.map((proposal: any) => ({
        id: proposal.id || proposal.proposal_id,
        title: proposal.title,
        description: proposal.description,
        status: proposal.status || 'active',
        votes_for: proposal.votes_for || proposal.votes_yes || 0,
        votes_against: proposal.votes_against || proposal.votes_no || 0,
        votes_abstain: proposal.votes_abstain || 0,
        total_votes: (proposal.votes_for || proposal.votes_yes || 0) + 
                    (proposal.votes_against || proposal.votes_no || 0) + 
                    (proposal.votes_abstain || 0),
        end_time: proposal.end_time || proposal.deadline || Date.now() + 7 * 24 * 60 * 60 * 1000,
        creator: proposal.creator || proposal.proposer,
        metadata: proposal.metadata || ''
      }));
      
      setProposals(transformedProposals);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new proposal
  const handleSubmitProposal = async () => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
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
      
      console.log('Proposal submitted:', result);
      
      // Reset form and reload proposals
      setNewProposal({ title: '', description: '', metadata: '' });
      await loadProposals();
      
      // Show success message
      alert('Proposal submitted successfully!');
    } catch (error) {
      console.error('Failed to submit proposal:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Vote on proposal
  const handleVote = async (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await voteOnProposal(
        contractAddress,
        parseInt(proposalId),
        vote,
        `Vote: ${vote}`
      );
      
      console.log('Vote submitted:', result);
      
      // Update local state
      setUserVotes(prev => [...prev.filter(v => v.proposalId !== proposalId), {
        proposalId,
        vote,
        timestamp: Date.now()
      }]);
      
      // Reload proposals to get updated vote counts
      await loadProposals();
      
      alert(`Vote submitted successfully: ${vote}`);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute proposal
  const handleExecuteProposal = async (proposalId: string) => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await executeProposal(contractAddress, parseInt(proposalId));
      
      console.log('Proposal executed:', result);
      
      // Reload proposals
      await loadProposals();
      
      alert('Proposal executed successfully!');
    } catch (error) {
      console.error('Failed to execute proposal:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time left
  const formatTimeLeft = (endTime: number) => {
    const ms = endTime - Date.now();
    if (ms <= 0) return 'Expired';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  // Get proposal status info
  const getProposalStatusInfo = (proposal: GovernanceProposal) => {
    const totalVotes = proposal.total_votes;
    const forPercent = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;
    const againstPercent = totalVotes > 0 ? (proposal.votes_against / totalVotes) * 100 : 0;
    
    return { forPercent, againstPercent, totalVotes };
  };

  // Get user's vote on a proposal
  const getUserVote = (proposalId: string) => {
    return userVotes.find(vote => vote.proposalId === proposalId);
  };

  // Get vote percentages
  const getVotePercentages = (proposal: GovernanceProposal) => {
    const { forPercent, againstPercent } = getProposalStatusInfo(proposal);
    return { forPercent, againstPercent };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">On-Chain Governance</h1>
          <p className="text-muted-foreground">
            Interact with SEI governance contracts directly on the blockchain
          </p>
        </div>
        {networkStatus && (
          <div className="text-right">
            <Badge variant={networkStatus.isOnline ? "default" : "destructive"}>
              {networkStatus.isOnline ? "🟢" : "🔴"} {networkStatus.network}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              Block {networkStatus.blockHeight?.toLocaleString() || 'N/A'}
            </div>
          </div>
        )}
      </div>

      {/* Contract Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Contract Configuration
          </CardTitle>
          <CardDescription>
            Enter the governance contract address to interact with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract-address">Governance Contract Address</Label>
              <Input
                id="contract-address"
                placeholder="sei1..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Current Network</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentNetwork === 'mainnet' && '🌐'}
                  {currentNetwork === 'testnet' && '🧪'}
                  {currentNetwork === 'evm' && '⚡'}
                  {currentNetwork}
                </Badge>
                {networkStatus?.chainId && (
                  <span className="text-xs text-muted-foreground">
                    {networkStatus.chainId}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={loadProposals} 
              disabled={!contractAddress.trim() || isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Load Proposals
            </Button>
            {proposals.length > 0 && (
              <Badge variant="secondary">
                {proposals.length} proposals loaded
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearError}
              className="ml-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading proposals...
            </div>
          ) : proposals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No proposals found. Enter a contract address and click "Load Proposals" to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => {
                const { forPercent, againstPercent, totalVotes } = getProposalStatusInfo(proposal);
                const userVote = getUserVote(proposal.id);
                const isExpired = proposal.end_time < Date.now();
                const canExecute = proposal.status === 'passed' && !isExpired;
                
                return (
                  <Card key={proposal.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {proposal.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant={
                            proposal.status === 'passed' ? 'default' :
                            proposal.status === 'rejected' ? 'destructive' :
                            proposal.status === 'executed' ? 'secondary' :
                            'outline'
                          }>
                            {proposal.status}
                          </Badge>
                          {isExpired && (
                            <Badge variant="outline">Expired</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Proposal Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Creator:</span>
                          <div className="font-mono text-xs truncate">{proposal.creator}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End Time:</span>
                          <div className="font-mono text-xs">{formatTimeLeft(proposal.end_time)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Votes:</span>
                          <div className="font-mono">{totalVotes}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Your Vote:</span>
                          <div>
                            {userVote ? (
                              <Badge variant="outline" className="text-xs">
                                {userVote.vote === 'yes' ? '✅ Yes' : 
                                 userVote.vote === 'no' ? '❌ No' : '🤷 Abstain'}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">Not voted</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vote Progress Bars */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Votes For: {proposal.votes_for}</span>
                          <span>Votes Against: {proposal.votes_against}</span>
                          <span>Abstain: {proposal.votes_abstain}</span>
                        </div>
                        <div className="flex h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${forPercent}%` }}
                          />
                          <div 
                            className="bg-red-500 h-full transition-all duration-300"
                            style={{ width: `${againstPercent}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {forPercent.toFixed(1)}% for, {againstPercent.toFixed(1)}% against
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {!isExpired && proposal.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant={userVote?.vote === 'yes' ? 'default' : 'outline'}
                              onClick={() => handleVote(proposal.id, 'yes')}
                              disabled={!wallet || isLoading}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Vote Yes
                            </Button>
                            <Button
                              size="sm"
                              variant={userVote?.vote === 'no' ? 'destructive' : 'outline'}
                              onClick={() => handleVote(proposal.id, 'no')}
                              disabled={!wallet || isLoading}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Vote No
                            </Button>
                            <Button
                              size="sm"
                              variant={userVote?.vote === 'abstain' ? 'secondary' : 'outline'}
                              onClick={() => handleVote(proposal.id, 'abstain')}
                              disabled={!wallet || isLoading}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Abstain
                            </Button>
                          </>
                        )}
                        
                        {canExecute && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleExecuteProposal(proposal.id)}
                            disabled={!wallet || isLoading}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Execute
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Submit Proposal Tab */}
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Submit New Proposal
              </CardTitle>
              <CardDescription>
                Create a new governance proposal on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!wallet ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please connect your wallet to submit proposals
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="proposal-title">Proposal Title *</Label>
                    <Input
                      id="proposal-title"
                      placeholder="Enter proposal title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proposal-description">Description *</Label>
                    <Textarea
                      id="proposal-description"
                      placeholder="Describe your proposal in detail"
                      rows={4}
                      value={newProposal.description}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proposal-metadata">Metadata (Optional)</Label>
                    <Input
                      id="proposal-metadata"
                      placeholder="Additional metadata or links"
                      value={newProposal.metadata}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, metadata: e.target.value }))}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSubmitProposal}
                    disabled={!newProposal.title.trim() || !contractAddress.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Submit Proposal
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>• Proposal will be submitted to the blockchain</p>
                    <p>• Gas fees will be deducted from your wallet</p>
                    <p>• Proposal will be visible to all governance participants</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
