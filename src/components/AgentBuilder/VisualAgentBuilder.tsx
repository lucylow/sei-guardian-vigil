import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodePalette } from './NodePalette';
import { Button } from '@/components/ui/button';
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
  }
};

const nodeTypes = {
  agentPersonality: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
      <div className="font-semibold">Agent Personality</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  skill: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
      <div className="font-semibold">Skill</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  action: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">
      <div className="font-semibold">Action</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  trigger: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-muted text-muted-foreground rounded-lg border">
      <div className="font-semibold">Trigger</div>
      <div className="text-sm">{data.label}</div>
    </div>
  ),
  output: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-green-600 text-white rounded-lg">
      <div className="font-semibold">Output</div>
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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            nodeTypes={nodeTypes}
            fitView
            className={`bg-background ${isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
          >
            <Background />
            <Controls className="bg-card border" />
            <MiniMap className="bg-card border" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}