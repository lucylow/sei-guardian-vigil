import { Navigation } from "@/components/Navigation";
import { SentinelGameDashboard } from "@/components/SentinelGameDashboard";
import { MatrixNFTDashboard } from "@/components/MatrixNFTDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, 
  Trophy, 
  Coins, 
  Users, 
  Zap, 
  Target, 
  Shield, 
  Flame,
  Crown,
  Star,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";

export default function AgentArenaPage() {
  // Game stats for the header
  const gameStats = {
    totalPlayers: 1247,
    activeBattles: 23,
    totalRewards: 156420,
    topAgent: "StaticGuardian"
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Game Header - Status and Stats */}
      <section className="relative py-6 px-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-b border-green-500/20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Game Title & Status */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                <Gamepad2 className="w-8 h-8 text-green-400" />
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Digital Sentinels Arena
                </h1>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  LIVE
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Choose your Oracle • Hunt Exploits • Earn $SENT
              </p>
            </div>

            {/* Live Game Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{gameStats.totalPlayers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Users className="w-3 h-3 mr-1" />
                  Players
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{gameStats.activeBattles}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Live Battles
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{gameStats.totalRewards.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Coins className="w-3 h-3 mr-1" />
                  $SENT Pool
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{gameStats.topAgent}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Crown className="w-3 h-3 mr-1" />
                  Top Agent
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Briefing */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Mission */}
            <Card className="lg:col-span-2 border-red-500/30 bg-gradient-to-r from-red-900/10 to-orange-900/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-400">
                  <Target className="w-5 h-5" />
                  <span>🚨 URGENT: Matrix Breach Detected</span>
                </CardTitle>
                <CardDescription>
                  Critical vulnerabilities have infiltrated the Sei ecosystem. Deploy your Digital Sentinels immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Threat Level</span>
                    <Badge variant="destructive">CRITICAL</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mission Progress</span>
                      <span>67/100 Agents Deployed</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-400">Mission ends in 2h 34m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="border-yellow-500/30 bg-gradient-to-r from-yellow-900/10 to-amber-900/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-400">
                  <Trophy className="w-5 h-5" />
                  <span>Top Sentinels</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">StaticGuardian</span>
                  </div>
                  <span className="text-sm text-yellow-400">2,340 $SENT</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">PatchMaster</span>
                  </div>
                  <span className="text-sm text-gray-400">3,200 $SENT</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">DarkWebScout</span>
                  </div>
                  <span className="text-sm text-orange-400">1,890 $SENT</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Game Interface - Agent Collection & Management */}
      <section className="py-8 px-4 bg-gradient-to-b from-background to-slate-900/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Digital Sentinels</h2>
            <p className="text-muted-foreground">
              Collect, upgrade, and deploy your AI agents to protect the Matrix
            </p>
          </div>
          <MatrixNFTDashboard />
        </div>
      </section>

      {/* Battle Arena & Live Activity */}
      <section className="py-8 px-4 border-t border-green-500/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-green-400" />
              <span>Live Battle Arena</span>
            </h2>
            <p className="text-muted-foreground">Real-time agent battles and system monitoring</p>
          </div>
          <SentinelGameDashboard />
        </div>
      </section>

      {/* Game Events & Rewards */}
      <section className="py-8 px-4 bg-gradient-to-r from-purple-900/10 to-pink-900/10 border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Events */}
            <Card className="border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-400">
                  <Flame className="w-5 h-5" />
                  <span>🎯 Zion Uprising Event</span>
                </CardTitle>
                <CardDescription>
                  Limited-time event with enhanced rewards and exclusive NFT drops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Event Progress</span>
                    <span className="text-sm text-purple-400">Phase 2/3</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-400">2.5x</div>
                      <div className="text-xs text-muted-foreground">Reward Multiplier</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-pink-400">48h</div>
                      <div className="text-xs text-muted-foreground">Time Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-400">
                  <Award className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded bg-green-900/20">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">First Blood</div>
                    <div className="text-xs text-muted-foreground">Detected your first vulnerability</div>
                  </div>
                  <Badge variant="outline" className="text-yellow-400">+100 $SENT</Badge>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded bg-purple-900/20">
                  <Star className="w-4 h-4 text-purple-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Agent Collector</div>
                    <div className="text-xs text-muted-foreground">Own 3+ different agent types</div>
                  </div>
                  <Badge variant="outline" className="text-purple-400">+250 $SENT</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}