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
          <Routes>
            {/* Landing page route - no layout */}
            <Route path="/" element={<LandingPage />} />
            
            {/* App routes - with layout */}
            <Route path="/dashboard" element={
              <Layout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/agents" element={
              <Layout>
                <ProtectedRoute>
                  <Agents />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/audits" element={
              <Layout>
                <ProtectedRoute>
                  <Audits />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/security" element={
              <Layout>
                <ProtectedRoute>
                  <Security />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/no-code-studio" element={
              <Layout>
                <ProtectedRoute>
                  <NoCodeStudio />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/agent-arena" element={
              <Layout>
                <ProtectedRoute>
                  <AgentArena />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/governance" element={
              <Layout>
                <ProtectedRoute>
                  <Governance />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/demo" element={
              <Layout>
                <ProtectedRoute>
                  <Demo />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/docs" element={
              <Layout>
                <ProtectedRoute>
                  <Docs />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </Layout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* SentinelChatbot - always present */}
          <SentinelChatbot />
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
