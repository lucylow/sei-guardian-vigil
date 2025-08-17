import React, { useState, useCallback } from 'react';
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
};

export default function VisualAgentBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

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
      const flowJson = { nodes, edges };
      
      const response = await fetch("/api/visual-agent/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flowJson),
      });

      const data = await response.json();
      
      if (data.status === "ok") {
        toast({
          title: "🚀 Agent Deployed!",
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
            Drag nodes from the palette to build your agent
          </p>
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
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
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