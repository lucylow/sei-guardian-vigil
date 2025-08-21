import { Navigation } from "@/components/Navigation";
import { AgentArena } from "@/components/AgentArena";

export default function AgentArenaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <AgentArena />
      </main>
    </div>
  );
}