
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Contract } from '../hooks/useSeiData';

interface RealTimeMonitorProps {
  contracts: Contract[];
}

export const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ contracts }) => {
  // Generate time series data for the last 30 data points
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 10000); // 10 second intervals
      data.push({
        time: time.toLocaleTimeString([], { hour12: false, timeStyle: 'medium' }),
        contracts: Math.floor(45 + Math.random() * 15),
        threats: Math.floor(2 + Math.random() * 6),
        gasUsage: Math.floor(300000 + Math.random() * 100000)
      });
    }
    
    return data;
  };

  const data = generateTimeSeriesData();

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                border: '1px solid #334155',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#14B8A6' }}
            />
            <Area 
              type="monotone" 
              dataKey="contracts" 
              stroke="#14B8A6" 
              fill="url(#colorContracts)" 
              name="Active Contracts"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="threats" 
              stroke="#F43F5E" 
              fill="url(#colorThreats)" 
              name="Threats Detected"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Contract Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contracts.slice(0, 6).map(contract => (
          <ContractCard key={contract.address} contract={contract} />
        ))}
      </div>
    </div>
  );
};

const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
  const statusColors = {
    critical: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    safe: 'bg-green-500/10 border-green-500/30 text-green-400',
  };

  const statusIcons = {
    critical: '🔴',
    warning: '🟡',
    safe: '🟢',
  };

  return (
    <div className={`p-4 rounded-lg border transition-all hover:scale-105 ${statusColors[contract.status]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white">{contract.name}</h3>
          <p className="text-xs text-slate-400 font-mono">{contract.address}</p>
        </div>
        <span className="text-lg">{statusIcons[contract.status]}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">TVL</span>
          <span className="text-white font-medium">{contract.tvl}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Vulnerabilities</span>
          <span className={contract.vulnerabilities > 0 ? 'text-red-400 font-medium' : 'text-green-400'}>
            {contract.vulnerabilities}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Last Scan</span>
          <span className="text-slate-300">{contract.lastScan}</span>
        </div>
      </div>
    </div>
  );
};
