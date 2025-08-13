
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Contract } from '../hooks/useSeiData';

interface ContractHealthGridProps {
  contracts: Contract[];
}

export const ContractHealthGrid: React.FC<ContractHealthGridProps> = ({ contracts }) => {
  const statusColors = {
    critical: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
    warning: 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20',
    safe: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
  };
  
  const statusIcons = {
    critical: <AlertTriangle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    safe: <CheckCircle className="w-5 h-5 text-green-400" />,
  };

  const StatCard: React.FC<{
    label: string;
    value: string | number;
    highlight?: boolean;
    capitalize?: boolean;
    trend?: 'up' | 'down';
  }> = ({ label, value, highlight, capitalize, trend }) => (
    <div className={`p-2 rounded-lg transition-colors ${
      highlight ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800/30'
    }`}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`font-medium flex items-center space-x-1 ${
        capitalize ? 'capitalize' : ''
      } ${
        highlight ? 'text-red-400' : 'text-slate-200'
      }`}>
        <span>{value}</span>
        {trend && (
          trend === 'up' ? 
            <TrendingUp className="w-3 h-3 text-green-400" /> : 
            <TrendingDown className="w-3 h-3 text-red-400" />
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contracts.map(contract => (
        <div 
          key={contract.address} 
          className={`p-6 rounded-xl border transition-all hover:scale-105 cursor-pointer ${statusColors[contract.status]}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white mb-1">{contract.name}</h3>
              <p className="text-sm text-slate-400 font-mono break-all">{contract.address}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/50 ml-3">
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

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">
                Gas Optimized: {contract.gasOptimized ? 'Yes' : 'No'}
              </span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              contract.gasOptimized ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'
            }`}>
              {contract.gasOptimized ? 'OPTIMIZED' : 'PENDING'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
