import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NodePaletteProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

const nodeDefinitions = [
  {
    type: 'agentPersonality',
    label: 'Agent Personality',
    description: 'Define the agent\'s personality and behavior',
    icon: '🤖'
  },
  {
    type: 'skill',
    label: 'Skill',
    description: 'Add a skill or capability',
    icon: '⚡'
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Define an action the agent can perform',
    icon: '🎯'
  },
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Set up event triggers',
    icon: '🔔'
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Node Palette</h3>
      <div className="space-y-2">
        {nodeDefinitions.map((node) => (
          <Card key={node.type} className="p-3 cursor-grab active:cursor-grabbing">
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
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Drag nodes to the canvas or click to add them randomly
        </p>
      </div>
    </div>
  );
}