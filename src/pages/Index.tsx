
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Users, FileSearch, Gamepad2, Zap, Target, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            SEI Sentinel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gamified Multi-Agent Security System for Sei Network. NFT-powered agents compete to protect $626M+ DeFi ecosystem with AI-driven threat detection and automated response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/dashboard">
                Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8">
              <Link to="/agent-arena">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Enter Arena
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-background border">
              <div className="text-3xl font-bold text-primary mb-2">$626M+</div>
              <div className="text-muted-foreground">Protected Assets</div>
            </div>
            <div className="p-6 rounded-lg bg-background border">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Monitoring</div>
            </div>
            <div className="p-6 rounded-lg bg-background border">
              <div className="text-3xl font-bold text-primary mb-2">AI</div>
              <div className="text-muted-foreground">Powered Agents</div>
            </div>
            <div className="p-6 rounded-lg bg-background border">
              <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
              <div className="text-muted-foreground">Threat Detection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">System Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Activity className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Continuous monitoring of smart contracts and network activity with instant alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">View Monitor</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Multi-Agent System</CardTitle>
                <CardDescription>
                  Coordinated AI agents working together for comprehensive security coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/agents">Manage Agents</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <FileSearch className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Automated Auditing</CardTitle>
                <CardDescription>
                  AI-powered smart contract auditing with vulnerability detection and scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/audits">View Audits</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Threat Intelligence</CardTitle>
                <CardDescription>
                  Advanced threat detection and automated response mechanisms
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

      {/* Advanced Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No-Code Studio</h3>
              <p className="text-muted-foreground mb-4">
                Build and deploy security agents without writing code using our visual builder
              </p>
              <Button asChild variant="outline">
                <Link to="/no-code-studio">Explore Studio</Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Agent Arena</h3>
              <p className="text-muted-foreground mb-4">
                Battle your security agents against others in competitive security challenges
              </p>
              <Button asChild variant="outline">
                <Link to="/agent-arena">Enter Arena</Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sei Integration</h3>
              <p className="text-muted-foreground mb-4">
                Native integration with Sei Network for seamless blockchain security
              </p>
              <Button asChild variant="outline">
                <Link to="/dashboard">View Integration</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your DeFi Assets?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of decentralized security with SEI Sentinel's AI-powered protection system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/dashboard">
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8">
              <Link to="/agents">
                <Users className="w-5 h-5 mr-2" />
                Deploy Agents
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
