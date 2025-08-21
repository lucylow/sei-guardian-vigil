import React, { useState } from 'react';
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
  CheckCircle,
  Crown,
  Star,
  Flame,
  Brain,
  Cpu,
  Network
} from "lucide-react";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    role: string;
    level: number;
    xp: number;
    xpToNext: number;
    traits: {
      accuracy: number;
      speed: number;
      specialty: string;
      matrixAffinity: number;
    };
    stats: {
      vulnerabilitiesDetected: number;
      criticalFixes: number;
      reputation: number;
      tokensEarned: number;
      winStreak: number;
      matrixBreaches: number;
    };
    nftTokenId?: string;
    imageUrl: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    matrixStatus: 'active' | 'upgrading' | 'breached' | 'oracle';
  };
  onSelect: (agent: any) => void;
  onBattle: (agent: any) => void;
  isSelected?: boolean;
  className?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  onSelect, 
  onBattle, 
  isSelected = false,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
      case "security_analyst": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "threat_intel": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "remediation": return "bg-green-500/20 text-green-300 border-green-500/30"; 
      case "compliance": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default: return "bg-secondary";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 border-yellow-400/50";
      case "epic": return "text-purple-400 border-purple-400/50";
      case "rare": return "text-blue-400 border-blue-400/50";
      case "common": return "text-gray-400 border-gray-400/50";
      default: return "text-gray-400";
    }
  };

  const getMatrixStatusColor = (status: string) => {
    switch (status) {
      case "oracle": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "active": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "upgrading": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "breached": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getMatrixStatusIcon = (status: string) => {
    switch (status) {
      case "oracle": return <Crown className="w-3 h-3" />;
      case "active": return <Network className="w-3 h-3" />;
      case "upgrading": return <Cpu className="w-3 h-3" />;
      case "breached": return <Flame className="w-3 h-3" />;
      default: return <Network className="w-3 h-3" />;
    }
  };

  const getLevelBadge = (level: number) => {
    if (level >= 50) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (level >= 25) return <Star className="w-4 h-4 text-purple-400" />;
    if (level >= 10) return <TrendingUp className="w-4 h-4 text-blue-400" />;
    return <Target className="w-4 h-4 text-green-400" />;
  };

  const xpPercentage = (agent.xp / agent.xpToNext) * 100;

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 group ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${className}`}
      onClick={() => onSelect(agent)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Matrix Grid Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 to-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Agent Avatar with Matrix Effects */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center overflow-hidden">
        {/* Matrix Code Rain Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="matrix-rain"></div>
        </div>
        
        {/* Agent Icon */}
        <div className={`relative w-16 h-16 rounded-full ${getAgentRoleColor(agent.role)} flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110`}>
          {getAgentRoleIcon(agent.role)}
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          {getLevelBadge(agent.level)}
        </div>
        
        {/* Matrix Status Badge */}
        <Badge 
          variant="outline" 
          className={`absolute top-2 right-2 text-xs ${getMatrixStatusColor(agent.matrixStatus)}`}
        >
          <div className="flex items-center space-x-1">
            {getMatrixStatusIcon(agent.matrixStatus)}
            <span className="capitalize">{agent.matrixStatus}</span>
          </div>
        </Badge>

        {/* NFT Token ID */}
        {agent.nftTokenId && (
          <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
            #{agent.nftTokenId}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>{agent.name}</span>
          <Badge variant="outline" className={`text-xs ${getRarityColor(agent.rarity)}`}>
            {agent.rarity.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs capitalize">
          {agent.role.replace('_', ' ')} • Level {agent.level}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="font-medium">{agent.xp}/{agent.xpToNext}</span>
          </div>
          <Progress value={xpPercentage} className="h-2" />
        </div>

        {/* Matrix Affinity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Matrix Affinity</span>
            <span className="font-medium">{(agent.traits.matrixAffinity * 100).toFixed(0)}%</span>
          </div>
          <Progress value={agent.traits.matrixAffinity * 100} className="h-2 bg-green-900/20" />
        </div>

        {/* Stats Grid */}
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

        {/* Win Streak */}
        {agent.stats.winStreak > 0 && (
          <div className="flex items-center justify-center space-x-1 text-xs text-orange-400">
            <Flame className="w-3 h-3" />
            <span>{agent.stats.winStreak} Win Streak</span>
          </div>
        )}

        {/* Matrix Breaches */}
        {agent.stats.matrixBreaches > 0 && (
          <div className="flex items-center justify-center space-x-1 text-xs text-red-400">
            <Brain className="w-3 h-3" />
            <span>{agent.stats.matrixBreaches} Breaches</span>
          </div>
        )}

        {/* Battle Button */}
        <Button 
          size="sm" 
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
          onClick={(e) => {
            e.stopPropagation();
            onBattle(agent);
          }}
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Enter Matrix</span>
          </div>
        </Button>

        {/* Tokens Earned */}
        <div className="text-center pt-2 border-t border-green-500/20">
          <div className="text-xs text-muted-foreground">$SENT Earned</div>
          <div className="text-lg font-bold text-green-400">{agent.stats.tokensEarned.toLocaleString()}</div>
        </div>
      </CardContent>

      {/* Hover Effects */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 pointer-events-none" />
      )}
    </Card>
  );
};
