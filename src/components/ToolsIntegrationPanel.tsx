import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Zap, 
  Brain, 
  Settings, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Code,
  Search,
  BarChart3
} from 'lucide-react';
import { seiTools, SeiToolResult } from '@/lib/seiSentinelTools';
import { useToast } from '@/hooks/use-toast';

export const ToolsIntegrationPanel = () => {
  const [activeExecution, setActiveExecution] = useState<string | null>(null);
  const [executionResults, setExecutionResults] = useState<{ [key: string]: SeiToolResult }>({});
  const [toolStats, setToolStats] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    setToolStats(seiTools.getToolExecutionStats());
  }, []);

  const executeTool = async (toolName: string, params: any = {}) => {
    setActiveExecution(toolName);
    
    try {
      let result: SeiToolResult;
      
      switch (toolName) {
        case 'threat_detection':
          result = await seiTools.hiveThreatDetection(params.bytecode || '0x608060405234801561001057600080fd5b50...');
          break;
        case 'static_analysis':
          result = await seiTools.slitherStaticAnalysis(params.code || 'pragma solidity ^0.8.0; contract Sample {}');
          break;
        case 'formal_verification':
          result = await seiTools.formalVerification({}, ['balance >= 0', 'totalSupply > 0']);
          break;
        case 'security_fix':
          result = await seiTools.generateSecurityFix(
            { type: 'reentrancy', severity: 'high' },
            { contractCode: 'function withdraw() external {}' }
          );
          break;
        case 'network_metrics':
          result = await seiTools.getSeiNetworkMetrics();
          break;
        case 'contract_monitor':
          result = await seiTools.monitorContractAnomaly('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
          break;
        case 'batch_analysis':
          result = await seiTools.batchHistoricalAnalysis('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 30);
          break;
        default:
          throw new Error('Unknown tool');
      }

      setExecutionResults(prev => ({ ...prev, [toolName]: result }));
      
      if (result.success) {
        toast({
          title: "Tool Execution Successful",
          description: `${toolName} completed in ${result.executionTime}ms`,
        });
      } else {
        toast({
          title: "Tool Execution Failed",
          description: result.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setActiveExecution(null);
    }
  };

  const SecurityTools = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Hive Intelligence Threat Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Cross-chain threat detection against 5,000+ exploit patterns
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Risk Level: Low
            </Badge>
            <Button 
              size="sm" 
              onClick={() => executeTool('threat_detection')}
              disabled={activeExecution === 'threat_detection'}
            >
              {activeExecution === 'threat_detection' ? (
                <Clock className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Play className="w-3 h-3 mr-1" />
              )}
              Scan Contract
            </Button>
          </div>
          {executionResults.threat_detection && (
            <div className="text-xs p-2 bg-background/50 rounded border">
              <div className="flex items-center gap-2 mb-1">
                {executionResults.threat_detection.success ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                )}
                <span className="font-medium">
                  {executionResults.threat_detection.success ? 'Scan Complete' : 'Scan Failed'}
                </span>
              </div>
              {executionResults.threat_detection.success && executionResults.threat_detection.data && (
                <div className="space-y-1">
                  <div>Threat Score: {executionResults.threat_detection.data.threatScore}/100</div>
                  <div>Vulnerabilities: {executionResults.threat_detection.data.vulnerabilities.length}</div>
                  <div>Execution: {executionResults.threat_detection.executionTime}ms</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            Slither Static Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Static analysis with Sei-specific security rules
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Risk Level: Medium
            </Badge>
            <Button 
              size="sm" 
              onClick={() => executeTool('static_analysis')}
              disabled={activeExecution === 'static_analysis'}
            >
              {activeExecution === 'static_analysis' ? (
                <Clock className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Code className="w-3 h-3 mr-1" />
              )}
              Analyze Code
            </Button>
          </div>
          {executionResults.static_analysis && (
            <div className="text-xs p-2 bg-background/50 rounded border">
              <div className="flex items-center gap-2 mb-1">
                {executionResults.static_analysis.success ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                )}
                <span className="font-medium">Analysis Complete</span>
              </div>
              {executionResults.static_analysis.success && executionResults.static_analysis.data && (
                <div className="space-y-1">
                  <div>Issues Found: {executionResults.static_analysis.data.issuesFound}</div>
                  <div>Status: {executionResults.static_analysis.data.status}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const AITools = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            AI Security Fix Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            GPT-4 powered code fixes with Sei optimizations
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="destructive" className="text-xs">
              Risk Level: High
            </Badge>
            <Button 
              size="sm" 
              onClick={() => executeTool('security_fix')}
              disabled={activeExecution === 'security_fix'}
            >
              {activeExecution === 'security_fix' ? (
                <Clock className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Brain className="w-3 h-3 mr-1" />
              )}
              Generate Fix
            </Button>
          </div>
          {executionResults.security_fix && (
            <div className="text-xs p-2 bg-background/50 rounded border">
              <div className="flex items-center gap-2 mb-1">
                {executionResults.security_fix.success ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                )}
                <span className="font-medium">Fix Generated</span>
              </div>
              {executionResults.security_fix.success && executionResults.security_fix.data && (
                <div className="space-y-1">
                  <div>Gas Savings: {executionResults.security_fix.data.gasSavings}</div>
                  <div>Confidence: {(executionResults.security_fix.data.confidence * 100).toFixed(0)}%</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-400" />
            Z3 Formal Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Mathematical proof generation for contract invariants
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="destructive" className="text-xs">
              Risk Level: High
            </Badge>
            <Button 
              size="sm" 
              onClick={() => executeTool('formal_verification')}
              disabled={activeExecution === 'formal_verification'}
            >
              {activeExecution === 'formal_verification' ? (
                <Clock className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Settings className="w-3 h-3 mr-1" />
              )}
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MonitoringTools = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Sei Network Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            size="sm" 
            onClick={() => executeTool('network_metrics')}
            disabled={activeExecution === 'network_metrics'}
            className="w-full"
          >
            {activeExecution === 'network_metrics' ? (
              <Clock className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <BarChart3 className="w-3 h-3 mr-1" />
            )}
            Fetch Metrics
          </Button>
          {executionResults.network_metrics && executionResults.network_metrics.success && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-background/50 rounded">
                <div className="text-muted-foreground">Block Time</div>
                <div className="font-bold">{executionResults.network_metrics.data.blockTime.toFixed(2)}s</div>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <div className="text-muted-foreground">TPS</div>
                <div className="font-bold">{executionResults.network_metrics.data.tps.toLocaleString()}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Contract Anomaly Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            size="sm" 
            onClick={() => executeTool('contract_monitor')}
            disabled={activeExecution === 'contract_monitor'}
            className="w-full"
          >
            {activeExecution === 'contract_monitor' ? (
              <Clock className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Activity className="w-3 h-3 mr-1" />
            )}
            Monitor Contract
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const ToolStats = () => (
    <div className="space-y-4">
      {Object.entries(toolStats).map(([tool, stats]: [string, any]) => (
        <Card key={tool}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{tool.replace(/_/g, ' ')}</span>
              <Badge variant="outline" className="text-xs">
                {(stats.successRate * 100).toFixed(0)}% success
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Executions</div>
                <div className="font-bold">{stats.executions}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg Time</div>
                <div className="font-bold">{stats.avgTime}s</div>
              </div>
              <div>
                <div className="text-muted-foreground">Success Rate</div>
                <Progress value={stats.successRate * 100} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          SEI Sentinel Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
            <TabsTrigger value="monitoring">Monitor</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="mt-4">
            <SecurityTools />
          </TabsContent>
          
          <TabsContent value="ai" className="mt-4">
            <AITools />
          </TabsContent>
          
          <TabsContent value="monitoring" className="mt-4">
            <MonitoringTools />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <ToolStats />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};