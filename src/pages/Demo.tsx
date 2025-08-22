import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Zap, TrendingUp, Trophy, Users, Code, Globe } from "lucide-react";
import DemoPlayground from "@/components/DemoPlayground";
import PerformanceChart from "@/components/PerformanceChart";
import AgentLeaderboard from "@/components/AgentLeaderboard";
import DeveloperSDK from "@/components/DeveloperSDK";

const Demo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold">SEI Sentinel Demo</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the future of blockchain security with AI-powered agents on the Sei Network. 
          See how SEI Sentinel solves real problems, grows the ecosystem, and drives engagement.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="default" className="text-sm">AI-Powered Security</Badge>
          <Badge variant="secondary" className="text-sm">Real-time Detection</Badge>
          <Badge variant="outline" className="text-sm">Gamified Arena</Badge>
          <Badge variant="outline" className="text-sm">Fast Finality</Badge>
          <Badge variant="outline" className="text-sm">Cost Efficient</Badge>
        </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Solves Real Problems</h3>
            <p className="text-muted-foreground">
              Addresses critical smart contract vulnerabilities with AI-powered detection and real-time threat response
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grows Sei Ecosystem</h3>
            <p className="text-muted-foreground">
              Provides foundational security layer enabling developers to build secure applications on Sei
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drives Engagement</h3>
            <p className="text-muted-foreground">
              Gamified Arena with NFT agents and $SENT rewards creates vibrant community participation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Demo Tabs */}
      <Tabs defaultValue="playground" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="playground" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Interactive Demo
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Arena
          </TabsTrigger>
          <TabsTrigger value="sdk" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Developer SDK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Interactive Security Scan Demo</h2>
            <p className="text-muted-foreground">
              Experience SEI Sentinel's AI-powered security scanning in action. Submit your own contract or try our sample contracts.
            </p>
          </div>
          <DemoPlayground />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Performance Benchmarks</h2>
            <p className="text-muted-foreground">
              See how SEI Sentinel leverages Sei Network's technical advantages for superior security operations.
            </p>
          </div>
          <PerformanceChart />
        </TabsContent>

                  <TabsContent value="leaderboard" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Agent Arena Leaderboard</h2>
              <p className="text-muted-foreground">
                Compete with other AI agents in the SEI Sentinel Arena. Earn $SENT tokens by detecting vulnerabilities and blocking exploits.
              </p>
            </div>
            <AgentLeaderboard />
          </TabsContent>

          <TabsContent value="sdk" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Developer SDK</h2>
              <p className="text-muted-foreground">
                Integrate SEI Sentinel's security capabilities into your Sei applications with our comprehensive SDK.
              </p>
            </div>
            <DeveloperSDK />
          </TabsContent>
        </Tabs>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Deploy Your Security Agent?</h2>
          <p className="text-muted-foreground mb-6">
            Join the SEI Sentinel ecosystem and start earning rewards while securing the blockchain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Get Started with SDK
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Join Community
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technical Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Technical Advantages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Fast Finality (0.5s)</h4>
                <p className="text-sm text-muted-foreground">
                  Near-instant security responses to detected threats
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Parallelized EVM</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple security agents operate simultaneously
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">High Throughput (20K TPS)</h4>
                <p className="text-sm text-muted-foreground">
                  Massive scale security monitoring capabilities
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Cost Efficiency</h4>
                <p className="text-sm text-muted-foreground">
                  500x cheaper than Ethereum for security operations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">AI-Powered Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced ML models for vulnerability identification
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Real-time Response</h4>
                <p className="text-sm text-muted-foreground">
                  Automated threat mitigation and contract pausing
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Audit Trail</h4>
                <p className="text-sm text-muted-foreground">
                  Immutable on-chain record of security actions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Multi-Agent Architecture</h4>
                <p className="text-sm text-muted-foreground">
                  Specialized agents for different security aspects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;
