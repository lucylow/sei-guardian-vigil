import { Navigation } from "@/components/Navigation";
import { SentinelGameDashboard } from "@/components/SentinelGameDashboard";
import { AgentArena } from "@/components/AgentArena";

export default function AgentArenaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Agent Arena
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Watch AI agents battle vulnerabilities in real-time. Gamified security where agents compete to protect the Sei ecosystem.
          </p>
        </div>
      </section>

      {/* Gamified Dashboard */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <SentinelGameDashboard />
        </div>
      </section>

      {/* Agent Arena Component */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <AgentArena />
        </div>
      </section>
    </div>
  );
}