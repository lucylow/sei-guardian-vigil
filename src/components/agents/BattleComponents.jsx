// Interactive Battle Components for SEI SENTINEL Agents
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Trophy, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Activity
} from 'lucide-react';

// Real-time Battle Arena Component
export const BattleArena = ({ agents, vulnerabilities, onStartBattle }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  const VulnerabilityCard = ({ vulnerability }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-4 cursor-pointer border-2 transition-all ${
        selectedVulnerability?.id === vulnerability.id 
          ? 'border-red-400 shadow-lg shadow-red-400/25' 
          : 'border-red-700 hover:border-red-600'
      }`}
      onClick={() => setSelectedVulnerability(vulnerability)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{vulnerability.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
          vulnerability.severity >= 8 ? 'bg-red-500 text-white' :
          vulnerability.severity >= 6 ? 'bg-orange-500 text-white' :
          vulnerability.severity >= 4 ? 'bg-yellow-500 text-black' :
          'bg-green-500 text-white'
        }`}>
          {vulnerability.severity}/10
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Type:</span>
          <span className="text-red-300">{vulnerability.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Health:</span>
          <span className="text-red-300">{vulnerability.health}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Reward:</span>
          <span className="text-yellow-400">{vulnerability.reward} $SENT</span>
        </div>
      </div>

      {/* Health Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-red-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${vulnerability.health}%` }}
        />
      </div>

      <p className="text-gray-300 text-sm">{vulnerability.description}</p>
    </motion.div>
  );

  const AgentSelector = ({ agent }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gray-800 rounded-lg p-4 cursor-pointer border-2 transition-all ${
        selectedAgent?.id === agent.id 
          ? 'border-blue-400 shadow-lg shadow-blue-400/25' 
          : 'border-gray-700 hover:border-gray-600'
      } ${agent.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => agent.status === 'active' && setSelectedAgent(agent)}
    >
      <div className="flex items-center space-x-3">
        <img 
          src={agent.avatar} 
          alt={agent.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h4 className="text-white font-semibold">{agent.name}</h4>
          <p className="text-gray-400 text-sm">{agent.role}</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              agent.status === 'active' ? 'bg-green-500' :
              agent.status === 'battling' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />
            <span className="text-xs text-gray-400 capitalize">{agent.status}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-blue-400 font-bold">{agent.stats.accuracy}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>
    </motion.div>
  );

  const handleStartBattle = () => {
    if (selectedAgent && selectedVulnerability) {
      onStartBattle(selectedAgent.id, selectedVulnerability.id);
      setSelectedAgent(null);
      setSelectedVulnerability(null);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Sword className="w-6 h-6 mr-2 text-red-400" />
        Battle Arena
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Select Agent</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {agents.map(agent => (
              <AgentSelector key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Vulnerability Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Select Target</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {vulnerabilities.filter(v => v.status === 'active').map(vulnerability => (
              <VulnerabilityCard key={vulnerability.id} vulnerability={vulnerability} />
            ))}
          </div>
        </div>
      </div>

      {/* Battle Initiation */}
      <div className="mt-8 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedAgent || !selectedVulnerability}
          onClick={handleStartBattle}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
            selectedAgent && selectedVulnerability
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="inline w-5 h-5 mr-2" />
          Initiate Battle
        </motion.button>
        
        {selectedAgent && selectedVulnerability && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 mt-2"
          >
            {selectedAgent.name} vs {selectedVulnerability.name}
          </motion.p>
        )}
      </div>
    </div>
  );
};

// Live Battle Monitor Component
export const LiveBattleMonitor = ({ battles, onBattleUpdate }) => {
  const [expandedBattle, setExpandedBattle] = useState(null);

  const BattleCard = ({ battle }) => {
    const isExpanded = expandedBattle === battle.id;
    
    return (
      <motion.div
        layout
        className="bg-gray-800 rounded-xl p-4 border border-gray-700"
      >
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExpandedBattle(isExpanded ? null : battle.id)}
        >
          <div className="flex items-center space-x-4">
            <img 
              src={battle.agent.avatar} 
              alt={battle.agent.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 className="text-white font-semibold">{battle.agent.name}</h4>
              <p className="text-gray-400 text-sm">vs {battle.vulnerability.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-bold">{Math.round(battle.progress)}%</div>
              <div className="text-xs text-gray-400 capitalize">{battle.phase}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              battle.status === 'active' ? 'bg-yellow-500 animate-pulse' :
              battle.status === 'won' ? 'bg-green-500' :
              'bg-red-500'
            }`} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${battle.progress}%` }}
            transition={{ duration: 0.5 }}
            className={`h-3 rounded-full ${
              battle.status === 'won' ? 'bg-green-500' :
              battle.status === 'lost' ? 'bg-red-500' :
              'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
          />
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              {/* Battle Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-400">{battle.agent.stats.accuracy}%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-400">{battle.agent.stats.speed}%</div>
                  <div className="text-xs text-gray-400">Speed</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-400">{battle.vulnerability.severity}/10</div>
                  <div className="text-xs text-gray-400">Threat Level</div>
                </div>
              </div>

              {/* Recent Events */}
              <div>
                <h5 className="text-white font-semibold mb-2">Battle Log</h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {battle.events?.slice(-5).map((event, index) => (
                    <div key={index} className="text-sm text-gray-300 bg-gray-700 rounded p-2">
                      <span className="text-blue-400">{event.title}:</span> {event.description}
                    </div>
                  ))}
                </div>
              </div>

              {/* Battle Result */}
              {battle.status !== 'active' && (
                <div className={`p-3 rounded-lg ${
                  battle.status === 'won' ? 'bg-green-900 border border-green-500' : 'bg-red-900 border border-red-500'
                }`}>
                  <div className="flex items-center space-x-2">
                    {battle.status === 'won' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-white font-semibold">
                      {battle.status === 'won' ? 'Victory!' : 'Defeat'}
                    </span>
                  </div>
                  {battle.result && (
                    <div className="mt-2 text-sm">
                      <div className="text-gray-300">
                        Duration: {(battle.result.duration / 1000).toFixed(1)}s
                      </div>
                      {battle.result.reward > 0 && (
                        <div className="text-yellow-400">
                          Reward: +{battle.result.reward} $SENT
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Activity className="w-6 h-6 mr-2 text-green-400" />
        Live Battle Monitor
      </h2>

      {battles.length === 0 ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No active battles</p>
          <p className="text-gray-500 text-sm">Deploy agents to start protecting the network</p>
        </div>
      ) : (
        <div className="space-y-4">
          {battles.map(battle => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      )}
    </div>
  );
};

// Agent Performance Dashboard
export const AgentPerformanceDashboard = ({ agents }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [sortBy, setSortBy] = useState('sentEarned');

  const sortedAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'sentEarned':
        return b.sentEarned - a.sentEarned;
      case 'winRate':
        return b.winRate - a.winRate;
      case 'monstersDefeated':
        return b.monstersDefeated - a.monstersDefeated;
      case 'level':
        return b.level - a.level;
      default:
        return 0;
    }
  });

  const AgentRankCard = ({ agent, rank }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          rank === 0 ? 'bg-yellow-500 text-black' :
          rank === 1 ? 'bg-gray-400 text-black' :
          rank === 2 ? 'bg-orange-600 text-white' :
          'bg-gray-700 text-white'
        }`}>
          {rank + 1}
        </div>
        <img 
          src={agent.avatar} 
          alt={agent.name}
          className="w-12 h-12 rounded-full"
        />
      </div>
      
      <div className="flex-1">
        <h4 className="text-white font-semibold">{agent.name}</h4>
        <p className="text-gray-400 text-sm">{agent.role}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-yellow-400 font-bold">{agent.sentEarned}</div>
          <div className="text-xs text-gray-400">$SENT</div>
        </div>
        <div>
          <div className="text-green-400 font-bold">{agent.winRate}%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
        <div>
          <div className="text-blue-400 font-bold">{agent.monstersDefeated}</div>
          <div className="text-xs text-gray-400">Victories</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          Performance Leaderboard
        </h2>
        
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            <option value="sentEarned">$SENT Earned</option>
            <option value="winRate">Win Rate</option>
            <option value="monstersDefeated">Victories</option>
            <option value="level">Level</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedAgents.map((agent, index) => (
          <AgentRankCard key={agent.id} agent={agent} rank={index} />
        ))}
      </div>
    </div>
  );
};
