import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2, Sparkles, Zap, TrendingUp, Globe, Lock, Code, Trophy, BookOpen, Github, Play, Rocket, Terminal, Network, FileText, Brain, Eye, Sword, BarChart3 } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletButton";
import { useWallet } from "@/contexts/WalletContext";
import { Link, useNavigate } from "react-router-dom";
import DemoPlayground from "@/components/DemoPlayground";
import PerformanceChart from "@/components/PerformanceChart";
import AgentLeaderboard from "@/components/AgentLeaderboard";
import DeveloperSDK from "@/components/DeveloperSDK";
import ParallelAuditDemo from "@/components/ParallelAuditDemo";
import { useToast } from "@/components/ui/use-toast";

export default function LandingPage() {
  const { isConnected } = useWallet();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Auto-redirect to dashboard when wallet connects
  useEffect(() => {
    console.log('LandingPage: Wallet connection state changed:', { isConnected, isRedirecting });
    
    if (isConnected && !isRedirecting) {
      console.log('LandingPage: Wallet connected, starting redirect to dashboard...');
      setIsRedirecting(true);
      // Small delay to ensure wallet state is fully updated
      const timer = setTimeout(() => {
        console.log('LandingPage: Redirecting to dashboard now');
        navigate('/dashboard');
      }, 1000); // Increased delay to ensure wallet state is stable
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, navigate, isRedirecting]);

  // Also redirect if user is already connected (e.g., page refresh)
  useEffect(() => {
    console.log('LandingPage: Checking if already connected:', { isConnected, isRedirecting });
    
    if (isConnected && !isRedirecting) {
      console.log('LandingPage: Already connected, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isConnected, isRedirecting, navigate]);
  
  // Tab descriptions for each demo section
  const tabDescriptions = {
    'playground': "Interactive security scanning demo - test SEI Sentinel's AI-powered vulnerability detection",
    'parallel': "Witness SEI's parallelized EVM with multiple AI agents auditing contracts simultaneously",
    'performance': "Performance benchmarks showcasing SEI Network's technical advantages for security operations",
    'leaderboard': "Compete in the Agent Arena and earn $SENT tokens by detecting vulnerabilities",
    'sdk': "Integrate SEI Sentinel's security capabilities into your Sei applications with our comprehensive SDK"
  };
  
  // Handle button clicks
  const handleStartAudit = () => {
    if (isConnected) {
      navigate('/audits');
    } else {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to start a security audit",
      });
    }
  };

  const handleWatchDemo = () => {
    setActiveDemo('playground');
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnterArena = () => {
    if (isConnected) {
      navigate('/agent-arena');
    } else {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to enter the Agent Arena",
      });
    }
  };

  const handleTryDemo = () => {
    setActiveDemo('playground');
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewGitHub = () => {
    window.open('https://github.com/sei-network', '_blank');
  };

  const handleInteractiveDemo = () => {
    setActiveDemo('playground');
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSourceCode = () => {
    window.open('https://github.com/sei-network', '_blank');
  };

  const handleSeiNetwork = () => {
    window.open('https://sei.io', '_blank');
  };

  const handleDiscordCommunity = () => {
    window.open('https://discord.gg/sei', '_blank');
  };

  const handleTwitterUpdates = () => {
    window.open('https://twitter.com/SeiNetwork', '_blank');
  };

  const handleDeveloperForum = () => {
    window.open('https://forum.sei.io', '_blank');
  };

  const handleDashboard = () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to access the dashboard",
      });
    }
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

      {/* Redirecting Notification */}
      {isRedirecting && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-2xl border-2 border-green-400/50 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="font-mono font-bold tracking-wide">REDIRECTING TO DASHBOARD...</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23dc2626%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/25">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text tracking-tight">
                  SEI SENTINEL
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                <span className="text-red-400 font-semibold">400ms Smart Contract Scans.</span>{" "}
                <span className="text-white">Zero Exploits.</span>{" "}
                <span className="text-red-400 font-semibold">Always On.</span>
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                AI-Optimized Smart Contract Auditor + Continuous Security Platform for the Sei Blockchain
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleStartAudit}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Security Audit
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleWatchDemo}
                className="border-2 border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-400 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
              <Button 
                size="sm" 
                onClick={() => toast({ title: "Test", description: "Toast is working!" })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
              >
                Test Toast
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-white">400ms</div>
                <div className="text-gray-400">Scan Speed</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-white">99%+</div>
                <div className="text-gray-400">Vulnerability Detection</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-white">24/7</div>
                <div className="text-gray-400">Continuous Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Why Choose <span className="text-transparent bg-gradient-to-r from-red-400 to-red-500 bg-clip-text">SEI Sentinel</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Built for the high-speed, high-risk environment of blockchain security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "400ms scan cycles match Sei's finality speed for real-time protection",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "AI-Powered",
                description: "Advanced ML models detect 99%+ of known exploits plus zero-day threats",
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: Activity,
                title: "Always On",
                description: "Continuous blockchain monitoring with instant threat response",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Multi-Agent",
                description: "Coordinated AI agents working together for comprehensive security",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Globe,
                title: "Cross-Chain Ready",
                description: "Native CosmWasm support with IBC and EVM adapters",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: Gamepad2,
                title: "Gamified",
                description: "NFT agents, battles, and rewards make security engaging",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-500/10 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              How <span className="text-transparent bg-gradient-to-r from-red-400 to-red-500 bg-clip-text">SEI Sentinel</span> Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From contract upload to threat detection in under 400ms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Upload Contract",
                description: "Drag & drop your smart contract or enter an address",
                icon: FileSearch,
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Advanced ML models scan for vulnerabilities in parallel",
                icon: Brain,
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "03",
                title: "Instant Results",
                description: "Get comprehensive security report in under 400ms",
                icon: Zap,
                color: "from-yellow-500 to-orange-500"
              },
              {
                step: "04",
                title: "Continuous Monitoring",
                description: "24/7 blockchain watching with automatic rescans",
                icon: Eye,
                color: "from-green-500 to-emerald-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="mb-4">
                  <span className="inline-block w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-gray-700">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Economy Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              <span className="text-transparent bg-gradient-to-r from-red-400 to-red-500 bg-clip-text">AI Agent Economy</span> on Sei
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Security agents as NFT identities, fighting vulnerabilities like live "monsters" on-chain
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sword className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Vulnerability Battles</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Critical vulnerabilities spawn as monster avatars. AI agents compete to defeat them for rewards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Live Leaderboards</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Real-time rankings with $SENT token rewards and agent performance tracking.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Achievement System</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Agents earn badges for exploits stopped and fixes deployed on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={handleEnterArena}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Enter the Arena
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Live Demo Mode</h3>
                  <p className="text-gray-400">
                    Experience real-time agent battles and leaderboard updates
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-400">127</div>
                      <div className="text-sm text-gray-500">Active Agents</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">89</div>
                      <div className="text-sm text-gray-500">Vulnerabilities Defeated</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-gray-800/50">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                SEI SENTINEL <span className="text-transparent bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text">DOCUMENTATION</span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive guide to building AI agents on Sei Network. Learn how to leverage 
              parallelized EVM, fast finality, and native order matching for next-generation security.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-8">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleViewGitHub}
                className="border-2 border-blue-600/50 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500 px-6 py-3"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleTryDemo}
                className="border-2 border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 px-6 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>

          {/* Quick Start Guide */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 mb-12 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-white">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                Quick Start Guide
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Get up and running with SEI Sentinel in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: "Install Dependencies",
                    description: "Install the required packages for your project",
                    code: "npm install @sei-guardian-vigil/sdk",
                    language: "bash"
                  },
                  {
                    step: 2,
                    title: "Initialize SDK",
                    description: "Create an instance of the SeiAgentSDK",
                    code: `import { SeiAgentSDK } from '@sei-guardian-vigil/sdk';

const sdk = new SeiAgentSDK('https://rpc.sei.io');`,
                    language: "typescript"
                  },
                  {
                    step: 3,
                    title: "Register Agent",
                    description: "Register your AI agent on the Sei Network",
                    code: `const agentAddress = await sdk.registerAgent(
  'MySecurityAgent',
  'ipfs://QmMyAgentMetadata',
  '0xYourWalletAddress'
);`,
                    language: "typescript"
                  },
                  {
                    step: 4,
                    title: "Submit Audit",
                    description: "Submit a contract for security audit",
                    code: `const auditId = await sdk.submitContractForAudit(
  agentAddress,
  '0xContractAddress',
  'high'
);`,
                    language: "typescript"
                  }
                ].map((step) => (
                  <div key={step.step} className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                      <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700/50">
                        <code className="text-sm text-gray-200 font-mono">{step.code}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Shield,
                title: "AI-Powered Security",
                description: "Advanced vulnerability detection using machine learning algorithms",
                benefits: ["Real-time threat detection", "Automated response", "Continuous monitoring"],
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Zap,
                title: "Parallel Execution",
                description: "Leverage Sei's parallelized EVM for simultaneous contract audits",
                benefits: ["Massive scalability", "Faster processing", "Cost efficiency"],
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Network,
                title: "Fast Finality",
                description: "400ms finality enables near-instant security operations",
                benefits: ["Quick response times", "Real-time updates", "Enhanced user experience"],
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Agent Coordination",
                description: "Multi-agent systems working together for comprehensive security",
                benefits: ["Collaborative analysis", "Specialized expertise", "Redundancy"],
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature) => (
              <Card key={feature.title} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/10 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400 text-lg leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center space-x-3 text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Documentation */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 mb-12 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-white">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                API Reference
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Complete API documentation for integrating with SEI Sentinel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    method: "POST",
                    endpoint: "/api/agents/register",
                    description: "Register a new AI agent",
                    parameters: ["name", "description", "capabilities", "metadataURI"]
                  },
                  {
                    method: "POST",
                    endpoint: "/api/audits/submit",
                    description: "Submit contract for audit",
                    parameters: ["agentId", "contractAddress", "priority"]
                  },
                  {
                    method: "GET",
                    endpoint: "/api/audits/{auditId}",
                    description: "Get audit results",
                    parameters: ["auditId"]
                  },
                  {
                    method: "GET",
                    endpoint: "/api/network/metrics",
                    description: "Get Sei Network metrics",
                    parameters: []
                  },
                  {
                    method: "GET",
                    endpoint: "/api/agents/discover",
                    description: "Discover active agents",
                    parameters: []
                  }
                ].map((endpoint) => (
                  <div key={endpoint.endpoint} className="border border-gray-700/50 rounded-xl p-6 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center space-x-4 mb-3">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className={`px-3 py-1 text-sm font-semibold ${
                        endpoint.method === "GET" 
                          ? "bg-green-600/20 text-green-400 border-green-600/30" 
                          : "bg-blue-600/20 text-blue-400 border-blue-600/30"
                      }`}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-lg text-gray-200">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-gray-400 text-lg mb-4 leading-relaxed">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.parameters.map((param) => (
                        <Badge key={param} variant="outline" className="text-sm border-gray-600/50 text-gray-300 bg-gray-800/50">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 mb-12 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-white">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                Code Examples
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Get started with our SDKs and examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">TypeScript SDK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-gray-900/80 p-4 rounded-lg overflow-x-auto text-gray-200 border border-gray-700/50">
{`import { SeiAgentSDK } from '@sei-guardian-vigil/sdk';

const sdk = new SeiAgentSDK('https://rpc.sei.io');
const metrics = await sdk.getSeiNetworkMetrics();
console.log('Current TPS:', metrics.currentTPS);`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Python SDK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-gray-900/80 p-4 rounded-lg overflow-x-auto text-gray-200 border border-gray-700/50">
{`from sei_guardian_vigil import SeiAgentSDK

sdk = SeiAgentSDK('https://rpc.sei.io')
metrics = await sdk.get_network_metrics()
print(f"Current TPS: {metrics['current_tps']}")`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 mb-12 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-white">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                Integrations & Frameworks
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Connect SEI Sentinel with popular AI frameworks and tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "LangChain",
                    description: "Integrate with LangChain for advanced AI workflows",
                    icon: Code,
                    examples: ["Agent chains", "Memory systems", "Tool integration"],
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    name: "CrewAI",
                    description: "Build autonomous AI crews for complex security tasks",
                    icon: Users,
                    examples: ["Role-based agents", "Task delegation", "Collaborative workflows"],
                    color: "from-green-500 to-green-600"
                  },
                  {
                    name: "Auto-GPT",
                    description: "Create autonomous agents with goal-oriented behavior",
                    icon: Rocket,
                    examples: ["Goal setting", "Autonomous execution", "Learning capabilities"],
                    color: "from-purple-500 to-purple-600"
                  }
                ].map((integration) => (
                  <Card key={integration.name} className="border-2 border-gray-700/50 hover:border-gray-600/50 transition-colors bg-gray-800/30 hover:bg-gray-800/50">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center shadow-lg`}>
                          <integration.icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg text-white">{integration.name}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-400 leading-relaxed">{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-300">Examples:</h4>
                          <ul className="space-y-1">
                            {integration.examples.map((example) => (
                              <li key={example} className="text-sm text-gray-400 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources & Community */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-white">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                Additional Resources & Community
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Explore more resources to master SEI Sentinel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-white">Documentation</h4>
                  <ul className="space-y-3">
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleInteractiveDemo(); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center text-lg hover:underline cursor-pointer"
                      >
                        <Play className="w-4 h-4 mr-3" />
                        Interactive Demo
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleSourceCode(); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center text-lg hover:underline cursor-pointer"
                      >
                        <Github className="w-4 h-4 mr-3" />
                        Source Code
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleSeiNetwork(); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center text-lg hover:underline cursor-pointer"
                      >
                        <Globe className="w-4 h-4 mr-3" />
                        Sei Network
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-white">Community</h4>
                  <ul className="space-y-3">
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleDiscordCommunity(); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-lg hover:underline cursor-pointer"
                      >
                        Discord Community
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleTwitterUpdates(); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-lg hover:underline cursor-pointer"
                      >
                        Twitter Updates
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleDeveloperForum(); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-lg hover:underline cursor-pointer"
                      >
                        Developer Forum
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              <span className="text-transparent bg-gradient-to-r from-red-400 to-red-500 bg-clip-text">LIVE DEMOS</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience SEI Sentinel's capabilities in action
            </p>
          </div>

          <Tabs value={activeDemo || "playground"} onValueChange={setActiveDemo} className="space-y-6">
            <TabsList variant="security" className="w-full">
              <TabsTrigger value="playground" variant="security" icon={<Play className="w-4 h-4" />}>
                INTERACTIVE PLAYGROUND
              </TabsTrigger>
              <TabsTrigger value="parallel" variant="security" icon={<Zap className="w-4 h-4" />}>
                PARALLEL AUDIT
              </TabsTrigger>
              <TabsTrigger value="performance" variant="security" icon={<BarChart3 className="w-4 h-4" />}>
                PERFORMANCE
              </TabsTrigger>
              <TabsTrigger value="leaderboard" variant="security" icon={<Trophy className="w-4 h-4" />}>
                LEADERBOARD
              </TabsTrigger>
              <TabsTrigger value="sdk" variant="security" icon={<Code className="w-4 h-4" />}>
                SDK
              </TabsTrigger>
            </TabsList>

            <TabDescription 
              variant="security" 
              descriptions={tabDescriptions} 
            />

            <TabConnectionLine variant="security" />

            <TabsContent value="playground" variant="security">
              <DemoPlayground />
            </TabsContent>
            <TabsContent value="parallel" variant="security">
              <ParallelAuditDemo />
            </TabsContent>
            <TabsContent value="performance" variant="security">
              <PerformanceChart />
            </TabsContent>
            <TabsContent value="leaderboard" variant="security">
              <AgentLeaderboard />
            </TabsContent>
            <TabsContent value="sdk" variant="security">
              <DeveloperSDK />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-gray-800/50 bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl supports-[backdrop-filter]:bg-black/90 shadow-2xl">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-lg text-gray-400 tracking-wide font-medium">© 2024 SEI SENTINEL. BUILT ON SEI NETWORK.</span>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-lg tracking-wide font-medium text-gray-300">NETWORK: HEALTHY</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <button 
                onClick={handleDashboard}
                className="text-lg text-gray-400 hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-105 transform cursor-pointer"
              >
                DASHBOARD
              </button>
              <a 
                href="https://github.com/sei-network" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-lg text-gray-400 hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-105 transform"
              >
                GITHUB
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
