
/* Navigation is now handled by the Layout component */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      
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
            <Button asChild size="lg" className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold text-lg px-8 py-6 transform hover:scale-105 hover:-translate-y-1">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <span>VIEW DASHBOARD</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold text-lg px-8 py-6 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-red-500/25">
              <Link to="/agent-arena" className="flex items-center space-x-3">
                <Gamepad2 className="w-5 h-5" />
                <span>ENTER ARENA</span>
              </Link>
            </Button>
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
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105">
                  <Link to="/dashboard">VIEW MONITOR →</Link>
                </Button>
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
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105">
                  <Link to="/agents">MANAGE AGENTS →</Link>
                </Button>
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
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105">
                  <Link to="/audits">VIEW AUDITS →</Link>
                </Button>
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
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105">
                  <Link to="/security">SECURITY CENTER →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
