import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Shield,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface HumanTask {
  id: string;
  type: 'APPROVAL_REQUEST' | 'CRITICAL_ALERT' | 'PATCH_REVIEW' | 'POLICY_VIOLATION' | 'ANOMALY_REVIEW';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  details: any;
  timestamp: number;
  deadline?: number;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated';
  assignedOperator?: string;
  agentRequestor: string;
  context: any;
}

interface Operator {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'offline';
  expertise: string[];
  activeReviews: number;
  avgResponseTime: number;
}

interface Approval {
  taskId: string;
  decision: 'approve' | 'reject' | 'modify';
  feedback: string;
  timestamp: number;
  operator: string;
}

export function HumanInterventionPanel() {
  const [humanTasks, setHumanTasks] = useState<HumanTask[]>([
    {
      id: 'human-001',
      type: 'CRITICAL_ALERT',
      priority: 'critical',
      title: 'Critical Reentrancy Vulnerability Detected',
      description: 'High-risk reentrancy vulnerability found in DeFi lending pool with $2.3M TVL',
      details: {
        contract: 'sei14ja2a...xqy3',
        vulnerability: 'SWC-107: Reentrancy',
        riskScore: 9.2,
        tvl: 2300000,
        location: 'LendingPool.sol:42-58'
      },
      timestamp: Date.now() - 120000,
      deadline: Date.now() + 300000,
      status: 'pending',
      agentRequestor: 'Security Analyst',
      context: {
        originalCode: 'function withdraw() public { ... }',
        suggestedFix: 'Added nonReentrant modifier',
        gasImpact: -24000
      }
    },
    {
      id: 'human-002',
      type: 'PATCH_REVIEW',
      priority: 'high',
      title: 'AI-Generated Patch Requires Approval',
      description: 'AI generated a security patch that needs human verification before deployment',
      details: {
        contract: 'sei9k3x...m2n4',
        patchType: 'Access Control Fix',
        confidenceScore: 0.87,
        estimatedImpact: 'Low'
      },
      timestamp: Date.now() - 300000,
      status: 'in_review',
      assignedOperator: 'Sarah Chen',
      agentRequestor: 'Remediation Agent',
      context: {
        originalIssue: 'Missing access control on admin functions',
        patchSummary: 'Added onlyOwner modifier to critical functions'
      }
    },
    {
      id: 'human-003',
      type: 'POLICY_VIOLATION',
      priority: 'medium',
      title: 'Agent Attempted Unauthorized Action',
      description: 'Threat Intelligence agent tried to access restricted API endpoint',
      details: {
        agent: 'Threat Intelligence',
        attemptedAction: 'Access dark web monitoring API',
        violatedPolicy: 'External API Access Control',
        timestamp: Date.now() - 600000
      },
      timestamp: Date.now() - 600000,
      status: 'pending',
      agentRequestor: 'Guardrail System',
      context: {
        policyRule: 'All external API access must be pre-approved',
        agentJustification: 'Checking for new exploit patterns'
      }
    }
  ]);

  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 'op-001',
      name: 'Sarah Chen',
      role: 'Senior Security Analyst',
      status: 'busy',
      expertise: ['smart_contracts', 'defi', 'formal_verification'],
      activeReviews: 2,
      avgResponseTime: 180
    },
    {
      id: 'op-002',
      name: 'Marcus Rodriguez',
      role: 'Lead Blockchain Auditor',
      status: 'available',
      expertise: ['sei_protocol', 'gas_optimization', 'consensus'],
      activeReviews: 0,
      avgResponseTime: 145
    },
    {
      id: 'op-003',
      name: 'Elena Vasquez',
      role: 'AI Safety Specialist',
      status: 'available',
      expertise: ['ai_governance', 'guardrails', 'policy_enforcement'],
      activeReviews: 1,
      avgResponseTime: 210
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<HumanTask | null>(null);
  const [feedback, setFeedback] = useState('');
  const [recentApprovals, setRecentApprovals] = useState<Approval[]>([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update task statuses
      setHumanTasks(prev => prev.map(task => {
        if (task.status === 'in_review' && Math.random() > 0.95) {
          return { ...task, status: Math.random() > 0.8 ? 'approved' : 'rejected' };
        }
        return task;
      }));

      // Update operator statuses
      setOperators(prev => prev.map(op => ({
        ...op,
        activeReviews: Math.max(0, op.activeReviews + Math.floor((Math.random() - 0.5) * 2))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTaskAction = (taskId: string, action: 'approve' | 'reject' | 'review') => {
    if (action === 'review') {
      const task = humanTasks.find(t => t.id === taskId);
      setSelectedTask(task || null);
      return;
    }

    setHumanTasks(prev => prev.map(task =>
      task.id === taskId
        ? { 
            ...task, 
            status: action === 'approve' ? 'approved' : 'rejected',
            assignedOperator: 'Current User'
          }
        : task
    ));

    // Add to recent approvals
    const approval: Approval = {
      taskId,
      decision: action,
      feedback: feedback || 'No additional feedback',
      timestamp: Date.now(),
      operator: 'Current User'
    };
    setRecentApprovals(prev => [approval, ...prev.slice(0, 9)]);
    setFeedback('');
    setSelectedTask(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'in_review': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL_ALERT': return AlertTriangle;
      case 'PATCH_REVIEW': return Shield;
      case 'APPROVAL_REQUEST': return CheckCircle;
      case 'POLICY_VIOLATION': return XCircle;
      case 'ANOMALY_REVIEW': return Eye;
      default: return MessageSquare;
    }
  };

  const formatTimeRemaining = (deadline?: number) => {
    if (!deadline) return 'No deadline';
    const remaining = deadline - Date.now();
    if (remaining <= 0) return 'Overdue';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Human Intervention Panel</h2>
          <p className="text-muted-foreground">
            Human oversight and decision making for critical AI agent actions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Escalation Rules
          </Button>
          <Button>
            <User className="w-4 h-4 mr-2" />
            Operator Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{humanTasks.filter(t => t.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{humanTasks.filter(t => t.priority === 'critical').length}</div>
            <p className="text-xs text-muted-foreground">Critical Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{operators.filter(o => o.status === 'available').length}</div>
            <p className="text-xs text-muted-foreground">Available Ops</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {Math.round(operators.reduce((sum, op) => sum + op.avgResponseTime, 0) / operators.length)}s
            </div>
            <p className="text-xs text-muted-foreground">Avg Response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="approvals">Recent Approvals</TabsTrigger>
          <TabsTrigger value="escalation">Escalation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {humanTasks.filter(task => task.status === 'pending' || task.status === 'in_review').map((task) => {
              const IconComponent = getTaskIcon(task.type);
              return (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge variant={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {task.agentRequestor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {task.deadline && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeRemaining(task.deadline)}</span>
                          </div>
                        )}
                        {task.assignedOperator && (
                          <div className="text-sm font-medium mt-1">
                            → {task.assignedOperator}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{task.description}</p>
                    
                    {task.details && (
                      <div className="bg-muted p-3 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(task.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-mono">
                                {typeof value === 'number' && key.includes('Score') 
                                  ? value.toFixed(1)
                                  : typeof value === 'number' && key === 'tvl'
                                  ? `$${(value / 1000000).toFixed(1)}M`
                                  : String(value)
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleTaskAction(task.id, 'review')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTaskAction(task.id, 'approve')}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Quick Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTaskAction(task.id, 'reject')}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Quick Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Review Modal */}
          {selectedTask && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Detailed Review: {selectedTask.title}</CardTitle>
                <CardDescription>
                  Requested by {selectedTask.agentRequestor} • Priority: {selectedTask.priority}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Context Information:</h4>
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(selectedTask.context, null, 2)}
                  </pre>
                </div>

                <div>
                  <label className="text-sm font-medium">Your Feedback:</label>
                  <Textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback for this decision..."
                    className="mt-1"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => handleTaskAction(selectedTask.id, 'approve')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleTaskAction(selectedTask.id, 'reject')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTask(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="operators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((operator) => (
              <Card key={operator.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{operator.name}</CardTitle>
                      <CardDescription>{operator.role}</CardDescription>
                    </div>
                    <Badge variant={operator.status === 'available' ? 'default' : 'secondary'}>
                      {operator.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Active Reviews:</span>
                        <div className="font-medium">{operator.activeReviews}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Response:</span>
                        <div className="font-medium">{operator.avgResponseTime}s</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium mb-1">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {operator.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Approval History</CardTitle>
              <CardDescription>Last 10 human intervention decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentApprovals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No recent approvals</p>
                ) : (
                  recentApprovals.map((approval, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={approval.decision === 'approve' ? 'default' : 'destructive'}>
                            {approval.decision}
                          </Badge>
                          <span className="font-medium">Task {approval.taskId.slice(-3)}</span>
                          <span className="text-sm text-muted-foreground">by {approval.operator}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {approval.feedback}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(approval.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Escalation Triggers</CardTitle>
                <CardDescription>Conditions that require human intervention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Critical Vulnerabilities</div>
                    <div className="text-sm text-muted-foreground">Risk score ≥ 8.5 or TVL &gt; $1M</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">AI Confidence</div>
                    <div className="text-sm text-muted-foreground">Patch confidence &lt; 85%</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Policy Violations</div>
                    <div className="text-sm text-muted-foreground">Guardrail rule violations</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Anomaly Detection</div>
                    <div className="text-sm text-muted-foreground">Unusual agent behavior</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response SLAs</CardTitle>
                <CardDescription>Expected response times by priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Critical</span>
                    <Badge variant="destructive">5 minutes</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">High</span>
                    <Badge variant="secondary">30 minutes</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Medium</span>
                    <Badge variant="default">2 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Low</span>
                    <Badge variant="outline">24 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {humanTasks.filter(t => t.priority === 'critical' && t.status === 'pending').length} critical tasks 
              require immediate attention. Average operator response time is currently under SLA targets.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}