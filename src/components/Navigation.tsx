import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, BarChart3, Users, FileSearch, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Shield },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/agents", label: "Agents", icon: Users },
    { to: "/audits", label: "Audits", icon: FileSearch },
    { to: "/security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">SEI Sentinel</span>
          </Link>
          
          <div className="flex items-center space-x-1">
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
        </div>
      </div>
    </nav>
  );
}