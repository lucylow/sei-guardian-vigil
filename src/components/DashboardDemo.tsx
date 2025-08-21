import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Activity,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { dashboardService } from '@/lib/dashboardService';

export const DashboardDemo: React.FC = () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [demoInterval, setDemoInterval] = React.useState<NodeJS.Timeout | null>(null);

  const startDemo = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    // Add activities every 5 seconds
    const interval = setInterval(async () => {
      const activities = [
        {
          type: 'audit' as const,
          title: 'Contract Audit Completed',
          description: 'SeiStake Pool audit finished with 95% security score',
          status: 'success' as const
        },
        {
          type: 'threat' as const,
          title: 'New Vulnerability Detected',
          description: 'Reentrancy vulnerability found in contract 0x1234...',
          status: 'warning' as const,
          severity: 'high' as const
        },
        {
          type: 'deployment' as const,
          title: 'Smart Contract Deployed',
          description: 'New DeFi protocol deployed to Sei Network',
          status: 'success' as const
        },
        {
          type: 'optimization' as const,
          title: 'Gas Optimization Applied',
          description: 'Contract optimized, 30% gas savings achieved',
          status: 'success' as const
        }
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      await dashboardService.addActivity(randomActivity);
      
      // Occasionally add alerts
      if (Math.random() > 0.7) {
        const alerts = [
          {
            type: 'Suspicious Transaction',
            severity: 'medium' as const,
            description: 'Large value transfer detected from unknown address',
            status: 'new' as const
          },
          {
            type: 'Network Anomaly',
            severity: 'low' as const,
            description: 'Unusual gas consumption pattern detected',
            status: 'investigating' as const
          },
          {
            type: 'Contract Interaction',
            severity: 'high' as const,
            description: 'Multiple failed contract calls from same address',
            status: 'new' as const
          }
        ];
        
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        await dashboardService.addAlert(randomAlert);
      }
    }, 5000);
    
    setDemoInterval(interval);
  };

  const stopDemo = () => {
    if (demoInterval) {
      clearInterval(demoInterval);
      setDemoInterval(null);
    }
    setIsRunning(false);
  };

  const resetDemo = async () => {
    stopDemo();
    
    // Reset to initial state
    await dashboardService.initialize();
  };

  React.useEffect(() => {
    return () => {
      if (demoInterval) {
        clearInterval(demoInterval);
      }
    };
  }, [demoInterval]);

  return (
    <Card className="bg-gradient-to-br from-background/50 to-background/30 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Dashboard Demo Controls
        </CardTitle>
        <CardDescription>
          Control real-time dashboard updates and simulate system activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={startDemo} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Demo
          </Button>
          
          <Button 
            onClick={stopDemo} 
            disabled={!isRunning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Stop Demo
          </Button>
          
          <Button 
            onClick={resetDemo} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-muted-foreground">
            Demo is {isRunning ? 'running' : 'stopped'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-background/40 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-muted-foreground">Activities</span>
            </div>
            <div className="text-lg font-bold text-blue-400">Auto-generated</div>
            <div className="text-xs text-muted-foreground">Every 5 seconds</div>
          </div>
          
          <div className="p-3 rounded-lg bg-background/40 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-muted-foreground">Alerts</span>
            </div>
            <div className="text-lg font-bold text-orange-400">Random</div>
            <div className="text-xs text-muted-foreground">30% chance</div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-primary/10">
          <h4 className="text-sm font-medium mb-3">Demo Features</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Real-time activity updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Dynamic security metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Live blockchain data integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Agent status monitoring</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
