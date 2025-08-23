import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import LandingPage from "./components/LandingPage";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Audits from "./pages/Audits";
import Security from "./pages/Security";
import NoCodeStudio from "./pages/NoCodeStudio";
import AgentArena from "./pages/AgentArena";
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";
import Docs from "./pages/Docs";
import Settings from "./pages/Settings";
import { SentinelChatbot } from "@/components/SentinelChatbot";
import { WalletProvider } from "./contexts/WalletContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WalletProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/agents" element={
                <ProtectedRoute>
                  <Agents />
                </ProtectedRoute>
              } />
              <Route path="/audits" element={
                <ProtectedRoute>
                  <Audits />
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute>
                  <Security />
                </ProtectedRoute>
              } />
              <Route path="/no-code-studio" element={
                <ProtectedRoute>
                  <NoCodeStudio />
                </ProtectedRoute>
              } />
              <Route path="/agent-arena" element={
                <ProtectedRoute>
                  <AgentArena />
                </ProtectedRoute>
              } />
              <Route path="/governance" element={
                <ProtectedRoute>
                  <Governance />
                </ProtectedRoute>
              } />
              <Route path="/demo" element={
                <ProtectedRoute>
                  <Demo />
                </ProtectedRoute>
              } />
              <Route path="/docs" element={
                <ProtectedRoute>
                  <Docs />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Place this outside your page routing/components so it's always present */}
            <SentinelChatbot />
          </Layout>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
