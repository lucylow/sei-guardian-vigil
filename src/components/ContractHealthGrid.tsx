import React, { useEffect, useState } from "react";
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Contract } from '../hooks/useSeiData';

interface ContractHealthGridProps {
  contracts: Contract[];
}

export const ContractHealthGrid: React.FC<ContractHealthGridProps> = ({ contracts }) => {
  const statusColors = {
    critical: 'bg-red-50 border-red-300 hover:bg-red-100',
    warning: 'bg-amber-50 border-amber-300 hover:bg-amber-100',
    safe: 'bg-green-50 border-green-300 hover:bg-green-100',
  };
  
  const statusIcons = {
    critical: <AlertTriangle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    safe: <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const StatCard: React.FC<{
    label: string;
    value: string | number;
    highlight?: boolean;
    capitalize?: boolean;
    trend?: 'up' | 'down';
  }> = ({ label, value, highlight, capitalize, trend }) => (
    <div className={`p-2 rounded-lg transition-colors ${
      highlight ? 'bg-red-100 border border-red-300' : 'bg-slate-50'
    }`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`font-medium flex items-center space-x-1 ${
        capitalize ? 'capitalize' : ''
      } ${
        highlight ? 'text-red-600' : 'text-slate-800'
      }`}>
        <span>{value}</span>
        {trend && (
          trend === 'up' ? 
            <TrendingUp className="w-3 h-3 text-green-500" /> : 
            <TrendingDown className="w-3 h-3 text-red-500" />
        )}
      </div>
    </div>
  );

  // Highlight for SeiStake Pool
  const highlightSeiStakePool = (contract: Contract) =>
    contract.name === "SeiStake Pool" &&
    contract.address.toLowerCase() === "0xa0b86a33e6441d87c7834c20001c48ffde12db1b".toLowerCase();

  // Twin-Turbo Consensus: Live block finality + scan latency feed
  const [blockStatus, setBlockStatus] = useState<{ blockHeight: number; latencyMs: number } | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    // Mock real-time data instead of socket.io
    const interval = setInterval(() => {
      setBlockStatus({
        blockHeight: Math.floor(Math.random() * 1000000) + 8000000,
        latencyMs: Math.floor(Math.random() * 600) + 200
      });
      
      if (Math.random() > 0.7) {
        const scan = {
          contract: `Contract_${Math.floor(Math.random() * 1000)}`,
          scanTime: Math.floor(Math.random() * 1500) + 500,
          latencyMs: Math.floor(Math.random() * 400) + 100
        };
        setRecentScans(prev => [scan, ...prev].slice(0, 3));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Twin-Turbo Consensus: Block finality + scan latency panel */}
      <div className="mb-6 p-4 rounded-xl bg-white/80 shadow border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-1">⚡ Live Block Finality (Twin-Turbo)</h2>
        {blockStatus ? (
          <div className="flex items-center space-x-4">
            <span className="font-mono text-blue-700 text-base">
              Block #{blockStatus.blockHeight}
            </span>
            <span className={`font-semibold px-2 py-1 rounded ${blockStatus.latencyMs < 400 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} transition`}>
              Finality latency: {blockStatus.latencyMs} ms
            </span>
          </div>
        ) : (
          <span className="text-slate-500">Connecting to Sei testnet…</span>
        )}
        <div className="mt-3">
          <h3 className="text-md font-bold text-slate-800 mb-1">🚀 Recent Auto‑Scans</h3>
          <ul className="list-disc list-inside text-sm">
            {recentScans.map((scan, idx) => (
              <li key={idx}>
                <strong>{scan.contract}</strong> — Scan: {scan.scanTime} ms • Latency: {scan.latencyMs} ms
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Existing contract health grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map(contract => (
          <div 
            key={contract.address} 
            className={`p-6 rounded-xl border transition-all hover:scale-105 cursor-pointer ${statusColors[contract.status]} ${
              highlightSeiStakePool(contract)
                ? "border-4 border-fuchsia-500 bg-fuchsia-100/10 shadow-lg relative"
                : ""
            }`}
          >
            {/* Highlight badge for SeiStake Pool */}
            {highlightSeiStakePool(contract) && (
              <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-fuchsia-500 text-white text-xs font-bold shadow">
                SEI STAKE POOL
              </span>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">{contract.name}</h3>
                <p className="text-sm text-slate-500 font-mono break-all">{contract.address}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 ml-3">
                {statusIcons[contract.status]}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard label="TVL" value={contract.tvl} />
              <StatCard label="Last Scan" value={contract.lastScan} />
              <StatCard 
                label="Vulnerabilities" 
                value={contract.vulnerabilities} 
                highlight={contract.vulnerabilities > 0}
              />
              <StatCard 
                label="Status" 
                value={contract.status} 
                capitalize 
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">
                  Gas Optimized: {contract.gasOptimized ? 'Yes' : 'No'}
                </span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                contract.gasOptimized ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {contract.gasOptimized ? 'OPTIMIZED' : 'PENDING'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
