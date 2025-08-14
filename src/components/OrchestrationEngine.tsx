import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Users, 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Route,
  Cpu,
  Timer,
  Gauge
} from "lucide-react";
import { authorizeAgent, listenToMCP, deployContract, configureParallelExecution } from "@/lib/seiSentinelTools";

interface Task {
  id: string;
  type: 'CONTRACT_DEPLOY' | 'EXPLOIT_ALERT' | 'PATCH_REQUEST' | 'COMPLIANCE_CHECK' | 'HUMAN_ESCALATION';
  priority: number;
  payload: any;
  deadline: number;
  status: 'pending' | 'routing' | 'executing' | 'completed' | 'failed' | 'escalated';
  assignedAgent?: string;
  startTime?: number;
  endTime?: number;
  executionTime?: number;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'busy' | 'error';
  capabilities: string[];
  currentLoad: number;
  avgResponseTime: number;
  successRate: number;
  lastActivity?: string;
}

interface OrchestrationMetrics {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  avgLatency: number;
  throughput: number;
  guardrailViolations: number;
  humanInterventions: number;
  systemLoad: number;
}

export function OrchestrationEngine() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'orchestrator-001',
      name: 'Master Orchestrator',
      type: 'orchestrator',
      status: 'busy',
      capabilities: ['task_routing', 'agent_coordination', 'human_escalation'],
      currentLoad: 35,
      avgResponseTime: 45,
      successRate: 99.8
    },
    {
      id: 'security-001',
      name: 'Security Analyst',
      type: 'security_analyst',
      status: 'busy',
      capabilities: ['static_analysis', 'dynamic_analysis', 'vulnerability_detection'],
      currentLoad: 78,
      avgResponseTime: 120,
      successRate: 96.8,
      lastActivity: 'Analyzing sei14ja2a...xqy3'
    },
    {
      id: 'threat-001',
      name: 'Threat Intelligence',
      type: 'threat_intel',
      status: 'busy',
      capabilities: ['exploit_monitoring', 'dark_web_scanning', 'hive_api'],
      currentLoad: 42,
      avgResponseTime: 67,
      successRate: 98.5,
      lastActivity: 'Checking CVE databases'
    },
    {
      id: 'remediation-001',
      name: 'AI Remediation',
      type: 'remediation',
      status: 'idle',
      capabilities: ['patch_generation', 'gas_optimization', 'formal_verification'],
      currentLoad: 12,
      avgResponseTime: 89,
      successRate: 94.2
    },
    {
      id: 'compliance-001',
      name: 'Compliance Guard',
      type: 'compliance',
      status: 'idle',
      capabilities: ['policy_enforcement', 'guardrails', 'z3_verification'],
      currentLoad: 8,
      avgResponseTime: 34,
      successRate: 99.9
    }
  ]);

  const [metrics, setMetrics] = useState<OrchestrationMetrics>({
    totalTasks: 2847,
    activeTasks: 23,
    completedTasks: 156,
    avgLatency: 287,
    throughput: 42.3,
    guardrailViolations: 3,
    humanInterventions: 12,
    systemLoad: 68
  });

  const [routingMatrix, setRoutingMatrix] = useState({
    CONTRACT_DEPLOY: 'security-001',
    EXPLOIT_ALERT: 'threat-001',
    PATCH_REQUEST: 'remediation-001',
    COMPLIANCE_CHECK: 'compliance-001',
    HUMAN_ESCALATION: 'orchestrator-001'
  });

  // Simulate real-time task processing
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new tasks
      if (Math.random() > 0.85) {
        createNewTask();
      }

      // Update task statuses
      setTasks(prev => prev.map(task => {
        if (task.status === 'executing' && Math.random() > 0.7) {
          const now = Date.now();
          return {
            ...task,
            status: Math.random() > 0.9 ? 'failed' : 'completed',
            endTime: now,
            executionTime: task.startTime ? now - task.startTime : 0
          };
        }
        return task;
      }));

      // Update agent loads
      setAgents(prev => prev.map(agent => ({
        ...agent,
        currentLoad: Math.max(0, Math.min(100, agent.currentLoad + (Math.random() - 0.5) * 15))
      })));

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        avgLatency: prev.avgLatency + (Math.random() - 0.5) * 20,
        activeTasks: Math.max(0, prev.activeTasks + Math.floor((Math.random() - 0.5) * 3)),
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + (Math.random() - 0.5) * 10))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    authorizeAgent({
      agentId: "sentinel-auditor",
      permissions: ["read_chain", "deploy_contract", "simulate_tx"]
    });

    listenToMCP("contract_deployed", (contract) => {
      // setAgents or dispatch audit task
    });
  }, []);

  const createNewTask = useCallback(() => {
    const taskTypes: Task['type'][] = [
      'CONTRACT_DEPLOY', 
      'EXPLOIT_ALERT', 
      'PATCH_REQUEST', 
      'COMPLIANCE_CHECK'
    ];
    
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const priority = taskType === 'EXPLOIT_ALERT' ? 100 : Math.floor(Math.random() * 50) + 1;
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: taskType,
      priority,
      payload: {
        contract: `sei${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        gasUsed: Math.floor(Math.random() * 1000000) + 50000
      },
      deadline: Date.now() + 350, // 350ms deadline
      status: 'pending'
    };

    setTasks(prev => [newTask, ...prev.slice(0, 49)]); // Keep last 50 tasks
    routeTask(newTask);
  }, []);

  const routeTask = useCallback((task: Task) => {
    // Find best agent based on routing matrix and availability
    const preferredAgentId = routingMatrix[task.type];
    const preferredAgent = agents.find(a => a.id === preferredAgentId);
    
    let assignedAgent = preferredAgent;
    
    // If preferred agent is overloaded, find alternative
    if (!preferredAgent || preferredAgent.currentLoad > 85) {
      const availableAgents = agents
        .filter(a => a.capabilities.some(cap => getRequiredCapabilities(task.type).includes(cap)))
        .sort((a, b) => a.currentLoad - b.currentLoad);
      
      assignedAgent = availableAgents[0];
    }

    if (assignedAgent) {
      setTasks(prev => prev.map(t => 
        t.id === task.id 
          ? { 
              ...t, 
              status: 'executing', 
              assignedAgent: assignedAgent.id,
              startTime: Date.now()
            }
          : t
      ));

      // Update agent load
      setAgents(prev => prev.map(a => 
        a.id === assignedAgent.id 
          ? { ...a, currentLoad: Math.min(100, a.currentLoad + 20) }
          : a
      ));
    }
  }, [agents, routingMatrix]);

  const getRequiredCapabilities = (taskType: Task['type']): string[] => {
    const capabilityMap = {
      CONTRACT_DEPLOY: ['static_analysis', 'vulnerability_detection'],
      EXPLOIT_ALERT: ['exploit_monitoring', 'threat_intelligence'],
      PATCH_REQUEST: ['patch_generation', 'code_generation'],
      COMPLIANCE_CHECK: ['policy_enforcement', 'formal_verification'],
      HUMAN_ESCALATION: ['human_interface', 'escalation_management']
    };
    return capabilityMap[taskType] || [];
  };

  const escalateToHuman = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId 
        ? { ...task, status: 'escalated', type: 'HUMAN_ESCALATION' }
        : task
    ));
    
    setMetrics(prev => ({ ...prev, humanInterventions: prev.humanInterventions + 1 }));
  }, []);

  const handleRemediation = async (fixData: any) => {
    await deployContract({
      optimizedBytecode: fixData.bytecode,
      gasLimit: "auto",
      signer: "sentinel_safe_wallet"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'executing': return 'secondary';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      case 'escalated': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 90) return 'destructive';
    if (priority >= 50) return 'secondary';
    return 'default';
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'orchestrator': return Brain;
      case 'security_analyst': return Shield;
      case 'threat_intel': return AlertTriangle;
      case 'remediation': return Zap;
      case 'compliance': return CheckCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Orchestration Engine</h2>
          <p className="text-muted-foreground">
            Real-time task routing and agent coordination • {metrics.avgLatency.toFixed(0)}ms avg latency
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Route className="w-4 h-4 mr-2" />
            Routing Config
          </Button>
          <Button variant="outline">
            <Timer className="w-4 h-4 mr-2" />
            Performance Tuning
          </Button>
          <Button>
            <Gauge className="w-4 h-4 mr-2" />
            System Dashboard
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.avgLatency.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.throughput.toFixed(1)}/s</div>
            <p className="text-xs text-muted-foreground">Throughput</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.guardrailViolations}</div>
            <p className="text-xs text-muted-foreground">Guardrails</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.humanInterventions}</div>
            <p className="text-xs text-muted-foreground">Human</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.systemLoad}%</div>
            <p className="text-xs text-muted-foreground">System Load</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orchestration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orchestration">Live Tasks</TabsTrigger>
          <TabsTrigger value="agents">Agent Network</TabsTrigger>
          <TabsTrigger value="routing">Routing Matrix</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="orchestration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Task Queue</CardTitle>
              <CardDescription>
                Real-time task processing with sub-400ms execution cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getPriorityColor(task.priority)}>
                          P{task.priority}
                        </Badge>
                        <h4 className="font-medium">{task.type.replace('_', ' ')}</h4>
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.assignedAgent && (
                          <Badge variant="outline" className="text-xs">
                            {agents.find(a => a.id === task.assignedAgent)?.name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Contract: {task.payload.contract} • Gas: {task.payload.gasUsed?.toLocaleString()}
                      </div>
                      {task.executionTime && (
                        <div className="text-xs text-muted-foreground">
                          Execution time: {task.executionTime}ms
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {task.status === 'executing' && (
                        <Button size="sm" variant="outline" onClick={() => escalateToHuman(task.id)}>
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Escalate
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const IconComponent = getAgentIcon(agent.type);
              return (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <Badge variant={agent.status === 'busy' ? 'secondary' : 'default'}>
                        {agent.status}
                      </Badge>
                    </div>
                    {agent.lastActivity && (
                      <p className="text-sm text-muted-foreground">{agent.lastActivity}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Load:</span>
                          <span>{agent.currentLoad}%</span>
                        </div>
                        <Progress value={agent.currentLoad} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Response:</span>
                          <div className="font-medium">{agent.avgResponseTime}ms</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success:</span>
                          <div className="font-medium">{agent.successRate}%</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium">Capabilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.slice(0, 3).map((capability, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {capability.replace('_', ' ')}
                            </Badge>
                          ))}
                          {agent.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.capabilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Routing Matrix</CardTitle>
                <CardDescription>Task type to agent assignment rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(routingMatrix).map(([taskType, agentId]) => {
                    const agent = agents.find(a => a.id === agentId);
                    return (
                      <div key={taskType} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{taskType.replace('_', ' ')}</div>
                          <div className="text-sm text-muted-foreground">
                            → {agent?.name || 'Unknown Agent'}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {agent?.currentLoad}% load
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Load Balancing</CardTitle>
                <CardDescription>Agent utilization and overflow handling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Balancing Rules:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Route to least loaded capable agent</li>
                      <li>• Overflow threshold: 85% load</li>
                      <li>• Priority tasks skip queue</li>
                      <li>• Human escalation if no agents available</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Current Load Distribution:</h4>
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{agent.name}:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={agent.currentLoad} className="w-20 h-2" />
                          <span className="w-12 text-right">{agent.currentLoad}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latency Optimization</CardTitle>
                <CardDescription>Sub-400ms execution cycle targeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Sei-Optimized Timing:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Event Detection:</span>
                        <span className="font-mono">50ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Task Routing:</span>
                        <span className="font-mono">20ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Agent Execution:</span>
                        <span className="font-mono">120ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Result Processing:</span>
                        <span className="font-mono">30ms</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total Target:</span>
                        <span className="font-mono text-primary">&lt;400ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current Performance:</span>
                      <span className="font-mono">{metrics.avgLatency.toFixed(0)}ms</span>
                    </div>
                    <Progress value={(400 - metrics.avgLatency) / 4} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: &lt;400ms • {((400 - metrics.avgLatency) / 4).toFixed(1)}% efficiency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time orchestration metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Task Success Rate:</span>
                      <div className="text-2xl font-bold">97.8%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agent Uptime:</span>
                      <div className="text-2xl font-bold">99.9%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recent Performance:</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Tasks processed (1h):</span>
                        <span className="font-mono">152</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Human escalations:</span>
                        <span className="font-mono">3</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Guardrail violations:</span>
                        <span className="font-mono">{metrics.guardrailViolations}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Cpu className="h-4 w-4" />
            <AlertDescription>
              Orchestration system operating at {((400 - metrics.avgLatency) / 4).toFixed(1)}% efficiency. 
              All agents responding within SLA. {metrics.activeTasks} tasks in active processing queue.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}