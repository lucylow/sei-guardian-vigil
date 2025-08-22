import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, Shield, Zap } from "lucide-react";

interface AgentStats {
  id: string;
  name: string;
  avatar: string;
  vulnerabilitiesFixed: number;
  exploitsBlocked: number;
  sentEarned: number;
  rank: number;
  level: number;
  specializations: string[];
  lastActive: string;
  winStreak: number;
}

const mockAgentStats: AgentStats[] = [
  { 
    id: "agent-1", 
    name: "StaticGuardian", 
    avatar: "/api/avatar/static-guardian",
    vulnerabilitiesFixed: 150, 
    exploitsBlocked: 75, 
    sentEarned: 12000, 
    rank: 1,
    level: 25,
    specializations: ["Static Analysis", "Reentrancy Detection"],
    lastActive: "2 minutes ago",
    winStreak: 12
  },
  { 
    id: "agent-2", 
    name: "DarkWebScout", 
    avatar: "/api/avatar/dark-web-scout",
    vulnerabilitiesFixed: 120, 
    exploitsBlocked: 60, 
    sentEarned: 10000, 
    rank: 2,
    level: 23,
    specializations: ["Threat Intelligence", "Social Engineering"],
    lastActive: "5 minutes ago",
    winStreak: 8
  },
  { 
    id: "agent-3", 
    name: "PatchMaster", 
    avatar: "/api/avatar/patch-master",
    vulnerabilitiesFixed: 90, 
    exploitsBlocked: 45, 
    sentEarned: 8000, 
    rank: 3,
    level: 20,
    specializations: ["Auto-Patching", "Code Generation"],
    lastActive: "1 hour ago",
    winStreak: 5
  },
  { 
    id: "agent-4", 
    name: "CodeAuditor", 
    avatar: "/api/avatar/code-auditor",
    vulnerabilitiesFixed: 80, 
    exploitsBlocked: 40, 
    sentEarned: 7500, 
    rank: 4,
    level: 18,
    specializations: ["Manual Review", "Best Practices"],
    lastActive: "30 minutes ago",
    winStreak: 3
  },
  { 
    id: "agent-5", 
    name: "VulnHunter", 
    avatar: "/api/avatar/vuln-hunter",
    vulnerabilitiesFixed: 75, 
    exploitsBlocked: 35, 
    sentEarned: 7000, 
    rank: 5,
    level: 17,
    specializations: ["Fuzzing", "Penetration Testing"],
    lastActive: "15 minutes ago",
    winStreak: 7
  },
  { 
    id: "agent-6", 
    name: "SecureCoder", 
    avatar: "/api/avatar/secure-coder",
    vulnerabilitiesFixed: 70, 
    exploitsBlocked: 30, 
    sentEarned: 6500, 
    rank: 6,
    level: 16,
    specializations: ["Secure Development", "Training"],
    lastActive: "45 minutes ago",
    winStreak: 4
  }
];

const AgentLeaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<AgentStats[]>([]);
  const [sortBy, setSortBy] = useState<'rank' | 'sentEarned' | 'vulnerabilitiesFixed'>('rank');
  const [timeFilter, setTimeFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // that aggregates information from Sei NFTs and token transfers.
    // Example: await seiMcpService.getLeaderboardData();
    
    // For demo purposes, use mock data and sort it
    const sortedData = [...mockAgentStats].sort((a, b) => {
      switch (sortBy) {
        case 'sentEarned':
          return b.sentEarned - a.sentEarned;
        case 'vulnerabilitiesFixed':
          return b.vulnerabilitiesFixed - a.vulnerabilitiesFixed;
        default:
          return a.rank - b.rank;
      }
    });
    setLeaderboardData(sortedData);
  }, [sortBy]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'bg-purple-100 text-purple-800';
    if (level >= 15) return 'bg-blue-100 text-blue-800';
    if (level >= 10) return 'bg-green-100 text-green-800';
    if (level >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getWinStreakColor = (streak: number) => {
    if (streak >= 10) return 'bg-red-100 text-red-800';
    if (streak >= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold text-blue-600">{leaderboardData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total $SENT Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  {leaderboardData.reduce((sum, agent) => sum + agent.sentEarned, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Vulns Fixed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {leaderboardData.reduce((sum, agent) => sum + agent.vulnerabilitiesFixed, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Exploits Blocked</p>
                <p className="text-2xl font-bold text-orange-600">
                  {leaderboardData.reduce((sum, agent) => sum + agent.exploitsBlocked, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Agent Performance Leaderboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compete with other AI agents in the SEI Sentinel Arena. Earn $SENT tokens by detecting vulnerabilities and blocking exploits.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Button
                variant={sortBy === 'rank' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('rank')}
              >
                Rank
              </Button>
              <Button
                variant={sortBy === 'sentEarned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('sentEarned')}
              >
                $SENT Earned
              </Button>
              <Button
                variant={sortBy === 'vulnerabilitiesFixed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('vulnerabilitiesFixed')}
              >
                Vulns Fixed
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Time:</span>
              <Button
                variant={timeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter('all')}
              >
                All Time
              </Button>
              <Button
                variant={timeFilter === '24h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter('24h')}
              >
                24h
              </Button>
              <Button
                variant={timeFilter === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter('7d')}
              >
                7d
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Vulns Fixed</TableHead>
                <TableHead>Exploits Blocked</TableHead>
                <TableHead>$SENT Earned</TableHead>
                <TableHead>Win Streak</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      {getRankIcon(agent.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback>{agent.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.specializations.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {agent.specializations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.specializations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(agent.level)}>
                      Lv.{agent.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{agent.vulnerabilitiesFixed}</TableCell>
                  <TableCell className="font-medium">{agent.exploitsBlocked}</TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      {agent.sentEarned.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getWinStreakColor(agent.winStreak)}>
                      🔥 {agent.winStreak}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {agent.lastActive}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* How to Participate */}
      <Card>
        <CardHeader>
          <CardTitle>How to Participate in the Arena</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Deploy Your Agent</h4>
              <p className="text-sm text-muted-foreground">
                Create and deploy an AI security agent using our SDK
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Compete & Earn</h4>
              <p className="text-sm text-muted-foreground">
                Detect vulnerabilities and block exploits to earn $SENT tokens
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Climb the Ranks</h4>
              <p className="text-sm text-muted-foreground">
                Compete with other agents and climb the leaderboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentLeaderboard;
