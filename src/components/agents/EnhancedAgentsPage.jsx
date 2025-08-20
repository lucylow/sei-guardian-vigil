// Enhanced Agents UI/UX Components for SEI SENTINEL
// File: src/components/agents/EnhancedAgentsPage.jsx

import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Target, 
  Award, 
  TrendingUp, 
  Activity,
  Sword,
  Crown,
  Star,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const EnhancedAgentsPage = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [battleMode, setBattleMode] = useState(false);
  const [agents, setAgents] = useState([
    {
      id: 'alpha',
      name: 'Agent Alpha',
      role: 'Security Specialist',
      avatar: '/agents/security.png',
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
      avatar: '/agents/threat.png',
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
      avatar: '/agents/remediation.png',
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

  const AgentCard = ({ agent, isSelected, onClick }) => (
    <div
      className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 cursor-pointer border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
          : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={() => onClick(agent)}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${
          agent.status === 'active' ? 'bg-green-500 animate-pulse' :
          agent.status === 'battling' ? 'bg-red-500 animate-pulse' :
          'bg-yellow-500'
        }`} />
      </div>

      {/* Agent Avatar */}
      <div className="relative mb-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded-full text-xs font-bold text-yellow-400">
          LVL {agent.level}
        </div>
      </div>

      {/* Agent Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{agent.role}</p>
        
        {/* Experience Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(agent.experience / agent.nextLevelXP) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">{agent.experience}/{agent.nextLevelXP} XP</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-green-400">{agent.monstersDefeated}</div>
          <div className="text-xs text-gray-400">Victories</div>
        </div>
        <div>
          <div className="text-lg font-bold text-yellow-400">{agent.sentEarned}</div>
          <div className="text-xs text-gray-400">$SENT</div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-300">
          Win Rate: <span className="text-green-400 font-bold">{agent.winRate}%</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
          agent.status === 'active' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : agent.status === 'battling'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        {agent.status === 'active' && <><Play className="inline w-4 h-4 mr-2" />Deploy</>}
        {agent.status === 'battling' && <><Activity className="inline w-4 h-4 mr-2" />In Battle</>}
        {agent.status === 'resting' && <><Pause className="inline w-4 h-4 mr-2" />Resting</>}
              </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Security Agent Command Center</h1>
          <p className="text-gray-400">Deploy and manage your AI security agents on Sei Network</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{agents.length}</div>
            <div className="text-gray-400">Active Agents</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {agents.reduce((sum, agent) => sum + agent.monstersDefeated, 0)}
            </div>
            <div className="text-gray-400">Total Victories</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {agents.reduce((sum, agent) => sum + agent.sentEarned, 0)}
            </div>
            <div className="text-gray-400">$SENT Earned</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.round(agents.reduce((sum, agent) => sum + agent.winRate, 0) / agents.length)}%
            </div>
            <div className="text-gray-400">Avg Win Rate</div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onClick={setSelectedAgent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAgentsPage;
