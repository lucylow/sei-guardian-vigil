import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileSearch, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface AuditTask {
  id: string;
  contractAddress: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  value: number;
  projectName?: string;
  estimatedTime?: number;
  assignedAgent?: string;
  vulnerabilitiesFound?: number;
}

const mockTasks: AuditTask[] = [
  {
    id: 'task-001',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    status: 'in-progress',
    priority: 'critical',
    timestamp: new Date(Date.now() - 300000),
    value: 2500000,
    projectName: 'Sei Vault Protocol',
    estimatedTime: 45,
    assignedAgent: 'Security Analyst',
    vulnerabilitiesFound: 2
  },
  {
    id: 'task-002',
    contractAddress: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    status: 'pending',
    priority: 'high',
    timestamp: new Date(Date.now() - 120000),
    value: 1250000,
    projectName: 'Sei DEX Router',
    estimatedTime: 30
  },
  {
    id: 'task-003',
    contractAddress: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
    status: 'completed',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1800000),
    value: 750000,
    projectName: 'Sei NFT Marketplace',
    vulnerabilitiesFound: 0
  },
  {
    id: 'task-004',
    contractAddress: '0x28c6c06298d514Db089934071355E5743bf21d60',
    status: 'pending',
    priority: 'high',
    timestamp: new Date(Date.now() - 60000),
    value: 3200000,
    projectName: 'Sei Lending Protocol',
    estimatedTime: 60
  },
  {
    id: 'task-005',
    contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    status: 'failed',
    priority: 'medium',
    timestamp: new Date(Date.now() - 900000),
    value: 500000,
    projectName: 'Sei Staking Pool'
  }
];

export const AuditQueuePanel = () => {
  const [selectedTask, setSelectedTask] = useState<AuditTask | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalValue = mockTasks.reduce((sum, task) => sum + task.value, 0);
  const pendingTasks = mockTasks.filter(task => task.status === 'pending').length;
  const activeTasks = mockTasks.filter(task => task.status === 'in-progress').length;

  return (
    <Card className="p-4 bg-gradient-to-br from-background/50 to-background/30 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            Audit Queue
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {pendingTasks} Pending
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {activeTasks} Active
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-background/40 border border-primary/10">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{mockTasks.length}</div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">${(totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground">Value at Risk</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {Math.round(mockTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0) / mockTasks.length)}min
            </div>
            <div className="text-xs text-muted-foreground">Avg. Time</div>
          </div>
        </div>

        {/* Task List */}
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {mockTasks.map(task => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedTask?.id === task.id
                    ? 'bg-primary/20 border-primary/40'
                    : 'bg-background/40 border-primary/10 hover:border-primary/20 hover:bg-background/60'
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className="text-sm font-medium">{task.projectName || 'Unknown Project'}</span>
                  </div>
                  <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-mono text-muted-foreground">
                    {task.contractAddress}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${(task.value / 1000000).toFixed(1)}M
                      </span>
                      {task.estimatedTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedTime}min
                        </span>
                      )}
                      {task.vulnerabilitiesFound !== undefined && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {task.vulnerabilitiesFound} vulns
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      {task.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {task.assignedAgent && (
                    <div className="text-xs text-primary">
                      Assigned to: {task.assignedAgent}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Selected Task Actions */}
        {selectedTask && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
            <h4 className="text-sm font-medium text-primary">Quick Actions</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <ArrowRight className="w-3 h-3 mr-1" />
                View Report
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Prioritize
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};