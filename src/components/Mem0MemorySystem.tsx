import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Search, Brain, Zap, History, Globe } from "lucide-react";

interface MemoryEntry {
  id: string;
  type: 'short_term' | 'long_term' | 'knowledge_base';
  category: string;
  content: any;
  embedding?: number[];
  metadata: {
    timestamp: string;
    source: string;
    relevance?: number;
    tags: string[];
  };
}

interface VectorSearchResult {
  entry: MemoryEntry;
  similarity: number;
  rank: number;
}

export function Mem0MemorySystem() {
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([
    {
      id: 'mem-001',
      type: 'short_term',
      category: 'task_state',
      content: {
        taskId: 'audit-001',
        status: 'completed',
        findings: ['reentrancy_risk', 'access_control_issue'],
        confidence: 0.94
      },
      metadata: {
        timestamp: '2024-01-15 14:32:15',
        source: 'security_agent',
        tags: ['audit', 'vulnerability', 'sei_contract']
      }
    },
    {
      id: 'mem-002',
      type: 'long_term',
      category: 'vulnerability_pattern',
      content: {
        pattern: 'reentrancy_parallel_sei',
        description: 'Reentrancy vulnerability in Sei parallel execution context',
        severity: 'critical',
        exploitCode: 'function attack() { contract.withdraw(); }',
        mitigation: 'Use nonReentrant modifier with transient storage'
      },
      embedding: [0.8, 0.2, 0.9, 0.1, 0.7, 0.3, 0.6, 0.4],
      metadata: {
        timestamp: '2024-01-15 12:15:30',
        source: 'threat_intel_agent',
        relevance: 0.96,
        tags: ['reentrancy', 'sei', 'parallel_execution', 'critical']
      }
    },
    {
      id: 'mem-003',
      type: 'knowledge_base',
      category: 'audit_history',
      content: {
        contractAddress: 'sei14ja2a...xqy3',
        auditor: 'security_agent',
        vulnerabilities: [
          { type: 'reentrancy', severity: 'high', fixed: true },
          { type: 'access_control', severity: 'medium', fixed: false }
        ],
        gasOptimizations: ['storage_packing', 'loop_optimization'],
        recommendation: 'Deploy with fixes applied'
      },
      embedding: [0.6, 0.4, 0.8, 0.2, 0.9, 0.1, 0.5, 0.7],
      metadata: {
        timestamp: '2024-01-15 11:45:22',
        source: 'orchestrator_agent',
        relevance: 0.89,
        tags: ['audit_complete', 'sei_contract', 'defi']
      }
    },
    {
      id: 'mem-004',
      type: 'short_term',
      category: 'human_feedback',
      content: {
        taskId: 'remediation-003',
        feedback: 'Approve patch but require additional testing',
        approver: 'security_expert_alice',
        action: 'conditional_approval',
        requirements: ['testnet_deployment', 'formal_verification']
      },
      metadata: {
        timestamp: '2024-01-15 14:28:45',
        source: 'human_operator',
        tags: ['human_feedback', 'patch_approval', 'testing_required']
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VectorSearchResult[]>([]);
  const [newEntry, setNewEntry] = useState({
    type: 'short_term' as const,
    category: '',
    content: '',
    tags: ''
  });

  const [memoryStats, setMemoryStats] = useState({
    totalEntries: 1247,
    shortTermEntries: 156,
    longTermEntries: 891,
    knowledgeBaseEntries: 200,
    avgRetrievalTime: 23,
    cacheHitRate: 94.2,
    storageUsed: 2.3, // GB
    searchAccuracy: 97.8
  });

  const performVectorSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Simulate vector embedding for query (in production, use OpenAI/BERT)
    const queryEmbedding = query.split('').map((_, i) => Math.random());
    
    // Calculate similarity with stored entries
    const results: VectorSearchResult[] = memoryEntries
      .filter(entry => entry.embedding)
      .map(entry => {
        // Simplified cosine similarity
        const similarity = calculateSimilarity(queryEmbedding, entry.embedding!);
        return {
          entry,
          similarity,
          rank: 0
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map((result, index) => ({ ...result, rank: index + 1 }));

    setSearchResults(results);
  };

  const calculateSimilarity = (a: number[], b: number[]): number => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };

  const addMemoryEntry = () => {
    if (!newEntry.content || !newEntry.category) return;

    const entry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      type: newEntry.type,
      category: newEntry.category,
      content: newEntry.content,
      embedding: newEntry.type !== 'short_term' ? 
        Array(8).fill(0).map(() => Math.random()) : undefined,
      metadata: {
        timestamp: new Date().toLocaleString(),
        source: 'manual_input',
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }
    };

    setMemoryEntries(prev => [entry, ...prev]);
    setNewEntry({ type: 'short_term', category: '', content: '', tags: '' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate memory cleanup and optimization
      setMemoryStats(prev => ({
        ...prev,
        totalEntries: prev.totalEntries + Math.floor(Math.random() * 3),
        avgRetrievalTime: Math.max(20, prev.avgRetrievalTime + (Math.random() - 0.5) * 2),
        cacheHitRate: Math.min(100, Math.max(90, prev.cacheHitRate + (Math.random() - 0.5)))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mem0 Memory System</h2>
          <p className="text-muted-foreground">Shared memory for multi-agent knowledge and state management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Optimize Memory
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Train Embeddings
          </Button>
        </div>
      </div>

      {/* Memory Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.shortTermEntries}</div>
            <p className="text-xs text-muted-foreground">Short Term</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.longTermEntries}</div>
            <p className="text-xs text-muted-foreground">Long Term</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.knowledgeBaseEntries}</div>
            <p className="text-xs text-muted-foreground">Knowledge Base</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.avgRetrievalTime}ms</div>
            <p className="text-xs text-muted-foreground">Avg Retrieval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.cacheHitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Cache Hit Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.storageUsed}GB</div>
            <p className="text-xs text-muted-foreground">Storage Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{memoryStats.searchAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Search Accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Vector Search</TabsTrigger>
          <TabsTrigger value="entries">Memory Entries</TabsTrigger>
          <TabsTrigger value="add">Add Entry</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Semantic Search
              </CardTitle>
              <CardDescription>
                Search the memory system using natural language queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search memory... (e.g., 'reentrancy vulnerabilities in Sei contracts')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => performVectorSearch(searchQuery)}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Search Results ({searchResults.length})</h3>
                    {searchResults.map((result) => (
                      <Card key={result.entry.id} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline">#{result.rank}</Badge>
                                <Badge variant="secondary">{result.entry.type}</Badge>
                                <Badge variant="outline">{result.entry.category}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {(result.similarity * 100).toFixed(1)}% match
                                </span>
                              </div>
                              <div className="text-sm">
                                <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(result.entry.content, null, 2)}
                                </pre>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.entry.metadata.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Entries</CardTitle>
              <CardDescription>Browse all stored memory entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {memoryEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          entry.type === 'short_term' ? 'default' :
                          entry.type === 'long_term' ? 'secondary' : 'outline'
                        }>
                          {entry.type}
                        </Badge>
                        <Badge variant="outline">{entry.category}</Badge>
                        <span className="text-sm text-muted-foreground">{entry.metadata.timestamp}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.metadata.source}
                      </Badge>
                    </div>
                    
                    <div className="text-sm mb-2">
                      <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(entry.content, null, 2)}
                      </pre>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {entry.metadata.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Memory Entry</CardTitle>
              <CardDescription>Store new information in the memory system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Memory Type</label>
                    <Select value={newEntry.type} onValueChange={(value: any) => setNewEntry(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short_term">Short Term</SelectItem>
                        <SelectItem value="long_term">Long Term</SelectItem>
                        <SelectItem value="knowledge_base">Knowledge Base</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      placeholder="e.g., vulnerability_pattern, task_state"
                      value={newEntry.category}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Content (JSON)</label>
                  <Textarea
                    placeholder='{"type": "reentrancy", "severity": "high", "description": "..."}'
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    placeholder="vulnerability, sei, critical, reentrancy"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>

                <Button onClick={addMemoryEntry} disabled={!newEntry.content || !newEntry.category}>
                  <Database className="w-4 h-4 mr-2" />
                  Store in Memory
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Short Term Cache</span>
                    <span className="text-sm font-medium">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Long Term Storage</span>
                    <span className="text-sm font-medium">71.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Knowledge Base</span>
                    <span className="text-sm font-medium">15.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Efficiency</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Embedding Quality</span>
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Query Response Time</span>
                    <span className="text-sm font-medium">23ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>Vector search: "reentrancy patterns"</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>Stored: audit results for sei14ja2a...xqy3</span>
                  <span className="text-muted-foreground">5 min ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>Retrieved: threat intelligence on CVE-2023-1234</span>
                  <span className="text-muted-foreground">8 min ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>Updated: knowledge base with new exploit pattern</span>
                  <span className="text-muted-foreground">12 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}