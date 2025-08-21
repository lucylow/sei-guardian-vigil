import { Navigation } from "@/components/Navigation";
import { SentinelGameDashboard } from "@/components/SentinelGameDashboard";
import { MatrixNFTDashboard } from "@/components/MatrixNFTDashboard";
import "../styles/matrix-effects.css";

export default function AgentArenaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Matrix Theme */}
      <section className="relative py-12 px-4 overflow-hidden">
        {/* Matrix Grid Background */}
        <div className="absolute inset-0 matrix-grid opacity-20"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 gradient-text-animate">
            Agent Arena
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Enter the Matrix. Deploy your Digital Sentinels. Hunt vulnerabilities. 
            <span className="text-green-400 font-semibold"> Choose the Red Pill.</span>
          </p>
          
          {/* Matrix Breach Alert */}
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-6 max-w-2xl mx-auto matrix-pulse">
            <div className="flex items-center justify-center space-x-3 text-red-400 mb-3">
              <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-bold">Matrix Breach Detected</span>
            </div>
            <p className="text-red-300">
              New vulnerabilities have breached the Sei ecosystem. 
              Deploy your AI Sentinels now to protect the Matrix!
            </p>
          </div>
        </div>
      </section>

      {/* Matrix NFT Dashboard */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <MatrixNFTDashboard />
        </div>
      </section>

      {/* Legacy Components (Optional) */}
      <section className="py-8 px-4 border-t border-green-500/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Classic Arena Mode</h2>
            <p className="text-muted-foreground">Traditional agent management and battle system</p>
          </div>
          <SentinelGameDashboard />
        </div>
      </section>
    </div>
  );
}