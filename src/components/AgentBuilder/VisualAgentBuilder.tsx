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

  return (
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
  );
}