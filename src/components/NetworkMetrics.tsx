
import React from 'react';
import { NetworkStats } from '../hooks/useSeiData';

interface NetworkMetricsProps {
  stats: NetworkStats;
}

export const NetworkMetrics: React.FC<NetworkMetricsProps> = ({ stats }) => {
  const getHealthStatus = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value > threshold;
    return isGood ? 'good' : 'warning';
  };

  const HealthMetric: React.FC<{
    label: string;
    value: string;
    status: 'good' | 'warning' | 'normal';
  }> = ({ label, value, status }) => {
    const colors = {
      good: 'text-green-400',
      warning: 'text-amber-400',
      normal: 'text-slate-300'
    };

    const indicators = {
      good: '🟢',
      warning: '🟡',
      normal: '⚪'
    };

    return (
      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{indicators[status]}</span>
          <span className="text-sm text-slate-400">{label}</span>
        </div>
        <span className={`font-mono font-medium ${colors[status]}`}>{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <HealthMetric 
        label="Block Time" 
        value={`${Math.round(stats.blockTime || 0)}ms`} 
        status={getHealthStatus(stats.blockTime || 0, 400, true)}
      />
      <HealthMetric 
        label="TPS" 
        value={Math.round(stats.tps || 0).toLocaleString()} 
        status={getHealthStatus(stats.tps || 0, 2500)}
      />
      <HealthMetric 
        label="Validators" 
        value={stats.validators?.toString() || '0'} 
        status="normal"
      />
      <HealthMetric 
        label="Utilization" 
        value={`${Math.round(stats.utilization || 0)}%`} 
        status={getHealthStatus(stats.utilization || 0, 85, true)}
      />
    </div>
  );
};
