import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Coins, Shield, Sword, Target } from "lucide-react";

// Import agent avatars
import agent1 from "@/assets/agent-1.png";
import agent2 from "@/assets/agent-2.png";
import agent3 from "@/assets/agent-3.png";
import monsterReentrancy from "@/assets/monster-reentrancy.png";
import monsterOverflow from "@/assets/monster-overflow.png";

interface Battle {
  id: string;
  agentId: string;
  agentName: string;
  agentLevel: number;
  agentHealth: number;
  agentMaxHealth: number;
  vulnerabilityType: string;
  monsterHealth: number;
  monsterMaxHealth: number;
  severity: number;
  status: 'fighting' | 'victory' | 'preparing';
  lastDamage: number;
  reward: number;
  attackAnimation: boolean;
}

interface Agent {
  id: string;
  name: string;
  level: number;
  victories: number;
  totalRewards: number;
  avatar: string;
  specialization: string;
  rank: number;
}

const EnhancedAgentArena = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [agents] = useState<Agent[]>([
    {
      id: "agent-1",
      name: "CyberGuard",
      level: 15,
      victories: 42,
      totalRewards: 2850,
      avatar: agent1,
      specialization: "Reentrancy Protection",
      rank: 1
    },
    {
      id: "agent-2",
      name: "CodeSentinel", 
      level: 12,
      victories: 38,
      totalRewards: 2340,
      avatar: agent2,
      specialization: "Access Control",
      rank: 2
    },
    {
      id: "agent-3",
      name: "VulnHunter",
      level: 18,
      victories: 56,
      totalRewards: 3420,
      avatar: agent3,
      specialization: "Integer Overflow",
      rank: 3
    }
  ]);

  const [leaderboard, setLeaderboard] = useState(agents);

  const vulnerabilityTypes = [
    { name: "Reentrancy", image: monsterReentrancy, difficulty: 8 },
    { name: "Integer Overflow", image: monsterOverflow, difficulty: 6 }
  ];

  const createBattle = (agent: Agent) => {
    const vulnerability = vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)];
    const newBattle: Battle = {
      id: `battle-${Date.now()}-${agent.id}`,
      agentId: agent.id,
      agentName: agent.name,
      agentLevel: agent.level,
      agentHealth: 100,
      agentMaxHealth: 100,
      vulnerabilityType: vulnerability.name,
      monsterHealth: 100,
      monsterMaxHealth: 100,
      severity: Math.floor(Math.random() * 5) + 5,
      status: 'preparing',
      lastDamage: 0,
      reward: 0,
      attackAnimation: false
    };

    setBattles(prev => [...prev, newBattle]);
    
    // Start battle after preparation
    setTimeout(() => {
      setBattles(prev => prev.map(b => 
        b.id === newBattle.id ? { ...b, status: 'fighting' as const } : b
      ));
      simulateBattle(newBattle.id);
    }, 1000);
  };

  const simulateBattle = (battleId: string) => {
    const battleInterval = setInterval(() => {
      setBattles(prev => {
        const battle = prev.find(b => b.id === battleId);
        if (!battle || battle.status !== 'fighting') {
          clearInterval(battleInterval);
          return prev;
        }

        const damage = Math.floor(Math.random() * 15) + 10;
        const newMonsterHealth = Math.max(0, battle.monsterHealth - damage);
        const isVictory = newMonsterHealth === 0;

        if (isVictory) {
          clearInterval(battleInterval);
          const reward = battle.severity * 50 + Math.floor(Math.random() * 100);
          
          // Update leaderboard
          setLeaderboard(prev => prev.map(agent => 
            agent.id === battle.agentId 
              ? { ...agent, victories: agent.victories + 1, totalRewards: agent.totalRewards + reward }
              : agent
          ));

          return prev.map(b => 
            b.id === battleId 
              ? { ...b, monsterHealth: 0, status: 'victory' as const, reward, attackAnimation: true }
              : b
          );
        }

        return prev.map(b => 
          b.id === battleId 
            ? { ...b, monsterHealth: newMonsterHealth, lastDamage: damage, attackAnimation: true }
            : b
        );
      });

      // Reset attack animation
      setTimeout(() => {
        setBattles(prev => prev.map(b => 
          b.id === battleId ? { ...b, attackAnimation: false } : b
        ));
      }, 500);
    }, 2000);
  };

  const removeBattle = (battleId: string) => {
    setBattles(prev => prev.filter(b => b.id !== battleId));
  };

  const getMonsterImage = (type: string) => {
    switch (type) {
      case "Reentrancy": return monsterReentrancy;
      case "Integer Overflow": return monsterOverflow;
      default: return monsterReentrancy;
    }
  };

  const HealthBar = ({ current, max, color }: { current: number; max: number; color: string }) => (
    <div className="w-full bg-muted rounded-full h-3">
      <motion.div 
        className={`h-3 rounded-full ${color}`}
        initial={{ width: '100%' }}
        animate={{ width: `${(current / max) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );

  const DamagePopup = ({ damage, show }: { damage: number; show: boolean }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-4 right-4 text-destructive font-bold text-xl z-10"
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          -{damage}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Agent Arena - Select Your Champion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                className="relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={agent.avatar} 
                      alt={agent.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                      #{agent.rank}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">Level {agent.level}</p>
                    <p className="text-xs text-muted-foreground">{agent.specialization}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{agent.victories}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{agent.totalRewards}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => createBattle(agent)}
                  disabled={battles.some(b => b.agentId === agent.id)}
                >
                  {battles.some(b => b.agentId === agent.id) ? (
                    <>
                      <Zap className="w-3 h-3 mr-1" />
                      In Battle
                    </>
                  ) : (
                    <>
                      <Sword className="w-3 h-3 mr-1" />
                      Start Battle
                    </>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Battles */}
      {battles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Battles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {battles.map((battle) => {
                const agent = agents.find(a => a.id === battle.agentId);
                return (
                  <motion.div
                    key={battle.id}
                    className={`relative p-6 border-2 rounded-lg ${
                      battle.status === 'victory' 
                        ? 'border-green-500 bg-green-500/5' 
                        : battle.status === 'fighting'
                        ? 'border-yellow-500 bg-yellow-500/5'
                        : 'border-blue-500 bg-blue-500/5'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DamagePopup damage={battle.lastDamage} show={battle.attackAnimation && battle.lastDamage > 0} />
                    
                    {/* Battle Status */}
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant={battle.status === 'victory' ? 'default' : 'secondary'}>
                        {battle.status === 'preparing' ? 'Preparing...' : 
                         battle.status === 'fighting' ? 'Fighting!' : 'Victory!'}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Severity: {battle.severity}/10
                      </div>
                    </div>

                    {/* Combatants */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Agent */}
                      <div className="text-center space-y-3">
                        <motion.img 
                          src={agent?.avatar} 
                          alt={battle.agentName}
                          className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-blue-500"
                          animate={battle.attackAnimation ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        />
                        <div>
                          <h4 className="font-semibold">{battle.agentName}</h4>
                          <p className="text-sm text-muted-foreground">Level {battle.agentLevel}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Health</span>
                            <span>{battle.agentHealth}/{battle.agentMaxHealth}</span>
                          </div>
                          <HealthBar 
                            current={battle.agentHealth} 
                            max={battle.agentMaxHealth} 
                            color="bg-blue-500" 
                          />
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="flex items-center justify-center">
                        <div className="text-2xl font-bold text-muted-foreground">VS</div>
                      </div>

                      {/* Monster */}
                      <div className="text-center space-y-3 -ml-6">
                        <motion.img 
                          src={getMonsterImage(battle.vulnerabilityType)} 
                          alt={battle.vulnerabilityType}
                          className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-red-500"
                          animate={battle.attackAnimation ? { scale: [1, 0.9, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        />
                        <div>
                          <h4 className="font-semibold">{battle.vulnerabilityType}</h4>
                          <p className="text-sm text-muted-foreground">Threat Level {battle.severity}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Health</span>
                            <span>{battle.monsterHealth}/{battle.monsterMaxHealth}</span>
                          </div>
                          <HealthBar 
                            current={battle.monsterHealth} 
                            max={battle.monsterMaxHealth} 
                            color="bg-red-500" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Victory Overlay */}
                    {battle.status === 'victory' && (
                      <motion.div
                        className="absolute inset-0 bg-green-900/20 flex items-center justify-center rounded-lg backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-center p-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                          >
                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-green-400 mb-2">VICTORY!</h3>
                            <div className="flex items-center justify-center gap-2 text-yellow-400">
                              <Coins className="w-4 h-4" />
                              <span>+{battle.reward} $SENT</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="mt-3"
                              onClick={() => removeBattle(battle.id)}
                            >
                              Claim Reward
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Agent Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard
              .sort((a, b) => b.totalRewards - a.totalRewards)
              .map((agent, index) => (
                <motion.div
                  key={agent.id}
                  className={`flex items-center p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-muted/50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {index === 0 ? '👑' : `#${index + 1}`}
                    </div>
                    <img 
                      src={agent.avatar} 
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Level {agent.level} • {agent.victories} victories
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">{agent.totalRewards}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAgentArena;