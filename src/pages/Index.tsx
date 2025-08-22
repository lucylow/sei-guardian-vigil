
/* Navigation is now handled by the Layout component */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/25 group-hover:shadow-red-500/50 transition-all duration-500">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text mb-6 tracking-wider">
            SEI SENTINEL
          </h1>
          <p className="text-xl text-red-300/80 mb-8 max-w-2xl mx-auto tracking-wide leading-relaxed">
            GAMIFIED MULTI-AGENT SECURITY SYSTEM FOR SEI NETWORK. NFT-POWERED AGENTS COMPETE TO PROTECT $626M+ DEFI ECOSYSTEM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-2 border-red-500 shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-mono tracking-wide font-bold">
              <Link to="/dashboard">
                VIEW DASHBOARD <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold">
              <Link to="/agent-arena">
                <Gamepad2 className="w-4 h-4 mr-2" />
                ENTER ARENA
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-300 tracking-wider">SYSTEM CAPABILITIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 bg-black/50 border-red-900/50 hover:border-red-700/50 group">
              <CardHeader className="group-hover:bg-red-900/10 transition-all duration-300">
                <Activity className="w-8 h-8 text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300" />
                <CardTitle className="text-red-300 font-mono tracking-wide">REAL-TIME MONITORING</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  CONTINUOUS MONITORING OF SMART CONTRACTS AND NETWORK ACTIVITY
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide">
                  <Link to="/dashboard">VIEW MONITOR</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 bg-black/50 border-red-900/50 hover:border-red-700/50 group">
              <CardHeader className="group-hover:bg-red-900/10 transition-all duration-300">
                <Users className="w-8 h-8 text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300" />
                <CardTitle className="text-red-300 font-mono tracking-wide">MULTI-AGENT SYSTEM</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  COORDINATED AI AGENTS WORKING TOGETHER FOR COMPREHENSIVE SECURITY
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide">
                  <Link to="/agents">MANAGE AGENTS</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 bg-black/50 border-red-900/50 hover:border-red-700/50 group">
              <CardHeader className="group-hover:bg-red-900/10 transition-all duration-300">
                <FileSearch className="w-8 h-8 text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300" />
                <CardTitle className="text-red-300 font-mono tracking-wide">AUTOMATED AUDITING</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  AI-POWERED SMART CONTRACT AUDITING WITH VULNERABILITY DETECTION
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide">
                  <Link to="/audits">VIEW AUDITS</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 bg-black/50 border-red-900/50 hover:border-red-700/50 group">
              <CardHeader className="group-hover:bg-red-900/10 transition-all duration-300">
                <Shield className="w-8 h-8 text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300" />
                <CardTitle className="text-red-300 font-mono tracking-wide">THREAT INTELLIGENCE</CardTitle>
                <CardDescription className="text-red-600/70 font-mono tracking-wide">
                  ADVANCED THREAT DETECTION AND RESPONSE MECHANISMS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="text-red-600/70 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 font-mono tracking-wide">
                  <Link to="/security">SECURITY CENTER</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
