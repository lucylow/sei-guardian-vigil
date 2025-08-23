import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2, Sparkles, Zap, TrendingUp, Globe, Lock, Code, Trophy } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletButton";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "react-router-dom";
import DemoPlayground from "@/components/DemoPlayground";
import PerformanceChart from "@/components/PerformanceChart";
import AgentLeaderboard from "@/components/AgentLeaderboard";
import DeveloperSDK from "@/components/DeveloperSDK";
import ParallelAuditDemo from "@/components/ParallelAuditDemo";

export default function LandingPage() {
  const { isConnected } = useWallet();
  
  // Tab descriptions for each demo section
  const tabDescriptions = {
    'playground': "Interactive security scanning demo - test SEI Sentinel's AI-powered vulnerability detection",

    'parallel': "Witness SEI's parallelized EVM with multiple AI agents auditing contracts simultaneously",

    'performance': "Performance benchmarks showcasing SEI Network's technical advantages for security operations",

    'leaderboard': "Compete in the Agent Arena and earn $SENT tokens by detecting vulnerabilities",

    'sdk': "Integrate SEI Sentinel's security capabilities into your Sei applications with our comprehensive SDK"

  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black font-mono text-red-400">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-red-900/50 bg-black/95 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80 shadow-2xl shadow-red-500/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-red-500/40 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3">
                <Shield className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <span className="font-bold text-2xl bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent tracking-wider">
                  SEI SENTINEL
                </span>
                <div className="text-xs text-red-600/70 tracking-wider font-medium">GUARDIAN VIGIL</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Network Status */}
              <div className="hidden md:flex items-center space-x-3 text-sm">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-red-600/70 tracking-wide font-medium">SEI NETWORK</span>
                <div className="px-2 py-1 bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-700/50 rounded text-xs text-red-300 font-bold tracking-wide">
                  <Activity className="w-3 h-3 inline mr-1 animate-pulse" />
                  LIVE
                </div>
              </div>
              
              {/* Wallet Connection */}
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-red-800/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/40 group-hover:shadow-red-500/60 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                <Shield className="w-12 h-12 text-white group-hover:animate-pulse" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-6 tracking-wider leading-tight">
              SEI SENTINEL
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-red-400 animate-pulse" />
              <span className="text-red-400 font-bold tracking-wider">AI-POWERED SECURITY</span>
              <Sparkles className="w-6 h-6 text-red-400 animate-pulse delay-500" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-red-300/90 mb-12 max-w-4xl mx-auto tracking-wide leading-relaxed font-medium">
            GAMIFIED MULTI-AGENT SECURITY SYSTEM FOR SEI NETWORK. NFT-POWERED AGENTS COMPETE TO PROTECT $626M+ DEFI ECOSYSTEM.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            {isConnected ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold text-lg px-8 py-6 transform hover:scale-105 hover:-translate-y-1">
                <Link to="/dashboard" className="flex items-center space-x-3">
                  <span>ACCESS SEI SENTINEL APP</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-2 border-red-500 shadow-2xl shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold text-lg px-8 py-6 rounded-lg transform hover:scale-105 hover:-translate-y-1">
                <span>CONNECT WALLET TO START</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">$626M+</div>
              <div className="text-sm text-red-600/70">DEFI TVL PROTECTED</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">0.5s</div>
              <div className="text-sm text-red-600/70">FAST FINALITY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">20K TPS</div>
              <div className="text-sm text-red-600/70">HIGH THROUGHPUT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">500x</div>
              <div className="text-sm text-red-600/70">COST EFFICIENT</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-8">
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

      {/* Footer */}
      <footer className="border-t-2 border-red-900/50 bg-gradient-to-r from-black/80 via-black/60 to-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60 shadow-2xl shadow-red-500/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-red-600/70">
            <div className="flex items-center space-x-6">
              <span className="tracking-wide font-medium">© 2024 SEI SENTINEL. BUILT ON SEI NETWORK.</span>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="tracking-wide font-medium">NETWORK: HEALTHY</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-red-400 transition-all duration-300 tracking-wide font-medium hover:scale-105 transform">
                DASHBOARD
              </Link>
              <a href="https://github.com/sei-network" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-all duration-300 tracking-wide font-medium hover:scale-105 transform">
                GITHUB
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
