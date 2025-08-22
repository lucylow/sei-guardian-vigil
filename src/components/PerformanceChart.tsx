import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, DollarSign, Shield } from "lucide-react";

interface PerformanceData {
  name: string;
  avgDetectionTimeMs: number;
  avgCostPerScan: number;
  throughput: number;
  finalityTime: number;
}

interface CostComparison {
  network: string;
  cost: number;
  currency: string;
}

const performanceData: PerformanceData[] = [
  { 
    name: 'Sei Network', 
    avgDetectionTimeMs: 450, 
    avgCostPerScan: 0.001, 
    throughput: 20000,
    finalityTime: 0.5
  },
  { 
    name: 'Ethereum', 
    avgDetectionTimeMs: 3000, 
    avgCostPerScan: 0.5, 
    throughput: 15,
    finalityTime: 12
  },
  { 
    name: 'Polygon', 
    avgDetectionTimeMs: 1200, 
    avgCostPerScan: 0.05, 
    throughput: 65,
    finalityTime: 2
  },
  { 
    name: 'Arbitrum', 
    avgDetectionTimeMs: 800, 
    avgCostPerScan: 0.02, 
    throughput: 40,
    finalityTime: 1
  },
  { 
    name: 'Solana', 
    avgDetectionTimeMs: 600, 
    avgCostPerScan: 0.001, 
    throughput: 65000,
    finalityTime: 0.4
  }
];

const costComparison: CostComparison[] = [
  { network: 'Sei', cost: 0.001, currency: 'SEI' },
  { network: 'Ethereum', cost: 0.5, currency: 'ETH' },
  { network: 'Polygon', cost: 0.05, currency: 'MATIC' },
  { network: 'Arbitrum', cost: 0.02, currency: 'ETH' },
  { network: 'Solana', cost: 0.001, currency: 'SOL' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PerformanceChart: React.FC = () => {
  const formatCurrency = (value: number, currency: string) => {
    if (currency === 'SEI') return `${value} SEI`;
    if (currency === 'ETH') return `${value} ETH`;
    if (currency === 'MATIC') return `${value} MATIC`;
    if (currency === 'SOL') return `${value} SOL`;
    return `${value}`;
  };

  const formatTime = (value: number) => {
    if (value < 1) return `${(value * 1000).toFixed(0)}ms`;
    return `${value.toFixed(1)}s`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Detection Time</p>
                <p className="text-2xl font-bold text-blue-600">450ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Cost per Scan</p>
                <p className="text-2xl font-bold text-green-600">0.001 SEI</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Throughput</p>
                <p className="text-2xl font-bold text-purple-600">20K TPS</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Finality</p>
                <p className="text-2xl font-bold text-orange-600">0.5s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Time & Cost Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Comparison
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              SEI Sentinel's detection speed and cost efficiency across networks
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="avgDetectionTimeMs" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Detection Time (ms)" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="avgCostPerScan" 
                  stroke="#82ca9d" 
                  name="Cost per Scan" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Throughput Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Network Throughput
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Transactions per second capacity for security operations
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="throughput" fill="#82ca9d" name="TPS" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Finality Time Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Finality Time Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Time to finality for critical security actions (lower is better)
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="finalityTime" fill="#ffc658" name="Finality Time (seconds)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Advantages */}
      <Card>
        <CardHeader>
          <CardTitle>Why SEI Network for Security Operations?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Fast Finality</h4>
                  <p className="text-sm text-muted-foreground">
                    0.5 second finality enables near-instant security responses to threats
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Cost Efficiency</h4>
                  <p className="text-sm text-muted-foreground">
                    500x cheaper than Ethereum for security operations
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">High Throughput</h4>
                  <p className="text-sm text-muted-foreground">
                    20,000 TPS supports massive scale security monitoring
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Parallelized EVM</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple security agents can operate simultaneously
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Native Order Matching</h4>
                  <p className="text-sm text-muted-foreground">
                    Built-in oracle security for price feed validation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Cosmos Ecosystem</h4>
                  <p className="text-sm text-muted-foreground">
                    Interoperable with other secure blockchain networks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
