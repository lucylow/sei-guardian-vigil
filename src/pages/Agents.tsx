/* Navigation is now handled by the Layout component */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Zap, 
  Shield, 
  Target, 
  TrendingUp, 
  Activity,
  Star,
  Crown,
  Sword,
  Brain,
  Sparkles
} from "lucide-react";

export default function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Mock agent data
  const agents = [
    {
      id: "1",
      name: "SENTINEL-01",
      type: "SECURITY",
      level: 8,
      status: "ACTIVE",
      performance: 94,
      experience: 1250,
      specializations: ["Smart Contracts", "Vulnerability Detection"],
      avatar: "/agent-1.png"
    },
    {
      id: "2",
      name: "GUARDIAN-02",
      type: "MONITORING",
      level: 6,
      status: "ACTIVE",
      performance: 87,
      experience: 890,
      specializations: ["Network Analysis", "Threat Intelligence"],
      avatar: "/agent-2.png"
    },
    {
      id: "3",
      name: "SENTINEL-03",
      type: "RESPONSE",
      level: 9,
      status: "ACTIVE",
      performance: 96,
      experience: 2100,
      specializations: ["Incident Response", "Forensics"],
      avatar: "/agent-3.png"
    }
  ];

  const agentTypes = [
    { type: "SECURITY", icon: Shield, color: "text-red-400", bgColor: "bg-red-500/10" },
    { type: "MONITORING", icon: Activity, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { type: "RESPONSE", icon: Zap, color: "text-green-400", bgColor: "bg-green-500/10" },
    { type: "ANALYSIS", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-500/10" }
  ];

  // Tab descriptions for each category
  const tabDescriptions = {
    SECURITY: "Security specialists focused on threat detection and prevention",
    MONITORING: "Monitoring agents that track network activity and anomalies",
    RESPONSE: "Response teams that handle incidents and deploy countermeasures",
    ANALYSIS: "Analytical agents that process data and generate insights"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-3 tracking-wider">
                AGENT MANAGEMENT
              </h1>
              <p className="text-lg text-red-600/70 font-medium tracking-wide">
                DEPLOY, TRAIN, AND MANAGE YOUR AI SECURITY AGENTS
              </p>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1">
              <Plus className="w-5 h-5 mr-2" />
              DEPLOY AGENT
            </Button>
          </div>
        </div>

        {/* Agent Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">24</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">TOTAL AGENTS</div>
              <div className="text-xs text-green-400 mt-2">+3 this week</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">18</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">ACTIVE AGENTS</div>
              <div className="text-xs text-blue-400 mt-2">75% deployment</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">92%</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">AVG PERFORMANCE</div>
              <div className="text-xs text-yellow-400 mt-2">+5% improvement</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">3</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">ELITE AGENTS</div>
              <div className="text-xs text-purple-400 mt-2">Level 9+</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">AGENT CATEGORIES</h3>
          <Tabs defaultValue="SECURITY" className="w-full">
            <TabsList variant="security" className="w-full">
              {agentTypes.map((type) => (
                <TabsTrigger
                  key={type.type}
                  value={type.type}
                  variant="security"
                  icon={<type.icon className="w-5 h-5" />}
                >
                  {type.type}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabConnectionLine variant="security" />
            <TabDescription variant="security" descriptions={tabDescriptions} />
            
            {/* Tab Content for each category */}
            {agentTypes.map((type) => (
              <TabsContent key={type.type} value={type.type} variant="security">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {agents
                    .filter(agent => agent.type === type.type)
                    .map((agent) => (
                      <Card 
                        key={agent.id}
                        className={`group cursor-pointer transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-2 hover:border-red-500/50 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/30 ${
                          selectedAgent === agent.id 
                            ? 'border-red-500/70 bg-red-900/20 shadow-xl shadow-red-500/30' 
                            : 'border-red-900/50'
                        }`}
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <Avatar className="w-16 h-16 border-2 border-red-600/50 group-hover:border-red-500 transition-all duration-300">
                              <AvatarImage src={agent.avatar} alt={agent.name} />
                              <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-lg">
                                {agent.name.split('-')[1]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs font-bold tracking-wide px-3 py-1 ${
                                  agent.status === 'ACTIVE' 
                                    ? 'bg-green-600/20 text-green-400 border-green-600/50' 
                                    : 'bg-red-600/20 text-red-400 border-red-600/50'
                                }`}
                              >
                                {agent.status}
                              </Badge>
                              <div className="text-xs text-red-600/70 mt-1 font-medium">LEVEL {agent.level}</div>
                            </div>
                          </div>
                          <CardTitle className="text-red-300 font-mono tracking-wide text-xl group-hover:text-red-200 transition-colors duration-300">
                            {agent.name}
                          </CardTitle>
                          <CardDescription className="text-red-600/70 font-mono tracking-wide font-medium">
                            {agent.type} SPECIALIST
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Performance Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-red-600/70 font-medium">PERFORMANCE</span>
                              <span className="text-red-300 font-bold">{agent.performance}%</span>
                            </div>
                            <div className="w-full bg-red-900/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-red-500/50"
                                style={{ width: `${agent.performance}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Experience */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-600/70 font-medium">EXPERIENCE</span>
                            <span className="text-red-300 font-bold">{agent.experience.toLocaleString()} XP</span>
                          </div>

                          {/* Specializations */}
                          <div className="space-y-2">
                            <span className="text-xs text-red-600/70 font-medium tracking-wide">SPECIALIZATIONS</span>
                            <div className="flex flex-wrap gap-2">
                              {agent.specializations.map((spec, index) => (
                                <Badge 
                                  key={index}
                                  variant="outline" 
                                  className="text-xs bg-red-900/20 border-red-700/50 text-red-400 font-mono tracking-wide"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105"
                            >
                              <Sword className="w-3 h-3 mr-1" />
                              DEPLOY
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105"
                            >
                              <Brain className="w-3 h-3 mr-1" />
                              TRAIN
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                
                {/* Empty State for this category */}
                {agents.filter(agent => agent.type === type.type).length === 0 && (
                  <Card className="text-center py-16 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                    <CardContent>
                      <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-red-300 mb-4 tracking-wide">NO {type.type} AGENTS</h3>
                      <p className="text-red-600/70 font-medium tracking-wide mb-6 max-w-md mx-auto">
                        NO {type.type} SPECIALISTS ARE CURRENTLY DEPLOYED. DEPLOY A NEW AGENT TO GET STARTED.
                      </p>
                      <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-8 py-4 transform hover:scale-105 hover:-translate-y-1">
                        <Plus className="w-5 h-5 mr-2" />
                        DEPLOY {type.type} AGENT
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}