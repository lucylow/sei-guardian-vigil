import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Zap, 
  Target, 
  Award, 
  TrendingUp,
  Eye,
  Code,
  CheckCircle 
} from "lucide-react";
import { SentinelAgent, SENTINEL_AGENTS, GoatSentinelService } from "@/lib/goatSdk";

interface AgentArenaProps {
  className?: string;
}

export const AgentArena: React.FC<AgentArenaProps> = ({ className }) => {
  const [agents, setAgents] = useState<SentinelAgent[]>(SENTINEL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<SentinelAgent | null>(null);
  const [battleInProgress, setBattleInProgress] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{agentId: string, score: number, rank: number}>>([]);

  useEffect(() => {
    // Load leaderboard on mount
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const board = await GoatSentinelService.getLeaderboard();
      setLeaderboard(board);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  };

  const getAgentRoleIcon = (role: string) => {
    switch (role) {
      case "security_analyst": return <Shield className="w-4 h-4" />;
      case "threat_intel": return <Eye className="w-4 h-4" />;
      case "remediation": return <Code className="w-4 h-4" />;
      case "compliance": return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getAgentRoleColor = (role: string) => {
    switch (role) {
      case "security_analyst": return "bg-blue-500/20 text-blue-300";
      case "threat_intel": return "bg-purple-500/20 text-purple-300";
      case "remediation": return "bg-green-500/20 text-green-300"; 
      case "compliance": return "bg-orange-500/20 text-orange-300";
      default: return "bg-secondary";
    }
  };

  const simulateVulnerabilityBattle = async (agent: SentinelAgent) => {
    if (battleInProgress) return;
    
    setBattleInProgress(agent.id);
    
    try {
      const result = await GoatSentinelService.simulateVulnerabilityBattle(
        agent.id, 
        `vuln_${Date.now()}`
      );
      
      // Update agent stats locally
      setAgents(prev => prev.map(a => 
        a.id === agent.id 
          ? {
              ...a,
              stats: {
                ...a.stats,
                vulnerabilitiesDetected: a.stats.vulnerabilitiesDetected + 1,
                tokensEarned: a.stats.tokensEarned + result.rewardEarned,
                criticalFixes: result.success ? a.stats.criticalFixes + 1 : a.stats.criticalFixes
              }
            }
          : a
      ));
      
      // Refresh leaderboard
      await loadLeaderboard();
      
    } catch (error) {
      console.error("Battle simulation failed:", error);
    } finally {
      setBattleInProgress(null);
    }
  };

  const getAgentRank = (agentId: string) => {
    const rankData = leaderboard.find(l => l.agentId === agentId);
    return rankData?.rank || "—";
  };

  const getAgentScore = (agentId: string) => {
    const rankData = leaderboard.find(l => l.agentId === agentId);
    return rankData?.score || 0;
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Agent Arena</h2>
        <p className="text-muted-foreground">NFT-powered security agents competing to protect Sei ecosystem</p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedAgent?.id === agent.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedAgent(agent)}
          >
            {/* Agent Avatar */}
            <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className={`w-16 h-16 rounded-full ${getAgentRoleColor(agent.role)} flex items-center justify-center`}>
                {getAgentRoleIcon(agent.role)}
              </div>
              
              {/* Rank Badge */}
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                #{getAgentRank(agent.id)}
              </Badge>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{agent.name}</CardTitle>
              <CardDescription className="text-xs capitalize">
                {agent.role.replace('_', ' ')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Accuracy</div>
                  <div className="font-semibold">{(agent.traits.accuracy * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fixes</div>
                  <div className="font-semibold">{agent.stats.criticalFixes}</div>
                </div>
              </div>

              {/* Performance Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Accuracy</span>
                    <span>{(agent.traits.accuracy * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={agent.traits.accuracy * 100} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Speed</span>
                    <span>{(agent.traits.speed * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={agent.traits.speed * 100} className="h-1" />
                </div>
              </div>

              {/* Battle Button */}
              <Button 
                size="sm" 
                className="w-full"
                disabled={battleInProgress === agent.id}
                onClick={(e) => {
                  e.stopPropagation();
                  simulateVulnerabilityBattle(agent);
                }}
              >
                {battleInProgress === agent.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Battling...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3 h-3" />
                    <span>Start Battle</span>
                  </div>
                )}
              </Button>

              {/* Tokens Earned */}
              <div className="text-center pt-2 border-t">
                <div className="text-xs text-muted-foreground">$SENT Earned</div>
                <div className="text-lg font-bold text-primary">{agent.stats.tokensEarned.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full ${getAgentRoleColor(selectedAgent.role)} flex items-center justify-center`}>
                {getAgentRoleIcon(selectedAgent.role)}
              </div>
              <div>
                <div>{selectedAgent.name}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {selectedAgent.role.replace('_', ' ')} • Rank #{getAgentRank(selectedAgent.id)}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Performance</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Detection Accuracy</span>
                      <span>{(selectedAgent.traits.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedAgent.traits.accuracy * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Processing Speed</span>
                      <span>{(selectedAgent.traits.speed * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedAgent.traits.speed * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Reputation Score</span>
                      <span>{selectedAgent.stats.reputation}</span>
                    </div>
                    <Progress value={(selectedAgent.stats.reputation / 1000) * 100} />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Statistics</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vulnerabilities Detected</span>
                    <span className="font-semibold">{selectedAgent.stats.vulnerabilitiesDetected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Critical Fixes</span>
                    <span className="font-semibold">{selectedAgent.stats.criticalFixes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$SENT Tokens Earned</span>
                    <span className="font-semibold">{selectedAgent.stats.tokensEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arena Score</span>
                    <span className="font-semibold">{getAgentScore(selectedAgent.id)}</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Specialization</span>
                </h4>
                <div className="space-y-3">
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {selectedAgent.traits.specialty}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    This agent specializes in {selectedAgent.traits.specialty.toLowerCase()} and has proven highly effective in detecting related vulnerabilities.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};