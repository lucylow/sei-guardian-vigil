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
  Sparkles,
  X,
  CheckCircle
} from "lucide-react";

// Deployment Modal Component
const DeploymentModal = ({ isOpen, onClose, agentType, onDeploy }: {
  isOpen: boolean;
  onClose: () => void;
  agentType?: string;
  onDeploy: (agentData: any) => void;
}) => {
  const [deploymentStep, setDeploymentStep] = useState(1);
  const [agentName, setAgentName] = useState("");
  const [selectedType, setSelectedType] = useState(agentType || "SECURITY");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAgent = {
      id: Date.now().toString(),
      name: agentName || `AGENT-${Date.now()}`,
      type: selectedType,
      level: 1,
      status: "ACTIVE",
      performance: 85,
      experience: 0,
      specializations: getDefaultSpecializations(selectedType),
      avatar: `/agent-${Math.floor(Math.random() * 3) + 1}.png`
    };
    
    onDeploy(newAgent);
    setIsDeploying(false);
    setDeploymentStep(1);
    setAgentName("");
    onClose();
  };

  const getDefaultSpecializations = (type: string) => {
    const specializations = {
      SECURITY: ["Smart Contracts", "Vulnerability Detection"],
      MONITORING: ["Network Analysis", "Threat Intelligence"],
      RESPONSE: ["Incident Response", "Forensics"],
      ANALYSIS: ["Data Processing", "Pattern Recognition"]
    };
    return specializations[type as keyof typeof specializations] || [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-red-500/50 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-300 tracking-wide">DEPLOY AGENT</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {deploymentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-400 mb-2 tracking-wide">
                AGENT NAME
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name..."
                className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-red-300 placeholder-red-600/50 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-red-400 mb-2 tracking-wide">
                AGENT TYPE
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-red-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                <option value="SECURITY">SECURITY</option>
                <option value="MONITORING">MONITORING</option>
                <option value="RESPONSE">RESPONSE</option>
                <option value="ANALYSIS">ANALYSIS</option>
              </select>
            </div>

            <Button
              onClick={() => setDeploymentStep(2)}
              disabled={!agentName.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              NEXT STEP
            </Button>
          </div>
        )}

        {deploymentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-red-300 mb-2">CONFIRM DEPLOYMENT</h3>
              <p className="text-red-600/70 text-sm">
                Deploying {agentName} as a {selectedType} agent...
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-red-600/70">Agent Name:</span>
                <span className="text-red-300 font-medium">{agentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600/70">Type:</span>
                <span className="text-red-300 font-medium">{selectedType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600/70">Initial Level:</span>
                <span className="text-red-300 font-medium">1</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeploymentStep(1)}
                className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500"
              >
                BACK
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isDeploying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    DEPLOYING...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    DEPLOY AGENT
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [deploymentAgentType, setDeploymentAgentType] = useState<string | undefined>();
  const [agents, setAgents] = useState([
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
  ]);

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

  const handleDeployAgent = (agentType?: string) => {
    setDeploymentAgentType(agentType);
    setIsDeploymentModalOpen(true);
  };

  const handleAgentDeployed = (newAgent: any) => {
    setAgents(prev => [...prev, newAgent]);
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
            <Button 
              onClick={() => handleDeployAgent()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1"
            >
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
                              onClick={() => handleDeployAgent(agent.type)}
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
                      <Button 
                        onClick={() => handleDeployAgent(type.type)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-8 py-4 transform hover:scale-105 hover:-translate-y-1"
                      >
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

      {/* Deployment Modal */}
      <DeploymentModal
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
        agentType={deploymentAgentType}
        onDeploy={handleAgentDeployed}
      />
    </div>
  );
}