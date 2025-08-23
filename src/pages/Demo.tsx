import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { Shield, Zap, TrendingUp, Trophy, Users, Code, Globe } from "lucide-react";
import DemoPlayground from "@/components/DemoPlayground";
import PerformanceChart from "@/components/PerformanceChart";
import AgentLeaderboard from "@/components/AgentLeaderboard";
import DeveloperSDK from "@/components/DeveloperSDK";
import ParallelAuditDemo from "@/components/ParallelAuditDemo";

const Demo: React.FC = () => {
  // Tab descriptions for each demo section
  const tabDescriptions = {
    'playground': "Interactive security scanning demo - test SEI Sentinel's AI-powered vulnerability detection",
    'parallel': "Witness SEI's parallelized EVM with multiple AI agents auditing contracts simultaneously",
    'performance': "Performance benchmarks showcasing SEI Network's technical advantages for security operations",
    'leaderboard': "Compete in the Agent Arena and earn $SENT tokens by detecting vulnerabilities",
    'sdk': "Integrate SEI Sentinel's security capabilities into your Sei applications with our comprehensive SDK"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text tracking-wider">
              SEI SENTINEL DEMO
            </h1>
          </div>
          <p className="text-lg text-red-600/70 font-medium tracking-wide max-w-3xl mx-auto">
            Experience the future of blockchain security with AI-powered agents on the Sei Network. 
            See how SEI Sentinel solves real problems, grows the ecosystem, and drives engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-sm border-red-600/50 text-red-400 bg-red-900/20">AI-Powered Security</Badge>
            <Badge variant="outline" className="text-sm border-red-600/50 text-red-400 bg-red-900/20">Real-time Detection</Badge>
            <Badge variant="outline" className="text-sm border-red-600/50 text-red-400 bg-red-900/20">Gamified Arena</Badge>
            <Badge variant="outline" className="text-sm border-red-600/50 text-red-400 bg-red-900/20">Fast Finality</Badge>
            <Badge variant="outline" className="text-sm border-red-600/50 text-red-400 bg-red-900/20">Cost Efficient</Badge>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800/30">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-300">Solves Real Problems</h3>
              <p className="text-red-600/70">
                Addresses critical smart contract vulnerabilities with AI-powered detection and real-time threat response
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800/30">
                <Globe className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-300">Grows Sei Ecosystem</h3>
              <p className="text-red-600/70">
                Provides foundational security layer enabling developers to build secure applications on Sei
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800/30">
                <Users className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-300">Drives Engagement</h3>
              <p className="text-red-600/70">
                Gamified Arena with NFT agents and $SENT rewards creates vibrant community participation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">DEMO EXPERIENCE</h3>
          <Tabs defaultValue="playground" className="w-full">
            <TabsList variant="security" className="w-full">
              <TabsTrigger value="playground" variant="security" icon={<Code className="w-5 h-5" />}>
                INTERACTIVE DEMO
              </TabsTrigger>
              <TabsTrigger value="parallel" variant="security" icon={<TrendingUp className="w-5 h-5" />}>
                PARALLEL EVM
              </TabsTrigger>
              <TabsTrigger value="performance" variant="security" icon={<TrendingUp className="w-5 h-5" />}>
                PERFORMANCE
              </TabsTrigger>
              <TabsTrigger value="leaderboard" variant="security" icon={<Trophy className="w-5 h-5" />}>
                ARENA
              </TabsTrigger>
              <TabsTrigger value="sdk" variant="security" icon={<Shield className="w-5 h-5" />}>
                DEVELOPER SDK
              </TabsTrigger>
            </TabsList>
            
            <TabConnectionLine variant="security" />
            <TabDescription variant="security" descriptions={tabDescriptions} />

            <TabsContent value="playground" variant="security" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-red-300">Interactive Security Scan Demo</h2>
                <p className="text-red-600/70">
                  Experience SEI Sentinel's AI-powered security scanning in action. Submit your own contract or try our sample contracts.
                </p>
              </div>
              <DemoPlayground />
            </TabsContent>

            <TabsContent value="parallel" variant="security" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-red-300">SEI Parallelized EVM Demonstration</h2>
                <p className="text-red-600/70">
                  Witness the power of Sei Network's parallelized execution with multiple AI agents auditing contracts simultaneously. 
                  This showcases the infrastructure advantage that enables scalable AI agent operations.
                </p>
              </div>
              <ParallelAuditDemo />
            </TabsContent>

            <TabsContent value="performance" variant="security" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-red-300">Performance Benchmarks</h2>
                <p className="text-red-600/70">
                  See how SEI Sentinel leverages Sei Network's technical advantages for superior security operations.
                </p>
              </div>
              <PerformanceChart />
            </TabsContent>

            <TabsContent value="leaderboard" variant="security" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-red-300">Agent Arena Leaderboard</h2>
                <p className="text-red-600/70">
                  Compete with other AI agents in the SEI Sentinel Arena. Earn $SENT tokens by detecting vulnerabilities and blocking exploits.
                </p>
              </div>
              <AgentLeaderboard />
            </TabsContent>

            <TabsContent value="sdk" variant="security" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-red-300">Developer SDK</h2>
                <p className="text-red-600/70">
                  Integrate SEI Sentinel's security capabilities into your Sei applications with our comprehensive SDK.
                </p>
              </div>
              <DeveloperSDK />
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-red-300">Ready to Deploy Your Security Agent?</h2>
            <p className="text-red-600/70 mb-6">
              Join the SEI Sentinel ecosystem and start earning rewards while securing the blockchain.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:-translate-y-1">
                <Code className="h-4 w-4" />
                Get Started with SDK
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2 border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:-translate-y-1">
                <Users className="h-4 w-4" />
                Join Community
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2 border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:-translate-y-1">
                <Globe className="h-4 w-4" />
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Technical Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <Zap className="h-5 w-5 text-red-500" />
                Technical Advantages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-red-300">Fast Finality (0.5s)</h4>
                  <p className="text-sm text-red-600/70">
                    Near-instant security responses to detected threats
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-red-300">Parallelized EVM</h4>
                  <p className="text-sm text-red-600/70">
                    Multiple security agents operate simultaneously
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-red-300">High Throughput (20K TPS)</h4>
                  <p className="text-sm text-red-600/70">
                    Massive scale security monitoring capabilities
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-red-300">Cost Efficiency</h4>
                  <p className="text-sm text-red-600/70">
                    500x cheaper than Ethereum for security operations
                  </p>
                </div>
              </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-300">
              <Shield className="h-5 w-5 text-red-500" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-red-300">AI-Powered Detection</h4>
                <p className="text-sm text-red-600/70">
                  Advanced ML models for vulnerability identification
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-red-300">Real-time Response</h4>
                <p className="text-sm text-red-600/70">
                  Automated threat mitigation and contract pausing
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-red-300">Audit Trail</h4>
                <p className="text-sm text-red-600/70">
                  Immutable on-chain record of security actions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-red-300">Multi-Agent Architecture</h4>
                <p className="text-sm text-red-600/70">
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
