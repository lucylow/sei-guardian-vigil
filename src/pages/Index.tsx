
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import EnhancedAgentArena from "@/components/EnhancedAgentArena";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            SEI Sentinel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gamified Multi-Agent Security System for Sei Network. NFT-powered agents compete to protect $626M+ DeFi ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/dashboard">
                View Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/agents">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Enter Arena
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gamified Agent Arena */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <EnhancedAgentArena />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">System Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Continuous monitoring of smart contracts and network activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">View Monitor</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Multi-Agent System</CardTitle>
                <CardDescription>
                  Coordinated AI agents working together for comprehensive security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/agents">Manage Agents</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileSearch className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Automated Auditing</CardTitle>
                <CardDescription>
                  AI-powered smart contract auditing with vulnerability detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/audits">View Audits</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Threat Intelligence</CardTitle>
                <CardDescription>
                  Advanced threat detection and response mechanisms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/security">Security Center</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
