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
import AgentPersonalityNode from './nodes/AgentPersonalityNode';
import SkillNode from './nodes/SkillNode';
import ActionNode from './nodes/ActionNode';
import TriggerNode from './nodes/TriggerNode';
import SeiIntegrationNode from './nodes/SeiIntegrationNode';
import OutputNode from './nodes/OutputNode';
import NodePalette from './NodePalette';
import ConfigurationPanel from './ConfigurationPanel';

const nodeTypes = {
  agentPersonality: AgentPersonalityNode,
  skill: SkillNode,
  action: ActionNode,
  trigger: TriggerNode,
  seiIntegration: SeiIntegrationNode,
  output: OutputNode,
};

// Template loader and converter
const curatedTemplates = [
  require('@/templates/defi-concierge.json'),
  require('@/templates/nft-lifecycle-tracker.json'),
  require('@/templates/wallet-behavior-analyst.json'),
  // ...add more templates as needed
];

function templateToFlow(template) {
  const nodes = [];
  let x = 100, y = 100;
  nodes.push({
    id: "personality",
    type: "agentPersonality",
    position: { x, y },
    data: { ...template }
  });
  y += 120;
  template.skills?.forEach((skill, i) => {
    nodes.push({
      id: `skill-${i}`,
      type: "skill",
      position: { x: x + 200, y: y + i * 100 },
      data: skill
    });
  });
  template.triggers?.forEach((trigger, i) => {
    nodes.push({
      id: `trigger-${i}`,
      type: "trigger",
      position: { x: x + 400, y: y + i * 100 },
      data: trigger
    });
  });
  template.actions?.forEach((action, i) => {
    nodes.push({
      id: `action-${i}`,
      type: "action",
      position: { x: x + 600, y: y + i * 100 },
      data: action
    });
  });
  if (template['sei-integration']) {
    nodes.push({
      id: "sei-integration",
      type: "seiIntegration",
      position: { x: x + 800, y },
      data: template['sei-integration']
    });
  }
  if (template.output) {
    nodes.push({
      id: "output",
      type: "output",
      position: { x: x + 1000, y },
      data: template.output
    });
  }
  return { nodes, edges: [] };
}

export default function VisualAgentBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [agentConfig, setAgentConfig] = useState({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
        label: type,
        config: {}
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deployAgent = useCallback(async () => {
    setIsDeploying(true);
    // ...deployment logic...
    setIsDeploying(false);
  }, [nodes, edges, agentConfig]);

  // Load template into flow
  useEffect(() => {
    if (selectedTemplate) {
      const { nodes, edges } = templateToFlow(selectedTemplate);
      setNodes(nodes);
      setEdges(edges);
      setAgentConfig(selectedTemplate);
    }
  }, [selectedTemplate, setNodes, setEdges, setAgentConfig]);

  // UI for template selection
  const TemplateSelector = () => (
    <div className="mb-4">
      <label className="font-bold text-sm mb-2 block">Agent Templates:</label>
      <select
        className="border rounded px-2 py-1"
        onChange={e => {
          const idx = parseInt(e.target.value, 10);
          setSelectedTemplate(curatedTemplates[idx]);
        }}
        defaultValue=""
      >
        <option value="" disabled>Select a template...</option>
        {curatedTemplates.map((tpl, idx) => (
          <option key={tpl.name} value={idx}>{tpl.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="h-screen w-full flex">
      <div>
        <TemplateSelector />
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
          className="bg-gradient-to-br from-purple-50 to-blue-50"
        >
          <Background pattern="dots" gap={20} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <ConfigurationPanel
        agentConfig={agentConfig}
        setAgentConfig={setAgentConfig}
        onDeploy={deployAgent}
        isDeploying={isDeploying}
      />
    </div>
  );
}
