import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Gamepad2,
  Sword,
  Target,
  TrendingUp,
  Zap,
  AlertTriangle,
  Award,
  Users,
  Clock,
  DollarSign,
  Activity
} from "lucide-react";
import { AgentArena } from "@/components/AgentArena";
import { AchievementSystem } from "@/components/AchievementSystem";
import { sentinelEvents, SENTINEL_AGENTS } from "@/lib/goatSdk";

interface SecurityEvent {
  id: string;
  type: string;
  severity?: number;
  agent: string;
  timestamp: Date;
  impact?: string;
  contract?: string;
  message: string;
}

interface SentinelGameDashboardProps {
  className?: string;
}

export const SentinelGameDashboard: React.FC<SentinelGameDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<"arena" | "achievements" | "overview">("overview");
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [gameStats, setGameStats] = useState({
    totalVulnerabilities: 342,
    blockedExploits: 156,
    tokensDistributed: 45600,
    activeAgents: 4,
    winRate: 94.2
  });

  useEffect(() => {
    // Subscribe to real-time events
    const handleEvent = (event: any) => {
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        type: event.type,
        severity: event.severity,
        agent: event.agent,
        timestamp: new Date(),
        impact: event.impact,
        contract: event.contract,
        message: formatEventMessage(event)
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events
      
      // Update stats based on event type
      if (event.type === "vulnerability_detected") {
        setGameStats(prev => ({
          ...prev,
          totalVulnerabilities: prev.totalVulnerabilities + 1
        }));
      } else if (event.type === "exploit_blocked") {
        setGameStats(prev => ({
          ...prev,
          blockedExploits: prev.blockedExploits + 1
        }));
      }
    };

    sentinelEvents.subscribe(handleEvent);
    sentinelEvents.startSecurityEvents();

    return () => {
      sentinelEvents.unsubscribe(handleEvent);
    };
  }, []);

  const formatEventMessage = (event: any) => {
    const agentName = SENTINEL_AGENTS.find(a => a.id === event.agent)?.name || "Unknown Agent";
    
    switch (event.type) {
      case "vulnerability_detected":
        return `${agentName} detected severity ${event.severity} vulnerability in ${event.contract}`;
      case "exploit_blocked":
        return `${agentName} blocked potential exploit, saving ${event.impact}`;
      case "achievement_earned":
        return `${agentName} earned a new achievement badge!`;
      default:
        return `${agentName} performed security action`;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "vulnerability_detected": return <Target className="w-4 h-4" />;
      case "exploit_blocked": return <Sword className="w-4 h-4" />;
      case "achievement_earned": return <Award className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (severity?: number) => {
    if (!severity) return "text-foreground";
    if (severity >= 9) return "text-red-400";
    if (severity >= 7) return "text-orange-400";
    if (severity >= 5) return "text-yellow-400";
    return "text-green-400";
  };

  const getSeverityBadge = (severity?: number) => {
    if (!severity) return null;
    
    let variant: "destructive" | "secondary" | "outline" | "default" = "default";
    if (severity >= 9) variant = "destructive";
    else if (severity >= 7) variant = "secondary";
    else variant = "outline";
    
    return (
      <Badge variant={variant} className="text-xs">
        Severity {severity}
      </Badge>
    );
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Gamepad2 className="w-8 h-8" />
          <span>SEI SENTINEL Arena</span>
        </h1>
        <p className="text-muted-foreground">Gamified security operations where AI agents compete to protect Sei ecosystem</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "arena", label: "Agent Arena", icon: Users },
          { id: "achievements", label: "Achievements", icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Game Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gameStats.totalVulnerabilities}</div>
                <p className="text-xs text-muted-foreground">Total detected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exploits Blocked</CardTitle>
                <Sword className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gameStats.blockedExploits}</div>
                <p className="text-xs text-muted-foreground">Attacks prevented</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">$SENT Distributed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gameStats.tokensDistributed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Token rewards</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gameStats.activeAgents}</div>
                <p className="text-xs text-muted-foreground">Defending Sei</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gameStats.winRate}%</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Security Event Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Live Security Events</span>
                </CardTitle>
                <CardDescription>Real-time agent activities and threat responses</CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto space-y-3">
                {events.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Waiting for security events...</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className={`mt-1 ${getEventColor(event.severity)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium truncate">{event.message}</span>
                          {getSeverityBadge(event.severity)}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{event.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Current Battle Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Battle Status</span>
                </CardTitle>
                <CardDescription>Active vulnerability battles and agent performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Simulated active battles */}
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Reentrancy Battle</span>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                      <span>StaticGuardian vs CVE-2024-001</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">75% complete</div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Access Control Scan</span>
                      <Badge variant="secondary">High</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                      <span>DarkWebScout analyzing threat patterns</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">45% complete</div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Gas Optimization</span>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                      <span>PatchMaster deploying fix</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">90% complete</div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Active Protection:</strong> All Sei DeFi protocols are being monitored by 4 active security agents.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Agent Arena Tab */}
      {activeTab === "arena" && (
        <AgentArena />
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <AchievementSystem />
      )}
    </div>
  );
};