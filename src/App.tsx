import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Audits from "./pages/Audits";
import Security from "./pages/Security";
import NoCodeStudio from "./pages/NoCodeStudio";
import NotFound from "./pages/NotFound";
import { SentinelChatbot } from "@/components/SentinelChatbot";

// SEI SENTINEL Frontend Pages
import Login from "./pages/Login";
import UploadScan from "./pages/UploadScan";
import ScanResult from "./pages/ScanResult";
import Monitoring from "./pages/Monitoring";
import Integrations from "./pages/Integrations";
import Alerts from "./pages/Alerts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <>
          <Routes>
            {/* SEI SENTINEL Frontend Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadScan />} />
            <Route path="/result/:scanId" element={<ScanResult />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/alerts" element={<Alerts />} />
            
            {/* Existing SEI Guardian Vigil Routes */}
            <Route path="/guardian" element={<Index />} />
            <Route path="/guardian/dashboard" element={<Dashboard />} />
            <Route path="/guardian/agents" element={<Agents />} />
            <Route path="/guardian/audits" element={<Audits />} />
            <Route path="/guardian/security" element={<Security />} />
            <Route path="/guardian/no-code-studio" element={<NoCodeStudio />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Place this outside your page routing/components so it's always present */}
          <SentinelChatbot />
        </>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
