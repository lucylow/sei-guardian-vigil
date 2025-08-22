import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileSearch, 
  ShieldCheck, 
  Sword, 
  Code, 
  BookOpen,
  Settings,
  Wallet,
  Zap,
  TrendingUp,
  Activity,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConnectWalletButton from "./ConnectWalletButton";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Home, description: "Welcome to SEI Sentinel" },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3, description: "System overview & metrics" },
    { to: "/agents", label: "Agents", icon: Users, description: "AI agent management" },
    { to: "/audits", label: "Audits", icon: FileSearch, description: "Security audit queue" },
    { to: "/security", label: "Security", icon: ShieldCheck, description: "Threat detection & response" },
    { to: "/agent-arena", label: "Agent Arena", icon: Sword, description: "Agent battles & training" },
    { to: "/no-code-studio", label: "No-Code Studio", icon: Code, description: "Visual agent builder" },
    { to: "/demo", label: "Demo", icon: Zap, description: "Interactive demonstrations" },
    { to: "/docs", label: "Documentation", icon: BookOpen, description: "Developer guides & API docs" },
    { to: "/settings", label: "Settings", icon: Settings, description: "Configuration & preferences" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEI Sentinel
                </span>
                <div className="text-xs text-muted-foreground">Guardian Vigil</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Sei Network</span>
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              
              {/* Wallet Connection */}
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 min-h-screen border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <nav className="p-4 space-y-2">
            {navItems.map(({ to, label, icon: Icon, description }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(to) 
                    ? "bg-accent text-accent-foreground border-l-2 border-l-primary" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  isActive(to) ? "text-primary" : "text-muted-foreground"
                )} />
                <div className="flex-1">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    {description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t">
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick Stats
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Agents</span>
                  <Badge variant="secondary" className="text-xs">8</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contracts Monitored</span>
                  <Badge variant="secondary" className="text-xs">24</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Security Score</span>
                  <Badge variant="default" className="text-xs bg-green-600">94%</Badge>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>© 2024 SEI Sentinel. Built on Sei Network.</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Network: Healthy</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/docs" className="hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link to="/settings" className="hover:text-foreground transition-colors">
                Settings
              </Link>
              <a href="https://github.com/sei-network" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
