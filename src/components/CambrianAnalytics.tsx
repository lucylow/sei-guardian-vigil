import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, TrendingUp, Shield, Zap } from 'lucide-react';

interface ContractAnalytics {
  total_contracts: number;
  new_last_24h: number;
  contract_types: Record<string, number>;
  vulnerability_distribution: Record<string, number>;
}

interface NetworkHealth {
  current_tps: number;
  avg_block_time: number;
  active_validators: number;
  network_utilization: number;
}

interface GasAnalytics {
  avg_gas_used: number;
  total_gas_saved: number;
  top_gas_consumers: Array<{
    address: string;
    name: string;
    gas_used: number;
  }>;
}

interface Vulnerability {
  contract: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium';
  detected: string;
  status: 'Open' | 'Mitigated' | 'Monitoring';
}

export const CambrianAnalytics: React.FC = () => {
  const [contractData, setContractData] = useState<ContractAnalytics | null>(null);
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth | null>(null);
  const [gasData, setGasData] = useState<GasAnalytics | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const generateMockData = () => {
    // Mock contract analytics
    const contractAnalytics: ContractAnalytics = {
      total_contracts: Math.floor(Math.random() * 500) + 500,
      new_last_24h: Math.floor(Math.random() * 15) + 5,
      contract_types: {
        DeFi: Math.floor(Math.random() * 200) + 100,
        NFT: Math.floor(Math.random() * 100) + 50,
        Gaming: Math.floor(Math.random() * 50) + 30,
        Utility: Math.floor(Math.random() * 150) + 100,
        Other: Math.floor(Math.random() * 50) + 50
      },
      vulnerability_distribution: {
        Critical: Math.floor(Math.random() * 10) + 5,
        High: Math.floor(Math.random() * 25) + 15,
        Medium: Math.floor(Math.random() * 60) + 40,
        Low: Math.floor(Math.random() * 200) + 100,
        Optimized: Math.floor(Math.random() * 300) + 200
      }
    };

    // Mock network health
    const networkData: NetworkHealth = {
      current_tps: Math.random() * 800 + 2000,
      avg_block_time: Math.random() * 40 + 380,
      active_validators: Math.floor(Math.random() * 50) + 50,
      network_utilization: Math.random() * 20 + 65
    };

    // Mock gas analytics
    const gasAnalytics: GasAnalytics = {
      avg_gas_used: Math.random() * 150000 + 50000,
      total_gas_saved: Math.random() * 4000 + 1000,
      top_gas_consumers: [
        { address: "0x123...abc", name: "YeiSwap", gas_used: Math.random() * 4000000 + 1000000 },
        { address: "0x456...def", name: "SeiPunks", gas_used: Math.random() * 2000000 + 800000 },
        { address: "0x789...ghi", name: "LendingPool", gas_used: Math.random() * 1500000 + 500000 }
      ]
    };

    // Mock vulnerabilities
    const vulnTypes = ["Reentrancy", "Front-running", "Access Control", "Arithmetic", "Oracle"];
    const contracts = ["YeiSwap", "SeiPunks", "LendingPool", "AgentMarket", "Prediction"];
    const severities: Array<'Critical' | 'High' | 'Medium'> = ["Critical", "High", "Medium"];
    const statuses: Array<'Open' | 'Mitigated' | 'Monitoring'> = ["Open", "Mitigated", "Monitoring"];
    
    const mockVulns: Vulnerability[] = Array.from({ length: 5 }, (_, i) => ({
      contract: `${contracts[i]} (0x${Math.random().toString(16).substr(2, 10)}...)`,
      type: vulnTypes[Math.floor(Math.random() * vulnTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      detected: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));

    setContractData(contractAnalytics);
    setNetworkHealth(networkData);
    setGasData(gasAnalytics);
    setVulnerabilities(mockVulns);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    generateMockData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      generateMockData();
    }, 1000);
  };

  const severityColors = {
    Critical: "hsl(var(--destructive))",
    High: "hsl(var(--warning))",
    Medium: "hsl(var(--secondary))",
    Low: "hsl(var(--muted))",
    Optimized: "hsl(var(--primary))"
  };

  const statusColors = {
    Open: "hsl(var(--destructive))",
    Mitigated: "hsl(var(--primary))",
    Monitoring: "hsl(var(--warning))"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cambrian Analytics</h2>
          <p className="text-muted-foreground">Real-time on-chain analytics for Sei Network</p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractData?.total_contracts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{contractData?.new_last_24h} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network TPS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth?.current_tps.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              {networkHealth?.avg_block_time.toFixed(0)}ms avg block time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Saved</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gasData?.total_gas_saved.toFixed(0)} SEI</div>
            <p className="text-xs text-muted-foreground">
              {gasData?.avg_gas_used.toFixed(0)} avg gas/contract
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Validators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth?.active_validators}</div>
            <p className="text-xs text-muted-foreground">
              {networkHealth?.network_utilization.toFixed(1)}% utilization
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contract Type Distribution</CardTitle>
            <CardDescription>Breakdown of contract types on Sei Network</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(contractData?.contract_types || {}).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(contractData?.contract_types || {}).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Severity</CardTitle>
            <CardDescription>Security vulnerability distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(contractData?.vulnerability_distribution || {}).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Gas Consumers</CardTitle>
            <CardDescription>Contracts with highest gas usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gasData?.top_gas_consumers.map((consumer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{consumer.name}</p>
                    <p className="text-sm text-muted-foreground">{consumer.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{consumer.gas_used.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">gas units</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Vulnerabilities</CardTitle>
            <CardDescription>Latest security findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vulnerabilities.map((vuln, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{vuln.contract}</p>
                    <Badge variant={vuln.severity === 'Critical' ? 'destructive' : vuln.severity === 'High' ? 'secondary' : 'outline'}>
                      {vuln.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{vuln.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {vuln.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(vuln.detected).toLocaleDateString()} {new Date(vuln.detected).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Performance (24h)</CardTitle>
          <CardDescription>Transactions per second over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              tps: Math.random() * 1000 + 1800
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tps" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Powered by Cambrian On-Chain Analytics • Last updated: {lastRefresh.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};