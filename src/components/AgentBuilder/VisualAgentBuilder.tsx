import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Connection,
  type Edge,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodePalette } from './NodePalette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">Agent Personality</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  skill: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">Skill</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  action: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">Action</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  trigger: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-muted text-muted-foreground rounded-lg border relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">Trigger</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  output: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-green-600 text-white rounded-lg relative">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="font-semibold">Output</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  
  // Data & Input Nodes
  dataSource: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
      <div className="font-semibold">Data Source</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  webhook: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg">
      <div className="font-semibold">Webhook</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  blockchain: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-purple-600 text-white rounded-lg">
      <div className="font-semibold">Blockchain</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  database: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
      <div className="font-semibold">Database</div>
      <div className="text-sm">{data.label}</div>
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
  selectedTemplate?: string;
}

export default function VisualAgentBuilder({ selectedTemplate }: VisualAgentBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [network, setNetwork] = useState("demo");
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { toast } = useToast();

  // Load template when selectedTemplate prop changes
  useEffect(() => {
    console.log('VisualAgentBuilder: selectedTemplate changed to:', selectedTemplate);
    if (selectedTemplate && agentTemplates[selectedTemplate]) {
      console.log('VisualAgentBuilder: Loading template:', agentTemplates[selectedTemplate]);
      loadTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  const loadTemplate = useCallback((templateId: string) => {
    console.log('VisualAgentBuilder: loadTemplate called with:', templateId);
    const template = agentTemplates[templateId];
    if (template) {
      console.log('VisualAgentBuilder: Setting nodes and edges for template:', template.name);
      setNodes(template.nodes);
      setEdges(template.edges);
      setCurrentTemplate(templateId);
      
      toast({
        title: `📋 Template Loaded: ${template.name}`,
        description: template.description,
      });
    } else {
      console.error('VisualAgentBuilder: Template not found for ID:', templateId);
    }
  }, [setNodes, setEdges, toast]);

  const onConnectStart = useCallback((event: any, params: any) => {
    console.log('Connection start:', params);
    // Add visual feedback for connection start
    document.body.style.cursor = 'crosshair';
    // Add a visual indicator to the source node
    if (params.nodeId) {
      const nodeElement = document.querySelector(`[data-id="${params.nodeId}"]`);
      if (nodeElement) {
        nodeElement.classList.add('ring-2', 'ring-green-500', 'ring-opacity-75');
      }
    }
  }, []);

  const onConnectEnd = useCallback((event: any) => {
    console.log('Connection end:', event);
    // Reset cursor
    document.body.style.cursor = 'default';
    // Remove visual indicators from all nodes
    document.querySelectorAll('.react-flow__node').forEach(node => {
      node.classList.remove('ring-2', 'ring-green-500', 'ring-opacity-75');
    });
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('Connection attempt:', params);
      
      // Simple validation
      if (!params.source || !params.target) {
        console.log('Invalid connection params');
        return;
      }
      
      // Create new edge with enhanced styling
      const newEdge: Edge = {
        id: `e${Date.now()}`,
        source: params.source,
        target: params.target,
        type: 'default',
        animated: true,
        style: { 
          stroke: '#3b82f6', 
          strokeWidth: 3,
          filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
        },
        label: `Connection ${params.source} → ${params.target}`,
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
      
      console.log('Adding new edge:', newEdge);
      setEdges((eds) => [...eds, newEdge]);
      
      toast({
        title: "✅ Connection Created",
        description: `Connected nodes successfully`,
      });
    },
    [setEdges, toast]
  );

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
    console.log('Node clicked:', node);
  }, []);

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

  const handleDeploy = async () => {
    if (nodes.length === 0) {
      toast({
        title: "No Agent Design",
        description: "Add some nodes to create your agent first!",
        variant: "destructive",
      });
      return;
    }

    // Validate workflow
    const validation = validateWorkflow(nodes, edges);
    if (!validation.isValid) {
      toast({
        title: "❌ Workflow Validation Failed",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);

    try {
      const flowJson = { nodes, edges, network };
      const response = await fetch("/api/visual-agent/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flowJson),
      });

      const data = await response.json();

      if (data.status === "ok") {
        toast({
          title: `🚀 Agent Deployed on ${network.toUpperCase()}!`,
          description: `NFT: ${data.agentNft?.slice(0, 10)}... | Tx: ${data.txHash?.slice(0, 10)}...`,
        });
      } else {
        throw new Error(data.error || "Deployment failed");
      }
    } catch (error) {
      toast({
        title: "❌ Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const validateWorkflow = (workflowNodes: Node[], workflowEdges: any[]) => {
    const errors: string[] = [];
    
    // Check if there are trigger nodes
    const triggerNodes = workflowNodes.filter(n => n.type === 'trigger');
    if (triggerNodes.length === 0) {
      errors.push("No trigger nodes found - every agent needs a starting point");
    }
    
    // Check if there are output nodes
    const outputNodes = workflowNodes.filter(n => n.type === 'output');
    if (outputNodes.length === 0) {
      errors.push("No output nodes found - every agent needs an endpoint");
    }
    
    // Check for disconnected nodes
    const connectedNodeIds = new Set();
    workflowEdges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const disconnectedNodes = workflowNodes.filter(n => !connectedNodeIds.has(n.id));
    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} disconnected nodes found`);
    }
    
    // Check for cycles (basic check)
    const hasCycles = checkForCycles(workflowNodes, workflowEdges);
    if (hasCycles) {
      errors.push("Workflow contains cycles which may cause infinite loops");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const checkForCycles = (workflowNodes: Node[], workflowEdges: any[]) => {
    // Simple cycle detection - can be enhanced
    const visited = new Set();
    const recStack = new Set();
    
    const hasCycle = (nodeId: string) => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      recStack.add(nodeId);
      
      const outgoingEdges = workflowEdges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true;
      }
      
      recStack.delete(nodeId);
      return false;
    };
    
    for (const node of workflowNodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) return true;
      }
    }
    
    return false;
  };

  return (
    <div className="space-y-4">
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
          <Button
            onClick={handleDeploy}
            disabled={isDeploying || nodes.length === 0}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Deploying to Sei...
              </>
            ) : (
              '🚀 Deploy Agent'
            )}
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
      </div>
      
      {/* Connection Instructions */}
      {nodes.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <div className="text-lg">🔗</div>
            <div className="text-sm">
              <strong>How to Connect Nodes:</strong> Click and drag from a <span className="bg-green-500 text-white px-1 rounded">🟢 green dot</span> (output) to a <span className="bg-blue-500 text-white px-1 rounded">🔵 blue dot</span> (input) to create a connection line
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-700">
            💡 <strong>Pro Tip:</strong> When you start dragging from a green dot, you'll see a connection line. Drop it on a blue dot to complete the connection!
          </div>
          <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
            🎯 <strong>Connection Mode:</strong> 
            <span className="ml-1 font-mono">🟢 Green dots = Outputs (start connections)</span> | 
            <span className="ml-1 font-mono">🔵 Blue dots = Inputs (end connections)</span>
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
            edges={edges}
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
            snapToGrid={true}
            snapGrid={[15, 15]}
            connectOnClick={false}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
            selectionKeyCode="Ctrl"
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            preventScrolling={true}
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls className="bg-card border" />
            <MiniMap className="bg-card border" />
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
    </div>
  );
}