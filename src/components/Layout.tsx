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
    <div className="min-h-screen bg-black font-mono text-red-400">
      {/* Header */}
      <header className="border-b-2 border-red-900/50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent tracking-wider">
                  SEI SENTINEL
                </span>
                <div className="text-xs text-red-600/70 tracking-wider">GUARDIAN VIGIL</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <span className="text-red-600/70 tracking-wide">SEI NETWORK</span>
                <Badge variant="secondary" className="text-xs bg-red-900/30 border-red-700/50 text-red-400">
                  <Activity className="w-3 h-3 mr-1" />
                  LIVE
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
        <aside className="w-64 min-h-screen border-r-2 border-red-900/50 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <nav className="p-4 space-y-2">
            {navItems.map(({ to, label, icon: Icon, description }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-red-900/20 hover:text-red-300 border-l-2 border-transparent",
                  isActive(to) 
                    ? "bg-red-900/30 text-red-300 border-l-red-500 shadow-lg shadow-red-500/25" 
                    : "text-red-600/70 hover:border-l-red-700/50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  isActive(to) ? "text-red-400" : "text-red-600/70"
                )} />
                <div className="flex-1">
                  <div className="font-medium tracking-wide">{label}</div>
                  <div className="text-xs text-red-600/50 hidden lg:block tracking-wide">
                    {description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-red-900/50">
            <div className="space-y-3">
              <div className="text-xs font-medium text-red-600/70 uppercase tracking-wider">
                QUICK STATS
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600/70">Active Agents</span>
                  <Badge variant="secondary" className="text-xs bg-red-900/30 border-red-700/50 text-red-400">8</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600/70">Contracts Monitored</span>
                  <Badge variant="secondary" className="text-xs bg-red-900/30 border-red-700/50 text-red-400">24</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600/70">Security Score</span>
                  <Badge variant="default" className="text-xs bg-red-600 text-white shadow-lg shadow-red-500/25">94%</Badge>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-red-900/50 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-red-600/70">
            <div className="flex items-center space-x-4">
              <span className="tracking-wide">© 2024 SEI SENTINEL. BUILT ON SEI NETWORK.</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                <span className="tracking-wide">NETWORK: HEALTHY</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/docs" className="hover:text-red-400 transition-colors duration-300 tracking-wide">
                DOCUMENTATION
              </Link>
              <Link to="/settings" className="hover:text-red-400 transition-colors duration-300 tracking-wide">
                SETTINGS
              </Link>
              <a href="https://github.com/sei-network" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors duration-300 tracking-wide">
                GITHUB
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
