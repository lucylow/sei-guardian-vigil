import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, BarChart3, Users, FileSearch, ShieldCheck, Sword, Wallet, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const location = useLocation();
  const { walletInfo, disconnectWallet } = useWallet();

  const navItems = [
    { to: "/", label: "Home", icon: Shield },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/no-code-studio", label: "No-Code Studio", icon: FileSearch },
    { to: "/agents", label: "Agents", icon: Users },
    { to: "/audits", label: "Audits", icon: FileSearch },
    { to: "/security", label: "Security", icon: ShieldCheck },
    { to: "/agent-arena", label: "Agent Arena", icon: Sword },
  ];

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">SEI Sentinel</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={to} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* Wallet Info */}
          {walletInfo && (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {walletInfo.type}
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <span className="hidden sm:inline">
                      {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                    </span>
                    <span className="sm:hidden">Wallet</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center space-x-2" onClick={disconnectWallet}>
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-card">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between overflow-x-auto space-x-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "default" : "ghost"}
                size="sm"
                asChild
                className="whitespace-nowrap"
              >
                <Link to={to} className="flex items-center space-x-1">
                  <Icon className="w-3 h-3" />
                  <span className="text-xs">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}