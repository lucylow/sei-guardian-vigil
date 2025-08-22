import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Target, 
  Activity, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Crown,
  Sword,
  Eye,
  Download,
  Share2,
  X,
  Trophy,
  Star,
  Gift,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const MatrixAgentArena = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeBattles, setActiveBattles] = useState([]);
  const [matrixRain, setMatrixRain] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showNFTMinting, setShowNFTMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [systemStats, setSystemStats] = useState({
    vulnerabilities: 847,
    exploitsBlocked: 156,
    sentDistributed: 45600,
    activeAgents: 4,
    winRate: 94.2
  });

  // Matrix Rain Effect
  useEffect(() => {
    const createMatrixRain = () => {
      const columns = Math.floor(window.innerWidth / 20);
      const drops = [];
      
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * window.innerHeight;
      }
      
      setMatrixRain(drops);
    };

    createMatrixRain();
    window.addEventListener('resize', createMatrixRain);
    
    const interval = setInterval(() => {
      setMatrixRain(prev => prev.map(drop => 
        drop > window.innerHeight ? 0 : drop + 20
      ));
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', createMatrixRain);
    };
  }, []);

  // Initialize achievements and leaderboard
  useEffect(() => {
    const initialAchievements = [
      {
        id: 1,
        title: "First Blood",
        description: "Detected your first vulnerability",
        icon: "🩸",
        reward: 100,
        unlocked: true,
        timestamp: Date.now() - 86400000
      },
      {
        id: 2,
        title: "Matrix Warrior",
        description: "Win 10 battles",
        icon: "⚔️",
        reward: 500,
        unlocked: true,
        timestamp: Date.now() - 172800000
      },
      {
        id: 3,
        title: "Agent Collector",
        description: "Own 3+ different agent types",
        icon: "🎭",
        reward: 250,
        unlocked: false,
        timestamp: null
      },
      {
        id: 4,
        title: "Vulnerability Hunter",
        description: "Eliminate 50 vulnerabilities",
        icon: "🎯",
        reward: 1000,
        unlocked: false,
        timestamp: null
      }
    ];

    const initialLeaderboard = [
      { rank: 1, agent: "Neo Guardian", codename: "StaticGuardian", sentEarned: 12500, battlesWon: 156, level: 42 },
      { rank: 2, agent: "Morpheus Scout", codename: "DarkWebScout", sentEarned: 9800, battlesWon: 134, level: 38 },
      { rank: 3, agent: "Trinity Patch", codename: "PatchMaster", sentEarned: 7500, battlesWon: 98, level: 35 },
      { rank: 4, agent: "Agent Compliance", codename: "ComplianceGuard", sentEarned: 4200, battlesWon: 67, level: 29 }
    ];

    setAchievements(initialAchievements);
    setLeaderboard(initialLeaderboard);
  }, []);

  const agents = [
    {
      id: 'neo-guardian',
      name: 'Neo Guardian',
      codename: 'StaticGuardian',
      rarity: 'LEGENDARY',
      level: 42,
      role: 'The One - Security Analyst',
      avatar: '/agents/neo-guardian.png',
      stats: {
        accuracy: 97,
        speed: 85,
        power: 92,
        defense: 88
      },
      abilities: ['Bullet Time Analysis', 'Code Sight', 'System Override'],
      battlesWon: 156,
      sentEarned: 12500,
      status: 'active',
      matrixCode: '01001110 01100101 01101111', // "Neo" in binary
      color: '#00ff41'
    },
    {
      id: 'morpheus-scout',
      name: 'Morpheus Scout',
      codename: 'DarkWebScout',
      rarity: 'EPIC',
      level: 38,
      role: 'The Mentor - Threat Intelligence',
      avatar: '/agents/morpheus-scout.png',
      stats: {
        accuracy: 94,
        speed: 92,
        power: 89,
        defense: 85
      },
      abilities: ['Red Pill Vision', 'Deep Web Dive', 'Truth Seeker'],
      battlesWon: 134,
      sentEarned: 9800,
      status: 'battling',
      matrixCode: '01001101 01101111 01110010', // "Mor" in binary
      color: '#ff6b35'
    },
    {
      id: 'trinity-patch',
      name: 'Trinity Patch',
      codename: 'PatchMaster',
      rarity: 'EPIC',
      level: 35,
      role: 'The Hacker - Remediation Expert',
      avatar: '/agents/trinity-patch.png',
      stats: {
        accuracy: 96,
        speed: 94,
        power: 87,
        defense: 83
      },
      abilities: ['System Hack', 'Code Injection', 'Digital Resurrection'],
      battlesWon: 98,
      sentEarned: 7500,
      status: 'active',
      matrixCode: '01010100 01110010 01101001', // "Tri" in binary
      color: '#9d4edd'
    },
    {
      id: 'agent-compliance',
      name: 'Agent Compliance',
      codename: 'ComplianceGuard',
      rarity: 'RARE',
      level: 29,
      role: 'The Enforcer - Compliance Guard',
      avatar: '/agents/agent-compliance.png',
      stats: {
        accuracy: 91,
        speed: 78,
        power: 85,
        defense: 95
      },
      abilities: ['System Lock', 'Rule Enforcement', 'Order Restoration'],
      battlesWon: 67,
      sentEarned: 4200,
      status: 'resting',
      matrixCode: '01000001 01100111 01100101', // "Age" in binary
      color: '#06ffa5'
    }
  ];

  const vulnerabilities = [
    {
      id: 'agent-smith-virus',
      name: 'Agent Smith Virus',
      type: 'Self-Replicating Exploit',
      severity: 10,
      description: 'Malicious code that duplicates itself across smart contracts',
      health: 100,
      reward: 500,
      status: 'active',
      matrixCode: '01010011 01101101 01101001', // "Smi" in binary
      color: '#ff0000'
    },
    {
      id: 'sentinel-hunter',
      name: 'Sentinel Hunter',
      type: 'Access Control Breach',
      severity: 8,
      description: 'Seeks and destroys security protocols',
      health: 75,
      reward: 300,
      status: 'active',
      matrixCode: '01001000 01110101 01101110', // "Hun" in binary
      color: '#ff4500'
    },
    {
      id: 'oracle-corruption',
      name: 'Oracle Corruption',
      type: 'Data Manipulation',
      severity: 9,
      description: 'Corrupts price feeds and external data sources',
      health: 90,
      reward: 400,
      status: 'active',
      matrixCode: '01001111 01110010 01100001', // "Ora" in binary
      color: '#ffa500'
    }
  ];

  const MatrixRainCanvas = () => (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
      {matrixRain.map((drop, index) => (
        <div
          key={index}
          className="absolute text-green-400 font-mono text-sm animate-pulse"
          style={{
            left: `${index * 20}px`,
            top: `${drop}px`,
            transform: 'translateY(-100%)'
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </div>
      ))}
    </div>
  );

  // Add notification function
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  // Remove notification function
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // NFT Minting function
  const mintNFT = async (agentId, achievementType) => {
    setShowNFTMinting(true);
    setMintingProgress(0);
    
    // Simulate NFT minting process
    const interval = setInterval(() => {
      setMintingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowNFTMinting(false);
            setMintingProgress(0);
            addNotification(`🎉 NFT "${achievementType}" minted successfully!`, 'success');
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Battle start function
  const startBattle = async (agent, vulnerability) => {
    if (!agent || agent.status !== 'active') {
      addNotification('Agent is not available for battle', 'error');
      return;
    }

    // Show battle start notification
    addNotification(`${agent.name} is entering the Matrix to battle vulnerabilities!`, 'info');
    
    // Update agent status
    const updatedAgents = agents.map(a => 
      a.id === agent.id ? { ...a, status: 'battling' } : a
    );
    
    // Simulate battle progress
    setTimeout(() => {
      addNotification(`${agent.name} is scanning for vulnerabilities...`, 'info');
    }, 2000);
    
    setTimeout(() => {
      addNotification(`${agent.name} is engaging hostile code...`, 'info');
    }, 5000);
    
    setTimeout(() => {
      addNotification(`${agent.name} has completed the battle!`, 'success');
      // Reset agent status
      const resetAgents = agents.map(a => 
        a.id === agent.id ? { ...a, status: 'active' } : a
      );
    }, 8000);
  };

  const AgentCard = ({ agent }) => (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative bg-black border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
        selectedAgent?.id === agent.id 
          ? `border-[${agent.color}] shadow-lg shadow-[${agent.color}]/50` 
          : 'border-gray-700 hover:border-gray-500'
      }`}
      style={{
        boxShadow: selectedAgent?.id === agent.id 
          ? `0 0 20px ${agent.color}40` 
          : 'none'
      }}
      onClick={() => setSelectedAgent(agent)}
    >
      {/* Matrix Code Background */}
      <div className="absolute inset-0 opacity-10 font-mono text-xs text-green-400 overflow-hidden">
        {agent.matrixCode.repeat(10)}
      </div>

      {/* Rarity Badge */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
        agent.rarity === 'LEGENDARY' ? 'bg-yellow-500 text-black' :
        agent.rarity === 'EPIC' ? 'bg-purple-500 text-white' :
        agent.rarity === 'RARE' ? 'bg-blue-500 text-white' :
        'bg-gray-500 text-white'
      }`}>
        {agent.rarity}
      </div>

      {/* Agent Avatar */}
      <div className="relative mb-4">
        <div 
          className="w-20 h-20 mx-auto rounded-full border-2 p-1"
          style={{ borderColor: agent.color }}
        >
          <div 
            className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ 
              backgroundColor: `${agent.color}20`,
              color: agent.color
            }}
          >
            {agent.name.charAt(0)}
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 rounded-full text-xs font-bold text-yellow-400">
          LVL {agent.level}
        </div>
      </div>

      {/* Agent Info */}
      <div className="text-center mb-4 relative z-10">
        <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{agent.role}</p>
        
        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            agent.status === 'active' ? 'bg-green-500 animate-pulse' :
            agent.status === 'battling' ? 'bg-red-500 animate-pulse' :
            'bg-yellow-500'
          }`} />
          <span className="text-xs text-gray-400 capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-center mb-4 relative z-10">
        <div>
          <div className="text-lg font-bold text-green-400">{agent.battlesWon}</div>
          <div className="text-xs text-gray-400">Victories</div>
        </div>
        <div>
          <div className="text-lg font-bold text-yellow-400">{agent.sentEarned}</div>
          <div className="text-xs text-gray-400">$SENT</div>
        </div>
      </div>

      {/* Abilities */}
      <div className="mb-4 relative z-10">
        <div className="text-xs text-gray-400 mb-1">Abilities:</div>
        <div className="flex flex-wrap gap-1">
          {agent.abilities.slice(0, 2).map((ability, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: `${agent.color}20`,
                color: agent.color
              }}
            >
              {ability}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-2 px-4 rounded font-semibold transition-all duration-200 relative z-10 ${
          agent.status === 'active' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : agent.status === 'battling'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (agent.status === 'active') {
            addNotification(`${agent.name} is entering the Matrix to battle vulnerabilities!`, 'info');
            // Start battle simulation
            startBattle(agent, vulnerabilities[0]);
          }
        }}
      >
        {agent.status === 'active' && <><Play className="inline w-4 h-4 mr-2" />Jack In</>}
        {agent.status === 'battling' && <><Activity className="inline w-4 h-4 mr-2" />In Combat</>}
        {agent.status === 'resting' && <><Pause className="inline w-4 h-4 mr-2" />Offline</>}
      </motion.button>
    </motion.div>
  );

  const VulnerabilityCard = ({ vulnerability }) => (
    <motion.div
      whileHover={{ scale: 1.02, rotateX: 5 }}
      className="bg-red-900/20 border-2 border-red-500 rounded-lg p-4 relative overflow-hidden"
    >
      {/* Virus Code Background */}
      <div className="absolute inset-0 opacity-10 font-mono text-xs text-red-400 overflow-hidden">
        {vulnerability.matrixCode.repeat(15)}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-red-400">{vulnerability.name}</h3>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            vulnerability.severity >= 9 ? 'bg-red-500 text-white' :
            vulnerability.severity >= 7 ? 'bg-orange-500 text-white' :
            'bg-yellow-500 text-black'
          }`}>
            THREAT LVL {vulnerability.severity}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{vulnerability.description}</p>
        
        {/* Health Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">System Integrity:</span>
            <span className="text-red-400">{vulnerability.health}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${vulnerability.health}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold">Bounty: {vulnerability.reward} $SENT</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold"
            onClick={() => {
              if (selectedAgent && selectedAgent.status === 'active') {
                startBattle(selectedAgent, vulnerability);
              } else {
                addNotification('Please select an active agent first', 'warning');
              }
            }}
            disabled={!selectedAgent || selectedAgent.status !== 'active'}
          >
            <Sword className="inline w-4 h-4 mr-1" />
            Engage
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const BattleMonitor = ({ battle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-green-500 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-green-400 font-bold">{battle.title}</h4>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          battle.severity === 'Critical' ? 'bg-red-500 text-white' :
          battle.severity === 'High' ? 'bg-orange-500 text-white' :
          'bg-yellow-500 text-black'
        }`}>
          {battle.severity}
        </span>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{battle.description}</p>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Combat Progress:</span>
          <span className="text-green-400">{battle.progress}% complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${battle.progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const battles = [
    {
      title: 'Reentrancy Battle',
      severity: 'Critical',
      description: 'StaticGuardian vs CVE-2024-001',
      progress: 75
    },
    {
      title: 'Threat Analysis',
      description: 'DarkWebScout analyzing threat patterns',
      severity: 'High',
      progress: 45
    },
    {
      title: 'System Patch',
      description: 'PatchMaster deploying fix',
      severity: 'Medium',
      progress: 90
    }
  ];

  // Notification Component
  const Notification = ({ notification, onRemove }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
        case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
        default: return <Info className="w-5 h-5 text-blue-400" />;
      }
    };

    const getBgColor = (type) => {
      switch (type) {
        case 'success': return 'bg-green-900/20 border-green-500/50';
        case 'error': return 'bg-red-900/20 border-red-500/50';
        case 'warning': return 'bg-yellow-900/20 border-yellow-500/50';
        default: return 'bg-blue-900/20 border-blue-500/50';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className={`${getBgColor(notification.type)} border rounded-lg p-4 mb-3 flex items-center space-x-3`}
      >
        {getIcon(notification.type)}
        <span className="text-white flex-1">{notification.message}</span>
        <button
          onClick={() => onRemove(notification.id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  };

  // Achievements Modal
  const AchievementsModal = () => (
    <AnimatePresence>
      {showAchievements && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAchievements(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-black border-2 border-green-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-400">🏆 Achievements</h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-gray-600 bg-gray-900/20 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h3 className={`font-bold ${
                        achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-bold">+{achievement.reward} $SENT</span>
                    {achievement.unlocked ? (
                      <span className="text-green-400 text-sm">✓ Unlocked</span>
                    ) : (
                      <span className="text-gray-500 text-sm">Locked</span>
                    )}
                  </div>
                  
                  {achievement.unlocked && achievement.timestamp && (
                    <div className="text-xs text-gray-500 mt-2">
                      Unlocked: {new Date(achievement.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Event Details Modal
  const EventDetailsModal = () => (
    <AnimatePresence>
      {showEventDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowEventDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-black border-2 border-purple-500 rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-400">🎯 Zion Uprising Event</h2>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Event Overview</h3>
                <p className="text-gray-300">
                  The Zion Uprising is a special Matrix event where agents receive enhanced rewards 
                  for achieving win streaks and eliminating high-threat vulnerabilities.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">500%</div>
                  <div className="text-sm text-gray-400">Reward Bonus</div>
                </div>
                <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">48h</div>
                  <div className="text-sm text-gray-400">Time Remaining</div>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Requirements</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Achieve 10+ win streaks</li>
                  <li>• Eliminate 5+ Critical threats</li>
                  <li>• Deploy 3+ agents simultaneously</li>
                </ul>
              </div>
              
              <button
                onClick={() => {
                  addNotification('🎉 Event participation activated!', 'success');
                  setShowEventDetails(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Join Event
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // NFT Minting Modal
  const NFTMintingModal = () => (
    <AnimatePresence>
      {showNFTMinting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNFTMinting(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-black border-2 border-green-500 rounded-lg p-6 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-400 mb-2">🎨 Minting NFT</h2>
              <p className="text-gray-300">Creating your Digital Sentinel NFT on the Sei blockchain...</p>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  style={{ width: `${mintingProgress}%` }}
                />
              </div>
              <div className="text-green-400 font-bold">{mintingProgress}%</div>
            </div>
            
            <div className="text-sm text-gray-400">
              {mintingProgress < 100 ? 'Processing transaction...' : 'NFT minted successfully!'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRainCanvas />
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 text-green-400 font-mono">
            THE MATRIX: DIGITAL SENTINELS
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Choose your Oracle • Hunt Exploits • Protect the Matrix
          </p>
          <div className="text-red-400 font-bold animate-pulse">
            🚨 URGENT: Matrix Breach Detected - Deploy Sentinels Immediately
          </div>
        </motion.div>

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(systemStats).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-green-500 rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold text-green-400">{value}</div>
              <div className="text-xs text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono">
              DIGITAL SENTINELS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Vulnerabilities */}
            <h2 className="text-2xl font-bold text-red-400 mb-6 font-mono">
              ACTIVE THREATS
            </h2>
            <div className="space-y-4">
              {vulnerabilities.map((vulnerability) => (
                <VulnerabilityCard key={vulnerability.id} vulnerability={vulnerability} />
              ))}
            </div>
          </div>

          {/* Battle Monitor */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 font-mono">
              COMBAT STATUS
            </h2>
            <div className="space-y-4">
              {battles.map((battle, index) => (
                <BattleMonitor key={index} battle={battle} />
              ))}
            </div>

            {/* Matrix Event */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-purple-400 mb-3 font-mono">
                🎯 ZION UPRISING EVENT
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Special rewards for agents who achieve 10+ win streaks during this event!
              </p>
              <div className="text-yellow-400 font-bold mb-4">
                Bonus: +500% $SENT rewards
              </div>
              <button
                onClick={() => setShowEventDetails(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold transition-colors"
              >
                View Event Details
              </button>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-3 font-mono">
                🏆 Achievements
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Track your progress and unlock rewards!
              </p>
              <button
                onClick={() => setShowAchievements(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black py-2 rounded font-semibold transition-colors"
              >
                View All Achievements
              </button>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-blue-400 mb-3 font-mono">
                🏅 Top Sentinels
              </h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 3).map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${
                        entry.rank === 1 ? 'text-yellow-400' :
                        entry.rank === 2 ? 'text-gray-400' :
                        'text-orange-400'
                      }`}>
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                      </span>
                      <span className="text-white">{entry.agent}</span>
                    </div>
                    <span className="text-yellow-400 font-bold">{entry.sentEarned.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AchievementsModal />
      <EventDetailsModal />
      <NFTMintingModal />
    </div>
  );
};

export default MatrixAgentArena;
