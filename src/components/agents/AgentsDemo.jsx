// Comprehensive Agents Demo Page for SEI SENTINEL
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedAgentsPage from './EnhancedAgentsPage';
import { BattleArena, LiveBattleMonitor, AgentPerformanceDashboard } from './BattleComponents';
import '../styles/agents.css';

const AgentsDemo = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [battles, setBattles] = useState([]);
  const [vulnerabilities] = useState([
    {
      id: 'reentrancy',
      name: 'Critical Reentrancy',
      type: 'Reentrancy Attack',
      severity: 9,
      health: 100,
      reward: 200,
      status: 'active',
      description: 'Critical reentrancy vulnerability allowing attackers to drain funds'
    },
    {
      id: 'access-control',
      name: 'Access Control Bug',
      type: 'Access Control',
      severity: 7,
      health: 85,
      reward: 150,
      status: 'active',
      description: 'Unauthorized access to admin functions'
    },
    {
      id: 'integer-overflow',
      name: 'Integer Overflow',
      type: 'Arithmetic',
      severity: 6,
      health: 70,
      reward: 100,
      status: 'active',
      description: 'Potential integer overflow in calculations'
    },
    {
      id: 'timestamp',
      name: 'Timestamp Manipulation',
      type: 'Time-based',
      severity: 5,
      health: 60,
      reward: 75,
      status: 'active',
      description: 'Vulnerable to timestamp manipulation attacks'
    }
  ]);

  const [agents] = useState([
    {
      id: 'alpha',
      name: 'Agent Alpha',
      role: 'Security Specialist',
      avatar: 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=A',
      level: 15,
      experience: 1250,
      nextLevelXP: 1500,
      monstersDefeated: 12,
      sentEarned: 1250,
      winRate: 94.2,
      status: 'active',
      specialties: ['Reentrancy Detection', 'Access Control', 'Gas Optimization'],
      stats: {
        accuracy: 97,
        speed: 85,
        power: 92,
        defense: 88
      },
      recentBattles: [
        { type: 'Critical Reentrancy', result: 'victory', reward: 150, time: '2m ago' },
        { type: 'Access Control Bug', result: 'victory', reward: 100, time: '15m ago' }
      ],
      achievements: ['Critical Slayer', 'Speed Demon', 'First Blood']
    },
    {
      id: 'beta',
      name: 'Agent Beta',
      role: 'Threat Intelligence',
      avatar: 'https://via.placeholder.com/80x80/10B981/FFFFFF?text=B',
      level: 12,
      experience: 980,
      nextLevelXP: 1200,
      monstersDefeated: 8,
      sentEarned: 980,
      winRate: 87.5,
      status: 'battling',
      specialties: ['Dark Web Monitoring', 'Exploit Analysis', 'Pattern Recognition'],
      stats: {
        accuracy: 94,
        speed: 92,
        power: 89,
        defense: 85
      },
      recentBattles: [
        { type: 'Integer Overflow', result: 'victory', reward: 75, time: '5m ago' },
        { type: 'Timestamp Manipulation', result: 'defeat', reward: 0, time: '1h ago' }
      ],
      achievements: ['Threat Hunter', 'Pattern Master']
    },
    {
      id: 'gamma',
      name: 'Agent Gamma',
      role: 'Remediation Expert',
      avatar: 'https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=G',
      level: 10,
      experience: 750,
      nextLevelXP: 1000,
      monstersDefeated: 6,
      sentEarned: 750,
      winRate: 83.3,
      status: 'resting',
      specialties: ['Auto-Patching', 'Code Generation', 'Fix Validation'],
      stats: {
        accuracy: 96,
        speed: 78,
        power: 85,
        defense: 90
      },
      recentBattles: [
        { type: 'Logic Error', result: 'victory', reward: 50, time: '30m ago' }
      ],
      achievements: ['Patch Master', 'Code Healer']
    }
  ]);

  const handleStartBattle = (agentId, vulnerabilityId) => {
    const agent = agents.find(a => a.id === agentId);
    const vulnerability = vulnerabilities.find(v => v.id === vulnerabilityId);
    
    if (agent && vulnerability) {
      const battle = {
        id: `battle_${Date.now()}`,
        agent,
        vulnerability,
        status: 'active',
        progress: 0,
        phase: 'initializing',
        events: [
          { title: 'Battle Start', description: `${agent.name} engages ${vulnerability.name}` },
          { title: 'Analysis', description: 'Scanning vulnerability patterns...' }
        ]
      };
      
      setBattles(prev => [...prev, battle]);
      
      // Simulate battle progress
      const battleInterval = setInterval(() => {
        setBattles(prev => prev.map(b => {
          if (b.id === battle.id) {
            const newProgress = Math.min(b.progress + Math.random() * 15, 100);
            const newPhase = newProgress < 30 ? 'analyzing' : 
                           newProgress < 60 ? 'attacking' : 
                           newProgress < 90 ? 'finalizing' : 'complete';
            
            if (newProgress >= 100) {
              clearInterval(battleInterval);
              const victory = Math.random() > 0.3; // 70% win rate
              return {
                ...b,
                progress: 100,
                status: victory ? 'won' : 'lost',
                phase: 'complete',
                result: {
                  duration: Date.now() - parseInt(b.id.split('_')[1]),
                  reward: victory ? vulnerability.reward : 0
                },
                events: [...b.events, 
                  { title: 'Battle End', description: victory ? 'Victory achieved!' : 'Defeat - vulnerability too strong' }
                ]
              };
            }
            
            return {
              ...b,
              progress: newProgress,
              phase: newPhase,
              events: [...b.events, 
                { title: 'Progress', description: `${newPhase} - ${Math.round(newProgress)}% complete` }
              ]
            };
          }
          return b;
        }));
      }, 1000);
    }
  };

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🚀 SEI SENTINEL Agents Demo</h1>
          <p className="text-xl opacity-90">
            Experience the future of AI-powered smart contract security
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 py-4 overflow-x-auto">
            <TabButton tab="agents" label="Agent Management" icon="🤖" />
            <TabButton tab="battle" label="Battle Arena" icon="⚔️" />
            <TabButton tab="monitor" label="Live Battles" icon="📊" />
            <TabButton tab="leaderboard" label="Performance" icon="🏆" />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Management System</h2>
                <p className="text-gray-600">
                  Deploy, monitor, and upgrade your AI security agents. Each agent specializes in different 
                  security domains and can be customized for your specific needs.
                </p>
              </div>
              <EnhancedAgentsPage />
            </motion.div>
          )}

          {activeTab === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Battle Arena</h2>
                <p className="text-gray-600">
                  Select your agents and target vulnerabilities to initiate real-time security battles. 
                  Watch as your agents analyze, attack, and defeat security threats.
                </p>
              </div>
              <BattleArena 
                agents={agents} 
                vulnerabilities={vulnerabilities}
                onStartBattle={handleStartBattle}
              />
            </motion.div>
          )}

          {activeTab === 'monitor' && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Battle Monitor</h2>
                <p className="text-gray-600">
                  Track real-time progress of ongoing battles. Expand each battle to see detailed 
                  analytics, battle logs, and performance metrics.
                </p>
              </div>
              <LiveBattleMonitor 
                battles={battles}
                onBattleUpdate={() => {}}
              />
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Leaderboard</h2>
                <p className="text-gray-600">
                  Compare agent performance across different metrics. Sort by $SENT earned, win rate, 
                  victories, or level to find your top performers.
                </p>
              </div>
              <AgentPerformanceDashboard agents={agents} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            🎯 Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Agents</h3>
              <p className="text-gray-600">
                Intelligent security agents that learn from each battle and improve over time
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Battles</h3>
              <p className="text-gray-600">
                Live combat system with real-time progress tracking and detailed battle logs
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">
                Comprehensive metrics and leaderboards to track agent performance
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gamified Experience</h3>
              <p className="text-gray-600">
                Level progression, achievements, and rewards make security fun and engaging
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security Focused</h3>
              <p className="text-gray-600">
                Specialized agents for different vulnerability types and security domains
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Responsive</h3>
              <p className="text-gray-600">
                Optimized for all devices with touch-friendly interactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsDemo;
