import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveBattleArena({ socket }) {
  const [activeBattles, setActiveBattles] = useState([]);
  const [agentDialogue, setAgentDialogue] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    socket.on("battle:started", (battle) => {
      setActiveBattles((prev) => [...prev, battle]);
    });

    socket.on("agent:dialogue", (message) => {
      setAgentDialogue((prev) => [...prev, message].slice(-10));
    });

    socket.on("achievement:unlocked", (achievement) => {
      // Show celebration animation
      // ...existing code...
    });

    return () => {
      socket.off("battle:started");
      socket.off("agent:dialogue");
      socket.off("achievement:unlocked");
    };
  }, [socket]);

  const sendMessageToAgent = (agentId) => {
    if (!userMessage.trim()) return;
    socket.emit("agent:message", {
      agentId,
      message: userMessage,
      timestamp: Date.now(),
    });
    setUserMessage("");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-white flex items-center gap-2">
        <span>🛡️</span> Agent Battle Arena
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activeBattles.map((battle, index) => (
          <motion.div
            key={battle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-800 via-purple-800 to-blue-800 p-6 rounded-lg mb-4 shadow-lg border border-purple-600 relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white text-lg flex items-center gap-2">
                <img
                  src={`/agents/${battle.agentName}.png`}
                  alt={battle.agentName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                {battle.agentName}
              </span>
              <span className="text-2xl text-yellow-400 font-bold">
                ⚔️ VS ⚔️
              </span>
              <span className="font-bold text-red-400 text-lg flex items-center gap-2">
                <img
                  src={`/monsters/${battle.vulnerability.type}.png`}
                  alt={battle.vulnerability.type}
                  className="w-8 h-8 rounded-full mr-2"
                />
                {battle.vulnerability.type}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex flex-col items-start w-1/2 pr-2">
                <span className="text-green-400 font-semibold mb-1">
                  Agent Health
                </span>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-1">
                  <motion.div
                    className="bg-green-500 h-4 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${battle.agentHealth}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-white text-xs">
                  {battle.agentHealth}%
                </span>
              </div>
              <div className="flex flex-col items-end w-1/2 pl-2">
                <span className="text-red-400 font-semibold mb-1">
                  Monster Health
                </span>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-1">
                  <motion.div
                    className="bg-red-500 h-4 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${battle.monsterHealth}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-white text-xs">
                  {battle.monsterHealth}%
                </span>
              </div>
            </div>
            <input
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={`Chat with ${battle.agentName}...`}
              className="w-full p-2 bg-gray-800 rounded text-white text-sm border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onKeyPress={(e) =>
                e.key === "Enter" && sendMessageToAgent(battle.agentId)
              }
            />
            {/* Victory animation */}
            {battle.monsterHealth === 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-green-900/70 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">
                    🏆 Victory!
                  </div>
                  <div className="text-lg text-white">
                    Agent {battle.agentName} defeated {battle.vulnerability.type}!
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🗣️</span> Live Agent Chatter
        </h3>
        <div className="bg-gradient-to-br from-gray-800 via-purple-800 to-blue-800 p-4 rounded shadow-lg">
          {agentDialogue.length === 0 ? (
            <div className="text-gray-400 italic">
              No messages yet. Start a battle and chat!
            </div>
          ) : (
            agentDialogue.map((msg, i) => (
              <div
                key={i}
                className="mb-2 text-white flex items-center gap-2"
              >
                <span className="font-bold text-purple-300">{msg.agentName}:</span>
                <span>{msg.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}