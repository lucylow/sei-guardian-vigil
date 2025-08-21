import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Shield, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Target
} from 'lucide-react';

interface SystemStats {
  totalAgents: number;
  activeAgents: number;
  tasksCompleted: number;
  vulnerabilitiesFound: number;
  patchesDeployed: number;
  systemHealth: number;
  totalValueProtected: number;
  averageResponseTime: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate?: Date;
}

interface SystemOverviewProps {
  stats?: Partial<SystemStats>;
  className?: string;
}

const defaultStats: SystemStats = {
  totalAgents: 9,
  activeAgents: 5,
  tasksCompleted: 2341,
  vulnerabilitiesFound: 127,
  patchesDeployed: 89,
  systemHealth: 94,
  totalValueProtected: 125000000,
  averageResponseTime: 0.3,
  threatLevel: 'medium'
};

export const SystemOverview: React.FC<SystemOverviewProps> = ({ 
  stats = {}, 
  className = "" 
}) => {
  const systemStats = { ...defaultStats, ...stats };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getThreatBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    if (health >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthProgressColor = (health: number) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 70) return 'bg-yellow-500';
    if (health >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-background/50 to-background/30 border-primary/20 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            System Overview
          </h3>
          <Badge className={`px-3 py-1 ${getThreatBadgeColor(systemStats.threatLevel)}`}>
            {systemStats.threatLevel.toUpperCase()} THREAT
          </Badge>
        </div>

        {/* System Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">System Health</span>
            <span className={`text-sm font-bold ${getHealthColor(systemStats.systemHealth)}`}>
              {systemStats.systemHealth}%
            </span>
          </div>
          <Progress 
            value={systemStats.systemHealth} 
            className="h-2"
            style={{
              '--progress-background': getHealthProgressColor(systemStats.systemHealth)
            } as React.CSSProperties}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-400" />
            {systemStats.systemHealth >= 90 ? 'All systems operational' : 
             systemStats.systemHealth >= 70 ? 'Minor issues detected' :
             systemStats.systemHealth >= 50 ? 'Performance degraded' : 'Critical issues detected'}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background/40 border border-primary/10 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Protection</span>
            </div>
            <div className="text-lg font-bold text-green-400">
              ${(systemStats.totalValueProtected / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Total Value Protected</div>
          </div>

          <div className="p-3 rounded-lg bg-background/40 border border-primary/10 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground">Speed</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">
              {systemStats.averageResponseTime}s
            </div>
            <div className="text-xs text-muted-foreground">Avg Response Time</div>
          </div>

          <div className="p-3 rounded-lg bg-background/40 border border-primary/10 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Agents</span>
            </div>
            <div className="text-lg font-bold text-blue-400">
              {systemStats.activeAgents}/{systemStats.totalAgents}
            </div>
            <div className="text-xs text-muted-foreground">Active Agents</div>
          </div>

          <div className="p-3 rounded-lg bg-background/40 border border-primary/10 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Tasks</span>
            </div>
            <div className="text-lg font-bold text-purple-400">
              {systemStats.tasksCompleted.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Security Metrics</h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-background/40 hover:bg-background/60 transition-colors">
              <span className="text-muted-foreground">Vulnerabilities Found</span>
              <span className="font-bold text-orange-400">{systemStats.vulnerabilitiesFound}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-background/40 hover:bg-background/60 transition-colors">
              <span className="text-muted-foreground">Patches Deployed</span>
              <span className="font-bold text-green-400">{systemStats.patchesDeployed}</span>
            </div>
          </div>

          <div className="p-2 rounded bg-background/40 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-medium">Current Threat Level</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Network-wide security status</span>
              <span className={`text-xs font-bold ${getThreatColor(systemStats.threatLevel)}`}>
                {systemStats.threatLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live monitoring active</span>
          </div>
          <span>Updated {systemStats.lastUpdate ? systemStats.lastUpdate.toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};