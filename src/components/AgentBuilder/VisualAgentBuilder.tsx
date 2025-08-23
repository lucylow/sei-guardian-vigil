import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Zap, 
  Shield, 
  Target,
  Activity,
  Wallet,
  Bot,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Rocket
} from 'lucide-react';

// Node types for the agent builder
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  skill: SkillNode,
  action: ActionNode,
  seiIntegration: SeiIntegrationNode,
  output: OutputNode,
};

// Trigger Node Component
function TriggerNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} bg-white shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="font-medium text-sm">Trigger</span>
      </div>
      <div className="text-xs text-gray-600">{data.label}</div>
      {data.config && (
        <div className="mt-2 text-xs">
          <div className="font-medium">Config:</div>
          <div className="text-gray-500">{data.config}</div>
        </div>
      )}
    </div>
  );
}

// Skill Node Component
function SkillNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${selected ? 'border-green-500' : 'border-gray-300'} bg-white shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="font-medium text-sm">Skill</span>
      </div>
      <div className="text-xs text-gray-600">{data.label}</div>
      {data.description && (
        <div className="mt-2 text-xs text-gray-500">{data.description}</div>
      )}
    </div>
  );
}

// Action Node Component
function ActionNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${selected ? 'border-purple-500' : 'border-gray-300'} bg-white shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <span className="font-medium text-sm">Action</span>
      </div>
      <div className="text-xs text-gray-600">{data.label}</div>
      {data.parameters && (
        <div className="mt-2 text-xs">
          <div className="font-medium">Params:</div>
          <div className="text-gray-500">{data.parameters}</div>
        </div>
      )}
    </div>
  );
}

// SEI Integration Node Component
function SeiIntegrationNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${selected ? 'border-orange-500' : 'border-gray-300'} bg-white shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-orange-500" />
        <span className="font-medium text-sm">SEI Integration</span>
      </div>
      <div className="text-xs text-gray-600">{data.label}</div>
      {data.contractAddress && (
        <div className="mt-2 text-xs">
          <div className="font-medium">Contract:</div>
          <div className="text-gray-500 font-mono">{data.contractAddress}</div>
        </div>
      )}
    </div>
  );
}

// Output Node Component
function OutputNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${selected ? 'border-red-500' : 'border-gray-300'} bg-white shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="font-medium text-sm">Output</span>
      </div>
      <div className="text-xs text-gray-600">{data.label}</div>
      {data.format && (
        <div className="mt-2 text-xs">
          <div className="font-medium">Format:</div>
          <div className="text-gray-500">{data.format}</div>
        </div>
      )}
    </div>
  );
}

// Node Configuration Panel
function NodeConfigPanel({ selectedNode, onUpdateNode }: { selectedNode: Node | null; onUpdateNode: (nodeId: string, data: any) => void }) {
  if (!selectedNode) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-lg">Node Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a node to configure its properties</p>
        </CardContent>
      </Card>
    );
  }

  const updateNodeData = (field: string, value: string) => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      [field]: value,
    });
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {selectedNode.type === 'trigger' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
          {selectedNode.type === 'skill' && <div className="w-3 h-3 rounded-full bg-green-500" />}
          {selectedNode.type === 'action' && <div className="w-3 h-3 rounded-full bg-purple-500" />}
          {selectedNode.type === 'seiIntegration' && <div className="w-3 h-3 rounded-full bg-orange-500" />}
          {selectedNode.type === 'output' && <div className="w-3 h-3 rounded-full bg-red-500" />}
          {selectedNode.type?.charAt(0).toUpperCase() + selectedNode.type?.slice(1)} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={selectedNode.data.label || ''}
            onChange={(e) => updateNodeData('label', e.target.value)}
            placeholder="Enter node label"
          />
        </div>

        {selectedNode.type === 'trigger' && (
          <div>
            <Label htmlFor="triggerType">Trigger Type</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedNode.data.triggerType || 'block'}
              onChange={(e) => updateNodeData('triggerType', e.target.value)}
            >
              <option value="block">New Block</option>
              <option value="contract">Contract Deploy</option>
              <option value="price">Price Threshold</option>
              <option value="event">Custom Event</option>
            </select>
          </div>
        )}

        {selectedNode.type === 'skill' && (
          <div>
            <Label htmlFor="skillType">Skill Type</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedNode.data.skillType || 'scanning'}
              onChange={(e) => updateNodeData('skillType', e.target.value)}
            >
              <option value="scanning">Contract Scanning</option>
              <option value="monitoring">Price Monitoring</option>
              <option value="analysis">Static Analysis</option>
              <option value="detection">Vulnerability Detection</option>
            </select>
          </div>
        )}

        {selectedNode.type === 'seiIntegration' && (
          <div>
            <Label htmlFor="contractAddress">Contract Address</Label>
            <Input
              id="contractAddress"
              value={selectedNode.data.contractAddress || ''}
              onChange={(e) => updateNodeData('contractAddress', e.target.value)}
              placeholder="sei1..."
            />
          </div>
        )}

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={selectedNode.data.description || ''}
            onChange={(e) => updateNodeData('description', e.target.value)}
            placeholder="Enter node description"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Main Visual Agent Builder Component
export default function VisualAgentBuilder({ 
  selectedTemplate, 
  onNavigateToDeploy 
}: { 
  selectedTemplate?: string | null; 
  onNavigateToDeploy?: () => void; 
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle node selection
  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Update node data
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      }),
    );
  }, [setNodes]);

  // Add new node to canvas
  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: {
        label: `New ${type}`,
        description: '',
        config: '',
        parameters: '',
        contractAddress: '',
        format: '',
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Handle drag from palette
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !reactFlowBounds) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [project, addNode],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Load template-specific starting nodes
  useEffect(() => {
    if (selectedTemplate) {
      const templateNodes = getTemplateNodes(selectedTemplate);
      setNodes(templateNodes);
      setEdges([]);
    }
  }, [selectedTemplate]);

  // Get template-specific starting nodes
  const getTemplateNodes = (template: string): Node[] => {
    switch (template) {
      case 'defi-arbitrage':
        return [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 100, y: 100 },
            data: {
              label: 'Price Monitor',
              description: 'Monitor SEI token prices across exchanges',
              triggerType: 'price',
              priceThreshold: '0.50'
            }
          } as Node,
          {
            id: 'skill-1',
            type: 'skill',
            position: { x: 300, y: 100 },
            data: {
              label: 'Arbitrage Detector',
              description: 'AI-powered arbitrage opportunity detection',
              skillType: 'detection',
              aiModel: 'transformer',
              confidenceThreshold: '85'
            }
          } as Node,
          {
            id: 'action-1',
            type: 'action',
            position: { x: 500, y: 100 },
            data: {
              label: 'Execute Trade',
              description: 'Automatically execute arbitrage trades',
              actionType: 'transaction'
            }
          } as Node
        ];
      
      case 'security-scanner':
        return [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 100, y: 100 },
            data: {
              label: 'Contract Deploy',
              description: 'Trigger on new contract deployment',
              triggerType: 'contract'
            }
          } as Node,
          {
            id: 'skill-1',
            type: 'skill',
            position: { x: 300, y: 100 },
            data: {
              label: 'Vulnerability Scanner',
              description: 'AI-powered security analysis',
              skillType: 'scanning',
              aiModel: 'transformer',
              confidenceThreshold: '90'
            }
          } as Node,
          {
            id: 'output-1',
            type: 'output',
            position: { x: 500, y: 100 },
            data: {
              label: 'Security Report',
              description: 'Generate detailed security report',
              outputType: 'dashboard',
              outputFormat: 'json'
            }
          } as Node
        ];
      
      case 'portfolio-manager':
        return [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 100, y: 100 },
            data: {
              label: 'Portfolio Update',
              description: 'Trigger on portfolio changes',
              triggerType: 'event'
            }
          } as Node,
          {
            id: 'skill-1',
            type: 'skill',
            position: { x: 300, y: 100 },
            data: {
              label: 'AI Portfolio Optimizer',
              description: 'Machine learning portfolio optimization',
              skillType: 'analysis',
              aiModel: 'ensemble',
              confidenceThreshold: '80'
            }
          } as Node,
          {
            id: 'action-1',
            type: 'action',
            position: { x: 500, y: 100 },
            data: {
              label: 'Rebalance Portfolio',
              description: 'Execute portfolio rebalancing',
              actionType: 'transaction'
            }
          } as Node
        ];
      
      default:
        return [];
    }
  };

  // Simulate agent execution
  const simulateAgent = () => {
    setIsSimulating(true);
    setSimulationLog([]);
    
    // Simulate execution steps
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '🚀 Starting agent simulation...']);
    }, 500);
    
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '📡 Connecting to SEI network...']);
    }, 1500);
    
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '🔍 Scanning blockchain for triggers...']);
    }, 2500);
    
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '⚡ Executing agent skills...']);
    }, 3500);
    
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '✅ Agent execution completed successfully!']);
      setIsSimulating(false);
    }, 4500);
  };

  // Save agent configuration
  const saveAgent = () => {
    const agentConfig = {
      name: agentName,
      description: agentDescription,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    const dataStr = JSON.stringify(agentConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${agentName || 'agent'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Load agent configuration
  const loadAgent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setAgentName(config.name || '');
          setAgentDescription(config.description || '');
          setNodes(config.nodes || []);
          setEdges(config.edges || []);
        } catch (error) {
          console.error('Error loading agent config:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Node Palette */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Node Palette</h2>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Triggers</h3>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'trigger')}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Block Event</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Triggers on new blocks</p>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'trigger')}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Price Alert</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Triggers on price changes</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Skills</h3>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'skill')}
              className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-move hover:bg-green-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Contract Scanner</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">AI-powered contract analysis</p>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'skill')}
              className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-move hover:bg-green-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Vulnerability Detector</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Security flaw identification</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">SEI Integration</h3>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'seiIntegration')}
              className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-move hover:bg-orange-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Wallet Connect</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Connect to SEI wallet</p>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'seiIntegration')}
              className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-move hover:bg-orange-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Smart Contract</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Interact with contracts</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Actions</h3>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'action')}
              className="p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-move hover:bg-purple-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">Send Alert</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Send notification</p>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'action')}
              className="p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-move hover:bg-purple-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">Mint NFT</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Create achievement NFT</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Outputs</h3>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'output')}
              className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-move hover:bg-red-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Dashboard</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Display results</p>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'output')}
              className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-move hover:bg-red-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Webhook</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Send data to external service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="agentName" className="text-sm font-medium">Agent Name</Label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter agent name"
                  className="w-48"
                />
              </div>
              <div>
                <Label htmlFor="agentDescription" className="text-sm font-medium">Description</Label>
                <Input
                  id="agentDescription"
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="Enter agent description"
                  className="w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={simulateAgent} disabled={isSimulating} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Simulate'}
              </Button>
              <Button onClick={saveAgent} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="relative">
                <Upload className="w-4 h-4 mr-2" />
                Load
                <input
                  type="file"
                  accept=".json"
                  onChange={loadAgent}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Button>
              {onNavigateToDeploy && (
                <Button 
                  onClick={onNavigateToDeploy}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Agent
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <Background />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Configuration Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <NodeConfigPanel selectedNode={selectedNode} onUpdateNode={updateNodeData} />
        
        {/* Simulation Log */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Simulation Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {simulationLog.length === 0 ? (
                <p className="text-muted-foreground text-sm">No simulation logs yet</p>
              ) : (
                simulationLog.map((log, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}