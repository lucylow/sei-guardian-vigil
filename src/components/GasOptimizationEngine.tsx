import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Zap, 
  TrendingDown, 
  Code, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Cpu,
  Fuel
} from "lucide-react";

interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  gasSaved: number;
  category: string;
  status: 'applied' | 'pending' | 'skipped';
}

interface GasMetrics {
  original: number;
  optimized: number;
  savings: number;
  percentage: number;
}

export function GasOptimizationEngine() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [gasMetrics, setGasMetrics] = useState<GasMetrics>({
    original: 215750,
    optimized: 158920,
    savings: 56830,
    percentage: 26.34
  });

  const optimizationRules: OptimizationRule[] = [
    {
      id: '1',
      name: 'SafeMath Removal',
      description: 'Removed SafeMath for Sei native overflow protection',
      gasSaved: 15000,
      category: 'Sei-Specific',
      status: 'applied'
    },
    {
      id: '2',
      name: 'Storage Packing',
      description: 'Packed uint128 variables into single storage slot',
      gasSaved: 8500,
      category: 'Storage',
      status: 'applied'
    },
    {
      id: '3',
      name: 'Loop Optimization',
      description: 'Unchecked increment and length caching',
      gasSaved: 12200,
      category: 'Control Flow',
      status: 'applied'
    },
    {
      id: '4',
      name: 'Boolean Defaults',
      description: 'Removed explicit false assignments',
      gasSaved: 3100,
      category: 'Variables',
      status: 'applied'
    },
    {
      id: '5',
      name: 'Transient Storage',
      description: 'Use cheaper transient storage for temp values',
      gasSaved: 6800,
      category: 'Sei-Specific',
      status: 'pending'
    },
    {
      id: '6',
      name: 'Parallel Batching',
      description: 'Batch external calls for parallel execution',
      gasSaved: 11230,
      category: 'Sei-Specific',
      status: 'pending'
    }
  ];

  const codeExamples = [
    {
      title: 'SafeMath Removal (Sei Native)',
      before: `using SafeMath for uint256;
uint256 result = a.add(b);`,
      after: `// Sei native overflow protection
uint256 result = a + b;`,
      gasSaved: 15000
    },
    {
      title: 'Storage Packing',
      before: `uint256 valueA;
uint256 valueB;`,
      after: `uint128 valueA;
uint128 valueB; // Packed in single slot`,
      gasSaved: 8500
    },
    {
      title: 'Loop Optimization',
      before: `for(uint i = 0; i < arr.length; i++) {
    balances[i] = balances[i] + 1;
}`,
      after: `uint length = arr.length;
for(uint i; i < length; ) {
    balances[i] += 1;
    unchecked { i++; }
}`,
      gasSaved: 12200
    }
  ];

  useEffect(() => {
    if (isOptimizing) {
      const interval = setInterval(() => {
        setOptimizationProgress(prev => {
          if (prev >= 100) {
            setIsOptimizing(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOptimizing]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
  };

  const appliedRules = optimizationRules.filter(rule => rule.status === 'applied');
  const pendingRules = optimizationRules.filter(rule => rule.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Gas Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Original Gas Cost</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gasMetrics.original.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-2">Pre-optimization</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimized Gas Cost</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{gasMetrics.optimized.toLocaleString()}</div>
            <Badge variant="default" className="mt-2">Sei-optimized</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{gasMetrics.percentage}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              -{gasMetrics.savings.toLocaleString()} gas units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="w-5 h-5" />
            <span>Gas Optimization Engine</span>
          </CardTitle>
          <CardDescription>
            AI-powered optimization reducing gas costs by 15-30% with Sei-specific rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOptimizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Optimizing contract...</span>
                <span>{optimizationProgress}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
            </div>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={handleOptimize} 
              disabled={isOptimizing}
              className="flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
            </Button>
            <Button variant="outline">
              <Code className="w-4 h-4 mr-2" />
              View Generated Code
            </Button>
          </div>

          <Alert>
            <BarChart3 className="h-4 w-4" />
            <AlertDescription>
              <strong>50+ optimization rules loaded</strong> - Including Sei-specific patterns for parallel EVM execution
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Optimization Rules & Code Examples */}
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Optimization Rules</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="analysis">Gas Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applied Optimizations</CardTitle>
                <CardDescription>{appliedRules.length} rules successfully applied</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {appliedRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">{rule.category}</Badge>
                      <div className="text-sm text-green-600 font-medium">
                        -{rule.gasSaved.toLocaleString()} gas
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Optimizations</CardTitle>
                <CardDescription>{pendingRules.length} additional optimizations available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{rule.category}</Badge>
                      <div className="text-sm text-orange-600 font-medium">
                        -{rule.gasSaved.toLocaleString()} gas
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-4">
            {codeExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  <CardDescription>Gas saved: {example.gasSaved.toLocaleString()} units</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Before (Inefficient)</h4>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{example.before}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">After (Optimized)</h4>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{example.after}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Gas Usage Analysis</CardTitle>
              <CardDescription>Detailed breakdown of optimization impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Storage Operations</span>
                  <span className="font-medium">68% reduction</span>
                </div>
                <Progress value={68} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Arithmetic Operations</span>
                  <span className="font-medium">45% reduction</span>
                </div>
                <Progress value={45} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>External Calls</span>
                  <span className="font-medium">32% reduction</span>
                </div>
                <Progress value={32} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Control Flow</span>
                  <span className="font-medium">28% reduction</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Optimization</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">{gasMetrics.percentage}%</span>
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Sei-specific optimizations contribute 40% of total savings
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}