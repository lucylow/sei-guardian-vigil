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
  Home,
  Gavel
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConnectWalletButton from "./ConnectWalletButton";
import { useWallet } from "@/contexts/WalletContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  console.log('Layout: Rendering, location:', location.pathname);
  
  // Safely get wallet state
  let isConnected = false;
  
  try {
    const walletData = useWallet();
    isConnected = walletData.isConnected;
    console.log('Layout: useWallet successful, isConnected:', isConnected);
  } catch (error) {
    console.error('Layout: useWallet failed:', error);
    isConnected = false;
  }

  const navItems = [
    { to: "/", label: "Home", icon: Home, description: "Welcome to SEI Sentinel" },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3, description: "System overview & metrics" },
    { to: "/governance", label: "Governance", icon: Gavel, description: "DAO governance & voting" },
    { to: "/agents", label: "Agents", icon: Users, description: "AI agent management" },
    { to: "/audits", label: "Audits", icon: FileSearch, description: "Security audit queue" },
    { to: "/security", label: "Security", icon: ShieldCheck, description: "Threat detection & response" },
    { to: "/agent-arena", label: "Agent Arena", icon: Sword, description: "Agent battles & training" },
    { to: "/no-code-studio", label: "No-Code Studio", icon: Code, description: "Visual agent builder" },

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black font-mono text-red-400">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-red-900/50 bg-black/95 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80 shadow-2xl shadow-red-500/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={isConnected ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-red-500/40 transition-all duration-500 transform group-hover:scale-105">
                <Shield className="w-6 h-5 text-red-500" />
              </div>
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <span className="font-bold text-2xl bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent tracking-wider">
                  SEI SENTINEL
                </span>
                <div className="text-xs text-red-600/70 tracking-wider font-medium">
                  {isConnected ? "APP" : "GUARDIAN VIGIL"}
                </div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Network Status */}
              <div className="hidden md:flex items-center space-x-3 text-sm">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-red-600/70 tracking-wide font-medium">SEI NETWORK</span>
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-900/40 to-red-800/40 border-red-700/50 text-red-300 shadow-lg shadow-red-500/20 font-bold tracking-wide">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
              
              {/* Wallet Connection */}
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      {isConnected ? (
        <div className="flex">
          {/* Sidebar Navigation */}
          <aside className="w-72 min-h-screen border-r-2 border-red-900/50 bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60 shadow-2xl shadow-red-500/10">
            <nav className="p-6 space-y-3">
              {navItems.map(({ to, label, icon: Icon, description }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-red-900/20 hover:text-red-300 border-l-4 border-transparent hover:border-l-red-500 hover:shadow-lg hover:shadow-red-500/20 transform hover:translate-x-1",
                    isActive(to) 
                      ? "bg-gradient-to-r from-red-900/40 to-red-800/20 text-red-300 border-l-red-500 shadow-xl shadow-red-500/30 transform translate-x-1" 
                      : "text-red-600/70 hover:border-l-red-700/50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive(to) 
                      ? "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20" 
                      : "bg-red-900/20 text-red-600/70 group-hover:bg-red-500/20 group-hover:text-red-400"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold tracking-wide text-base">{label}</div>
                    <div className="text-xs text-red-600/50 hidden lg:block tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {description}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

                      {/* Quick Stats */}
          <div className="p-6 border-t border-red-900/50">
            <div className="space-y-4">
              <div className="text-xs font-bold text-red-600/70 uppercase tracking-wider">
                QUICK STATS
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30 hover:bg-red-900/30 transition-colors duration-300">
                  <span className="text-red-600/70 font-medium">Active Agents</span>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25 font-bold">8</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30 hover:bg-red-900/30 transition-colors duration-300">
                  <span className="text-red-600/70 font-medium">Contracts Monitored</span>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25 font-bold">24</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30 hover:bg-red-900/30 transition-colors duration-300">
                  <span className="text-red-600/70 font-medium">Security Score</span>
                  <Badge variant="default" className="text-xs bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25 font-bold">94%</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back to Landing */}
          <div className="p-6 border-t border-red-900/50">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-red-900/20 hover:text-red-300 border-l-4 border-transparent hover:border-l-red-500 hover:shadow-lg hover:shadow-red-500/20 transform hover:translate-x-1 text-red-600/70 hover:border-l-red-700/50"
            >
              <div className="p-2 rounded-lg transition-all duration-300 bg-red-900/20 text-red-600/70 hover:bg-red-500/20 hover:text-red-400">
                <Home className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold tracking-wide text-base">BACK TO LANDING</div>
                <div className="text-xs text-red-600/50 hidden lg:block tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Return to landing page
                </div>
              </div>
            </Link>
          </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black">
            <div className="container mx-auto p-8">
              {children}
            </div>
          </main>
        </div>
      ) : (
        /* Main Content without sidebar for landing page */
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black">
          {children}
        </main>
      )}

      {/* Footer - Only show when NOT on landing page */}
      {/* The footer is now always visible as the landing page is removed */}
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
              <Link to="/docs" className="hover:text-red-400 transition-all duration-300 tracking-wide font-medium hover:scale-105 transform">
                DOCUMENTATION
              </Link>
              <Link to="/settings" className="hover:text-red-400 transition-all duration-300 tracking-wide font-medium hover:scale-105 transform">
                SETTINGS
              </Link>
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
