import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const BattleSystem = () => {
  const [battles, setBattles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const { socket, isConnected } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
    }
  }, [socket]);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'battleStarted':
        setBattles(prev => [...prev, data.battle]);
        break;
      case 'battleProgress':
        setBattles(prev => prev.map(battle => 
          battle.id === data.battleId 
            ? { ...battle, progress: data.progress, phase: data.phase, events: data.events }
            : battle
        ));
        break;
      case 'battleCompleted':
        setBattles(prev => prev.map(battle => 
          battle.id === data.battle.id 
            ? { ...data.battle, result: data.result }
            : battle
        ));
        break;
      case 'vulnerabilitySpawned':
        setVulnerabilities(prev => [...prev, data.vulnerability]);
        break;
    }
  };

  const startBattle = async (agentId, vulnerabilityId) => {
    if (!socket || !isConnected) {
      alert('Not connected to battle system');
      return;
    }

    socket.send(JSON.stringify({
      type: 'startBattle',
      agentId,
      vulnerabilityId
    }));
  };

  const BattleCard = ({ battle }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{battle.vulnerability}</h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          battle.status === 'won' ? 'bg-green-500' :
          battle.status === 'lost' ? 'bg-red-500' :
          'bg-yellow-500'
        }`}>
          {battle.status.toUpperCase()}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>{battle.agent} - {battle.phase}</span>
          <span>{Math.round(battle.progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${battle.progress}%` }}
          />
        </div>
      </div>

      {battle.events && battle.events.length > 0 && (
        <div className="text-xs text-gray-400">
          <div className="font-semibold mb-1">Recent Events:</div>
          {battle.events.slice(-2).map((event, index) => (
            <div key={index} className="mb-1">
              <span className="text-blue-400">{event.title}:</span> {event.description}
            </div>
          ))}
        </div>
      )}

      {battle.result && (
        <div className="mt-2 p-2 bg-gray-700 rounded">
          <div className="text-sm">
            {battle.result.success ? (
              <span className="text-green-400">Victory! Earned {battle.result.reward} $SENT</span>
            ) : (
              <span className="text-red-400">Defeat! Better luck next time.</span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Duration: {(battle.result.duration / 1000).toFixed(1)}s
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <div className="flex items-center space-x-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} transition-all`} />
        <span className="text-sm text-gray-400 font-semibold">
          {isConnected ? 'Connected to Battle System' : 'Disconnected'}
        </span>
      </div>
      {/* Available Vulnerabilities */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Available Vulnerabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vulnerabilities.filter(v => v.status === 'active').map(vuln => (
            <div key={vuln.id} className="bg-gradient-to-br from-gray-800 via-purple-800 to-blue-800 rounded-lg p-6 border border-purple-600 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-2">{vuln.name}</h3>
              <div className="text-sm text-gray-300 mb-3">
                <div>Type: {vuln.type}</div>
                <div>Severity: {vuln.severity}/10</div>
                <div>Health: {vuln.health}%</div>
              </div>
              <div className="space-y-2">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => startBattle(agent.id, vuln.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded text-sm font-bold shadow transition-colors"
                    disabled={!isConnected}
                  >
                    Send {agent.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Active Battles */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Active Battles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {battles.map(battle => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleSystem;
};

export default BattleSystem;
