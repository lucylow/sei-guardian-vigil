import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as PIXI from 'pixi.js';
import { Stage, Sprite, Graphics } from '@pixi/react';

const AgentArena = ({ battles }) => {
  const [activeBattles, setActiveBattles] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const battleRefs = useRef({});
  const animationFrame = useRef(null);

  // Battle mechanics
  const updateBattle = (battleId) => {
    setActiveBattles(prev => prev.map(b => {
      if (b.id === battleId) {
        const damage = Math.floor(Math.random() * 10) + 5;
        const newMonsterHealth = Math.max(0, b.monsterHealth - damage);
        const isVictory = newMonsterHealth === 0;
        
        return {
          ...b,
          monsterHealth: newMonsterHealth,
          status: isVictory ? 'victory' : 'fighting',
          lastDamage: damage,
          reward: isVictory ? Math.floor(b.severity * 100) : b.reward
        };
      }
      return b;
    }));
  };

  // Initialize battles
  useEffect(() => {
    const initialBattles = battles.map(battle => ({
      ...battle,
      agentHealth: 100,
      monsterHealth: 100,
      status: 'fighting',
      lastDamage: 0,
      reward: 0
    }));
    setActiveBattles(initialBattles);
    
    const leaderData = battles.reduce((acc, battle) => {
      const agent = acc.find(a => a.id === battle.agentId);
      if (agent) {
        agent.battles += 1;
      } else {
        acc.push({
          id: battle.agentId,
          name: `Agent ${battle.agentId.slice(0, 6)}`,
          battles: 1,
          victories: 0,
          rewards: 0
        });
      }
      return acc;
    }, []);
    setLeaderboard(leaderData);
    
    return () => cancelAnimationFrame(animationFrame.current);
  }, [battles]);

  // Battle animation loop
  useEffect(() => {
    const animate = () => {
      activeBattles.forEach(battle => {
        if (battle.status === 'fighting') {
          updateBattle(battle.id);
        }
      });
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    if (activeBattles.length > 0) {
      animationFrame.current = requestAnimationFrame(animate);
    }
    
    return () => cancelAnimationFrame(animationFrame.current);
  }, [activeBattles]);

  // Victory handling
  useEffect(() => {
    activeBattles.forEach(battle => {
      if (battle.status === 'victory') {
        setLeaderboard(prev => prev.map(agent => {
          if (agent.id === battle.agentId) {
            return {
              ...agent,
              victories: agent.victories + 1,
              rewards: agent.rewards + battle.reward
            };
          }
          return agent;
        }));
      }
    });
  }, [activeBattles]);

  // Health bar component
  const HealthBar = ({ health, color }) => (
    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
      <motion.div 
        className={`h-full ${color}`}
        initial={{ width: '100%' }}
        animate={{ width: `${health}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );

  // Damage popup component
  const DamagePopup = ({ damage, x, y }) => (
    <motion.div
      className="absolute text-red-500 font-bold text-xl"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
      style={{ left: x, top: y }}
    >
      -{damage}
    </motion.div>
  );

  return (
    <div className="agent-arena-container bg-gray-900 text-white p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="mr-2">⚔️</span> Agent Arena
        </h2>
        <div className="bg-purple-800 px-3 py-1 rounded-full text-sm">
          Live Battle Feed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Battle Arena */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Active Battles</h3>
          <div className="grid grid-cols-1 gap-4">
            {activeBattles.map((battle) => (
              <div 
                key={battle.id}
                className={`relative p-4 rounded-lg border-2 ${
                  battle.status === 'victory' 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-red-500 bg-red-900/20'
                }`}
                ref={el => battleRefs.current[battle.id] = el}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg">🛡️</span>
                    </div>
                    <div>
                      <div className="font-bold">Agent {battle.agentId.slice(0, 6)}</div>
                      <div className="text-xs text-gray-400">Level {battle.agentLevel}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl">VS</div>
                    <div className="text-xs text-gray-400">{battle.status}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div>
                      <div className="font-bold text-right">{battle.vulnerabilityType}</div>
                      <div className="text-xs text-gray-400 text-right">
                        Severity: {battle.severity}/10
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center ml-3">
                      <span className="text-lg">👾</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm mb-1">Agent Health</div>
                    <HealthBar health={battle.agentHealth} color="bg-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm mb-1">Monster Health</div>
                    <HealthBar health={battle.monsterHealth} color="bg-red-500" />
                  </div>
                </div>
                
                {battle.lastDamage > 0 && battle.status === 'fighting' && (
                  <DamagePopup 
                    damage={battle.lastDamage}
                    x={Math.random() * 200 + 50}
                    y={Math.random() * 30 + 20}
                  />
                )}
                
                {battle.status === 'victory' && (
                  <motion.div
                    className="absolute inset-0 bg-green-900/30 flex items-center justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center p-4">
                      <div className="text-2xl font-bold mb-2">VICTORY!</div>
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🏆</span>
                        <span>+{battle.reward} $SENT</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard
              .sort((a, b) => b.victories - a.victories || b.rewards - a.rewards)
              .slice(0, 5)
              .map((agent, index) => (
                <motion.div
                  key={agent.id}
                  className={`flex items-center p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-900/30 border-yellow-500' : 'bg-gray-700'
                  } border`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    {index === 0 ? '👑' : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{agent.name}</div>
                    <div className="text-xs text-gray-400">
                      Battles: {agent.battles} | Wins: {agent.victories}
                    </div>
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded-md flex items-center">
                    <span className="text-yellow-400 mr-1">🪙</span>
                    <span>{agent.rewards}</span>
                  </div>
                </motion.div>
              ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Battle Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-2xl">{battles.length}</div>
                <div className="text-xs text-gray-400">Total Battles</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-2xl text-green-400">
                  {leaderboard.reduce((acc, agent) => acc + agent.victories, 0)}
                </div>
                <div className="text-xs text-gray-400">Vulnerabilities Fixed</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-2xl text-yellow-400">
                  {leaderboard.reduce((acc, agent) => acc + agent.rewards, 0)}
                </div>
                <div className="text-xs text-gray-400">$SENT Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Visualization Canvas */}
      <div className="mt-6 bg-black/50 rounded-xl overflow-hidden">
        <Stage width={800} height={300} options={{ backgroundColor: 0x0a0a15 }}>
          {activeBattles.map((battle, index) => (
            <React.Fragment key={battle.id}>
              {/* Agent */}
              <Sprite
                image={`/agents/${battle.agentId}.png`}
                x={100}
                y={150}
                anchor={0.5}
                scale={0.8}
              />
              
              {/* Monster */}
              <Sprite
                image={`/monsters/${battle.vulnerabilityType}.png`}
                x={700}
                y={150}
                anchor={0.5}
                scale={0.8}
              />
              
              {/* Attack animation */}
              {battle.lastDamage > 0 && (
                <Graphics
                  draw={g => {
                    g.clear();
                    g.lineStyle(3, 0xff0000, 0.7);
                    g.moveTo(150, 150);
                    g.lineTo(650, 150);
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Stage>
      </div>
    </div>
  );
};

export default AgentArena;