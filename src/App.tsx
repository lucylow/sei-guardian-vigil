import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import WalletGate from "./components/WalletGate";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Audits from "./pages/Audits";
import Security from "./pages/Security";
import NoCodeStudio from "./pages/NoCodeStudio";
import AgentArena from "./pages/AgentArena";
import NotFound from "./pages/NotFound";
import { SentinelChatbot } from "@/components/SentinelChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WalletGate>
            <>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/audits" element={<Audits />} />
                <Route path="/security" element={<Security />} />
                <Route path="/no-code-studio" element={<NoCodeStudio />} />
                <Route path="/agent-arena" element={<AgentArena />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Place this outside your page routing/components so it's always present */}
              <SentinelChatbot />
            </>
          </WalletGate>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
