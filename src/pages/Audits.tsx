/* Navigation is now handled by the Layout component */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { 
  FileSearch, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play,
  Pause,
  Eye,
  Download,
  Share2,
  Filter,
  Search,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  List,
  BarChart3,
  Settings
} from "lucide-react";

export default function Audits() {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Tab descriptions for each audit section
  const tabDescriptions = {
    overview: "Comprehensive audit overview and status monitoring",
    active: "Currently running and queued audit operations",
    completed: "Completed audits with results and reports",
    analytics: "Audit performance metrics and trends",
    configuration: "Audit settings and automation rules"
  };

  // Mock audit data
  const audits = [
    {
      id: "1",
      contractName: "SEI_DEX_V2",
      status: "COMPLETED",
      severity: "LOW",
      progress: 100,
      duration: "2h 15m",
      vulnerabilities: 3,
      agent: "SENTINEL-01",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      contractName: "LIQUIDITY_POOL",
      status: "IN_PROGRESS",
      severity: "MEDIUM",
      progress: 65,
      duration: "1h 30m",
      vulnerabilities: 1,
      agent: "GUARDIAN-02",
      timestamp: "1 hour ago"
    },
    {
      id: "3",
      contractName: "STAKING_CONTRACT",
      status: "QUEUED",
      severity: "HIGH",
      progress: 0,
      duration: "Pending",
      vulnerabilities: 0,
      agent: "SENTINEL-03",
      timestamp: "5 minutes ago"
    }
  ];

  const statusFilters = [
    { value: "all", label: "ALL", count: audits.length },
    { value: "completed", label: "COMPLETED", count: audits.filter(a => a.status === "COMPLETED").length },
    { value: "in_progress", label: "IN PROGRESS", count: audits.filter(a => a.status === "IN_PROGRESS").length },
    { value: "queued", label: "QUEUED", count: audits.filter(a => a.status === "QUEUED").length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-600/20 text-green-400 border-green-600/50";
      case "IN_PROGRESS": return "bg-blue-600/20 text-blue-400 border-blue-600/50";
      case "QUEUED": return "bg-yellow-600/20 text-yellow-400 border-yellow-600/50";
      default: return "bg-red-600/20 text-red-400 border-red-600/50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW": return "bg-green-600/20 text-green-400 border-green-600/50";
      case "MEDIUM": return "bg-yellow-600/20 text-yellow-400 border-yellow-600/50";
      case "HIGH": return "bg-red-600/20 text-red-400 border-red-600/50";
      case "CRITICAL": return "bg-red-800/20 text-red-300 border-red-800/50";
      default: return "bg-gray-600/20 text-gray-400 border-gray-600/50";
    }
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
                AUDIT CENTER
              </h1>
              <p className="text-lg text-red-600/70 font-medium tracking-wide">
                SMART CONTRACT SECURITY AUDITS AND VULNERABILITY ASSESSMENT
              </p>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1">
              <FileSearch className="w-5 h-5 mr-2" />
              NEW AUDIT
            </Button>
          </div>
        </div>

        {/* Audit Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">{audits.length}</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">TOTAL AUDITS</div>
              <div className="text-xs text-green-400 mt-2">+2 this week</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">1</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">ACTIVE AUDITS</div>
              <div className="text-xs text-blue-400 mt-2">In progress</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">4</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">VULNERABILITIES</div>
              <div className="text-xs text-yellow-400 mt-2">Found</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Zap className="w-5 h-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">92%</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">SUCCESS RATE</div>
              <div className="text-xs text-green-400 mt-2">+5% improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">AUDIT MANAGEMENT</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList variant="security" className="w-full">
              <TabsTrigger value="overview" variant="security" icon={<BarChart3 className="w-5 h-5" />}>
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger value="active" variant="security" icon={<Activity className="w-5 h-5" />}>
                ACTIVE
              </TabsTrigger>
              <TabsTrigger value="completed" variant="security" icon={<CheckCircle className="w-5 h-5" />}>
                COMPLETED
              </TabsTrigger>
              <TabsTrigger value="analytics" variant="security" icon={<TrendingUp className="w-5 h-5" />}>
                ANALYTICS
              </TabsTrigger>
              <TabsTrigger value="configuration" variant="security" icon={<Settings className="w-5 h-5" />}>
                CONFIG
              </TabsTrigger>
            </TabsList>
            
            <TabConnectionLine variant="security" />
            <TabDescription variant="security" descriptions={tabDescriptions} />
            
            {/* Overview Tab */}
            <TabsContent value="overview" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <BarChart3 className="w-6 h-6 text-red-400" />
                      AUDIT OVERVIEW
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {statusFilters.map((filter) => (
                        <div key={filter.value} className="text-center p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                          <div className="text-2xl font-bold text-red-300">{filter.count}</div>
                          <div className="text-sm text-red-600/70">{filter.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Active Audits Tab */}
            <TabsContent value="active" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Activity className="w-6 h-6 text-red-400" />
                      ACTIVE AUDITS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {audits.filter(audit => audit.status !== "COMPLETED").map((audit) => (
                        <div key={audit.id} className="p-4 border border-red-800/30 rounded-lg bg-red-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-red-300">{audit.contractName}</h4>
                            <Badge className={getStatusColor(audit.status)}>
                              {audit.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-red-600/70">Agent:</span>
                              <span className="text-red-300 ml-2">{audit.agent}</span>
                            </div>
                            <div>
                              <span className="text-red-600/70">Duration:</span>
                              <span className="text-red-300 ml-2">{audit.duration}</span>
                            </div>
                            <div>
                              <span className="text-red-600/70">Vulnerabilities:</span>
                              <span className="text-red-300 ml-2">{audit.vulnerabilities}</span>
                            </div>
                            <div>
                              <span className="text-red-600/70">Progress:</span>
                              <span className="text-red-300 ml-2">{audit.progress}%</span>
                            </div>
                          </div>
                          {audit.status === "IN_PROGRESS" && (
                            <Progress value={audit.progress} className="mt-3 h-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Completed Audits Tab */}
            <TabsContent value="completed" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-red-400" />
                      COMPLETED AUDITS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {audits.filter(audit => audit.status === "COMPLETED").map((audit) => (
                        <div key={audit.id} className="p-4 border border-red-800/30 rounded-lg bg-red-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-red-300">{audit.contractName}</h4>
                            <div className="flex space-x-2">
                              <Badge className={getStatusColor(audit.status)}>
                                {audit.status}
                              </Badge>
                              <Badge className={getSeverityColor(audit.severity)}>
                                {audit.severity}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-red-600/70">Agent:</span>
                              <span className="text-red-300 ml-2">{audit.agent}</span>
                            </div>
                            <div>
                              <span className="text-red-600/70">Duration:</span>
                              <span className="text-red-300 ml-2">{audit.duration}</span>
                            </div>
                            <div>
                              <span className="text-red-600/70">Vulnerabilities:</span>
                              <span className="text-red-300 ml-2">{audit.vulnerabilities}</span>
                            </div>
                            <div>
                              <span className="text-red-600/70">Completed:</span>
                              <span className="text-red-300 ml-2">{audit.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="border-red-600/50 text-red-400 hover:bg-red-900/20">
                              <Eye className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600/50 text-red-400 hover:bg-red-900/20">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <TrendingUp className="w-6 h-6 text-red-400" />
                      AUDIT ANALYTICS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-800/30">
                        <div className="text-3xl font-bold text-green-400">92%</div>
                        <div className="text-sm text-red-600/70">Success Rate</div>
                      </div>
                      <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-800/30">
                        <div className="text-3xl font-bold text-blue-400">2.1h</div>
                        <div className="text-sm text-red-600/70">Avg Duration</div>
                      </div>
                      <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-800/30">
                        <div className="text-3xl font-bold text-yellow-400">1.3</div>
                        <div className="text-sm text-red-600/70">Avg Vulnerabilities</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="configuration" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Settings className="w-6 h-6 text-red-400" />
                      AUDIT CONFIGURATION
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105">
                          <Shield className="w-4 h-4 mr-2" />
                          Security Rules
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105">
                          <Zap className="w-4 h-4 mr-2" />
                          Automation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}