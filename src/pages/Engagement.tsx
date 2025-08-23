import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Target, 
  TrendingUp, 
  Users, 
  Activity,
  Bell,
  MessageCircle,
  Heart,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Award,
  Medal,
  Fire,
  Lightning,
  Bot,
  Sword,
  Skull,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  Globe,
  Network,
  Rocket,
  Sparkles,
  Gem,
  Diamond,
  Crown as CrownIcon,
  Star as StarIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  Bell as BellIcon,
  MessageCircle as MessageCircleIcon,
  Heart as HeartIcon,
  Eye as EyeIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  RotateCcw as RotateCcwIcon,
  Award as AwardIcon,
  Medal as MedalIcon,
  Fire as FireIcon,
  Lightning as LightningIcon,
  Bot as BotIcon,
  Sword as SwordIcon,
  Skull as SkullIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Clock as ClockIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  Globe as GlobeIcon,
  Network as NetworkIcon,
  Rocket as RocketIcon,
  Sparkles as SparklesIcon,
  Gem as GemIcon,
  Diamond as DiamondIcon
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  rank: number;
  agentType: string;
  vulnerabilitiesFound: number;
  scansCompleted: number;
  governanceParticipation: number;
  badges: string[];
  isOnline: boolean;
  lastActive: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward: string;
  category: string;
}

interface SocialFeedItem {
  id: string;
  type: "achievement" | "vulnerability" | "governance" | "upgrade" | "bounty";
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isShared: boolean;
}

interface Notification {
  id: string;
  type: "vulnerability" | "governance" | "achievement" | "bounty" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "critical";
  action?: string;
}

interface BattleArena {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  agent: {
    name: string;
    health: number;
    maxHealth: number;
    level: number;
    skills: string[];
  };
  threats: Array<{
    id: string;
    type: string;
    health: number;
    maxHealth: number;
    damage: number;
    position: { x: number; y: number };
  }>;
  score: number;
  timeElapsed: number;
  maxTime: number;
}

export default function Engagement() {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [socialFeed, setSocialFeed] = useState<SocialFeedItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [battleArenas, setBattleArenas] = useState<BattleArena[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: "SEI Guardian",
    level: 15,
    xp: 1250,
    maxXp: 2000,
    rank: "Elite",
    totalScore: 8750,
    achievements: 23,
    badges: 12
  });

  // Mock data initialization
  useEffect(() => {
    // Leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: "1",
        name: "AgentX",
        avatar: "/api/placeholder/40/40",
        score: 15850,
        level: 25,
        rank: 1,
        agentType: "Security Sentinel",
        vulnerabilitiesFound: 47,
        scansCompleted: 1250,
        governanceParticipation: 89,
        badges: ["First Place", "Vulnerability Hunter", "Governance Master"],
        isOnline: true,
        lastActive: "2 minutes ago"
      },
      {
        id: "2",
        name: "SentinelAI",
        avatar: "/api/placeholder/40/40",
        score: 14230,
        level: 22,
        rank: 2,
        agentType: "AI Defender",
        vulnerabilitiesFound: 38,
        scansCompleted: 980,
        governanceParticipation: 76,
        badges: ["Second Place", "AI Master", "Quick Scanner"],
        isOnline: true,
        lastActive: "5 minutes ago"
      },
      {
        id: "3",
        name: "BlockWatcher",
        avatar: "/api/placeholder/40/40",
        score: 12890,
        level: 20,
        rank: 3,
        agentType: "Block Monitor",
        vulnerabilitiesFound: 35,
        scansCompleted: 890,
        governanceParticipation: 65,
        badges: ["Third Place", "Block Master", "Eagle Eye"],
        isOnline: false,
        lastActive: "1 hour ago"
      },
      {
        id: "4",
        name: "CryptoGuard",
        avatar: "/api/placeholder/40/40",
        score: 11560,
        level: 18,
        rank: 4,
        agentType: "Crypto Protector",
        vulnerabilitiesFound: 28,
        scansCompleted: 720,
        governanceParticipation: 58,
        badges: ["Crypto Expert", "Guardian"],
        isOnline: true,
        lastActive: "15 minutes ago"
      },
      {
        id: "5",
        name: "DeFiShield",
        avatar: "/api/placeholder/40/40",
        score: 10240,
        level: 16,
        rank: 5,
        agentType: "DeFi Defender",
        vulnerabilitiesFound: 25,
        scansCompleted: 650,
        governanceParticipation: 52,
        badges: ["DeFi Master", "Shield Bearer"],
        isOnline: false,
        lastActive: "2 hours ago"
      }
    ];

    // Achievements data
    const mockAchievements: Achievement[] = [
      {
        id: "1",
        title: "First Scan",
        description: "Complete your first security scan",
        icon: <Eye className="w-6 h-6" />,
        rarity: "common",
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        unlockedAt: "2024-01-15",
        reward: "10 XP",
        category: "Scanning"
      },
      {
        id: "2",
        title: "Vulnerability Hunter",
        description: "Find 10 vulnerabilities",
        icon: <Target className="w-6 h-6" />,
        rarity: "rare",
        progress: 8,
        maxProgress: 10,
        unlocked: false,
        reward: "100 XP + Hunter Badge",
        category: "Security"
      },
      {
        id: "3",
        title: "Governance Master",
        description: "Participate in 50 governance votes",
        icon: <Crown className="w-6 h-6" />,
        rarity: "epic",
        progress: 23,
        maxProgress: 50,
        unlocked: false,
        reward: "500 XP + Governance Badge",
        category: "Governance"
      },
      {
        id: "4",
        title: "Scan Master",
        description: "Complete 1000 scans",
        icon: <Shield className="w-6 h-6" />,
        rarity: "legendary",
        progress: 1250,
        maxProgress: 1000,
        unlocked: true,
        unlockedAt: "2024-02-01",
        reward: "1000 XP + Master Badge",
        category: "Scanning"
      },
      {
        id: "5",
        title: "Zero-Day Hero",
        description: "Discover a critical zero-day vulnerability",
        icon: <Fire className="w-6 h-6" />,
        rarity: "legendary",
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        reward: "5000 XP + Hero Badge",
        category: "Security"
      }
    ];

    // Social feed data
    const mockSocialFeed: SocialFeedItem[] = [
      {
        id: "1",
        type: "achievement",
        user: { name: "AgentX", avatar: "/api/placeholder/32/32", level: 25 },
        content: "🎉 Just unlocked 'Scan Master' achievement! 1000 scans completed!",
        timestamp: "2 minutes ago",
        likes: 24,
        comments: 8,
        shares: 3,
        isLiked: true,
        isShared: false
      },
      {
        id: "2",
        type: "vulnerability",
        user: { name: "SentinelAI", avatar: "/api/placeholder/32/32", level: 22 },
        content: "🚨 Critical vulnerability detected in lending protocol! Agent successfully blocked exploit attempt.",
        timestamp: "15 minutes ago",
        likes: 18,
        comments: 12,
        shares: 7,
        isLiked: false,
        isShared: true
      },
      {
        id: "3",
        type: "governance",
        user: { name: "BlockWatcher", avatar: "/api/placeholder/32/32", level: 20 },
        content: "🗳️ New governance proposal submitted: 'Enhanced AI Model Integration' - Vote now!",
        timestamp: "1 hour ago",
        likes: 31,
        comments: 15,
        shares: 9,
        isLiked: true,
        isShared: false
      },
      {
        id: "4",
        type: "bounty",
        user: { name: "CryptoGuard", avatar: "/api/placeholder/32/32", level: 18 },
        content: "💰 Bounty claimed! Found reentrancy vulnerability in DEX contract. 500 SEI earned!",
        timestamp: "2 hours ago",
        likes: 42,
        comments: 20,
        shares: 12,
        isLiked: false,
        isShared: false
      }
    ];

    // Notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "vulnerability",
        title: "New Vulnerability Detected",
        message: "Your agent 'GuardianBot' found a potential reentrancy issue in contract 0x1234...",
        timestamp: "5 minutes ago",
        read: false,
        priority: "high"
      },
      {
        id: "2",
        type: "governance",
        title: "Governance Vote Required",
        message: "Proposal 'Enhanced Security Protocols' is now open for voting. Deadline: 24 hours.",
        timestamp: "1 hour ago",
        read: false,
        priority: "medium"
      },
      {
        id: "3",
        type: "achievement",
        title: "Achievement Unlocked!",
        message: "Congratulations! You've earned the 'Vulnerability Hunter' badge.",
        timestamp: "2 hours ago",
        read: true,
        priority: "low"
      }
    ];

    // Battle arena data
    const mockBattleArenas: BattleArena[] = [
      {
        id: "1",
        name: "Main Security Arena",
        status: "active",
        agent: {
          name: "GuardianBot",
          health: 85,
          maxHealth: 100,
          level: 15,
          skills: ["Firewall", "Anomaly Detection", "Threat Blocking"]
        },
        threats: [
          {
            id: "threat1",
            type: "Reentrancy Attack",
            health: 60,
            maxHealth: 100,
            damage: 15,
            position: { x: 300, y: 150 }
          },
          {
            id: "threat2",
            type: "Flash Loan Exploit",
            health: 40,
            maxHealth: 80,
            damage: 20,
            position: { x: 450, y: 200 }
          }
        ],
        score: 1250,
        timeElapsed: 45,
        maxTime: 120
      }
    ];

    setLeaderboard(mockLeaderboard);
    setAchievements(mockAchievements);
    setSocialFeed(mockSocialFeed);
    setNotifications(mockNotifications);
    setBattleArenas(mockBattleArenas);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update leaderboard scores
      setLeaderboard(prev => prev.map(entry => ({
        ...entry,
        score: entry.score + Math.floor(Math.random() * 10)
      })));

      // Add new social feed items
      const newFeedItem: SocialFeedItem = {
        id: Date.now().toString(),
        type: "achievement",
        user: { name: "RandomUser", avatar: "/api/placeholder/32/32", level: Math.floor(Math.random() * 20) + 1 },
        content: "🎯 Just completed another security scan!",
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isShared: false
      };
      setSocialFeed(prev => [newFeedItem, ...prev.slice(0, 9)]);

      // Update battle arena
      setBattleArenas(prev => prev.map(arena => ({
        ...arena,
        score: arena.score + Math.floor(Math.random() * 25),
        timeElapsed: arena.timeElapsed + 1
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle social interactions
  const handleLike = (feedId: string) => {
    setSocialFeed(prev => prev.map(item => 
      item.id === feedId 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const handleShare = (feedId: string) => {
    setSocialFeed(prev => prev.map(item => 
      item.id === feedId 
        ? { ...item, isShared: !item.isShared, shares: item.isShared ? item.shares - 1 : item.shares + 1 }
        : item
    ));
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "text-blue-400";
      case "epic": return "text-purple-400";
      case "legendary": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  // Get rarity border
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-400";
      case "rare": return "border-blue-400";
      case "epic": return "border-purple-400";
      case "legendary": return "border-yellow-400";
      default: return "border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/20 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-green-500" />
            SEI Sentinel Engagement Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compete, achieve, and connect with the SEI blockchain security community. 
            Track your progress, unlock achievements, and battle threats in real-time.
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-green-500">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-green-600 text-white text-xl font-bold">
                    {userProfile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-green-400">{userProfile.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Level {userProfile.level}</span>
                    <span>Rank: {userProfile.rank}</span>
                    <span>Total Score: {userProfile.totalScore.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{userProfile.achievements}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
                <div className="text-2xl font-bold text-blue-400 mt-2">{userProfile.badges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Experience Progress</span>
                <span>{userProfile.xp} / {userProfile.maxXp} XP</span>
              </div>
              <Progress value={(userProfile.xp / userProfile.maxXp) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Panel */}
        <div className="fixed top-20 right-4 w-80 z-50">
          <Card className="bg-black/90 border-green-500/30 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-green-500" />
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        notification.read 
                          ? 'bg-gray-900/50 border-gray-700' 
                          : 'bg-green-900/20 border-green-500/50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.priority === 'critical' ? 'bg-red-500' :
                          notification.priority === 'high' ? 'bg-orange-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                          <div className="text-xs text-muted-foreground mt-2">{notification.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Social Feed
            </TabsTrigger>
            <TabsTrigger value="battle" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Battle Arena
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top Agents Leaderboard
                </CardTitle>
                <CardDescription>
                  Real-time ranking of the most effective security agents on SEI network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:bg-gray-900/20 ${
                        index === 0 ? 'bg-yellow-900/20 border-yellow-500/50' :
                        index === 1 ? 'bg-gray-800/20 border-gray-500/50' :
                        index === 2 ? 'bg-orange-900/20 border-orange-500/50' :
                        'bg-gray-900/10 border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-center min-w-[3rem]">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <Avatar className="w-12 h-12 border-2 border-green-500">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {entry.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{entry.name}</h3>
                            {entry.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Level {entry.level} • {entry.agentType}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {entry.score.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Score</div>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span>🔍 {entry.scansCompleted}</span>
                          <span>🎯 {entry.vulnerabilitiesFound}</span>
                          <span>🗳️ {entry.governanceParticipation}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`transition-all hover:scale-105 ${
                    achievement.unlocked ? 'border-green-500/50 bg-green-900/10' : 'border-gray-700'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-full border-2 ${getRarityBorder(achievement.rarity)}`}>
                        <div className={getRarityColor(achievement.rarity)}>
                          {achievement.icon}
                        </div>
                      </div>
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span>Reward</span>
                        <span className="text-green-400 font-medium">{achievement.reward}</span>
                      </div>
                      {achievement.unlocked && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Unlocked {achievement.unlockedAt}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Feed Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Community Activity Feed
                </CardTitle>
                <CardDescription>
                  Real-time updates from the SEI Sentinel community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialFeed.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-700 rounded-lg hover:bg-gray-900/20 transition-all">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={item.user.avatar} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {item.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{item.user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Level {item.user.level}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                          </div>
                          <p className="text-sm mb-3">{item.content}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button
                              onClick={() => handleLike(item.id)}
                              className={`flex items-center gap-1 hover:text-green-400 transition-colors ${
                                item.isLiked ? 'text-green-400' : 'text-muted-foreground'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                              {item.likes}
                            </button>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-400 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              {item.comments}
                            </button>
                            <button
                              onClick={() => handleShare(item.id)}
                              className={`flex items-center gap-1 hover:text-purple-400 transition-colors ${
                                item.isShared ? 'text-purple-400' : 'text-muted-foreground'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                              {item.shares}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Battle Arena Tab */}
          <TabsContent value="battle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sword className="w-5 h-5 text-red-500" />
                  Agent Battle Arena
                </CardTitle>
                <CardDescription>
                  Watch your security agents battle threats in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {battleArenas.map((arena) => (
                    <div key={arena.id} className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{arena.name}</h3>
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant={arena.status === 'active' ? 'default' : 'secondary'}
                            className={arena.status === 'active' ? 'bg-green-600' : ''}
                          >
                            {arena.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Score: {arena.score.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Battle Visualization */}
                      <div className="relative h-64 bg-gradient-to-b from-gray-900 to-black rounded-lg border border-gray-700 overflow-hidden">
                        {/* Agent */}
                        <div className="absolute bottom-4 left-8 flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-400 shadow-lg shadow-green-500/50">
                            <Bot className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium text-green-400">{arena.agent.name}</div>
                            <div className="text-xs text-muted-foreground">Level {arena.agent.level}</div>
                          </div>
                        </div>

                        {/* Health Bar */}
                        <div className="absolute top-4 left-8 w-32">
                          <div className="text-xs text-muted-foreground mb-1">Health</div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(arena.agent.health / arena.agent.maxHealth) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-green-400 mt-1">
                            {arena.agent.health}/{arena.agent.maxHealth}
                          </div>
                        </div>

                        {/* Threats */}
                        {arena.threats.map((threat) => (
                          <div
                            key={threat.id}
                            className="absolute"
                            style={{ left: threat.position.x, top: threat.position.y }}
                          >
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center border-2 border-red-400 shadow-lg shadow-red-500/50 animate-pulse">
                              <Skull className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center mt-2">
                              <div className="text-xs font-medium text-red-400">{threat.type}</div>
                              <div className="text-xs text-muted-foreground">
                                HP: {threat.health}/{threat.maxHealth}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Battle Effects */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                        </div>

                        {/* Time and Controls */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Time</div>
                            <div className="text-lg font-bold text-blue-400">
                              {Math.floor(arena.timeElapsed / 60)}:{(arena.timeElapsed % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Pause className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Agent Skills */}
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Active Skills:</div>
                        <div className="flex gap-2">
                          {arena.agent.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Network Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-500" />
                    Network Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Scan Latency</span>
                      <span className="font-medium text-green-400">~400ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Agents</span>
                      <span className="font-medium text-blue-400">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Threats Averted</span>
                      <span className="font-medium text-red-400">89</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-green-400">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Community Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Users</span>
                      <span className="font-medium text-green-400">2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Today</span>
                      <span className="font-medium text-blue-400">1,156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Governance Participation</span>
                      <span className="font-medium text-purple-400">67.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New Users (24h)</span>
                      <span className="font-medium text-yellow-400">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Achievement Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Achievements</span>
                      <span className="font-medium text-yellow-400">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Unlocked</span>
                      <span className="font-medium text-green-400">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="font-medium text-blue-400">14.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Next Achievement</span>
                      <span className="font-medium text-purple-400">Vulnerability Hunter</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Global Activity (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3Icon className="w-12 h-12 mx-auto mb-2" />
                    <p>Activity chart visualization</p>
                    <p className="text-sm">Real-time data integration coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
