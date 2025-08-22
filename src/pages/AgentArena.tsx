import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Sword, 
  Users, 
  Trophy, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Play, 
  Zap, 
  Target, 
  Gamepad2,
  Wallet,
  Crown,
  Star,
  TrendingUp,
  Activity
} from "lucide-react";

export default function AgentArena() {
  // Game state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showNFTMinting, setShowNFTMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Game data
  const [agents, setAgents] = useState([
    { id: 1, name: "Neo Guardian", power: 95, status: "Active", rarity: "LEGENDARY", battlesWon: 156, sentEarned: 12500 },
    { id: 2, name: "Morpheus Scout", power: 85, status: "Idle", rarity: "EPIC", battlesWon: 134, sentEarned: 9800 },
    { id: 3, name: "Trinity Patch", power: 88, status: "Active", rarity: "EPIC", battlesWon: 98, sentEarned: 7500 },
    { id: 4, name: "Agent Compliance", power: 82, status: "Resting", rarity: "RARE", battlesWon: 67, sentEarned: 4200 }
  ]);

  const [vulnerabilities, setVulnerabilities] = useState([
    { id: 101, name: "Flash Loan Exploit", threatLevel: 90, status: "Active", reward: 500 },
    { id: 102, name: "Reentrancy Bug", threatLevel: 75, status: "Active", reward: 300 },
    { id: 103, name: "Oracle Manipulation", threatLevel: 85, status: "Active", reward: 400 }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Blood", description: "Detected your first vulnerability", icon: "🩸", reward: 100, unlocked: true },
    { id: 2, title: "Matrix Warrior", description: "Win 10 battles", icon: "⚔️", reward: 500, unlocked: true },
    { id: 3, title: "Agent Collector", description: "Own 3+ different agent types", icon: "🎭", reward: 250, unlocked: false },
    { id: 4, title: "Vulnerability Hunter", description: "Eliminate 50 vulnerabilities", icon: "🎯", reward: 1000, unlocked: false }
  ]);

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

  // Connect wallet function
  const connectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(true);
    setWalletAddress("sei1abc123...def456");
    addNotification("Wallet connected successfully!", "success");
  };

  // Start battle function
  const startBattle = (agent, vulnerability) => {
    if (agent.status !== "Active") {
      addNotification(`${agent.name} is not available for battle`, "error");
      return;
    }

    setBattleInProgress(true);
    setBattleLog([]);
    
    // Show battle start notification
    addNotification(`${agent.name} is entering the Matrix to battle vulnerabilities!`, "info");
    
    // Simulate battle phases
    const battlePhases = [
      { message: `${agent.name} is jacking into the Matrix...`, delay: 1000 },
      { message: `${agent.name} is scanning for vulnerabilities...`, delay: 3000 },
      { message: `${agent.name} is engaging ${vulnerability.name}...`, delay: 5000 },
      { message: `${agent.name} is in digital combat...`, delay: 7000 },
      { message: `${agent.name} has defeated ${vulnerability.name}!`, delay: 9000 }
    ];

    battlePhases.forEach((phase, index) => {
      setTimeout(() => {
        setBattleLog(prev => [...prev, phase.message]);
        if (index === battlePhases.length - 1) {
          // Battle complete
          setBattleInProgress(false);
          addNotification(`Victory! ${agent.name} earned ${vulnerability.reward} $SENT`, "success");
          
          // Update agent stats
          setAgents(prev => prev.map(a => 
            a.id === agent.id 
              ? { ...a, battlesWon: a.battlesWon + 1, sentEarned: a.sentEarned + vulnerability.reward }
              : a
          ));
          
          // Remove vulnerability
          setVulnerabilities(prev => prev.filter(v => v.id !== vulnerability.id));
        }
      }, phase.delay);
    });
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
            addNotification(`🎉 NFT "${achievementType}" minted successfully!`, "success");
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Notification Component
  const Notification = ({ notification, onRemove }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
        case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
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

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 text-green-400 font-mono">
            🛡️ SEI AGENT ARENA
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Deploy your Digital Sentinels • Defend the Sei Blockchain • Earn Rewards
          </p>
          
          {!walletConnected ? (
            <button
              onClick={connectWallet}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="bg-green-900/20 border border-green-500 rounded-lg px-6 py-3 inline-block">
              <span className="text-green-400">Connected: {walletAddress}</span>
            </div>
          )}
        </motion.div>

        {/* Game Overview Section */}
        <section className="mb-8 p-6 border border-green-500 rounded-lg bg-green-900/10">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2" />
            Game Overview
          </h2>
          <p className="text-gray-300 mb-3">
            In the Agent Arena, your security agents — represented as NFTs — battle emerging vulnerabilities 
            in real time on the Sei blockchain. Each agent has unique skills to detect, block, and neutralize 
            threats such as exploits, faulty contracts, and zero-day anomalies.
          </p>
          <p className="text-gray-300">
            The goal is to protect the ecosystem by deploying and upgrading agents that scan contracts in under 400ms, 
            matching Sei's lightning-fast finality.
          </p>
        </section>

        {/* Gameplay Mechanics Section */}
        <section className="mb-8 p-6 border border-blue-500 rounded-lg bg-blue-900/10">
          <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
            <Sword className="w-6 h-6 mr-2" />
            Gameplay Mechanics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Agents as NFT Entities</h3>
              <p className="text-gray-300 text-sm">
                Each agent NFT comes with traits and abilities, including scanning speed, detection accuracy, and special skills.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Live Battles</h3>
              <p className="text-gray-300 text-sm">
                Agents face off against simulated "monsters" representing vulnerabilities. Successful defenses earn XP and token rewards.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Upgrade & Evolve</h3>
              <p className="text-gray-300 text-sm">
                Use rewards to upgrade your agents with new skills or mint new NFTs with stronger capabilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Leaderboard & Achievements</h3>
              <p className="text-gray-300 text-sm">
                Track your defense success and climb the rankings while earning exclusive badges.
              </p>
            </div>
          </div>
        </section>

        {/* Main Game Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Your Digital Sentinels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedAgent?.id === agent.id
                      ? 'border-green-500 bg-green-900/20 shadow-lg shadow-green-500/25'
                      : 'border-gray-600 bg-gray-900/20 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      agent.rarity === 'LEGENDARY' ? 'bg-yellow-500 text-black' :
                      agent.rarity === 'EPIC' ? 'bg-purple-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {agent.rarity}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Power:</span>
                      <span className="text-green-400 font-bold">{agent.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-bold ${
                        agent.status === 'Active' ? 'text-green-400' :
                        agent.status === 'Idle' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Battles Won:</span>
                      <span className="text-blue-400 font-bold">{agent.battlesWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">$SENT Earned:</span>
                      <span className="text-yellow-400 font-bold">{agent.sentEarned.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-2 px-4 rounded font-semibold transition-all duration-200 ${
                      agent.status === 'Active' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={agent.status !== 'Active'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (agent.status === 'Active') {
                        addNotification(`${agent.name} is entering the Matrix to battle vulnerabilities!`, 'info');
                      }
                    }}
                  >
                    {agent.status === 'Active' && <><Play className="inline w-4 h-4 mr-2" />Jack In</>}
                    {agent.status === 'Idle' && <><Activity className="inline w-4 h-4 mr-2" />Idle</>}
                    {agent.status === 'Resting' && <><Activity className="inline w-4 h-4 mr-2" />Resting</>}
                  </button>
                </div>
              ))}
            </div>

            {/* Vulnerabilities Section */}
            <h2 className="text-2xl font-bold text-red-400 mb-6 font-mono flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Active Threats
            </h2>
            <div className="space-y-4">
              {vulnerabilities.map((vulnerability) => (
                <div
                  key={vulnerability.id}
                  className="bg-red-900/20 border-2 border-red-500 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-red-400">{vulnerability.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-yellow-400 font-bold">Reward: {vulnerability.reward} $SENT</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        vulnerability.threatLevel >= 85 ? 'bg-red-500 text-white' :
                        vulnerability.threatLevel >= 70 ? 'bg-orange-500 text-white' :
                        'bg-yellow-500 text-black'
                      }`}>
                        Threat LVL {vulnerability.threatLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      {vulnerability.name} is actively threatening the Sei ecosystem
                    </span>
                    <button
                      className={`px-4 py-2 rounded font-semibold transition-all duration-200 ${
                        selectedAgent && selectedAgent.status === 'Active'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!selectedAgent || selectedAgent.status !== 'Active'}
                      onClick={() => {
                        if (selectedAgent && selectedAgent.status === 'Active') {
                          startBattle(selectedAgent, vulnerability);
                        } else {
                          addNotification('Please select an active agent first', 'warning');
                        }
                      }}
                    >
                      <Sword className="inline w-4 h-4 mr-2" />
                      Engage
                    </button>
                  </div>
                </div>
          ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Battle Arena */}
            <div className="bg-gray-900/50 border border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Battle Arena
              </h3>
              
              {battleInProgress ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <Sword className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-green-400 font-bold">Battle in Progress!</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {battleLog.map((log, index) => (
                      <div key={index} className="text-sm text-gray-300 mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an agent and engage a vulnerability to start battling!</p>
                </div>
              )}
            </div>

            {/* Matrix Event */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3 font-mono">
                🎯 Zion Uprising Event
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
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500 rounded-lg p-6">
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
            </div>

            {/* Leaderboard */}
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3 font-mono">
                🏅 Top Sentinels
              </h3>
              <div className="space-y-2">
                {agents
                  .sort((a, b) => b.sentEarned - a.sentEarned)
                  .slice(0, 3)
                  .map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-400'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <span className="text-white">{agent.name}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{agent.sentEarned.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* How to Play Section */}
        <section className="mt-12 p-6 border border-cyan-500 rounded-lg bg-cyan-900/10">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            How to Play
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-cyan-300 mb-2">Getting Started</h3>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Connect your wallet and select your agent NFT</li>
                <li>2. Deploy agents to scan smart contracts or monitor live chain events</li>
                <li>3. Earn rewards by successfully defending against vulnerabilities</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-bold text-cyan-300 mb-2">Advanced Gameplay</h3>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>4. Use rewards to level up and unlock new skills or mint new agents</li>
                <li>5. Participate in leaderboard competitions and DAO governance votes</li>
                <li>6. Form alliances and coordinate defense strategies</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-green-400 mb-4">🚀 Ready to defend SEI?</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Join the Matrix and become a guardian of the Sei blockchain ecosystem
            </p>
            <button
              onClick={() => {
                if (walletConnected) {
                  addNotification('🎉 Welcome to the Matrix, Guardian!', 'success');
                } else {
                  connectWallet();
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-xl transition-colors flex items-center space-x-3 mx-auto"
            >
              <Shield className="w-6 h-6" />
              <span>{walletConnected ? 'Launch Agents' : 'Connect Wallet & Launch'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Modals */}
      <AchievementsModal />
      <EventDetailsModal />
      <NFTMintingModal />
    </div>
  );
}