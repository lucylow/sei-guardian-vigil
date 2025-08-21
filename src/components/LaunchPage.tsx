import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Users, Globe, ArrowRight, Play, Star } from "lucide-react";

interface LaunchPageProps {
  onLaunch: () => void;
}

export default function LaunchPage({ onLaunch }: LaunchPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            SEI Sentinel
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The Ultimate AI-Powered Security System for Sei Network
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={onLaunch} 
              size="lg" 
              className="h-14 px-8 text-lg bg-primary hover:bg-primary/90"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Sentinel
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg"
            >
              <Globe className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle>AI-Powered Security</CardTitle>
              <CardDescription>
                Advanced threat detection using machine learning and multi-agent systems
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-500" />
              </CardHeader>
              <CardTitle>Real-Time Protection</CardTitle>
              <CardDescription>
                24/7 monitoring and instant response to security threats
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-500" />
              </CardHeader>
              <CardTitle>Multi-Agent System</CardTitle>
              <CardDescription>
                Coordinated AI agents working together for comprehensive coverage
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-6 rounded-lg bg-card border">
            <div className="text-3xl font-bold text-primary mb-2">$626M+</div>
            <div className="text-muted-foreground">Protected Assets</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border">
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Monitoring</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border">
            <div className="text-3xl font-bold text-primary mb-2">AI</div>
            <div className="text-muted-foreground">Powered</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your DeFi Future?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of users protecting their assets with SEI Sentinel
          </p>
          <Button 
            onClick={onLaunch} 
            size="lg" 
            className="h-12 px-8 text-lg"
          >
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Built for Sei Network • Powered by AI • Secure by Design</p>
        </div>
      </div>
    </div>
  );
}
