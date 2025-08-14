import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlayCircle, PauseCircle, RotateCcw, Settings, Activity, Clock, Zap, CheckCircle2, AlertTriangle } from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "error";
  duration: number;
  startTime?: string;
  result?: any;
  gasUsed?: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "completed" | "error";
  progress: number;
  totalSteps: number;
  completedSteps: number;
  executionTime: number;
  steps: WorkflowStep[];
}

export function AgenticWorkflow() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "security-audit",
      name: "Security Audit Workflow",
      description: "Comprehensive security analysis with AI-powered remediation",
      status: "running",
      progress: 65,
      totalSteps: 8,
      completedSteps: 5,
      executionTime: 287,
      steps: [
        { id: "1", name: "Static Analysis", status: "completed", duration: 45, startTime: "14:30:01", result: "2 vulnerabilities found", gasUsed: 21000 },
        { id: "2", name: "Dynamic Simulation", status: "completed", duration: 60, startTime: "14:30:46", result: "Reentrancy test passed", gasUsed: 45000 },
        { id: "3", name: "Threat Intelligence", status: "completed", duration: 15, startTime: "14:31:46", result: "No known exploits", gasUsed: 12000 },
        { id: "4", name: "Vulnerability Aggregation", status: "completed", duration: 10, startTime: "14:32:01", result: "High-risk detected", gasUsed: 8000 },
        { id: "5", name: "AI Fix Generation", status: "completed", duration: 70, startTime: "14:32:11", result: "Fix generated", gasUsed: 25000 },
        { id: "6", name: "Formal Verification", status: "running", duration: 0, startTime: "14:33:21" },
        { id: "7", name: "Report Generation", status: "pending", duration: 0 },
        { id: "8", name: "MCP Alert", status: "pending", duration: 0 }
      ]
    },
    {
      id: "defi-arbitrage",
      name: "DeFi Arbitrage Execution",
      description: "Cross-DEX arbitrage opportunity detection and execution",
      status: "completed",
      progress: 100,
      totalSteps: 5,
      completedSteps: 5,
      executionTime: 156,
      steps: [
        { id: "1", name: "Price Discovery", status: "completed", duration: 25, startTime: "14:25:01", result: "3 opportunities found", gasUsed: 15000 },
        { id: "2", name: "Profitability Analysis", status: "completed", duration: 20, startTime: "14:25:26", result: "Est. profit: 0.5 SEI", gasUsed: 8000 },
        { id: "3", name: "MEV Protection", status: "completed", duration: 30, startTime: "14:25:46", result: "Private mempool used", gasUsed: 12000 },
        { id: "4", name: "Transaction Execution", status: "completed", duration: 45, startTime: "14:26:16", result: "Trade successful", gasUsed: 120000 },
        { id: "5", name: "Profit Calculation", status: "completed", duration: 36, startTime: "14:27:01", result: "Profit: 0.52 SEI", gasUsed: 10000 }
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("security-audit");

  useEffect(() => {
    // Simulate workflow progress
    const interval = setInterval(() => {
      setWorkflows(prev => prev.map(workflow => {
        if (workflow.status === "running") {
          const runningStep = workflow.steps.find(step => step.status === "running");
          if (runningStep) {
            runningStep.duration += 5;
            
            // Complete step after certain duration
            if (runningStep.duration >= 100) {
              runningStep.status = "completed";
              runningStep.result = "Step completed successfully";
              runningStep.gasUsed = Math.floor(Math.random() * 50000) + 10000;
              
              const nextStepIndex = workflow.steps.findIndex(step => step.status === "pending");
              if (nextStepIndex !== -1) {
                workflow.steps[nextStepIndex].status = "running";
                workflow.steps[nextStepIndex].startTime = new Date().toLocaleTimeString();
              }
              
              workflow.completedSteps += 1;
              workflow.progress = (workflow.completedSteps / workflow.totalSteps) * 100;
              
              if (workflow.completedSteps === workflow.totalSteps) {
                workflow.status = "completed";
              }
            }
          }
          
          workflow.executionTime += 5;
        }
        return workflow;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflow);

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "running": return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleStartWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: "running", progress: 0, completedSteps: 0, executionTime: 0 }
        : w
    ));
  };

  const handlePauseWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: "idle" }
        : w
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agentic Workflow Engine</h2>
          <p className="text-muted-foreground">Sub-400ms end-to-end security auditing and DeFi operations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button>
            <PlayCircle className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Workflows</h3>
          {workflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedWorkflow === workflow.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{workflow.name}</CardTitle>
                  <Badge variant={
                    workflow.status === "running" ? "default" :
                    workflow.status === "completed" ? "secondary" :
                    workflow.status === "error" ? "destructive" : "outline"
                  }>
                    {workflow.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {workflow.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span>{workflow.completedSteps}/{workflow.totalSteps} steps</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Runtime: {workflow.executionTime}ms</span>
                    <span>Target: &lt;400ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Details */}
        {currentWorkflow && (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentWorkflow.name}</CardTitle>
                    <CardDescription>{currentWorkflow.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {currentWorkflow.status === "running" ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePauseWorkflow(currentWorkflow.id)}
                      >
                        <PauseCircle className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleStartWorkflow(currentWorkflow.id)}
                      >
                        <PlayCircle className="w-4 h-4 mr-1" />
                        {currentWorkflow.status === "completed" ? "Restart" : "Start"}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Execution Time</p>
                    <p className="text-2xl font-bold">{currentWorkflow.executionTime}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">{Math.round(currentWorkflow.progress)}%</p>
                  </div>
                </div>
                <Progress value={currentWorkflow.progress} className="h-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Workflow Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{step.name}</h4>
                          <div className="flex items-center space-x-2">
                            {step.gasUsed && (
                              <Badge variant="outline" className="text-xs">
                                {step.gasUsed.toLocaleString()} gas
                              </Badge>
                            )}
                            <Badge variant={
                              step.status === "completed" ? "default" :
                              step.status === "running" ? "secondary" :
                              step.status === "error" ? "destructive" : "outline"
                            }>
                              {step.status}
                            </Badge>
                          </div>
                        </div>
                        {step.result && (
                          <p className="text-sm text-muted-foreground mt-1">{step.result}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>
                            {step.startTime && `Started: ${step.startTime}`}
                          </span>
                          <span>Duration: {step.duration}ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {currentWorkflow.status === "completed" && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Workflow completed successfully in {currentWorkflow.executionTime}ms. 
                  All steps executed within Sei's 400ms target for optimal performance.
                </AlertDescription>
              </Alert>
            )}

            {currentWorkflow.executionTime > 400 && currentWorkflow.status === "running" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Workflow is approaching the 400ms target. Consider optimizing step execution for better performance.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
}