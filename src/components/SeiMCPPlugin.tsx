import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Shield, Activity, Eye, Zap, Network } from 'lucide-react';

interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  contract?: string;
}

interface MonitoredContract {
  address: string;
  deployBlock: number;
  riskScore: number;
  status: 'MONITORING' | 'FLAGGED' | 'VERIFIED';
  lastActivity: string;
  anomalies: number;
}

export function SeiMCPPlugin() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [currentBlock, setCurrentBlock] = useState(3829847);
  const [scanSpeed, setScanSpeed] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'HIGH_RISK_DEPLOYMENT',
      severity: 'CRITICAL',
      message: 'Contract sei1j...5ha2 deployed with unverified proxy pattern',
      contract: 'sei1j...5ha2'
    },
    {
      id: '2', 
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'FUNCTION_CALL_SPIKE',
      severity: 'HIGH',
      message: '142 calls to mint() function detected in single block',
      contract: 'sei18...kt9f'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'STATE_CHANGE_ANOMALY',
      severity: 'MEDIUM',
      message: 'State changed by 78.2% in monitored contract',
      contract: 'sei14...xqy3'
    }
  ]);

  const [contracts, setContracts] = useState<MonitoredContract[]>([
    {
      address: 'sei1j5k2m8p4q7w9x2...5ha2',
      deployBlock: 3829845,
      riskScore: 8.7,
      status: 'FLAGGED',
      lastActivity: '2s ago',
      anomalies: 3
    },
    {
      address: 'sei18kt9f7x3v2a8b...kt9f',
      deployBlock: 3829843,
      riskScore: 6.2,
      status: 'MONITORING',
      lastActivity: '15s ago',
      anomalies: 1
    },
    {
      address: 'sei14xqy3m9n7k5j8...xqy3',
      deployBlock: 3829840,
      riskScore: 3.1,
      status: 'VERIFIED',
      lastActivity: '1m ago',
      anomalies: 0
    }
  ]);

  // Simulate real-time monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + 1);
      setScanSpeed(Math.floor(Math.random() * 50) + 350); // 350-400ms range
      
      // Occasionally add new alerts
      if (Math.random() < 0.1) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: ['DEPLOYMENT_SPIKE', 'STATE_CHANGE_ANOMALY', 'FUNCTION_CALL_SPIKE'][Math.floor(Math.random() * 3)],
          severity: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)] as Alert['severity'],
          message: `Anomaly detected in block #${currentBlock + 1}`,
          contract: `sei1${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 4)}`
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 400); // Match Sei's 400ms block time

    return () => clearInterval(interval);
  }, [isMonitoring, currentBlock]);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: MonitoredContract['status']) => {
    switch (status) {
      case 'FLAGGED': return 'destructive';
      case 'MONITORING': return 'default';
      case 'VERIFIED': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Plugin Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Sei MCP Plugin
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? 'ACTIVE' : 'PAUSED'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Current Block</p>
                <p className="text-lg font-bold">#{currentBlock.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Scan Speed</p>
                <p className="text-lg font-bold">{scanSpeed}ms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Monitored</p>
                <p className="text-lg font-bold">{contracts.length} contracts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Active Alerts</p>
                <p className="text-lg font-bold">{alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Live Anomaly Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{alert.type}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      {alert.contract && (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {alert.contract}
                        </code>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Monitored Contracts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Deployment Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div
                    key={contract.address}
                    className="p-3 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono">{contract.address}</code>
                      <Badge variant={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Block:</span>
                        <span className="ml-1">#{contract.deployBlock}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Activity:</span>
                        <span className="ml-1">{contract.lastActivity}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Risk Score</span>
                        <span className={contract.riskScore > 7 ? 'text-destructive' : contract.riskScore > 5 ? 'text-yellow-500' : 'text-green-500'}>
                          {contract.riskScore}/10
                        </span>
                      </div>
                      <Progress 
                        value={contract.riskScore * 10} 
                        className="h-1"
                      />
                    </div>

                    {contract.anomalies > 0 && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        {contract.anomalies} anomal{contract.anomalies === 1 ? 'y' : 'ies'} detected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* MCP Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>MCP Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-green-500">●</div>
              <p className="text-sm font-medium">Sei RPC</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-green-500">●</div>
              <p className="text-sm font-medium">MCP API</p>
              <p className="text-xs text-muted-foreground">Streaming</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-green-500">●</div>
              <p className="text-sm font-medium">Sentinel Auditor</p>
              <p className="text-xs text-muted-foreground">Scanning</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}