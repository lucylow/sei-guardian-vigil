import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, Shield, Search, Zap, Eye, Database, MessageSquare, Activity, AlertTriangle, Cpu, MemoryStick, MapPin, Clock } from 'lucide-react';
import { useSeiData } from '@/hooks/useSeiData';
import { formatDistanceToNow } from 'date-fns';

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'orchestrator': return <Brain className="w-4 h-4" />;
    case 'analyzer': return <Shield className="w-4 h-4" />;
    case 'scanner': return <Search className="w-4 h-4" />;
    case 'monitor': return <Eye className="w-4 h-4" />;
    case 'crawler': return <Activity className="w-4 h-4" />;
    case 'rag': return <Database className="w-4 h-4" />;
    case 'chatbot': return <MessageSquare className="w-4 h-4" />;
    case 'guardrail': return <AlertTriangle className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
};

export const AgentStatusPanel = () => {
  const { agents } = useSeiData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'active': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);

  return (
    <Card className="p-4 bg-gradient-to-br from-background/50 to-background/30 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Agent Status
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {activeAgents}/{agents.length} Active
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {totalTasks.toLocaleString()} Total Tasks
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {agents.map(agent => (
            <div key={agent.id} className="space-y-2 p-3 rounded-lg bg-background/40 border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getAgentIcon(agent.type)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground">{agent.name}</h4>
                    <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(agent.status)}`}>
                      {agent.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{agent.location}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{formatDistanceToNow(agent.lastActivity, { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'active' ? 'bg-yellow-400 animate-pulse' : 
                  agent.status === 'idle' ? 'bg-green-400' : 
                  agent.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      CPU
                    </span>
                    <span className="font-mono">{agent.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-secondary/30 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${agent.cpuUsage}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MemoryStick className="w-3 h-3" />
                      RAM
                    </span>
                    <span className="font-mono">{agent.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-secondary/30 rounded-full h-1.5">
                    <div 
                      className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${agent.memoryUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              {agent.currentTask && (
                <div className="text-xs p-2 bg-accent/20 rounded border border-accent/30">
                  <span className="text-accent-foreground font-medium">Current: </span>
                  <span className="font-mono">{agent.currentTask}</span>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Completed: {agent.tasksCompleted.toLocaleString()} tasks
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};