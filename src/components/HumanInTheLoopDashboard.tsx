import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, AlertTriangle, CheckCircle, Clock, MessageSquare, Shield, Brain, Eye } from "lucide-react";

interface HITLRequest {
  id: string;
  type: 'approval' | 'review' | 'escalation' | 'override';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  title: string;
  description: string;
  requestingAgent: string;
  timestamp: string;
  deadline?: string;
  context: any;
  expertRequired?: string;
}

interface ExpertAction {
  id: string;
  requestId: string;
  expert: string;
  action: 'approve' | 'reject' | 'modify' | 'escalate';
  feedback: string;
  timestamp: string;
  confidence: number;
}

interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
}

export function HumanInTheLoopDashboard() {
  const [hitlRequests, setHitlRequests] = useState<HITLRequest[]>([
    {
      id: 'hitl-001',
      type: 'approval',
      priority: 'critical',
      status: 'pending',
      title: 'Critical Vulnerability Fix Approval',
      description: 'AI-generated patch for reentrancy vulnerability in sei14ja2a...xqy3 requires human review before deployment',
      requestingAgent: 'ai_fix_generator',
      timestamp: '2024-01-15 14:35:22',
      deadline: '2024-01-15 15:00:00',
      context: {
        contractAddress: 'sei14ja2a...xqy3',
        vulnerability: 'reentrancy',
        severity: 'critical',
        confidence: 0.94,
        estimatedImpact: '$2.3M TVL at risk',
        patchCode: 'function withdraw() nonReentrant public { ... }',
        gasOptimization: '21.5K gas saved'
      },
      expertRequired: 'smart_contract_security'
    },
    {
      id: 'hitl-002',
      type: 'review',
      priority: 'high',
      status: 'in_review',
      title: 'Anomalous Transaction Pattern',
      description: 'Monitoring agent detected unusual activity requiring expert analysis',
      requestingAgent: 'monitoring_agent',
      timestamp: '2024-01-15 14:28:15',
      context: {
        contractAddress: 'sei1k82a...9djs',
        pattern: 'rapid_withdraw_pattern',
        frequency: '15 transactions in 2 minutes',
        totalValue: '450 SEI',
        suspicionScore: 0.87
      }
    },
    {
      id: 'hitl-003',
      type: 'escalation',
      priority: 'medium',
      status: 'pending',
      title: 'Policy Violation Override Request',
      description: 'Guardrail agent blocked deployment due to gas limit policy, requesting override',
      requestingAgent: 'guardrail_agent',
      timestamp: '2024-01-15 14:15:33',
      context: {
        violatedPolicy: 'max_gas_limit',
        requestedGas: '12000000',
        policyLimit: '10000000',
        justification: 'Complex DeFi protocol requires additional gas for safety checks'
      }
    }
  ]);

  const [expertActions, setExpertActions] = useState<ExpertAction[]>([
    {
      id: 'action-001',
      requestId: 'hitl-002',
      expert: 'security_expert_alice',
      action: 'approve',
      feedback: 'Pattern analysis confirms legitimate arbitrage bot activity. Recommend monitoring for 24h.',
      timestamp: '2024-01-15 14:42:18',
      confidence: 0.91
    }
  ]);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: 'alert-001',
      level: 'critical',
      title: 'Agent Coordination Failure',
      description: 'Security Analyst Agent failed to respond within SLA timeframe',
      source: 'orchestrator_agent',
      timestamp: '2024-01-15 14:38:45',
      acknowledged: false
    },
    {
      id: 'alert-002',
      level: 'warning',
      title: 'High Memory Usage',
      description: 'Mem0 memory system approaching 80% capacity',
      source: 'memory_system',
      timestamp: '2024-01-15 14:35:12',
      acknowledged: true
    }
  ]);

  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject' | 'modify', expertFeedback: string) => {
    const newAction: ExpertAction = {
      id: `action-${Date.now()}`,
      requestId,
      expert: 'current_user',
      action,
      feedback: expertFeedback,
      timestamp: new Date().toLocaleString(),
      confidence: 0.95
    };

    setExpertActions(prev => [newAction, ...prev]);
    
    setHitlRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'in_review' }
        : request
    ));

    setFeedback(prev => ({ ...prev, [requestId]: '' }));
  };

  const acknowledgeAlert = (alertId: string) => {
    setSystemAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_review': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const pendingRequests = hitlRequests.filter(r => r.status === 'pending').length;
  const criticalRequests = hitlRequests.filter(r => r.priority === 'critical').length;
  const unacknowledgedAlerts = systemAlerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Human-in-the-Loop Dashboard</h2>
          <p className="text-muted-foreground">Expert oversight and intervention for AI agent decisions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <User className="w-4 h-4 mr-2" />
            Expert Panel
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Emergency Override
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{criticalRequests}</div>
            <p className="text-xs text-muted-foreground">Critical Issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{unacknowledgedAlerts}</div>
            <p className="text-xs text-muted-foreground">Unack. Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">97.8%</div>
            <p className="text-xs text-muted-foreground">Expert Accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Banner */}
      {unacknowledgedAlerts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {unacknowledgedAlerts} system alert(s) require your attention. Review the Alerts tab for details.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Review Requests</TabsTrigger>
          <TabsTrigger value="actions">Expert Actions</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="space-y-4">
            {hitlRequests.map((request) => (
              <Card key={request.id} className={`border-l-4 ${
                request.priority === 'critical' ? 'border-l-red-500' :
                request.priority === 'high' ? 'border-l-orange-500' :
                request.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription>{request.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {request.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>From: {request.requestingAgent}</span>
                    <span>{request.timestamp}</span>
                  </div>
                  
                  {request.deadline && (
                    <div className="text-sm text-red-600">
                      ⏰ Deadline: {request.deadline}
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Context Information */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Context Details:</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre className="whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(request.context, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Expert Required */}
                    {request.expertRequired && (
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Requires: {request.expertRequired} expert</span>
                      </div>
                    )}

                    {/* Action Panel */}
                    {request.status === 'pending' && (
                      <div className="space-y-3 border-t pt-4">
                        <Textarea
                          placeholder="Enter your expert feedback and reasoning..."
                          value={feedback[request.id] || ''}
                          onChange={(e) => setFeedback(prev => ({ ...prev, [request.id]: e.target.value }))}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleRequestAction(request.id, 'approve', feedback[request.id] || '')}
                            disabled={!feedback[request.id]?.trim()}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleRequestAction(request.id, 'reject', feedback[request.id] || '')}
                            disabled={!feedback[request.id]?.trim()}
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            variant="secondary"
                            onClick={() => handleRequestAction(request.id, 'modify', feedback[request.id] || '')}
                            disabled={!feedback[request.id]?.trim()}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Changes
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Completed Actions */}
                    {request.status !== 'pending' && (
                      <div className="border-t pt-4">
                        <Badge variant="outline" className="mb-2">
                          Status: {request.status}
                        </Badge>
                        {expertActions.find(a => a.requestId === request.id) && (
                          <div className="text-sm text-muted-foreground">
                            Action taken by: {expertActions.find(a => a.requestId === request.id)?.expert}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expert Action History</CardTitle>
              <CardDescription>Recent decisions and feedback from human experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expertActions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(action.action)}
                        <h4 className="font-medium">Request #{action.requestId}</h4>
                        <Badge variant={action.action === 'approve' ? 'default' : 'secondary'}>
                          {action.action}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {action.expert} • {action.timestamp}
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded text-sm mb-2">
                      {action.feedback}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Confidence: {(action.confidence * 100).toFixed(1)}%</span>
                      <span>Expert accuracy score: High</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Alerts and notifications from the agent network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    alert.acknowledged ? 'bg-muted/50' : 'bg-background'
                  }`}>
                    {getAlertIcon(alert.level)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            alert.level === 'critical' || alert.level === 'error' ? 'destructive' :
                            alert.level === 'warning' ? 'secondary' : 'default'
                          }>
                            {alert.level}
                          </Badge>
                          {!alert.acknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <span>Source: {alert.source}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expert Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Decision Accuracy</span>
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="text-sm font-medium">8.5 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approval Rate</span>
                    <span className="text-sm font-medium">74.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Escalation Rate</span>
                    <span className="text-sm font-medium">2.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">False Positive Rate</span>
                    <span className="text-sm font-medium">1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Issues/Day</span>
                    <span className="text-sm font-medium">3.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}