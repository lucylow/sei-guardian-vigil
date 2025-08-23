import React from 'react';
import { Node } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
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
  TrendingUp,
  Lock,
  Unlock,
  DollarSign,
  Users,
  Gavel,
  Save,
  RotateCcw
} from 'lucide-react';

interface ConfigurationPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onResetNode: (nodeId: string) => void;
}

export default function ConfigurationPanel({ 
  selectedNode, 
  onUpdateNode, 
  onResetNode 
}: ConfigurationPanelProps) {
  if (!selectedNode) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Node Configuration
          </CardTitle>
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

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Activity className="w-4 h-4" />;
      case 'skill': return <Shield className="w-4 h-4" />;
      case 'action': return <Zap className="w-4 h-4" />;
      case 'seiIntegration': return <Wallet className="w-4 h-4" />;
      case 'output': return <Eye className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-blue-500';
      case 'skill': return 'bg-green-500';
      case 'action': return 'bg-purple-500';
      case 'seiIntegration': return 'bg-orange-500';
      case 'output': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderTypeSpecificFields = () => {
    switch (selectedNode.type) {
      case 'trigger':
        return (
          <>
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
                <option value="governance">Governance Event</option>
              </select>
            </div>
            
            {selectedNode.data.triggerType === 'price' && (
              <div>
                <Label htmlFor="priceThreshold">Price Threshold</Label>
                <Input
                  id="priceThreshold"
                  type="number"
                  value={selectedNode.data.priceThreshold || ''}
                  onChange={(e) => updateNodeData('priceThreshold', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            )}
            
            {selectedNode.data.triggerType === 'event' && (
              <div>
                <Label htmlFor="eventSignature">Event Signature</Label>
                <Input
                  id="eventSignature"
                  value={selectedNode.data.eventSignature || ''}
                  onChange={(e) => updateNodeData('eventSignature', e.target.value)}
                  placeholder="Transfer(address,address,uint256)"
                />
              </div>
            )}
          </>
        );

      case 'skill':
        return (
          <>
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
                <option value="governance">Governance Monitoring</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="aiModel">AI Model</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedNode.data.aiModel || 'transformer'}
                onChange={(e) => updateNodeData('aiModel', e.target.value)}
              >
                <option value="transformer">Transformer (GPT-4)</option>
                <option value="cnn">CNN (Convolutional)</option>
                <option value="lstm">LSTM (Recurrent)</option>
                <option value="ensemble">Ensemble Model</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
              <Input
                id="confidenceThreshold"
                type="number"
                min="0"
                max="100"
                value={selectedNode.data.confidenceThreshold || '80'}
                onChange={(e) => updateNodeData('confidenceThreshold', e.target.value)}
                placeholder="80"
              />
            </div>
          </>
        );

      case 'seiIntegration':
        return (
          <>
            <div>
              <Label htmlFor="integrationType">Integration Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedNode.data.integrationType || 'wallet'}
                onChange={(e) => updateNodeData('integrationType', e.target.value)}
              >
                <option value="wallet">Wallet Connection</option>
                <option value="contract">Smart Contract</option>
                <option value="swap">Token Swap</option>
                <option value="nft">NFT Operations</option>
                <option value="governance">Governance Actions</option>
              </select>
            </div>
            
            {selectedNode.data.integrationType === 'contract' && (
              <>
                <div>
                  <Label htmlFor="contractAddress">Contract Address</Label>
                  <Input
                    id="contractAddress"
                    value={selectedNode.data.contractAddress || ''}
                    onChange={(e) => updateNodeData('contractAddress', e.target.value)}
                    placeholder="sei1..."
                  />
                </div>
                <div>
                  <Label htmlFor="contractABI">Contract ABI</Label>
                  <Textarea
                    id="contractABI"
                    value={selectedNode.data.contractABI || ''}
                    onChange={(e) => updateNodeData('contractABI', e.target.value)}
                    placeholder="Paste contract ABI here..."
                    rows={4}
                  />
                </div>
              </>
            )}
            
            {selectedNode.data.integrationType === 'swap' && (
              <div>
                <Label htmlFor="swapAmount">Swap Amount</Label>
                <Input
                  id="swapAmount"
                  type="number"
                  value={selectedNode.data.swapAmount || ''}
                  onChange={(e) => updateNodeData('swapAmount', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            )}
          </>
        );

      case 'action':
        return (
          <>
            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedNode.data.actionType || 'alert'}
                onChange={(e) => updateNodeData('actionType', e.target.value)}
              >
                <option value="alert">Send Alert</option>
                <option value="nft">Mint NFT</option>
                <option value="vote">Cast Vote</option>
                <option value="transaction">Execute Transaction</option>
                <option value="webhook">Send Webhook</option>
              </select>
            </div>
            
            {selectedNode.data.actionType === 'alert' && (
              <div>
                <Label htmlFor="alertMessage">Alert Message</Label>
                <Textarea
                  id="alertMessage"
                  value={selectedNode.data.alertMessage || ''}
                  onChange={(e) => updateNodeData('alertMessage', e.target.value)}
                  placeholder="Enter alert message..."
                  rows={3}
                />
              </div>
            )}
            
            {selectedNode.data.actionType === 'webhook' && (
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={selectedNode.data.webhookUrl || ''}
                  onChange={(e) => updateNodeData('webhookUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            )}
          </>
        );

      case 'output':
        return (
          <>
            <div>
              <Label htmlFor="outputType">Output Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedNode.data.outputType || 'dashboard'}
                onChange={(e) => updateNodeData('outputType', e.target.value)}
              >
                <option value="dashboard">Dashboard Display</option>
                <option value="webhook">Webhook</option>
                <option value="email">Email Notification</option>
                <option value="database">Database Log</option>
                <option value="file">File Export</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="outputFormat">Output Format</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedNode.data.outputFormat || 'json'}
                onChange={(e) => updateNodeData('outputFormat', e.target.value)}
              >
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
                <option value="text">Plain Text</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getNodeColor(selectedNode.type || '')}`} />
          {getNodeIcon(selectedNode.type || '')}
          {selectedNode.type?.charAt(0).toUpperCase() + selectedNode.type?.slice(1)} Configuration
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            ID: {selectedNode.id.slice(0, 8)}...
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Type: {selectedNode.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Configuration */}
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={selectedNode.data.label || ''}
            onChange={(e) => updateNodeData('label', e.target.value)}
            placeholder="Enter node label"
          />
        </div>

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

        {/* Type-specific configuration fields */}
        {renderTypeSpecificFields()}

        {/* Advanced Configuration */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Settings</h4>
          
          <div>
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              value={selectedNode.data.timeout || '30000'}
              onChange={(e) => updateNodeData('timeout', e.target.value)}
              placeholder="30000"
            />
          </div>
          
          <div>
            <Label htmlFor="retryCount">Retry Count</Label>
            <Input
              id="retryCount"
              type="number"
              min="0"
              max="5"
              value={selectedNode.data.retryCount || '3'}
              onChange={(e) => updateNodeData('retryCount', e.target.value)}
              placeholder="3"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button 
            onClick={() => onResetNode(selectedNode.id)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={() => console.log('Save node config')}
            size="sm"
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
