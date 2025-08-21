import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Zap, 
  Shield, 
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Users,
  Cpu
} from 'lucide-react';

interface AgentActivity {
  id: string;
  type: 'scan' | 'alert' | 'action' | 'deployment';
  description: string;
  timestamp: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: any;
}

interface LiveTransaction {
  hash: string;
  type: 'agent-deploy' | 'security-scan' | 'vulnerability-alert' | 'emergency-response';
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber: number;
  timestamp: Date;
}

export const InteractiveDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>([]);
  const [selectedDemo, setSelectedDemo] = useState<'playground' | 'live' | 'metrics'>('playground');
  const [contractInput, setContractInput] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  // Simulate real-time agent activities
  useEffect(() => {
    if (!isRunning) return;

    const activityTypes = [
      {
        type: 'scan' as const,
        description: 'Security scan initiated for contract 0x742d35...f44e',
        status: 'running' as const
      },
      {
        type: 'alert' as const,
        description: 'Critical vulnerability detected: Reentrancy attack vector',
        status: 'completed' as const
      },
      {
        type: 'action' as const,
        description: 'Emergency response triggered: Contract paused',
        status: 'pending' as const
      },
      {
        type: 'deployment' as const,
        description: 'New security agent deployed: Advanced-Reentrancy-Detector',
        status: 'completed' as const
      }
    ];

    const addActivity = () => {
      const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const newActivity: AgentActivity = {
        id: `activity-${Date.now()}`,
        ...randomActivity,
        timestamp: new Date()
      };

      setAgentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    const interval = setInterval(addActivity, 3000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Simulate live transactions
  useEffect(() => {
    if (!isRunning) return;

    const transactionTypes = [
      {
        type: 'agent-deploy' as const,
        description: 'Agent Deployment',
        value: '0 SEI'
      },
      {
        type: 'security-scan' as const,
        description: 'Security Scan',
        value: '0.001 SEI'
      },
      {
        type: 'vulnerability-alert' as const,
        description: 'Vulnerability Alert',
        value: '0.0005 SEI'
      },
      {
        type: 'emergency-response' as const,
        description: 'Emergency Response',
        value: '0.002 SEI'
      }
    ];

    const addTransaction = () => {
      const randomTx = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const newTx: LiveTransaction = {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        ...randomTx,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        gasUsed: Math.floor(Math.random() * 50000) + 10000,
        status: 'confirmed',
        blockNumber: Math.floor(Math.random() * 1000000) + 8000000,
        timestamp: new Date()
      };

      setLiveTransactions(prev => [newTx, ...prev.slice(0, 9)]);
    };

    const interval = setInterval(addTransaction, 4000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startDemo = () => {
    setIsRunning(true);
    setAgentActivities([]);
    setLiveTransactions([]);
  };

  const stopDemo = () => {
    setIsRunning(false);
  };

  const simulateContractScan = async () => {
    if (!contractInput.trim()) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan': return <Shield className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'action': return <Zap className="w-4 h-4" />;
      case 'deployment': return <Bot className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'scan': return 'text-blue-500';
      case 'alert': return 'text-red-500';
      case 'action': return 'text-orange-500';
      case 'deployment': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTxTypeColor = (type: string) => {
    switch (type) {
      case 'agent-deploy': return 'text-green-500';
      case 'security-scan': return 'text-blue-500';
      case 'vulnerability-alert': return 'text-red-500';
      case 'emergency-response': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          🎮 Interactive Demo & Playground
        </h2>
        <p className="text-muted-foreground">
          Experience SEI Guardian Vigil in action - deploy agents, scan contracts, and watch real-time security operations
        </p>
      </div>

      {/* Demo Controls */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Play className="w-5 h-5" />
            Demo Controls
          </CardTitle>
          <CardDescription>
            Start/stop the live demonstration of SEI Guardian Vigil's capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={startDemo} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Live Demo
            </Button>
            <Button 
              onClick={stopDemo} 
              disabled={!isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop Demo
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isRunning ? 'Demo Running' : 'Demo Stopped'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{agentActivities.length}</div>
              <div className="text-xs text-muted-foreground">Agent Activities</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-green-600">{liveTransactions.length}</div>
              <div className="text-xs text-muted-foreground">Live Transactions</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {isRunning ? 'Active' : 'Inactive'}
              </div>
              <div className="text-xs text-muted-foreground">Demo Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { key: 'playground', label: 'Playground', icon: Play },
            { key: 'live', label: 'Live Activity', icon: Activity },
            { key: 'metrics', label: 'Metrics', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={selectedDemo === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedDemo(key as any)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Playground Tab */}
      {selectedDemo === 'playground' && (
        <div className="space-y-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Shield className="w-5 h-5" />
                🚀 Contract Security Scanner
              </CardTitle>
              <CardDescription>
                Test the AI-powered security scanning capabilities with your own contract code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Smart Contract Code</label>
                  <Textarea
                    placeholder="Paste your Solidity smart contract code here to test security scanning..."
                    value={contractInput}
                    onChange={(e) => setContractInput(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                
                <Button 
                  onClick={simulateContractScan} 
                  disabled={!contractInput.trim() || isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scanning Contract...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start Security Scan
                    </>
                  )}
                </Button>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Scan Progress</span>
                      <span>{scanProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      AI agents are analyzing your contract for vulnerabilities...
                    </div>
                  </div>
                )}

                {scanProgress >= 100 && (
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Scan Complete!</h4>
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Your contract has been analyzed by our AI security agents. 
                      No critical vulnerabilities were detected. The scan completed in 156ms leveraging Sei's fast finality.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Bot className="w-5 h-5" />
                🤖 Agent Deployment Simulator
              </CardTitle>
              <CardDescription>
                Deploy a new AI security agent to the SEI Guardian Vigil network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Agent Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Agent Name</label>
                      <Input placeholder="MySecurityAgent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Specialization</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Reentrancy Detection</option>
                        <option>Overflow Protection</option>
                        <option>Access Control</option>
                        <option>Oracle Manipulation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">AI Model</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>GPT-4 (Recommended)</option>
                        <option>Claude-3</option>
                        <option>Custom Model</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full">Deploy Agent</Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Deployment Preview</h4>
                  <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span className="font-medium">Sei Mainnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Gas:</span>
                      <span className="font-medium">~45,000 SEI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deployment Time:</span>
                      <span className="font-medium">~400ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Initial Cost:</span>
                      <span className="font-medium">0.045 SEI</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    * Leveraging Sei's parallelized EVM for optimal deployment performance
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Activity Tab */}
      {selectedDemo === 'live' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Live Agent Activities
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of AI agent operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentActivities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Start the demo to see live agent activities
                    </div>
                  ) : (
                    agentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`${getActivityColor(activity.type)} mt-1`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                            <span className="text-xs text-muted-foreground capitalize">{activity.status}</span>
                            <span className="text-xs text-muted-foreground">
                              {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Sei Transactions
                </CardTitle>
                <CardDescription>
                  Real-time blockchain transactions from agent activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Start the demo to see live transactions
                    </div>
                  ) : (
                    liveTransactions.map((tx) => (
                      <div key={tx.hash} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${getTxTypeColor(tx.type)}`}>
                            {tx.type.replace('-', ' ').toUpperCase()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Hash: {tx.hash.substring(0, 16)}...</div>
                          <div>Block: #{tx.blockNumber}</div>
                          <div>Gas: {tx.gasUsed.toLocaleString()}</div>
                          <div>Time: {tx.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {selectedDemo === 'metrics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Demo Performance Metrics
              </CardTitle>
              <CardDescription>
                Real-time performance data from the interactive demonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {agentActivities.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Activities</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {liveTransactions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {isRunning ? 'Active' : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Demo Runtime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {scanProgress.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Scan Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
