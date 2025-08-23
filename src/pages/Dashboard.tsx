import React from 'react';

export default function Dashboard() {
  console.log('Dashboard: Rendering component');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-red-400 mb-6">
          DASHBOARD
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-300 mb-2">Network Status</h3>
            <p className="text-2xl text-green-400">ONLINE</p>
          </div>
          
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-300 mb-2">Active Agents</h3>
            <p className="text-2xl text-blue-400">24</p>
          </div>
          
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-300 mb-2">Security Score</h3>
            <p className="text-2xl text-red-400">94%</p>
          </div>
          
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-300 mb-2">Avg Response</h3>
            <p className="text-2xl text-yellow-400">400ms</p>
          </div>
        </div>
        
        <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-300 mb-4">System Status</h2>
          <p className="text-red-400">Dashboard is working correctly!</p>
        </div>
      </div>
    </div>
  );
}