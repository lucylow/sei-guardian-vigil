import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Users, Zap, Shield, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";
import { routeTask, handleRoutingFailure, scoreAgent } from "@/lib/routingEngine";
import { RAGAgentRole } from "@/lib/ragKnowledgeGraph";

interface Agent {
  id: string;
  name: string;
  type: 'orchestrator' | 'security' | 'threat_intel' | 'remediation' | 'monitoring' | 'rag' | 'chatbot' | 'crawler' | 'guardrail';
  status: 'idle' | 'active' | 'busy' | 'error';
  capabilities: string[];
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    avgResponseTime: number;
    successRate: number;
  };
  load: number;
}

interface Task {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed' | 'escalated';
  assignedAgent?: string;
  startTime?: string;
  endTime?: string;
  metadata: any;
  humanApprovalRequired?: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent?: string;
  duration?: number;
  result?: any;
}

export function MultiAgentOrchestrator() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'orchestrator-001',
      name: 'Orchestrator Agent',
      type: 'orchestrator',
      status: 'active',
      capabilities: ['task_decomposition', 'agent_coordination', 'human_escalation', 'routing_optimization'],
      performance: { tasksCompleted: 1247, avgResponseTime: 156, successRate: 99.2 },
      load: 25
    },
    {
      id: 'security-001',
      name: 'Security Analyst Agent',
      type: 'security',
      status: 'busy',
      capabilities: ['static_analysis', 'dynamic_analysis', 'vulnerability_detection', 'sei_parallel_checks'],
      currentTask: 'Analyzing contract sei14ja2a...xqy3',
      performance: { tasksCompleted: 892, avgResponseTime: 2840, successRate: 96.8 },
      load: 78
    },
    {
      id: 'threat-001',
      name: 'Threat Intelligence Agent',
      type: 'threat_intel',
      status: 'active',
      capabilities: ['exploit_monitoring', 'dark_web_scanning', 'vulnerability_matching', 'hive_api'],
      performance: { tasksCompleted: 2156, avgResponseTime: 890, successRate: 98.5 },
      load: 42
    },
    {
      id: 'remediation-001',
      name: 'AI Fix Generator',
      type: 'remediation',
      status: 'idle',
      capabilities: ['code_generation', 'patch_optimization', 'formal_verification', 'gas_optimization'],
      performance: { tasksCompleted: 567, avgResponseTime: 4230, successRate: 94.2 },
      load: 12
    },
    {
      id: 'monitoring-001',
      name: 'Monitoring Agent',
      type: 'monitoring',
      status: 'active',
      capabilities: ['contract_deployment', 'anomaly_detection', 'real_time_alerting', 'sei_mcp'],
      currentTask: 'Monitoring 47 contracts',
      performance: { tasksCompleted: 3421, avgResponseTime: 234, successRate: 99.7 },
      load: 35
    },
    {
      id: 'rag-001',
      name: 'RAG Knowledge Agent',
      type: 'rag',
      status: 'active',
      capabilities: ['knowledge_retrieval', 'context_embedding', 'vector_search', 'information_synthesis'],
      performance: { tasksCompleted: 1876, avgResponseTime: 445, successRate: 97.8 },
      load: 28
    },
    {
      id: 'chatbot-001',
      name: 'Sentinel Chatbot',
      type: 'chatbot',
      status: 'active',
      capabilities: ['natural_language', 'user_interface', 'query_processing', 'report_generation'],
      currentTask: 'Handling 3 user conversations',
      performance: { tasksCompleted: 5634, avgResponseTime: 890, successRate: 98.9 },
      load: 18
    },
    {
      id: 'crawler-001',
      name: 'Web Crawler Agent',
      type: 'crawler',
      status: 'busy',
      capabilities: ['web_scraping', 'vulnerability_feeds', 'news_monitoring', 'data_extraction'],
      currentTask: 'Crawling CVE databases',
      performance: { tasksCompleted: 987, avgResponseTime: 1250, successRate: 95.4 },
      load: 67
    },
    {
      id: 'guardrail-001',
      name: 'Guardrail Agent',
      type: 'guardrail',
      status: 'active',
      capabilities: ['policy_enforcement', 'risk_assessment', 'safety_checks', 'compliance_monitoring'],
      performance: { tasksCompleted: 2890, avgResponseTime: 123, successRate: 99.9 },
      load: 15
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-001',
      type: 'contract_audit',
      priority: 'critical',
      status: 'running',
      assignedAgent: 'security-001',
      startTime: '14:32:15',
      metadata: { contractAddress: 'sei14ja2a...xqy3', deployer: 'sei1k82a...9djs' }
    },
    {
      id: 'task-002',
      type: 'threat_analysis',
      priority: 'high',
      status: 'completed',
      assignedAgent: 'threat-001',
      startTime: '14:28:42',
      endTime: '14:31:18',
      metadata: { exploitsFound: 2, riskScore: 87 }
    },
    {
      id: 'task-003',
      type: 'vulnerability_patch',
      priority: 'critical',
      status: 'escalated',
      assignedAgent: 'remediation-001',
      humanApprovalRequired: true,
      metadata: { vulnerability: 'reentrancy', severity: 'critical' }
    }
  ]);

  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStep[]>([
    { id: '1', name: 'Contract Discovery', status: 'completed', agent: 'monitoring-001', duration: 234, result: 'New contract detected' },
    { id: '2', name: 'Static Analysis', status: 'completed', agent: 'security-001', duration: 2840, result: '3 vulnerabilities found' },
    { id: '3', name: 'Threat Intelligence', status: 'completed', agent: 'threat-001', duration: 890, result: '2 known exploits matched' },
    { id: '4', name: 'Dynamic Analysis', status: 'running', agent: 'security-001', duration: 1200 },
    { id: '5', name: 'Remediation Generation', status: 'pending' },
    { id: '6', name: 'Formal Verification', status: 'pending' },
    { id: '7', name: 'Human Review', status: 'pending' }
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    totalTasks: 1247,
    activeTasks: 23,
    completedToday: 156,
    averageLatency: 387,
    humanInterventions: 12,
    policyViolations: 3
  });

  const [routingLog, setRoutingLog] = useState<{taskId: string, agentName: string, score: number}[]>([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update agent loads
      setAgents(prev => prev.map(agent => ({
        ...agent,
        load: Math.max(0, Math.min(100, agent.load + (Math.random() - 0.5) * 10))
      })));

      // Update workflow progress
      setCurrentWorkflow(prev => prev.map(step => {
        if (step.status === 'running' && step.duration !== undefined) {
          step.duration += 100;
          if (step.duration > 3000) {
            step.status = 'completed';
            step.result = 'Step completed successfully';
          }
        }
        return step;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Routing optimization: assign tasks to agents
  useEffect(() => {
    // For demo: assign each task using routing engine
    const newRoutingLog: {taskId: string, agentName: string, score: number}[] = [];
    setTasks(prevTasks => prevTasks.map(task => {
      const assignedAgent = routeTask(task, agents);
      if (assignedAgent) {
        newRoutingLog.push({
          taskId: task.id,
          agentName: assignedAgent.name,
          score: scoreAgent(task, assignedAgent)
        });
        return { ...task, assignedAgent: assignedAgent.id };
      }
      return task;
    }));
    setRoutingLog(newRoutingLog);
  }, [agents]);

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'orchestrator': return Brain;
      case 'security': return Shield;
      case 'threat_intel': return AlertTriangle;
      case 'remediation': return Zap;
      case 'monitoring': return Activity;
      case 'rag': return Brain;
      case 'chatbot': return Users;
      case 'crawler': return Activity;
      case 'guardrail': return CheckCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'busy': return 'secondary';
      case 'idle': return 'outline';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getWorkflowIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Add RAG agents to agent list
  const ragAgents = [
    { id: "rag-router", name: "Query Router Agent", type: RAGAgentRole.QueryRouter, status: "active", capabilities: ["intent_classification", "sei_parallel_routing"], performance: { tasksCompleted: 120, avgResponseTime: 120, successRate: 99.1 }, load: 10 },
    { id: "rag-navigator", name: "Knowledge Navigator Agent", type: RAGAgentRole.KnowledgeNavigator, status: "active", capabilities: ["graph_traversal", "path_optimization"], performance: { tasksCompleted: 98, avgResponseTime: 110, successRate: 98.7 }, load: 12 },
    { id: "rag-context", name: "Context Enrichment Agent", type: RAGAgentRole.ContextEnrichment, status: "active", capabilities: ["semantic_search", "cross_chain_context"], performance: { tasksCompleted: 105, avgResponseTime: 130, successRate: 98.9 }, load: 8 },
    { id: "rag-generator", name: "Response Generator Agent", type: RAGAgentRole.ResponseGenerator, status: "active", capabilities: ["answer_synthesis", "vulnerability_templating"], performance: { tasksCompleted: 112, avgResponseTime: 140, successRate: 99.0 }, load: 9 },
    { id: "rag-fact", name: "Fact-Checker Agent", type: RAGAgentRole.FactChecker, status: "active", capabilities: ["accuracy_validation", "formal_verification"], performance: { tasksCompleted: 97, avgResponseTime: 150, successRate: 99.2 }, load: 7 },
    { id: "rag-curator", name: "Knowledge Curator Agent", type: RAGAgentRole.KnowledgeCurator, status: "active", capabilities: ["graph_maintenance", "automated_pruning"], performance: { tasksCompleted: 88, avgResponseTime: 160, successRate: 98.8 }, load: 6 },
  ];
  // Merge ragAgents into agents for display
  const allAgents = [...agents, ...ragAgents];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Multi-Agent Orchestrator</h2>
          <p className="text-muted-foreground">Coordinating {agents.length} specialized AI agents with human oversight</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Deploy New Agent
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Emergency Override
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{systemMetrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{systemMetrics.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Active Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{systemMetrics.completedToday}</div>
            <p className="text-xs text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{systemMetrics.averageLatency}ms</div>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{systemMetrics.humanInterventions}</div>
            <p className="text-xs text-muted-foreground">Human Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{systemMetrics.policyViolations}</div>
            <p className="text-xs text-muted-foreground">Policy Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agent Network</TabsTrigger>
          <TabsTrigger value="tasks">Task Queue</TabsTrigger>
          <TabsTrigger value="workflow">Live Workflow</TabsTrigger>
          <TabsTrigger value="routing">Routing Engine</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAgents.map((agent) => {
              const IconComponent = getAgentIcon(agent.type);
              return (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <Badge variant={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                    {agent.currentTask && (
                      <p className="text-sm text-muted-foreground">{agent.currentTask}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Load:</span>
                          <span>{agent.load}%</span>
                        </div>
                        <Progress value={agent.load} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tasks:</span>
                          <div className="font-medium">{agent.performance.tasksCompleted}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success:</span>
                          <div className="font-medium">{agent.performance.successRate}%</div>
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

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Queue</CardTitle>
              <CardDescription>Current tasks being processed by the agent network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <h4 className="font-medium">{task.type.replace('_', ' ')}</h4>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                      {task.assignedAgent && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Assigned to: {agents.find(a => a.id === task.assignedAgent)?.name}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        Started: {task.startTime} {task.endTime && `• Completed: ${task.endTime}`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {task.humanApprovalRequired && (
                        <Button size="sm" variant="outline">
                          Review Required
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Workflow: Contract Audit sei14ja2a...xqy3</CardTitle>
              <CardDescription>Sub-400ms multi-agent security analysis in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentWorkflow.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getWorkflowIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{step.name}</h4>
                        <div className="flex items-center space-x-2">
                          {step.agent && (
                            <Badge variant="outline" className="text-xs">
                              {agents.find(a => a.id === step.agent)?.name}
                            </Badge>
                          )}
                          {step.duration && (
                            <span className="text-xs text-muted-foreground">
                              {step.duration}ms
                            </span>
                          )}
                        </div>
                      </div>
                      {step.result && (
                        <p className="text-sm text-muted-foreground">{step.result}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Execution Time:</span>
                  <span className="text-lg font-bold">387ms</span>
                </div>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Target: &lt;400ms • Progress: 75%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Routing Algorithm</CardTitle>
                <CardDescription>Intelligent task assignment based on agent capabilities and load</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Routing Factors:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Agent capabilities match</li>
                      <li>• Current load balancing</li>
                      <li>• Historical performance</li>
                      <li>• Task priority level</li>
                      <li>• Geographic proximity</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Current Routing Rules:</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Critical Security → Security Agent</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Load &gt; 80% → Distribute</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Human Review → Escalate</span>
                        <Badge variant="secondary" className="text-xs">Triggered</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Agent network performance and optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Routing Accuracy:</span>
                      <div className="text-2xl font-bold">97.8%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Load Balance:</span>
                      <div className="text-2xl font-bold">Optimal</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Agent Utilization:</h4>
                    {agents.slice(0, 5).map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{agent.name}:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={agent.load} className="w-16 h-1" />
                          <span>{agent.load}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Multi-agent system operating at optimal efficiency. All agents responding within SLA targets.
              Human intervention required for 1 critical task pending review.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Routing Optimization Log */}
      <Card>
        <CardHeader>
          <CardTitle>Routing Optimization Log</CardTitle>
          <CardDescription>
            Real-time task assignment using Sei-optimized routing engine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            {routingLog.length === 0 ? (
              <span className="text-muted-foreground">No routing decisions yet.</span>
            ) : (
              routingLog.map(log => (
                <div key={log.taskId} className="flex justify-between">
                  <span>Task <span className="font-mono">{log.taskId}</span> → <span className="font-semibold">{log.agentName}</span></span>
                  <span>Score: {log.score.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}