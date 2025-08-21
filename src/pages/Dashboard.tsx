import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Clock, Database } from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your SEI security system</p>
        </div>

        {/* Simple Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Contracts</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">24</div>
              <p className="text-xs text-muted-foreground">Monitored contracts</p>
            </CardContent>
          </Card>

          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">94%</div>
              <p className="text-xs text-muted-foreground">System health</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">8</div>
              <p className="text-xs text-muted-foreground">Running agents</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">System Uptime</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">99.9%</div>
              <p className="text-xs text-muted-foreground">24h availability</p>
            </CardContent>
          </Card>
        </div>

        {/* Simple Content */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SEI Sentinel</CardTitle>
            <CardDescription>
              Your AI-powered security dashboard is ready. Navigate to different sections to explore features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This is a simplified dashboard view. The full dashboard with all features will be available once we restore the wallet integration.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">View Agents</Button>
                <Button variant="outline">Check Security</Button>
                <Button variant="outline">Run Audit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}