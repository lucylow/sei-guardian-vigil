import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2, Sparkles, Zap, TrendingUp, Globe, Lock } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black font-mono text-red-400">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-red-900/50 bg-black/95 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80 shadow-2xl shadow-red-500/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-red-500/40 transition-all duration-500 transform group-hover:scale-105">
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
            <div className="flex items-center space-x-3 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-2 border-red-500 shadow-2xl shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold text-lg px-8 py-6 rounded-lg transform hover:scale-105 hover:-translate-y-1">
              <span>CONNECT WALLET TO START</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-800/30 hover:bg-red-900/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-red-400 mb-2">$626M+</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">DEFI ECOSYSTEM</div>
            </div>
            <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-800/30 hover:bg-red-900/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-red-400 mb-2">400ms</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">FINALITY</div>
            </div>
            <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-800/30 hover:bg-red-900/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-red-400 mb-2">20K+</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">TPS</div>
            </div>
            <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-800/30 hover:bg-red-900/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-red-400 mb-2">AI</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">POWERED</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-red-300 tracking-wider mb-6">SYSTEM CAPABILITIES</h2>
            <p className="text-xl text-red-600/70 max-w-3xl mx-auto tracking-wide leading-relaxed">
              ADVANCED SECURITY FEATURES DESIGNED FOR THE NEXT GENERATION OF BLOCKCHAIN PROTECTION
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-2">
              <CardHeader className="group-hover:bg-red-900/20 transition-all duration-300 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl">REAL-TIME MONITORING</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide leading-relaxed">
                  CONTINUOUS MONITORING OF SMART CONTRACTS AND NETWORK ACTIVITY WITH INSTANT ALERTS
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-red-600/70 font-mono tracking-wide font-bold">
                  CONNECT WALLET TO ACCESS →
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-2">
              <CardHeader className="group-hover:bg-red-900/20 transition-all duration-300 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl">MULTI-AGENT SYSTEM</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide leading-relaxed">
                  COORDINATED AI AGENTS WORKING TOGETHER FOR COMPREHENSIVE SECURITY COVERAGE
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-red-600/70 font-mono tracking-wide font-bold">
                  CONNECT WALLET TO ACCESS →
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-2">
              <CardHeader className="group-hover:bg-red-900/20 transition-all duration-300 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <FileSearch className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl">AUTOMATED AUDITING</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide leading-relaxed">
                  AI-POWERED SMART CONTRACT AUDITING WITH ADVANCED VULNERABILITY DETECTION
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-red-600/70 font-mono tracking-wide font-bold">
                  CONNECT WALLET TO ACCESS →
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-2">
              <CardHeader className="group-hover:bg-red-900/20 transition-all duration-300 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-300 font-mono tracking-wide text-xl">THREAT INTELLIGENCE</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide leading-relaxed">
                  ADVANCED THREAT DETECTION AND RESPONSE MECHANISMS FOR REAL-TIME PROTECTION
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-red-600/70 font-mono tracking-wide font-bold">
                  CONNECT WALLET TO ACCESS →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-red-300 tracking-wider mb-6">
              READY TO PROTECT THE SEI ECOSYSTEM?
            </h2>
            <p className="text-xl text-red-600/70 mb-8 tracking-wide leading-relaxed">
              CONNECT YOUR WALLET TO ACCESS THE FULL SEI SENTINEL PLATFORM AND JOIN THE GUARDIAN VIGIL
            </p>
            <div className="flex justify-center">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </section>

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
