
import React from 'react';
import { NetworkStats } from '../hooks/useSeiData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Zap, 
  Users, 
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface NetworkMetricsProps {
  stats: NetworkStats;
  className?: string;
}

export const NetworkMetrics: React.FC<NetworkMetricsProps> = ({ stats, className = "" }) => {
  const getHealthStatus = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value > threshold;
    return isGood ? 'good' : 'warning';
  };

  const getHealthColor = (status: 'good' | 'warning' | 'normal') => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'normal': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  const getHealthBadge = (status: 'good' | 'warning' | 'normal') => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (current < previous) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return null;
  };

  const HealthMetric: React.FC<{
    label: string;
    value: string;
    status: 'good' | 'warning' | 'normal';
    icon: React.ReactNode;
    description?: string;
    progress?: number;
    trend?: { current: number; previous: number };
  }> = ({ label, value, status, icon, description, progress, trend }) => {
    return (
      <div className="p-3 bg-background/40 border border-primary/10 rounded-lg hover:bg-background/60 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${getHealthBadge(status)}`}>
              {icon}
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          {trend && getTrendIcon(trend.current, trend.previous)}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${getHealthColor(status)}`}>{value}</span>
            <Badge variant="outline" className={getHealthBadge(status)}>
              {status}
            </Badge>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          
          {progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Performance</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`bg-gradient-to-br from-background/50 to-background/30 border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Network Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <HealthMetric 
          label="Block Time" 
          value={`${Math.round(stats.blockTime || 0)}ms`} 
          status={getHealthStatus(stats.blockTime || 0, 400, true)}
          icon={<Clock className="w-4 h-4" />}
          description="Average time between blocks"
          progress={Math.max(0, Math.min(100, 100 - ((stats.blockTime || 0) / 10)))}
        />
        
        <HealthMetric 
          label="TPS" 
          value={Math.round(stats.tps || 0).toLocaleString()} 
          status={getHealthStatus(stats.tps || 0, 2500)}
          icon={<Zap className="w-4 h-4" />}
          description="Transactions per second"
          progress={Math.min(100, ((stats.tps || 0) / 5000) * 100)}
        />
        
        <HealthMetric 
          label="Validators" 
          value={stats.validators?.toString() || '0'} 
          status="normal"
          icon={<Users className="w-4 h-4" />}
          description="Active network validators"
          progress={Math.min(100, ((stats.validators || 0) / 200) * 100)}
        />
        
        <HealthMetric 
          label="Utilization" 
          value={`${Math.round(stats.utilization || 0)}%`} 
          status={getHealthStatus(stats.utilization || 0, 85, true)}
          icon={<Activity className="w-4 h-4" />}
          description="Network capacity usage"
          progress={stats.utilization || 0}
        />

        {/* Additional Network Info */}
        <div className="pt-3 border-t border-primary/10">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-background/40">
              <span className="text-muted-foreground">Total Contracts</span>
              <span className="font-medium text-blue-400">{stats.totalContracts || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-background/40">
              <span className="text-muted-foreground">Vulnerabilities</span>
              <span className="font-medium text-orange-400">{stats.vulnerabilitiesFound || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
