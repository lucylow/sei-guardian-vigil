import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award,
  Star,
  Crown,
  Shield,
  Zap,
  Target,
  Trophy,
  Medal,
  Lock
} from "lucide-react";
import { Achievement, ACHIEVEMENTS, SENTINEL_AGENTS, GoatSentinelService } from "@/lib/goatSdk";

interface AchievementSystemProps {
  className?: string;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ className }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [agentAchievements, setAgentAchievements] = useState<Record<string, string[]>>({});
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  useEffect(() => {
    checkAgentAchievements();
  }, []);

  const checkAgentAchievements = () => {
    const agentAchievementMap: Record<string, string[]> = {};
    
    SENTINEL_AGENTS.forEach(agent => {
      const earnedAchievements = achievements
        .filter(achievement => achievement.criteria(agent))
        .map(achievement => achievement.id);
      
      agentAchievementMap[agent.id] = earnedAchievements;
    });
    
    setAgentAchievements(agentAchievementMap);
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary": return <Crown className="w-4 h-4 text-yellow-400" />;
      case "epic": return <Star className="w-4 h-4 text-purple-400" />;
      case "rare": return <Medal className="w-4 h-4 text-blue-400" />;
      case "common": return <Award className="w-4 h-4 text-gray-400" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-yellow-400/50 bg-yellow-400/10";
      case "epic": return "border-purple-400/50 bg-purple-400/10";
      case "rare": return "border-blue-400/50 bg-blue-400/10";
      case "common": return "border-gray-400/50 bg-gray-400/10";
      default: return "border-border";
    }
  };

  const getAchievementProgress = (achievement: Achievement) => {
    let totalAgents = SENTINEL_AGENTS.length;
    let achievedAgents = 0;
    
    SENTINEL_AGENTS.forEach(agent => {
      if (achievement.criteria(agent)) {
        achievedAgents++;
      }
    });
    
    return {
      achieved: achievedAgents,
      total: totalAgents,
      percentage: (achievedAgents / totalAgents) * 100
    };
  };

  const getAgentName = (agentId: string) => {
    const agent = SENTINEL_AGENTS.find(a => a.id === agentId);
    return agent?.name || agentId;
  };

  const filteredAchievements = selectedRarity 
    ? achievements.filter(a => a.rarity === selectedRarity)
    : achievements;

  const rarityStats = achievements.reduce((acc, achievement) => {
    acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Achievement System</h2>
        <p className="text-muted-foreground">NFT badges and rewards for security excellence</p>
      </div>

      {/* Rarity Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedRarity === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRarity(null)}
        >
          All ({achievements.length})
        </Button>
        {Object.entries(rarityStats).map(([rarity, count]) => (
          <Button
            key={rarity}
            variant={selectedRarity === rarity ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRarity(rarity)}
            className="capitalize"
          >
            {getRarityIcon(rarity)}
            <span className="ml-1">{rarity} ({count})</span>
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredAchievements.map((achievement) => {
          const progress = getAchievementProgress(achievement);
          
          return (
            <Card 
              key={achievement.id}
              className={`relative overflow-hidden ${getRarityColor(achievement.rarity)}`}
            >
              {/* Rarity Banner */}
              <div className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold bg-background/90 rounded-bl-md capitalize flex items-center space-x-1">
                {getRarityIcon(achievement.rarity)}
                <span>{achievement.rarity}</span>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      {achievement.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {achievement.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Reward */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reward</span>
                  <Badge variant="secondary">
                    {achievement.reward} $SENT
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Agents Achieved</span>
                    <span>{progress.achieved} / {progress.total}</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                </div>

                {/* Achieved by Agents */}
                {progress.achieved > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium">Achieved by:</div>
                    <div className="flex flex-wrap gap-1">
                      {SENTINEL_AGENTS
                        .filter(agent => achievement.criteria(agent))
                        .slice(0, 3)
                        .map(agent => (
                          <Badge 
                            key={agent.id} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {agent.name}
                          </Badge>
                        ))}
                      {progress.achieved > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{progress.achieved - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Not achieved yet */}
                {progress.achieved === 0 && (
                  <div className="flex items-center justify-center text-xs text-muted-foreground py-2">
                    <Lock className="w-3 h-3 mr-1" />
                    Not yet achieved
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent Achievement Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Achievement Summary</CardTitle>
          <CardDescription>Overview of badges earned by each security agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SENTINEL_AGENTS.map(agent => {
              const earnedAchievements = agentAchievements[agent.id] || [];
              const totalRewards = earnedAchievements.reduce((sum, achievementId) => {
                const achievement = achievements.find(a => a.id === achievementId);
                return sum + (achievement?.reward || 0);
              }, 0);

              return (
                <div 
                  key={agent.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {agent.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Achievements</span>
                      <span className="font-semibold">{earnedAchievements.length}/{achievements.length}</span>
                    </div>
                    <Progress 
                      value={(earnedAchievements.length / achievements.length) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Rewards</span>
                    <Badge variant="secondary">
                      {totalRewards} $SENT
                    </Badge>
                  </div>

                  {earnedAchievements.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Latest Badges:</div>
                      <div className="flex flex-wrap gap-1">
                        {earnedAchievements.slice(0, 2).map(achievementId => {
                          const achievement = achievements.find(a => a.id === achievementId);
                          return achievement ? (
                            <div 
                              key={achievementId}
                              className="flex items-center space-x-1 text-xs"
                            >
                              {getRarityIcon(achievement.rarity)}
                              <span className="truncate max-w-16">{achievement.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};