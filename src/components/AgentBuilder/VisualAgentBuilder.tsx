import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  BackgroundVariant,
  type Node,
  type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodePalette } from './NodePalette';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Template definitions for different agent types
const agentTemplates = {
  'defi-arbitrage': {
    name: 'DeFi Arbitrage Agent',
    description: 'High-frequency arbitrage trading across Sei DEXs',
    nodes: [
      {
        id: 'trigger-block',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'New Block Trigger', config: { event: 'NewBlock', interval: '400ms' } }
      },
      {
        id: 'fetch-prices',
        type: 'skill',
        position: { x: 300, y: 100 },
        data: { label: 'Fetch DEX Prices', config: { dexes: ['SeiSwap', 'Astroport'], pairs: ['SEI/USDC', 'ATOM/USDC'] } }
      },
      {
        id: 'compute-arbitrage',
        type: 'skill',
        position: { x: 500, y: 100 },
        data: { label: 'Compute Arbitrage', config: { minProfit: '0.5%', gasOptimization: true } }
      },
      {
        id: 'execute-trades',
        type: 'action',
        position: { x: 700, y: 100 },
        data: { label: 'Execute Trades', config: { slippage: '0.1%', maxGas: '100000' } }
      },
      {
        id: 'notify-dashboard',
        type: 'output',
        position: { x: 900, y: 100 },
        data: { label: 'Notify Dashboard', config: { channel: 'Dashboard', format: 'JSON' } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-block', target: 'fetch-prices' },
      { id: 'e2', source: 'fetch-prices', target: 'compute-arbitrage' },
      { id: 'e3', source: 'compute-arbitrage', target: 'execute-trades' },
      { id: 'e4', source: 'execute-trades', target: 'notify-dashboard' }
    ]
  },
  'security-scanner': {
    name: 'Security Scanner Agent',
    description: 'Automated vulnerability detection and fix generation',
    nodes: [
      {
        id: 'trigger-deploy',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'Contract Deployed', config: { event: 'ContractDeployed', networks: ['Sei'] } }
      },
      {
        id: 'fetch-bytecode',
        type: 'skill',
        position: { x: 300, y: 100 },
        data: { label: 'Fetch Bytecode', config: { source: 'Blockchain', format: 'Hex' } }
      },
      {
        id: 'ai-scan',
        type: 'skill',
        position: { x: 500, y: 100 },
        data: { label: 'AI Vulnerability Scan', config: { model: 'GPT-4', checks: ['Reentrancy', 'Overflow', 'Access Control'] } }
      },
      {
        id: 'generate-fix',
        type: 'skill',
        position: { x: 700, y: 100 },
        data: { label: 'Generate Fix', config: { language: 'Solidity', testing: true } }
      },
      {
        id: 'deploy-fix',
        type: 'action',
        position: { x: 900, y: 100 },
        data: { label: 'Deploy Fix', config: { gasLimit: '500000', verification: true } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-deploy', target: 'fetch-bytecode' },
      { id: 'e2', source: 'fetch-bytecode', target: 'ai-scan' },
      { id: 'e3', source: 'ai-scan', target: 'generate-fix' },
      { id: 'e4', source: 'generate-fix', target: 'deploy-fix' }
    ]
  },
  'portfolio-manager': {
    name: 'AI Portfolio Manager',
    description: 'Autonomous portfolio optimization with risk management',
    nodes: [
      {
        id: 'trigger-daily',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'Daily Timer', config: { event: 'DailyTimer', time: '00:00 UTC' } }
      },
      {
        id: 'fetch-positions',
        type: 'skill',
        position: { x: 300, y: 100 },
        data: { label: 'Fetch Positions', config: { wallets: ['User Wallet'], protocols: ['Sei', 'Cosmos'] } }
      },
      {
        id: 'compute-optimal',
        type: 'skill',
        position: { x: 500, y: 100 },
        data: { label: 'Compute Optimal Portfolio', config: { riskTolerance: 'Medium', rebalanceThreshold: '5%' } }
      },
      {
        id: 'execute-trades',
        type: 'action',
        position: { x: 700, y: 100 },
        data: { label: 'Execute Rebalance', config: { maxSlippage: '0.5%', gasOptimization: true } }
      },
      {
        id: 'update-dashboard',
        type: 'output',
        position: { x: 900, y: 100 },
        data: { label: 'Update Dashboard', config: { metrics: ['Performance', 'Risk', 'Allocation'] } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-daily', target: 'fetch-positions' },
      { id: 'e2', source: 'fetch-positions', target: 'compute-optimal' },
      { id: 'e3', source: 'compute-optimal', target: 'execute-trades' },
      { id: 'e4', source: 'execute-trades', target: 'update-dashboard' }
    ]
  },
  'data-aggregator': {
    name: 'Cross-Chain Data Agent',
    description: 'Real-time data aggregation from multiple blockchain sources',
    nodes: [
      {
        id: 'trigger-block',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'New Block Trigger', config: { event: 'NewBlock', chains: ['Sei', 'Cosmos', 'Ethereum'] } }
      },
      {
        id: 'fetch-defi-data',
        type: 'skill',
        position: { x: 300, y: 50 },
        data: { label: 'Fetch DeFi Data', config: { protocols: ['SeiSwap', 'Osmosis', 'Uniswap'] } }
      },
      {
        id: 'fetch-market-prices',
        type: 'skill',
        position: { x: 300, y: 150 },
        data: { label: 'Fetch Market Prices', config: { sources: ['CoinGecko', 'Binance', 'Coinbase'] } }
      },
      {
        id: 'combine-data',
        type: 'skill',
        position: { x: 500, y: 100 },
        data: { label: 'Combine & Process', config: { format: 'JSON', aggregation: 'Weighted Average' } }
      },
      {
        id: 'output-api',
        type: 'output',
        position: { x: 700, y: 100 },
        data: { label: 'REST API Output', config: { endpoint: '/api/data', rateLimit: '1000/min' } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-block', target: 'fetch-defi-data' },
      { id: 'e2', source: 'trigger-block', target: 'fetch-market-prices' },
      { id: 'e3', source: 'fetch-defi-data', target: 'combine-data' },
      { id: 'e4', source: 'fetch-market-prices', target: 'combine-data' },
      { id: 'e5', source: 'combine-data', target: 'output-api' }
    ]
  },
  'yield-optimizer': {
    name: 'Yield Farming Optimizer',
    description: 'Automated yield farming optimization across multiple protocols',
    nodes: [
      {
        id: 'trigger-block',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'New Block Trigger', config: { event: 'NewBlock', interval: '1min' } }
      },
      {
        id: 'fetch-yield-farms',
        type: 'skill',
        position: { x: 300, y: 100 },
        data: { label: 'Fetch Yield Farms', config: { protocols: ['Sei', 'Osmosis', 'Juno'], minAPY: '10%' } }
      },
      {
        id: 'compute-strategy',
        type: 'skill',
        position: { x: 500, y: 100 },
        data: { label: 'Compute Optimal Strategy', config: { riskModel: 'Sharpe Ratio', maxImpermanentLoss: '2%' } }
      },
      {
        id: 'execute-strategy',
        type: 'action',
        position: { x: 700, y: 100 },
        data: { label: 'Execute Strategy', config: { gasOptimization: true, slippage: '0.3%' } }
      },
      {
        id: 'notify-dashboard',
        type: 'output',
        position: { x: 900, y: 100 },
        data: { label: 'Notify Dashboard', config: { metrics: ['APY', 'Risk', 'Allocation'] } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-block', target: 'fetch-yield-farms' },
      { id: 'e2', source: 'fetch-yield-farms', target: 'compute-strategy' },
      { id: 'e3', source: 'compute-strategy', target: 'execute-strategy' },
      { id: 'e4', source: 'execute-strategy', target: 'notify-dashboard' }
    ]
  },
  'cross-chain-bridge': {
    name: 'Cross-Chain Bridge Monitor',
    description: 'Monitor and optimize cross-chain asset transfers',
    nodes: [
      {
        id: 'trigger-transfer',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'Cross-Chain Transfer', config: { event: 'TransferInitiated', chains: ['Sei', 'Cosmos', 'Ethereum'] } }
      },
      {
        id: 'fetch-liquidity',
        type: 'skill',
        position: { x: 300, y: 100 },
        data: { label: 'Fetch Liquidity Status', config: { protocols: ['IBC', 'Axelar', 'LayerZero'], minLiquidity: '1000 USDC' } }
      },
      {
        id: 'compute-route',
        type: 'skill',
        position: { x: 500, y: 100 },
        data: { label: 'Compute Optimal Route', config: { gasOptimization: true, slippage: '0.1%', maxTime: '5min' } }
      },
      {
        id: 'execute-bridge',
        type: 'action',
        position: { x: 700, y: 100 },
        data: { label: 'Execute Bridge', config: { gasLimit: '300000', verification: true, retryAttempts: 3 } }
      },
      {
        id: 'monitor-status',
        type: 'output',
        position: { x: 900, y: 100 },
        data: { label: 'Monitor Transfer Status', config: { updates: 'Real-time', alerts: ['Success', 'Failure', 'Pending'] } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-transfer', target: 'fetch-liquidity' },
      { id: 'e2', source: 'fetch-liquidity', target: 'compute-route' },
      { id: 'e3', source: 'compute-route', target: 'execute-bridge' },
      { id: 'e4', source: 'execute-bridge', target: 'monitor-status' }
    ]
  },
  'sei-defi-bot': {
    name: 'SEI DeFi Trading Bot',
    description: 'Automated DeFi trading on SEI with yield optimization',
    nodes: [
      {
        id: 'trigger-block',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'New Block Trigger', config: { event: 'NewBlock', interval: '400ms' } }
      },
      {
        id: 'sei-oracle',
        type: 'seiOracle',
        position: { x: 300, y: 50 },
        data: { label: 'SEI Price Oracle', config: { pairs: ['SEI/USDC', 'ATOM/USDC'], updateInterval: '1s' } }
      },
      {
        id: 'sei-mempool',
        type: 'seiMempool',
        position: { x: 300, y: 150 },
        data: { label: 'Monitor Mempool', config: { gasThreshold: '100000', priority: 'high' } }
      },
      {
        id: 'compute-opportunity',
        type: 'math',
        position: { x: 500, y: 100 },
        data: { label: 'Compute Opportunity', config: { minProfit: '0.5%', riskModel: 'Sharpe Ratio' } }
      },
      {
        id: 'sei-swap',
        type: 'seiSwap',
        position: { x: 700, y: 100 },
        data: { label: 'Execute SEI Swap', config: { slippage: '0.1%', gasOptimization: true } }
      },
      {
        id: 'sei-staking',
        type: 'seiStaking',
        position: { x: 900, y: 50 },
        data: { label: 'Stake Rewards', config: { validator: 'Auto-select', minStake: '100 SEI' } }
      },
      {
        id: 'sei-alert',
        type: 'seiAlert',
        position: { x: 900, y: 150 },
        data: { label: 'Send Alert', config: { channels: ['Slack', 'Email'], format: 'JSON' } }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-block', target: 'sei-oracle' },
      { id: 'e2', source: 'trigger-block', target: 'sei-mempool' },
      { id: 'e3', source: 'sei-oracle', target: 'compute-opportunity' },
      { id: 'e4', source: 'sei-mempool', target: 'compute-opportunity' },
      { id: 'e5', source: 'compute-opportunity', target: 'sei-swap' },
      { id: 'e6', source: 'sei-swap', target: 'sei-staking' },
      { id: 'e7', source: 'sei-swap', target: 'sei-alert' }
    ]
  }
};

const nodeTypes = {
  // Core Agent Components
  agentPersonality: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg relative min-w-[120px] border-2 border-primary-foreground/20">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Agent Personality</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  skill: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg relative min-w-[120px] border-2 border-blue-300">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Skill</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  action: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-purple-500 text-white rounded-lg relative min-w-[120px] border-2 border-purple-300">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Action</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  trigger: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-orange-500 text-white rounded-lg border-2 border-orange-300 relative min-w-[120px]">
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Trigger</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  output: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-green-600 text-white rounded-lg relative min-w-[120px] border-2 border-green-400">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <div className="font-semibold text-xs">Output</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  
  // Data & Input Nodes
  dataSource: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg min-w-[120px] border-2 border-blue-400">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Data Source</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  webhook: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg min-w-[120px] border-2 border-blue-300">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Webhook</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  blockchain: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-purple-600 text-white rounded-lg min-w-[120px] border-2 border-purple-400">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Blockchain</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  database: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg min-w-[120px] border-2 border-indigo-400">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="font-semibold text-xs">Database</div>
      <div className="text-xs opacity-90">{data.label}</div>
    </div>
  ),
  
  // Logic & Control Nodes
  condition: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-orange-600 text-white rounded-lg">
      <div className="font-semibold">Condition</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  loop: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-orange-500 text-white rounded-lg">
      <div className="font-semibold">Loop</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  switch: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-orange-400 text-white rounded-lg">
      <div className="font-semibold">Switch</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  delay: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg">
      <div className="font-semibold">Delay</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // Processing Nodes
  math: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-teal-600 text-white rounded-lg">
      <div className="font-semibold">Math</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  transform: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-teal-500 text-white rounded-lg">
      <div className="font-semibold">Transform</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  aggregate: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-teal-400 text-white rounded-lg">
      <div className="font-semibold">Aggregate</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  filter: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-teal-300 text-white rounded-lg">
      <div className="font-semibold">Filter</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // AI & External Services
  aiModel: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-pink-600 text-white rounded-lg">
      <div className="font-semibold">AI Model</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  nlp: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-pink-500 text-white rounded-lg">
      <div className="font-semibold">NLP</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  vision: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-pink-400 text-white rounded-lg">
      <div className="font-semibold">Vision</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // Communication Nodes
  email: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-red-600 text-white rounded-lg">
      <div className="font-semibold">Email</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  sms: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-red-500 text-white rounded-lg">
      <div className="font-semibold">SMS</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  slack: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-red-400 text-white rounded-lg">
      <div className="font-semibold">Slack</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  discord: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-red-300 text-white rounded-lg">
      <div className="font-semibold">Discord</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // Storage & Output Nodes
  fileStorage: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-gray-600 text-white rounded-lg">
      <div className="font-semibold">File Storage</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  cache: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-gray-500 text-white rounded-lg">
      <div className="font-semibold">Cache</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  queue: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-gray-400 text-white rounded-lg">
      <div className="font-semibold">Queue</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // Monitoring & Analytics
  metrics: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
      <div className="font-semibold">Metrics</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  alert: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-emerald-500 text-white rounded-lg">
      <div className="font-semibold">Alert</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  logging: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-emerald-400 text-white rounded-lg">
      <div className="font-semibold">Logging</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // SEI Blockchain Nodes
  seiValidator: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-indigo-700 text-white rounded-lg border-2 border-indigo-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Validator</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiStaking: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-yellow-700 text-white rounded-lg border-2 border-yellow-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Staking</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiSwap: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-green-700 text-white rounded-lg border-2 border-green-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Swap</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiLiquidity: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-700 text-white rounded-lg border-2 border-blue-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Liquidity</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiNFT: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-purple-700 text-white rounded-lg border-2 border-purple-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI NFT</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiGovernance: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-red-700 text-white rounded-lg border-2 border-red-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Governance</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiBridge: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-cyan-700 text-white rounded-lg border-2 border-cyan-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Bridge</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiOracle: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-pink-700 text-white rounded-lg border-2 border-pink-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Oracle</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiContract: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-orange-700 text-white rounded-lg border-2 border-orange-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Contract</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiMempool: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-teal-700 text-white rounded-lg border-2 border-teal-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Mempool</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiGas: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-amber-700 text-white rounded-lg border-2 border-amber-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Gas Tracker</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiMetrics: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-lime-700 text-white rounded-lg border-2 border-lime-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Metrics</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiAlert: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-rose-700 text-white rounded-lg border-2 border-rose-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Alert</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiBackup: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-slate-700 text-white rounded-lg border-2 border-slate-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Backup</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  seiRecovery: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-stone-700 text-white rounded-lg border-2 border-stone-500 relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">SEI Recovery</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  


};

const networkOptions = [
  { value: "mainnet", label: "🌐 Sei Mainnet" },
  { value: "testnet", label: "🧪 Sei Testnet" },
  { value: "demo", label: "🎭 Demo Mode (mock data)" },
];

interface VisualAgentBuilderProps {
  selectedTemplate: string | null;
  onNavigateToDeploy?: () => void;
  disableAutoNavigation?: boolean;
}

export default function VisualAgentBuilder({ selectedTemplate, onNavigateToDeploy, disableAutoNavigation = true }: VisualAgentBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [network, setNetwork] = useState("demo");
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [agentConfig, setAgentConfig] = useState<any>({});
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  // New custom connection system
  const [connectionMode, setConnectionMode] = useState(false);
  const [sourceNode, setSourceNode] = useState<any>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  
  const { toast } = useToast();

  // Initialize wallet address from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem('sei-wallet-address');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  // Simple wallet connection function
  const connectWallet = () => {
    // For demo purposes, generate a mock wallet address
    const mockAddress = 'sei1' + Array.from({length: 38}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setWalletAddress(mockAddress);
    localStorage.setItem('sei-wallet-address', mockAddress);
    
    toast({
      title: "🔗 Wallet Connected!",
      description: `Connected to: ${mockAddress.slice(0, 20)}...`,
    });
  };

  // Load template when selectedTemplate prop changes
  useEffect(() => {
    console.log('VisualAgentBuilder: selectedTemplate changed to:', selectedTemplate);
    console.log('VisualAgentBuilder: Available templates:', Object.keys(agentTemplates));
    
    if (selectedTemplate && agentTemplates[selectedTemplate]) {
      console.log('VisualAgentBuilder: Loading template:', agentTemplates[selectedTemplate]);
      loadTemplate(selectedTemplate);
    } else if (selectedTemplate) {
      console.error('VisualAgentBuilder: Template not found:', selectedTemplate);
      console.log('VisualAgentBuilder: Available templates:', Object.keys(agentTemplates));
    }
  }, [selectedTemplate]);

  const loadTemplate = useCallback((templateId: string) => {
    console.log('VisualAgentBuilder: loadTemplate called with:', templateId);
    const template = agentTemplates[templateId];
    if (template) {
      console.log('VisualAgentBuilder: Setting nodes and edges for template:', template.name);
      
      // Ensure all nodes have proper data structure and unique IDs
      const processedNodes = template.nodes.map((node, index) => ({
        ...node,
        id: `${templateId}-${node.id}-${index}`, // Ensure unique IDs
        data: {
          ...node.data,
          label: node.data.label || node.type,
          config: node.data.config || {},
          description: node.data.description || `Node for ${template.name}`
        },
        position: {
          x: node.position.x + (index * 50), // Spread nodes slightly
          y: node.position.y + (index * 30)
        }
      }));
      
      // Update edge IDs and source/target to match new node IDs
      const processedEdges = template.edges.map((edge, index) => {
        const sourceNode = processedNodes.find(n => n.id.includes(edge.source));
        const targetNode = processedNodes.find(n => n.id.includes(edge.target));
        
        if (sourceNode && targetNode) {
          return {
            ...edge,
            id: `${templateId}-edge-${index}`,
            source: sourceNode.id,
            target: targetNode.id,
            style: { 
              stroke: '#3b82f6', 
              strokeWidth: 3,
              strokeDasharray: '5,5',
              filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
            },
            animated: true
          };
        }
        return edge;
      }).filter(edge => edge.source && edge.target); // Only include valid edges
      
      setNodes(processedNodes);
      setEdges(processedEdges);
      setCurrentTemplate(templateId);
      
      // Set agent configuration from template
      setAgentConfig({
        name: template.name,
        description: template.description,
        type: templateId,
        sei: {
          network: 'sei-testnet',
          optimization: 'sub-400ms',
          features: ['parallel-execution', 'cosmwasm-support']
        }
      });
      
      console.log('VisualAgentBuilder: Template loaded successfully:', {
        template: template.name,
        nodes: processedNodes.length,
        edges: processedEdges.length,
        nodeTypes: processedNodes.map(n => n.type)
      });
      
      // Template is now loaded and ready
      console.log('VisualAgentBuilder: Template loaded successfully, ready for user interaction');
      
      // Show success message and let user decide when to proceed
      toast({
        title: `🎉 Template Ready!`,
        description: `"${template.name}" loaded successfully. You can now customize your agent or click Deploy when ready.`,
      });
    } else {
      console.error('VisualAgentBuilder: Template not found for ID:', templateId);
      toast({
        title: "❌ Template Not Found",
        description: `Template "${templateId}" could not be loaded. Please try another template.`,
        variant: "destructive",
      });
    }
  }, [setNodes, setEdges, toast, setAgentConfig]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (sourceNode && targetNode) {
        // Prevent self-connection
        if (params.source === params.target) {
          toast({
            title: "❌ Invalid Connection",
            description: "Cannot connect a node to itself",
            variant: "destructive",
          });
          return;
        }
        
        // Check for duplicate connections
        const existingConnection = edges.find(
          e => e.source === params.source && e.target === params.target
        );
        
        if (existingConnection) {
          toast({
            title: "❌ Duplicate Connection",
            description: "Connection already exists between these nodes",
            variant: "destructive",
          });
          return;
        }
        
        // Add connection with enhanced styling
        const newEdge = {
          ...params,
          id: `e${Date.now()}`,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: '#3b82f6', 
            strokeWidth: 3,
            strokeDasharray: '5,5',
            filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
          },
          label: `${sourceNode.data.label} → ${targetNode.data.label}`,
          labelStyle: {
            fill: '#1f2937',
            fontWeight: 600,
            fontSize: '12px',
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.9
          }
        };
        
        setEdges((eds) => [...eds, newEdge]);
        
        toast({
          title: "✅ Connection Created",
          description: `Connected ${sourceNode.data.label} to ${targetNode.data.label}`,
        });
      }
    },
    [nodes, edges, setEdges, toast]
  );

  const onConnectStart = useCallback((event: any, params: any) => {
    console.log('Connection start:', params);
  }, []);

  const onConnectEnd = useCallback((event: any) => {
    console.log('Connection end:', event);
  }, []);

  // Custom connection system functions
  const startConnectionMode = useCallback(() => {
    setConnectionMode(true);
    setSourceNode(null);
    setTargetNode(null);
    toast({
      title: "🔗 Connection Mode Active",
      description: "Click on a source node (green dot), then click on a target node (blue dot)",
    });
  }, [toast]);

  const selectNodeForConnection = useCallback((node: any, isSource: boolean) => {
    if (isSource) {
      setSourceNode(node);
      toast({
        title: "✅ Source Selected",
        description: `Selected "${node.data.label}" as source. Now click on a target node.`,
      });
    } else {
      setTargetNode(node);
      toast({
        title: "✅ Target Selected",
        description: `Selected "${node.data.label}" as target. Ready to connect!`,
      });
    }
  }, [toast]);

  const createConnection = useCallback(() => {
    if (!sourceNode || !targetNode) {
      toast({
        title: "❌ Missing Selection",
        description: "Please select both source and target nodes",
        variant: "destructive",
      });
      return;
    }

    if (sourceNode.id === targetNode.id) {
      toast({
        title: "❌ Invalid Connection",
        description: "Cannot connect a node to itself",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate connections
    const existingConnection = edges.find(
      e => e.source === sourceNode.id && e.target === targetNode.id
    );
    
    if (existingConnection) {
      toast({
        title: "❌ Duplicate Connection",
        description: "Connection already exists between these nodes",
        variant: "destructive",
      });
      return;
    }

    // Create new connection
    const newEdge = {
      id: `e${Date.now()}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: 'default',
      animated: true,
      style: { 
        stroke: '#3b82f6', 
        strokeWidth: 3,
        filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
      },
      label: `${sourceNode.data.label} → ${targetNode.data.label}`,
      labelStyle: {
        fill: '#1f2937',
        fontWeight: 600,
        fontSize: '12px',
        background: '#ffffff',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #d1d5db'
      },
      labelBgStyle: {
        fill: '#ffffff',
        fillOpacity: 0.9
      }
    };

    setEdges((eds) => [...eds, newEdge]);
    
    toast({
      title: "✅ Connection Created",
      description: `Connected "${sourceNode.data.label}" to "${targetNode.data.label}"`,
    });

    // Reset connection mode
    setConnectionMode(false);
    setSourceNode(null);
    setTargetNode(null);
  }, [sourceNode, targetNode, edges, setEdges, toast]);

  const cancelConnection = useCallback(() => {
    setConnectionMode(false);
    setSourceNode(null);
    setTargetNode(null);
    toast({
      title: "❌ Connection Cancelled",
      description: "Connection mode deactivated",
    });
  }, [toast]);

  const onNodeClick = useCallback((event: any, node: any) => {
    if (connectionMode) {
      // In connection mode, handle node selection
      if (!sourceNode) {
        // First click - select source node
        selectNodeForConnection(node, true);
      } else if (!targetNode && sourceNode.id !== node.id) {
        // Second click - select target node
        selectNodeForConnection(node, false);
      }
    } else {
      // Normal mode - open configuration panel
      setSelectedNode(node);
      console.log('Node clicked:', node);
    }
  }, [connectionMode, sourceNode, targetNode, selectNodeForConnection]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        config: {}
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setCurrentTemplate(null);
    toast({
      title: "🧹 Canvas Cleared",
      description: "Ready for a new agent design",
    });
  }, [setNodes, setEdges, toast]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: type.charAt(0).toUpperCase() + type.slice(1),
            config: {}
          }
        };

        setNodes((nds) => [...nds, newNode]);
        
        toast({
          title: "✅ Node Added",
          description: `${type} node added to canvas`,
        });
      }
    },
    [setNodes, toast]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Deploy agent: serialize graph and send to backend for deployment
  const deployAgent = useCallback(async () => {
    if (!walletAddress) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet before deploying",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "❌ No Agent Design",
        description: "Add some nodes to create your agent first!",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      // Serialize graph to JSON
      const agentGraph = { 
        nodes, 
        edges, 
        config: {
          ...agentConfig,
          name: agentConfig.name || `Agent_${Date.now()}`,
          description: agentConfig.description || 'AI Agent created via No-Code Studio',
          type: agentConfig.type || 'Custom'
        }
      };

      console.log('Deploying agent with flow:', agentGraph);

      // POST to backend for deployment
      const response = await fetch("/api/agents/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          flow: agentGraph, 
          seiConfig: agentConfig.sei || {},
          ownerWalletAddress: walletAddress
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Deployment failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Agent deployment successful:', result);

      // Show success message
      toast({
        title: "🚀 Agent Deployed!",
        description: `Your agent "${result.agent.name}" has been successfully deployed to the Sei blockchain. NFT Token ID: ${result.deploymentDetails.nftTokenId}`,
        duration: 5000,
      });

      // Store deployment info
      localStorage.setItem('sei-agent-deployment', JSON.stringify({
        agentId: result.agent.id,
        agentName: result.agent.name,
        nftTokenId: result.deploymentDetails.nftTokenId,
        seiTxHash: result.deploymentDetails.seiTxHash,
        timestamp: new Date().toISOString(),
        status: 'success'
      }));

      // Navigate to deploy tab if callback is provided
      if (onNavigateToDeploy) {
        onNavigateToDeploy();
      }

    } catch (err: any) {
      console.error('Agent deployment failed:', err);
      
      // Show error message
      toast({
        title: "❌ Deployment Failed",
        description: err.message || "Failed to deploy agent. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDeploying(false);
    }
  }, [nodes, edges, agentConfig, walletAddress, onNavigateToDeploy, toast]);

  // Handle deployment button click
  const handleDeploy = () => {
    if (!walletAddress) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet before deploying",
        variant: "destructive",
      });
      return;
    }
    deployAgent();
  };

  // Generate smart contract code from the workflow
  const generateAgentContract = (workflowNodes: Node[], workflowEdges: any[]) => {
    const contractCode = `
// SEI Agent Smart Contract
// Generated from Visual Agent Builder
// Network: ${network}
// Created: ${new Date().toISOString()}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AgentConfig {
    pub nodes: Vec<NodeConfig>,
    pub edges: Vec<EdgeConfig>,
    pub network: String,
    pub version: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct NodeConfig {
    pub id: String,
    pub node_type: String,
    pub label: String,
    pub config: String, // JSON string
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct EdgeConfig {
    pub source: String,
    pub target: String,
    pub label: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub config: AgentConfig,
    pub owner: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ExecuteMsg {
    pub action: String,
    pub data: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct QueryMsg {
    pub query: String,
}

pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Store agent configuration
    AGENT_CONFIG.save(deps.storage, &msg.config)?;
    OWNER.save(deps.storage, &info.sender)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("agent_id", msg.config.nodes.len().to_string()))
}

pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg.action.as_str() {
        "execute_workflow" => execute_workflow(deps, env, info, msg.data),
        "update_config" => update_config(deps, env, info, msg.data),
        _ => Err(ContractError::InvalidAction {}),
    }
}

fn execute_workflow(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    data: String,
) -> Result<Response, ContractError> {
    // Verify owner
    let owner = OWNER.load(deps.storage)?;
    if info.sender != owner {
        return Err(ContractError::Unauthorized {});
    }
    
    // Execute the agent workflow based on stored configuration
    let config = AGENT_CONFIG.load(deps.storage)?;
    
    // Process nodes in order based on edges
    let mut processed_nodes = std::collections::HashSet::new();
    let mut results = Vec::new();
    
    // Find trigger nodes (nodes with no incoming edges)
    let trigger_nodes: Vec<String> = config.nodes.iter()
        .filter(|node| {
            !config.edges.iter().any(|edge| edge.target == node.id)
        })
        .map(|node| node.id.clone())
        .collect();
    
    // Process workflow starting from triggers
    for trigger_id in trigger_nodes {
        process_node_recursive(&config, &trigger_id, &mut processed_nodes, &mut results)?;
    }
    
    Ok(Response::new()
        .add_attribute("method", "execute_workflow")
        .add_attribute("processed_nodes", processed_nodes.len().to_string())
        .add_attribute("results", results.len().to_string()))
}

fn process_node_recursive(
    config: &AgentConfig,
    node_id: &str,
    processed: &mut std::collections::HashSet<String>,
    results: &mut Vec<String>,
) -> Result<(), ContractError> {
    if processed.contains(node_id) {
        return Ok(());
    }
    
    let node = config.nodes.iter().find(|n| n.id == *node_id)
        .ok_or(ContractError::NodeNotFound {})?;
    
    // Process node based on type
    match node.node_type.as_str() {
        "trigger" => {
            // Handle trigger logic
            results.push(format!("Triggered: {}", node.label));
        },
        "skill" => {
            // Execute skill logic
            results.push(format!("Skill executed: {}", node.label));
        },
        "action" => {
            // Perform action
            results.push(format!("Action performed: {}", node.label));
        },
        "output" => {
            // Generate output
            results.push(format!("Output generated: {}", node.label));
        },
        _ => {
            // Handle other node types
            results.push(format!("Processed: {}", node.label));
        }
    }
    
    processed.insert(node_id.to_string());
    
    // Process connected nodes
    let connected_nodes: Vec<String> = config.edges.iter()
        .filter(|edge| edge.source == *node_id)
        .map(|edge| edge.target.clone())
        .collect();
    
    for connected_id in connected_nodes {
        process_node_recursive(config, &connected_id, processed, results)?;
    }
    
    Ok(())
}

// Storage
#[cw_storage_plus::item]
pub const AGENT_CONFIG: Item<AgentConfig> = Item::new("agent_config");

#[cw_storage_plus::item]
pub const OWNER: Item<Addr> = Item::new("owner");

// Error handling
#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("Invalid action")]
    InvalidAction {},
    
    #[error("Node not found")]
    NodeNotFound {},
    
    #[error("Storage error: {0}")]
    Storage(#[from] StdError),
}

// Entry points
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    crate::contract::instantiate(deps, env, info, msg)
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    crate::contract::execute(deps, env, info, msg)
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    crate::contract::query(deps, msg)
}
    `;
    
    return {
      code: contractCode,
      nodes: workflowNodes.length,
      edges: workflowEdges.length,
      network: network,
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="space-y-4">
      {/* Wallet Connection Status */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔗</div>
            <div>
              <h4 className="font-semibold text-blue-900">Wallet Connection</h4>
              <p className="text-sm text-blue-700">
                {walletAddress ? `Connected: ${walletAddress.slice(0, 20)}...` : 'No wallet connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {walletAddress ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600 font-medium">✅ Connected</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWalletAddress('');
                    localStorage.removeItem('sei-wallet-address');
                    toast({
                      title: "🔌 Wallet Disconnected",
                      description: "Wallet has been disconnected",
                    });
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                🔗 Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Agent Canvas</h3>
          <p className="text-sm text-muted-foreground">
            {currentTemplate ? `Template: ${agentTemplates[currentTemplate]?.name}` : 'Drag nodes from the palette to build your agent'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Template Actions */}
          {currentTemplate && (
            <Button
              onClick={clearCanvas}
              variant="outline"
              size="sm"
            >
              🧹 Clear Template
            </Button>
          )}
          
          {/* Network Selector */}
          <div>
            <label className="text-xs font-semibold block mb-1">Select Network</label>
            <select
              value={network}
              onChange={e => setNetwork(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              {networkOptions.map(n => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>
          
          {/* Deploy Button */}
          <Button
            onClick={handleDeploy}
            disabled={isDeploying || nodes.length === 0}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Deploying to Sei...
              </>
            ) : (
              <>
                🚀 Deploy Agent
                <span className="ml-2 text-xs opacity-90">({network})</span>
              </>
            )}
          </Button>
          
          {/* Alternative Deployment Option */}
          <Button
            variant="outline"
            onClick={() => {
              if (onNavigateToDeploy) {
                onNavigateToDeploy();
              } else {
                // Fallback toast message
                toast({
                  title: "📋 Deployment Options",
                  description: "Use the 'Deploy & Test' tab for dedicated deployment options, or deploy directly from here using the button above.",
                  variant: "default",
                });
              }
            }}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            📋 View Deploy Tab
          </Button>
        </div>
      </div>
      
      {/* Workflow Statistics */}
      {nodes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg border">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
            <div className="text-xs text-gray-600">Total Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{edges.length}</div>
            <div className="text-xs text-gray-600">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {nodes.filter(n => n.type === 'trigger').length}
            </div>
            <div className="text-xs text-gray-600">Triggers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {nodes.filter(n => n.type === 'output').length}
            </div>
            <div className="text-xs text-gray-600">Outputs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {nodes.filter(n => n.type === 'skill').length}
            </div>
            <div className="text-xs text-gray-600">Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {nodes.filter(n => n.type === 'action').length}
            </div>
            <div className="text-xs text-gray-600">Actions</div>
          </div>
        </div>
      )}
      
      {/* Quick Actions Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
        <Button
          variant="outline"
          size="sm"
          onClick={startConnectionMode}
          disabled={connectionMode}
          className={connectionMode ? 'bg-green-100 text-green-800' : ''}
        >
          🔗 Start Connection Mode
        </Button>
        
        {connectionMode && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={createConnection}
              disabled={!sourceNode || !targetNode}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              ✅ Create Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={cancelConnection}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              ❌ Cancel
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Test connection functionality
            if (nodes.length >= 2) {
              const testEdge = {
                id: `test-${Date.now()}`,
                source: nodes[0].id,
                target: nodes[1].id,
                type: 'default',
                animated: true,
                style: { stroke: '#ef4444', strokeWidth: 4 }
              };
              setEdges((eds) => [...eds, testEdge]);
              toast({
                title: "🧪 Test Connection",
                description: "Added test connection between first two nodes",
              });
            }
          }}
        >
          🧪 Test Connection
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Auto-layout nodes in a grid
            const newNodes = nodes.map((node, index) => ({
              ...node,
              position: {
                x: 100 + (index % 4) * 200,
                y: 100 + Math.floor(index / 4) * 150
              }
            }));
            setNodes(newNodes);
            toast({
              title: "🎯 Auto-Layout Applied",
              description: "Nodes arranged in a grid pattern",
            });
          }}
          disabled={nodes.length === 0}
        >
          📐 Auto-Layout
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Export workflow as JSON
            const workflow = { nodes, edges, metadata: { name: 'Agent Workflow', created: new Date().toISOString() } };
            const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'agent-workflow.json';
            a.click();
            URL.revokeObjectURL(url);
            toast({
              title: "💾 Workflow Exported",
              description: "Downloaded as agent-workflow.json",
            });
          }}
          disabled={nodes.length === 0}
        >
          💾 Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Import workflow from file
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  try {
                    const workflow = JSON.parse(e.target?.result as string);
                    if (workflow.nodes && workflow.edges) {
                      setNodes(workflow.nodes);
                      setEdges(workflow.edges);
                      setCurrentTemplate(null);
                      toast({
                        title: "📥 Workflow Imported",
                        description: "Workflow loaded successfully",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "❌ Import Failed",
                      description: "Invalid workflow file",
                      variant: "destructive",
                    });
                  }
                };
                reader.readAsText(file);
              }
            };
            input.click();
          }}
        >
          📥 Import
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Zoom to fit all nodes - simplified approach
            const canvas = document.querySelector('.react-flow');
            if (canvas) {
              // Trigger a fit view by dispatching a custom event
              canvas.dispatchEvent(new CustomEvent('fitView'));
            }
          }}
          disabled={nodes.length === 0}
        >
          🔍 Fit View
        </Button>
        
        {/* Deploy Button - Only show when template is loaded */}
        {currentTemplate && nodes.length > 0 && (
          <Button
            size="sm"
            onClick={() => {
              if (onNavigateToDeploy) {
                onNavigateToDeploy();
              }
            }}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            🚀 Deploy Agent
          </Button>
        )}
      </div>
      
      {/* Connection Status Display */}
      {connectionMode && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <div className="text-lg">🔗</div>
            <div className="text-sm">
              <strong>Connection Mode Active:</strong>
              {!sourceNode && " Click on a source node (green dot) to start"}
              {sourceNode && !targetNode && ` Source: "${sourceNode.data.label}" - Now click on a target node (blue dot)`}
              {sourceNode && targetNode && ` Ready to connect: "${sourceNode.data.label}" → "${targetNode.data.label}"`}
            </div>
          </div>
          {sourceNode && targetNode && (
            <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
              ✅ <strong>Ready to Connect!</strong> Click "Create Connection" button to finalize the connection.
            </div>
          )}
        </div>
      )}

      {/* Connection Instructions */}
      {nodes.length > 0 && !connectionMode && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <div className="text-lg">💡</div>
            <div className="text-sm">
              <strong>How to Connect Nodes:</strong> Click "🔗 Start Connection Mode", then click on a source node (green dot), then click on a target node (blue dot), and finally click "Create Connection".
            </div>
          </div>
        </div>
      )}
      
      {/* Connection Tutorial */}
      {nodes.length === 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">How to Build Your Agent Workflow</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div>
                  <div className="font-medium mb-1">1. Add Nodes</div>
                  <p>Drag nodes from the left palette onto the canvas, or click to add them randomly</p>
                </div>
                <div>
                  <div className="font-medium mb-1">2. Connect Nodes</div>
                  <p>Click and drag from the blue dots (top-left) to green dots (bottom-right) to create connections</p>
                </div>
                <div>
                  <div className="font-medium mb-1">3. Configure</div>
                  <p>Click any node to open the configuration panel and customize its properties</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
                <strong>Pro Tip:</strong> Start with a Trigger node, add Skills and Actions in the middle, and end with Output nodes for a complete workflow!
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="h-[600px] w-full flex border rounded-lg bg-background">
        <div className="w-64 border-r bg-card p-4">
          <NodePalette onAddNode={addNode} />
        </div>
        <div className="flex-1 h-full">
            <ReactFlow
            nodes={nodes}
            edges={edges.map(edge => ({
              ...edge,
              style: { 
                stroke: '#3b82f6', 
                strokeWidth: 3,
                ...edge.style 
              },
              animated: edge.animated !== false
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            nodeTypes={nodeTypes}
            fitView
            className={`bg-background ${isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-30" />
            <Controls className="bg-card border shadow-lg" />
            <MiniMap className="bg-card border shadow-lg" />
          </ReactFlow>
        </div>
      </div>
      
      {/* Node Configuration Panel */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Configure Node: {selectedNode.data.label}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedNode(null)}
            >
              ✕ Close
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nodeLabel" className="text-sm font-medium">Node Label</Label>
              <Input
                id="nodeLabel"
                value={selectedNode.data.label || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                placeholder="Enter node label"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="nodeType" className="text-sm font-medium">Node Type</Label>
              <Input
                id="nodeType"
                value={selectedNode.type}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="nodeDescription" className="text-sm font-medium">Description</Label>
              <Textarea
                id="nodeDescription"
                value={selectedNode.data.description || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                placeholder="Describe what this node does..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="nodeConfig" className="text-sm font-medium">Configuration (JSON)</Label>
              <Textarea
                id="nodeConfig"
                value={JSON.stringify(selectedNode.data.config || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e.target.value);
                    updateNodeData(selectedNode.id, { config });
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder='{"key": "value"}'
                className="mt-1 font-mono text-sm"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter configuration as valid JSON
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Node ID: {selectedNode.id}</span>
              <span>Position: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</span>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Status Panel */}
      {isDeploying && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900">🚀 Deploying Agent to SEI Blockchain</h4>
              <p className="text-sm text-blue-700">
                {network === "testnet" && "Deploying to SEI Testnet (atlantic-2)"}
                {network === "mainnet" && "Deploying to SEI Mainnet (pacific-1)"}
                {network === "demo" && "Simulating deployment to SEI"}
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <div>• Generating smart contract code from workflow</div>
                <div>• Connecting to SEI network</div>
                <div>• Deploying contract to blockchain</div>
                <div>• Confirming transaction</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Results */}
      {!isDeploying && edges.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900">Ready to Deploy</h4>
              <p className="text-sm text-green-700">
                Your agent workflow is ready! You can deploy directly from here or use the dedicated deployment options.
              </p>
              <div className="mt-2 text-xs text-green-600">
                <div>• Workflow validated: {nodes.length} nodes, {edges.length} connections</div>
                <div>• Smart contract will be generated automatically</div>
                <div>• Current network: <strong>{network}</strong></div>
                <div>• Deploy to testnet first, then mainnet</div>
              </div>
              
              {/* Deployment Options */}
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs text-green-600 font-medium">Deployment Options:</span>
                <span className="text-xs text-green-500">🚀 Deploy directly from here</span>
                <span className="text-xs text-green-500">•</span>
                <span className="text-xs text-green-500">📋 Use dedicated deploy tab</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment History */}
      {(() => {
        const deploymentHistory = localStorage.getItem('sei-agent-deployment');
        if (deploymentHistory) {
          try {
            const deployment = JSON.parse(deploymentHistory);
            return (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📋</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">Last Deployment</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Network:</strong> {deployment.network}</div>
                      <div><strong>Contract:</strong> {deployment.contractAddress}</div>
                      <div><strong>Transaction:</strong> {deployment.txHash}</div>
                      <div><strong>Status:</strong> <span className="text-green-600">✅ Success</span></div>
                      <div><strong>Deployed:</strong> {new Date(deployment.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      Your agent is now live on the SEI blockchain! You can interact with it using the contract address above.
                    </div>
                  </div>
                </div>
              </div>
            );
          } catch (e) {
            return null;
          }
        }
        return null;
      })()}

      {/* Template Loaded Success Message */}
      {currentTemplate && nodes.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h4 className="font-semibold text-green-900">Template Loaded Successfully!</h4>
                <p className="text-sm text-green-700">
                  Your "{currentTemplate}" agent template is ready. You can now customize the nodes, 
                  add connections, or click the "🚀 Deploy Agent" button above when you're ready to deploy.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (onNavigateToDeploy) {
                  onNavigateToDeploy();
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Deploy Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}