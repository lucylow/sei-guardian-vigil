import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NodePaletteProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

const nodeDefinitions = [
  // Core Agent Components
  {
    type: 'agentPersonality',
    label: 'Agent Personality',
    description: 'Define the agent\'s personality and behavior',
    icon: '🤖',
    category: 'Core'
  },
  {
    type: 'skill',
    label: 'Skill',
    description: 'Add a skill or capability',
    icon: '⚡',
    category: 'Core'
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Define an action the agent can perform',
    icon: '🎯',
    category: 'Core'
  },
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Set up event triggers',
    icon: '🔔',
    category: 'Core'
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Handle outputs and results',
    icon: '📤',
    category: 'Core'
  },
  
  // Data & Input Nodes
  {
    type: 'dataSource',
    label: 'Data Source',
    description: 'Connect to APIs, databases, or external sources',
    icon: '📡',
    category: 'Data'
  },
  {
    type: 'webhook',
    label: 'Webhook',
    description: 'Receive data from external services',
    icon: '🔗',
    category: 'Data'
  },
  {
    type: 'blockchain',
    label: 'Blockchain',
    description: 'Read from Sei or other blockchains',
    icon: '⛓️',
    category: 'Data'
  },
  {
    type: 'database',
    label: 'Database',
    description: 'Read/write to databases',
    icon: '🗄️',
    category: 'Data'
  },
  
  // Logic & Control Nodes
  {
    type: 'condition',
    label: 'Condition',
    description: 'If/else logic and decision making',
    icon: '🔀',
    category: 'Logic'
  },
  {
    type: 'loop',
    label: 'Loop',
    description: 'Repeat operations multiple times',
    icon: '🔄',
    category: 'Logic'
  },
  {
    type: 'switch',
    label: 'Switch',
    description: 'Multiple condition branching',
    icon: '🎚️',
    category: 'Logic'
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Add time delays or scheduling',
    icon: '⏰',
    category: 'Logic'
  },
  
  // Processing Nodes
  {
    type: 'math',
    label: 'Math',
    description: 'Mathematical operations and calculations',
    icon: '🧮',
    category: 'Processing'
  },
  {
    type: 'transform',
    label: 'Transform',
    description: 'Data transformation and formatting',
    icon: '🔄',
    category: 'Processing'
  },
  {
    type: 'aggregate',
    label: 'Aggregate',
    description: 'Combine and summarize data',
    icon: '📊',
    category: 'Processing'
  },
  {
    type: 'filter',
    label: 'Filter',
    description: 'Filter data based on conditions',
    icon: '🔍',
    category: 'Processing'
  },
  
  // AI & External Services
  {
    type: 'aiModel',
    label: 'AI Model',
    description: 'Integrate with AI/ML models',
    icon: '🧠',
    category: 'AI'
  },
  {
    type: 'nlp',
    label: 'NLP',
    description: 'Natural language processing',
    icon: '💬',
    category: 'AI'
  },
  {
    type: 'vision',
    label: 'Computer Vision',
    description: 'Image and video analysis',
    icon: '👁️',
    category: 'AI'
  },
  
  // Communication Nodes
  {
    type: 'email',
    label: 'Email',
    description: 'Send emails and notifications',
    icon: '📧',
    category: 'Communication'
  },
  {
    type: 'sms',
    label: 'SMS',
    description: 'Send text messages',
    icon: '📱',
    category: 'Communication'
  },
  {
    type: 'slack',
    label: 'Slack',
    description: 'Send Slack messages',
    icon: '💬',
    category: 'Communication'
  },
  {
    type: 'discord',
    label: 'Discord',
    description: 'Send Discord messages',
    icon: '🎮',
    category: 'Communication'
  },
  
  // Storage & Output Nodes
  {
    type: 'fileStorage',
    label: 'File Storage',
    description: 'Save files to cloud storage',
    icon: '💾',
    category: 'Storage'
  },
  {
    type: 'cache',
    label: 'Cache',
    description: 'Temporary data storage',
    icon: '⚡',
    category: 'Storage'
  },
  {
    type: 'queue',
    label: 'Queue',
    description: 'Message queuing system',
    icon: '📋',
    category: 'Storage'
  },
  
  // Monitoring & Analytics
  {
    type: 'metrics',
    label: 'Metrics',
    description: 'Collect and track metrics',
    icon: '📈',
    category: 'Monitoring'
  },
  {
    type: 'alert',
    label: 'Alert',
    description: 'Send alerts and notifications',
    icon: '🚨',
    category: 'Monitoring'
  },
  {
    type: 'logging',
    label: 'Logging',
    description: 'Log events and activities',
    icon: '📝',
    category: 'Monitoring'
  }
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (type: string) => {
    const position = {
      x: Math.random() * 400,
      y: Math.random() * 400
    };
    onAddNode(type, position);
  };

  // Group nodes by category
  const groupedNodes = nodeDefinitions.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, typeof nodeDefinitions>);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground mb-4">Node Palette</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide sticky top-0 bg-card py-1 z-10">
              {category}
            </h4>
            <div className="space-y-2">
              {nodes.map((node) => (
                <Card key={node.type} className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    onClick={() => handleAddNode(node.type)}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{node.icon}</span>
                      <span className="font-medium text-sm">{node.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{node.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200 mt-4">
        <p className="text-xs text-muted-foreground">
          Drag nodes to the canvas or click to add them randomly
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {nodeDefinitions.length} node types available
        </p>
      </div>
    </div>
  );
}