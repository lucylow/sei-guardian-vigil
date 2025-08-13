import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Shield,
  Github,
  MessageSquare,
  Newspaper,
  FileText,
  Zap,
  Eye,
  Settings
} from "lucide-react";
import { SeiThreatCrawler, ThreatSource, ThreatData, CrawlResult } from "@/lib/crawlerService";

export function WebCrawlerAgent() {
  const [sources, setSources] = useState<ThreatSource[]>(SeiThreatCrawler.getDefaultSources());
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSource, setCurrentSource] = useState<string>('');

  const [metrics, setMetrics] = useState({
    totalSources: sources.length,
    enabledSources: sources.filter(s => s.enabled).length,
    threatsFound: 0,
    riskScore: 0,
    lastCrawl: Date.now() - 300000,
    crawlsToday: 23
  });

  useEffect(() => {
    // Update metrics when threats change
    const avgRisk = threats.length > 0 
      ? threats.reduce((sum, t) => sum + t.riskScore, 0) / threats.length 
      : 0;

    setMetrics(prev => ({
      ...prev,
      threatsFound: threats.length,
      riskScore: avgRisk,
      enabledSources: sources.filter(s => s.enabled).length
    }));
  }, [threats, sources]);

  const runCrawl = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setCrawlResults([]);
    setThreats([]);

    const enabledSources = sources.filter(s => s.enabled);
    const totalSources = enabledSources.length;

    for (let i = 0; i < enabledSources.length; i++) {
      const source = enabledSources[i];
      setCurrentSource(source.name);
      setProgress((i / totalSources) * 100);

      try {
        const result = await SeiThreatCrawler.crawlSource(source);
        setCrawlResults(prev => [...prev, result]);
        
        if (result.success && result.threats.length > 0) {
          setThreats(prev => [...prev, ...result.threats]);
        }
      } catch (error) {
        console.error(`Crawl failed for ${source.name}:`, error);
      }

      // Small delay between sources
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setProgress(100);
    setCurrentSource('');
    setIsRunning(false);
    setMetrics(prev => ({ ...prev, lastCrawl: Date.now(), crawlsToday: prev.crawlsToday + 1 }));
  }, [sources]);

  const toggleSource = useCallback((sourceId: string) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, enabled: !source.enabled }
        : source
    ));
  }, []);

  const handleThreatAction = useCallback((threatId: string, action: 'analyze' | 'dismiss' | 'escalate') => {
    setThreats(prev => prev.map(threat =>
      threat.id === threatId
        ? { ...threat, status: action === 'analyze' ? 'analyzed' : action === 'dismiss' ? 'dismissed' : 'escalated' }
        : threat
    ));
  }, []);

  const getSourceIcon = (type: ThreatSource['type']) => {
    switch (type) {
      case 'github': return Github;
      case 'darkweb': return Shield;
      case 'forums': return MessageSquare;
      case 'news': return Newspaper;
      case 'pastebin': return FileText;
      default: return Globe;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'default';
      case 'dismissed': return 'outline';
      case 'escalated': return 'destructive';
      case 'new': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Threat Intelligence Crawler</h2>
          <p className="text-muted-foreground">
            Multi-source threat monitoring for Sei ecosystem security
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure Sources
          </Button>
          <Button onClick={runCrawl} disabled={isRunning}>
            <Search className="w-4 h-4 mr-2" />
            {isRunning ? 'Crawling...' : 'Start Crawl'}
          </Button>
        </div>
      </div>

      {/* Real-time Status */}
      {isRunning && (
        <Card className="border-primary">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Crawling: {currentSource}</span>
                <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Scanning for Sei-related threats...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.enabledSources}</div>
            <p className="text-xs text-muted-foreground">Active Sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.threatsFound}</div>
            <p className="text-xs text-muted-foreground">Threats Found</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.riskScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Avg Risk Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{formatTimestamp(metrics.lastCrawl)}</div>
            <p className="text-xs text-muted-foreground">Last Crawl</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.crawlsToday}</div>
            <p className="text-xs text-muted-foreground">Crawls Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {threats.filter(t => t.status === 'escalated').length}
            </div>
            <p className="text-xs text-muted-foreground">Escalated</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="sources">Crawler Sources</TabsTrigger>
          <TabsTrigger value="results">Crawl Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detected Threats</CardTitle>
              <CardDescription>
                Real-time threat intelligence from monitored sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No threats detected. Run a crawl to start monitoring.</p>
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div key={threat.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{threat.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={getRiskColor(threat.sourceType === 'darkweb' ? 'critical' : 'medium')}>
                                {threat.sourceType}
                              </Badge>
                              <Badge variant={getStatusColor(threat.status)}>
                                {threat.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Risk: {threat.riskScore.toFixed(1)}/10
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatTimestamp(threat.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleThreatAction(threat.id, 'analyze')}>
                            <Eye className="w-4 h-4 mr-1" />
                            Analyze
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleThreatAction(threat.id, 'escalate')}>
                            <Zap className="w-4 h-4 mr-1" />
                            Escalate
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="mb-2">{threat.content}</p>
                        {threat.entities.contracts.length > 0 && (
                          <div>
                            <span className="font-medium">Contracts:</span> {threat.entities.contracts.join(', ')}
                          </div>
                        )}
                        {threat.entities.cves.length > 0 && (
                          <div>
                            <span className="font-medium">CVEs:</span> {threat.entities.cves.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex space-x-4">
                          <span>Source: {threat.source}</span>
                          <span>Confidence: {(threat.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleThreatAction(threat.id, 'dismiss')}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => {
              const IconComponent = getSourceIcon(source.type);
              return (
                <Card key={source.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                      </div>
                      <Switch 
                        checked={source.enabled}
                        onCheckedChange={() => toggleSource(source.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={getRiskColor(source.riskLevel)}>
                          {source.riskLevel} risk
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {source.lastCrawled ? formatTimestamp(source.lastCrawled) : 'Never'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>URL: {source.url}</p>
                        <p>Keywords: {source.keywords.slice(0, 3).join(', ')}...</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" disabled={!source.enabled}>
                          <Search className="w-4 h-4 mr-1" />
                          Test Crawl
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crawl Results</CardTitle>
              <CardDescription>Performance metrics from recent crawling operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crawlResults.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No crawl results yet. Run a crawl to see performance metrics.
                  </p>
                ) : (
                  crawlResults.map((result, index) => {
                    const source = sources.find(s => s.id === result.sourceId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <div className="font-medium">{source?.name || result.sourceId}</div>
                            <div className="text-sm text-muted-foreground">
                              {result.threatsFound} threats • {result.metadata.pagesScanned} pages • {result.metadata.crawlTime}ms
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Threat Sources Distribution</CardTitle>
                <CardDescription>Breakdown by source type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['github', 'darkweb', 'forums', 'news', 'pastebin'].map(type => {
                    const count = threats.filter(t => t.sourceType === type).length;
                    const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crawl Performance</CardTitle>
                <CardDescription>Average metrics across all sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Avg Crawl Time:</span>
                      <div className="text-2xl font-bold">
                        {crawlResults.length > 0 
                          ? Math.round(crawlResults.reduce((sum, r) => sum + r.metadata.crawlTime, 0) / crawlResults.length)
                          : 0
                        }ms
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <div className="text-2xl font-bold">
                        {crawlResults.length > 0 
                          ? Math.round((crawlResults.filter(r => r.success).length / crawlResults.length) * 100)
                          : 0
                        }%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recent Activity:</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Total Threats:</span>
                        <span className="font-mono">{metrics.threatsFound}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>High Risk:</span>
                        <span className="font-mono">{threats.filter(t => t.riskScore >= 8).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Escalated:</span>
                        <span className="font-mono">{threats.filter(t => t.status === 'escalated').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Crawler system operational with {metrics.enabledSources} active sources. 
              {threats.filter(t => t.riskScore >= 8).length} high-risk threats detected in the last crawl cycle.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}