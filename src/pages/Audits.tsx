/* Navigation is now handled by the Layout component */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Activity
} from "lucide-react";

export default function Audits() {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
                SECURITY AUDITS
              </h1>
              <p className="text-lg text-red-600/70 font-medium tracking-wide">
                SMART CONTRACT SECURITY ANALYSIS & VULNERABILITY DETECTION
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold px-4 py-2 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
                <Filter className="w-4 h-4 mr-2" />
                FILTERS
              </Button>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-2 transform hover:scale-105 hover:-translate-y-1">
                <FileSearch className="w-4 h-4 mr-2" />
                NEW AUDIT
              </Button>
            </div>
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
              <div className="text-3xl font-bold text-red-300 mb-2">156</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">TOTAL AUDITS</div>
              <div className="text-xs text-green-400 mt-2">+23 this month</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">142</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">COMPLETED</div>
              <div className="text-xs text-blue-400 mt-2">91% success rate</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">89</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">VULNERABILITIES</div>
              <div className="text-xs text-yellow-400 mt-2">12 critical</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50 hover:border-red-700/50 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-300 mb-2">2.4h</div>
              <div className="text-sm text-red-600/70 font-medium tracking-wide">AVG DURATION</div>
              <div className="text-xs text-purple-400 mt-2">Fast analysis</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Filters */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">FILTER BY STATUS</h3>
          <div className="flex flex-wrap gap-4">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? "default" : "outline"}
                onClick={() => setFilterStatus(filter.value)}
                className={`font-mono tracking-wide font-bold px-6 py-3 transition-all duration-300 transform hover:scale-105 ${
                  filterStatus === filter.value
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40"
                    : "border-2 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/25"
                }`}
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2 bg-red-900/30 border-red-700/50 text-red-300 font-bold">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Audits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {audits
            .filter(audit => filterStatus === "all" || audit.status.toLowerCase().replace("_", "") === filterStatus)
            .map((audit) => (
            <Card 
              key={audit.id}
              className={`group cursor-pointer transition-all duration-500 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-2 hover:border-red-500/50 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/30 ${
                selectedAudit === audit.id 
                  ? 'border-red-500/70 bg-red-900/20 shadow-xl shadow-red-500/30' 
                  : 'border-red-900/50'
              }`}
              onClick={() => setSelectedAudit(audit.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                      <FileSearch className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-300 font-mono tracking-wide group-hover:text-red-200 transition-colors duration-300">
                        {audit.contractName}
                      </h3>
                      <p className="text-sm text-red-600/70 font-medium tracking-wide">Contract Audit</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={`text-xs font-bold tracking-wide px-3 py-1 ${getStatusColor(audit.status)}`}>
                      {audit.status.replace("_", " ")}
                    </Badge>
                    <Badge className={`text-xs font-bold tracking-wide px-3 py-1 ${getSeverityColor(audit.severity)}`}>
                      {audit.severity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600/70 font-medium">PROGRESS</span>
                    <span className="text-red-300 font-bold">{audit.progress}%</span>
                  </div>
                  <Progress value={audit.progress} className="h-2 bg-red-900/30">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-red-500/50"></div>
                  </Progress>
                </div>

                {/* Audit Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">DURATION</span>
                      <span className="text-red-300 font-bold">{audit.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">AGENT</span>
                      <span className="text-red-300 font-bold">{audit.agent}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">VULNERABILITIES</span>
                      <span className="text-red-300 font-bold">{audit.vulnerabilities}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600/70 font-medium">TIMESTAMP</span>
                      <span className="text-red-300 font-bold text-xs">{audit.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    VIEW
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    REPORT
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300 transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    SHARE
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {audits.filter(audit => filterStatus === "all" || audit.status.toLowerCase().replace("_", "") === filterStatus).length === 0 && (
          <Card className="text-center py-16 bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileSearch className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-300 mb-4 tracking-wide">NO AUDITS FOUND</h3>
              <p className="text-red-600/70 font-medium tracking-wide mb-6 max-w-md mx-auto">
                NO AUDITS MATCH THE SELECTED FILTERS. TRY ADJUSTING YOUR SEARCH CRITERIA.
              </p>
              <Button 
                onClick={() => setFilterStatus("all")}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-8 py-4 transform hover:scale-105 hover:-translate-y-1"
              >
                <Eye className="w-5 h-5 mr-2" />
                VIEW ALL AUDITS
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}