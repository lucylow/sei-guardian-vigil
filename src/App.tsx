import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import LandingPage from "./components/LandingPage";

import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Audits from "./pages/Audits";
import Security from "./pages/Security";
import NoCodeStudio from "./pages/NoCodeStudio";
import AgentArena from "./pages/AgentArena";
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";

import Docs from "./pages/Docs";
import Settings from "./pages/Settings";
import { SentinelChatbot } from "@/components/SentinelChatbot";
import { WalletProvider } from "./contexts/WalletContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-400 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">Please refresh the page to continue</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;
