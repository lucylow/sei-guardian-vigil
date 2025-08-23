import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  MiniMap,
  Background,
  Elements,
  Connection,
  Edge,
  OnLoadParams,
  Node,
  Handle,
  Position,
  ReactFlowInstance,
  useReactFlow,
} from "react-flow-renderer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Play, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Copy, 
  Eye,
  Zap,
  Shield,
  Target,
  Activity,
  Globe,
  Database,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Wallet,
  Code,
  FileText,
  Share2
} from "lucide-react";

// SEI-themed node types with distinct colors and icons
const nodeTypes = {
  agentPersonality: { 
    color: "#00ff00", 
    label: "Agent Personality", 
    icon: Shield,
    description: "Define agent behavior and communication style"
  },
  skill: { 
    color: "#33cc33", 
    label: "Skill", 
    icon: Target,
    description: "Add capabilities like price monitoring, anomaly detection"
  },
  trigger: { 
    color: "#66ff66", 
    label: "Trigger", 
    icon: Zap,
    description: "Set conditions that activate the agent"
  },
  action: { 
    color: "#00cc00", 
    label: "Action", 
    icon: Activity,
    description: "Define what the agent does when triggered"
  },
  seiIntegration: { 
    color: "#009900", 
    label: "Sei Integration", 
    icon: Globe,
    description: "Connect to Sei blockchain and smart contracts"
  },
  output: { 
    color: "#006600", 
    label: "Output", 
    icon: Database,
    description: "Handle results, alerts, and data storage"
  },
};

// Custom node component with SEI branding
const CustomNode = ({ data, id, selected }: { data: any; id: string; selected: boolean }) => {
  const color = nodeTypes[data.type].color;
  const IconComponent = nodeTypes[data.type].icon;
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{
        padding: 12,
        borderRadius: 12,
        backgroundColor: color,
        color: "#000",
        fontWeight: "bold",
        minWidth: 160,
        textAlign: "center",
        border: selected ? "3px solid #fff" : "2px solid #000",
        boxShadow: selected ? `0 0 20px ${color}` : "0 4px 8px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />
      
      {/* Icon */}
      <div style={{ marginBottom: 8 }}>
        <IconComponent size={24} />
      </div>
      
      {/* Label */}
      <div style={{ fontSize: "14px", lineHeight: "1.2" }}>
        {nodeTypes[data.type].label}
      </div>
      
      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id={`${id}-target`} 
        style={{ 
          background: "#222", 
          border: "2px solid #fff",
          width: 12,
          height: 12
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id={`${id}-source`} 
        style={{ 
          background: "#222", 
          border: "2px solid #fff",
          width: 12,
          height: 12
        }} 
      />
    </motion.div>
  );
};

const NODE_TYPES = {
  customNode: CustomNode,
};

// Draggable sidebar node item
const SidebarNode = ({ type, label, icon: Icon, description }: { 
  type: string; 
  label: string; 
  icon: any;
  description: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <motion.div
      onDragStart={(e) => onDragStart(e, type)}
      draggable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: 12,
        margin: "8px 0",
        backgroundColor: nodeTypes[type].color,
        color: "#000",
        borderRadius: 8,
        cursor: "grab",
        fontWeight: "600",
        userSelect: "none",
        textAlign: "center",
        minWidth: 160,
        border: "2px solid transparent",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Icon size={20} />
      </div>
      <div style={{ fontSize: "12px", lineHeight: "1.2" }}>
        {label}
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute",
              left: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              marginLeft: 12,
              backgroundColor: "#000",
              color: "#fff",
              padding: 8,
              borderRadius: 6,
              fontSize: "11px",
              maxWidth: 200,
              zIndex: 1000,
              border: "1px solid #333"
            }}
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Node configuration panel
const NodeConfigPanel = ({ 
  selectedNode, 
  onClose, 
  onUpdate 
}: { 
  selectedNode: Node | null; 
  onClose: () => void; 
  onUpdate: (nodeId: string, data: any) => void;
}) => {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const nodeType = nodeTypes[selectedNode.data.type];
  
  const renderConfigFields = () => {
    switch (selectedNode.data.type) {
      case "agentPersonality":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={config.name || ""}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter agent name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Personality Type
              </label>
              <select
                value={config.personality || "friendly"}
                onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="analytical">Analytical</option>
                <option value="protective">Protective</option>
              </select>
            </div>
          </>
        );
      
      case "skill":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Type
              </label>
              <select
                value={config.skillType || "price-monitoring"}
                onChange={(e) => setConfig({ ...config, skillType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="price-monitoring">Price Monitoring</option>
                <option value="anomaly-detection">Anomaly Detection</option>
                <option value="vulnerability-scanning">Vulnerability Scanning</option>
                <option value="compliance-checking">Compliance Checking</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scan Frequency (seconds)
              </label>
              <input
                type="number"
                value={config.frequency || 60}
                onChange={(e) => setConfig({ ...config, frequency: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                min="1"
                max="3600"
              />
            </div>
          </>
        );
      
      case "trigger":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trigger Type
              </label>
              <select
                value={config.triggerType || "block-event"}
                onChange={(e) => setConfig({ ...config, triggerType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="block-event">Block Event</option>
                <option value="transaction">Transaction</option>
                <option value="price-threshold">Price Threshold</option>
                <option value="time-based">Time Based</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Threshold Value
              </label>
              <input
                type="text"
                value={config.threshold || ""}
                onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter threshold value"
              />
            </div>
          </>
        );
      
      case "action":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Action Type
              </label>
              <select
                value={config.actionType || "scan-contract"}
                onChange={(e) => setConfig({ ...config, actionType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="scan-contract">Scan Contract</option>
                <option value="mint-nft">Mint NFT</option>
                <option value="send-alert">Send Alert</option>
                <option value="execute-transaction">Execute Transaction</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Address
              </label>
              <input
                type="text"
                value={config.targetAddress || ""}
                onChange={(e) => setConfig({ ...config, targetAddress: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter contract address"
              />
            </div>
          </>
        );
      
      case "seiIntegration":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Network
              </label>
              <select
                value={config.network || "sei-testnet"}
                onChange={(e) => setConfig({ ...config, network: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="sei-testnet">Sei Testnet</option>
                <option value="sei-mainnet">Sei Mainnet</option>
                <option value="local-dev">Local Development</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                RPC Endpoint
              </label>
              <input
                type="text"
                value={config.rpcEndpoint || "https://rpc-testnet.sei.io"}
                onChange={(e) => setConfig({ ...config, rpcEndpoint: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter RPC endpoint"
              />
            </div>
          </>
        );
      
      case "output":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Output Type
              </label>
              <select
                value={config.outputType || "webhook"}
                onChange={(e) => setConfig({ ...config, outputType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="webhook">Webhook</option>
                <option value="database">Database</option>
                <option value="dashboard">Dashboard</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination URL
              </label>
              <input
                type="text"
                value={config.destinationUrl || ""}
                onChange={(e) => setConfig({ ...config, destinationUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter destination URL"
              />
            </div>
          </>
        );
      
      default:
        return (
          <div className="text-gray-400 text-sm">
            No configuration options available for this node type.
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <nodeType.icon className="w-5 h-5 mr-2" />
          Configure {nodeType.label}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {renderConfigFields()}
        
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              onUpdate(selectedNode.id, { ...selectedNode.data, config });
              onClose();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Visual Agent Builder component
export default function VisualAgentBuilder() {
  const [elements, setElements] = useState<Elements>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [flowName, setFlowName] = useState("Untitled Flow");
  const [isDeploying, setIsDeploying] = useState(false);

  const onConnect = useCallback((params: Edge | Connection) => {
    setElements((els) => addEdge(params, els));
  }, []);

  const onElementsRemove = useCallback((elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
  }, []);

  const onLoad = useCallback((reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(reactFlowInstance);
    reactFlowInstance.fitView();
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsConfigPanelOpen(true);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: "customNode",
        data: { type, config: {} },
        position,
      };

      setElements((es) => es.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setElements((els) =>
      els.map((el) =>
        el.id === nodeId ? { ...el, data: { ...el.data, ...newData } } : el
      )
    );
  }, []);

  const saveFlow = useCallback(async () => {
    try {
      const flowData = {
        name: flowName,
        elements,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage for now, can be extended to save to backend
      localStorage.setItem(`sei-flow-${flowName}`, JSON.stringify(flowData));
      
      // Show success message
      alert("Flow saved successfully!");
    } catch (error) {
      console.error("Error saving flow:", error);
      alert("Error saving flow");
    }
  }, [flowName, elements]);

  const loadFlow = useCallback(() => {
    const savedFlows = Object.keys(localStorage).filter(key => key.startsWith('sei-flow-'));
    if (savedFlows.length === 0) {
      alert("No saved flows found");
      return;
    }

    const flowName = prompt("Enter flow name to load:");
    if (!flowName) return;

    const flowKey = `sei-flow-${flowName}`;
    const savedFlow = localStorage.getItem(flowKey);
    
    if (savedFlow) {
      try {
        const flowData = JSON.parse(savedFlow);
        setElements(flowData.elements);
        setFlowName(flowData.name);
        alert("Flow loaded successfully!");
      } catch (error) {
        console.error("Error loading flow:", error);
        alert("Error loading flow");
      }
    } else {
      alert("Flow not found");
    }
  }, []);

  const deployFlow = useCallback(async () => {
    if (elements.length === 0) {
      alert("No nodes to deploy");
      return;
    }

    setIsDeploying(true);
    
    try {
      // Convert visual flow to agent configuration
      const agentConfig = {
        name: flowName,
        description: `AI Agent built with SEI Sentinel Visual Builder`,
        agentType: "Custom" as const,
        ownerWalletAddress: "sei1demo123...", // This would come from connected wallet
        configuration: {
          flow: elements,
          nodeConfigs: elements.reduce((acc, el) => {
            if (el.type === "customNode") {
              acc[el.id] = el.data.config;
            }
            return acc;
          }, {} as Record<string, any>)
        }
      };

      // Call backend to deploy agent
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentConfig)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Agent deployed successfully! NFT Token ID: ${result.agent.nftTokenId}`);
      } else {
        throw new Error('Failed to deploy agent');
      }
    } catch (error) {
      console.error("Error deploying flow:", error);
      alert("Error deploying flow. Please check console for details.");
    } finally {
      setIsDeploying(false);
    }
  }, [elements, flowName]);

  const exportFlow = useCallback(() => {
    const flowData = {
      name: flowName,
      elements,
      metadata: {
        created: new Date().toISOString(),
        version: "1.0.0",
        tool: "SEI Sentinel Visual Agent Builder"
      }
    };

    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${flowName.replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [flowName, elements]);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-green-400 font-mono">
              🛡️ SEI SENTINEL VISUAL AGENT BUILDER
            </h1>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="Enter flow name"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={saveFlow}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            
            <button
              onClick={loadFlow}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Upload size={16} />
              <span>Load</span>
            </button>
            
            <button
              onClick={exportFlow}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            
            <button
              onClick={deployFlow}
              disabled={isDeploying || elements.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              {isDeploying ? (
                <>
                  <Activity size={16} className="animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Deploy Agent</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold text-green-400 mb-4 font-mono">
            Node Types
          </h3>
          <div className="space-y-2">
            {Object.entries(nodeTypes).map(([type, { label, icon, description }]) => (
              <SidebarNode 
                key={type} 
                type={type} 
                label={label} 
                icon={icon}
                description={description}
              />
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => setElements([])}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <section className="flex-1 relative">
          <ReactFlowProvider>
            <ReactFlow
              elements={elements}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={NODE_TYPES}
              snapToGrid={true}
              snapGrid={[20, 20]}
              style={{ background: "#000" }}
              connectionMode="loose"
              deleteKeyCode="Delete"
            >
              <MiniMap
                nodeStrokeColor={(n) => {
                  if (n.type === "customNode") {
                    return nodeTypes[n.data.type].color;
                  }
                  return "#eee";
                }}
                nodeColor={() => "#000"}
                nodeBorderRadius={2}
                style={{ backgroundColor: "#111" }}
              />
              <Controls style={{ backgroundColor: "#111", border: "1px solid #333" }} />
              <Background color="#111" gap={20} size={1} />
            </ReactFlow>
          </ReactFlowProvider>

          {/* Configuration Panel */}
          <AnimatePresence>
            {isConfigPanelOpen && selectedNode && (
              <NodeConfigPanel
                selectedNode={selectedNode}
                onClose={() => {
                  setIsConfigPanelOpen(false);
                  setSelectedNode(null);
                }}
                onUpdate={updateNodeData}
              />
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Nodes: {elements.filter(el => el.type === "customNode").length}</span>
            <span>Connections: {elements.filter(el => el.type === "edge").length}</span>
            <span>Status: Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>SEI Network Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
