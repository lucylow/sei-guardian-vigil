import React from 'react';
import { motion } from 'framer-motion';

export default function ConfigurationPanel({
  agentConfig,
  setAgentConfig,
  onDeploy,
  isDeploying
}) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-gray-800">🚀 Agent Configuration</h3>
      {agentConfig?.name && (
        <div className="mb-2">
          <div className="font-bold text-primary">{agentConfig.name}</div>
          <div className="text-xs text-muted-foreground">{agentConfig.description}</div>
        </div>
      )}
      {/* ...existing code for config fields... */}
      <motion.button
        onClick={onDeploy}
        disabled={isDeploying}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white transition-colors ${
          isDeploying
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
        }`}
      >
        {isDeploying ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Deploying to Sei...</span>
          </div>
        ) : (
          '🚀 Deploy Agent to Sei Blockchain'
        )}
      </motion.button>
      {/* ...existing code... */}
    </div>
  );
}