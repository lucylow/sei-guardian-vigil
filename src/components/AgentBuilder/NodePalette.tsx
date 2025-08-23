import React from 'react';
import { 
  Bot, 
  Zap, 
  Shield, 
  Target, 
  Activity, 
  Wallet, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Lock,
  Unlock,
  DollarSign,
  Users,
  Gavel
} from 'lucide-react';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function NodePalette({ onDragStart }: NodePaletteProps) {
  const nodeTypes = [
    {
      category: 'Triggers',
      nodes: [
        {
          type: 'trigger',
          label: 'Block Event',
          description: 'Triggers on new blocks',
          icon: <Activity className="w-4 h-4" />,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:bg-blue-100'
        },
        {
          type: 'trigger',
          label: 'Price Alert',
          description: 'Triggers on price changes',
          icon: <TrendingUp className="w-4 h-4" />,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:bg-blue-100'
        },
        {
          type: 'trigger',
          label: 'Contract Deploy',
          description: 'Triggers on new contract deployment',
          icon: <Lock className="w-4 h-4" />,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:bg-blue-100'
        }
      ]
    },
    {
      category: 'Skills',
      nodes: [
        {
          type: 'skill',
          label: 'Contract Scanner',
          description: 'AI-powered contract analysis',
          icon: <Eye className="w-4 h-4" />,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        },
        {
          type: 'skill',
          label: 'Vulnerability Detector',
          description: 'Security flaw identification',
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        },
        {
          type: 'skill',
          label: 'Price Monitor',
          description: 'Real-time price tracking',
          icon: <TrendingUp className="w-4 h-4" />,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        },
        {
          type: 'skill',
          label: 'Governance Monitor',
          description: 'Track DAO proposals and votes',
          icon: <Gavel className="w-4 h-4" />,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        }
      ]
    },
    {
      category: 'SEI Integration',
      nodes: [
        {
          type: 'seiIntegration',
          label: 'Wallet Connect',
          description: 'Connect to SEI wallet',
          icon: <Wallet className="w-4 h-4" />,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          hoverColor: 'hover:bg-orange-100'
        },
        {
          type: 'seiIntegration',
          label: 'Smart Contract',
          description: 'Interact with contracts',
          icon: <Lock className="w-4 h-4" />,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          hoverColor: 'hover:bg-orange-100'
        },
        {
          type: 'seiIntegration',
          label: 'Token Swap',
          description: 'Execute token swaps',
          icon: <DollarSign className="w-4 h-4" />,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          hoverColor: 'hover:bg-orange-100'
        },
        {
          type: 'seiIntegration',
          label: 'NFT Mint',
          description: 'Mint achievement NFTs',
          icon: <Bot className="w-4 h-4" />,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          hoverColor: 'hover:bg-orange-100'
        }
      ]
    },
    {
      category: 'Actions',
      nodes: [
        {
          type: 'action',
          label: 'Send Alert',
          description: 'Send notification',
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          hoverColor: 'hover:bg-purple-100'
        },
        {
          type: 'action',
          label: 'Mint NFT',
          description: 'Create achievement NFT',
          icon: <Bot className="w-4 h-4" />,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          hoverColor: 'hover:bg-purple-100'
        },
        {
          type: 'action',
          label: 'Vote on Proposal',
          description: 'Cast governance vote',
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          hoverColor: 'hover:bg-purple-100'
        },
        {
          type: 'action',
          label: 'Execute Transaction',
          description: 'Perform blockchain transaction',
          icon: <Zap className="w-4 h-4" />,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          hoverColor: 'hover:bg-purple-100'
        }
      ]
    },
    {
      category: 'Outputs',
      nodes: [
        {
          type: 'output',
          label: 'Dashboard',
          description: 'Display results',
          icon: <Eye className="w-4 h-4" />,
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hoverColor: 'hover:bg-red-100'
        },
        {
          type: 'output',
          label: 'Webhook',
          description: 'Send data to external service',
          icon: <Zap className="w-4 h-4" />,
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hoverColor: 'hover:bg-red-100'
        },
        {
          type: 'output',
          label: 'Email Notification',
          description: 'Send email alerts',
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hoverColor: 'hover:bg-red-100'
        },
        {
          type: 'output',
          label: 'Database Log',
          description: 'Store results in database',
          icon: <Shield className="w-4 h-4" />,
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hoverColor: 'hover:bg-red-100'
        }
      ]
    }
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Node Palette</h2>
      
      <div className="space-y-6">
        {nodeTypes.map((category) => (
          <div key={category.category} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
              {category.category}
            </h3>
            
            <div className="space-y-2">
              {category.nodes.map((node, index) => (
                <div
                  key={`${node.type}-${index}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type)}
                  className={`p-3 ${node.bgColor} border ${node.borderColor} rounded-lg cursor-move ${node.hoverColor} transition-colors duration-200`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${node.color}`} />
                    <span className="text-sm font-medium text-gray-800">{node.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {node.icon}
                    <p className="text-xs text-gray-600">{node.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full p-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Users className="w-4 h-4 inline mr-2" />
            Import Template
          </button>
          <button className="w-full p-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Bot className="w-4 h-4 inline mr-2" />
            Deploy Agent
          </button>
        </div>
      </div>
    </div>
  );
}