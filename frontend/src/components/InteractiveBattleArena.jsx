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
    <div className="p-6 bg-gray-900 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">
        🛡️ Agent Battle Arena
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeBattles.map((battle, index) => (
          <div key={battle.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white">{battle.agentName}</span>
              <span className="text-lg text-yellow-400">⚔️ VS ⚔️</span>
              <span className="font-bold text-red-400">
                {battle.vulnerability.type}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-green-400">
                Agent Health: {battle.agentHealth}%
              </span>
              <span className="text-red-400">
                Monster Health: {battle.monsterHealth}%
              </span>
            </div>
            <input
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={`Chat with ${battle.agentName}...`}
              className="w-full p-2 bg-gray-800 rounded text-white text-sm"
              onKeyPress={(e) => e.key === "Enter" && sendMessageToAgent(battle.agentId)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-2">
          🗣️ Live Agent Chatter
        </h3>
        <div className="bg-gray-800 p-3 rounded">
          {agentDialogue.map((msg, i) => (
            <div key={i} className="mb-1 text-white">
              <span className="font-bold">{msg.agentName}:</span> {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}