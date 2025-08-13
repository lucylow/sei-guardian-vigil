import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Shield, Clock, User, CheckCircle, XCircle } from 'lucide-react';

interface InterventionRequest {
  id: string;
  agentId: string;
  action: string;
  contract: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  justification: string;
  timestamp: Date;
  details: {
    vulnerabilityType: string;
    confidence: number;
    potentialImpact: string;
    affectedFunctions: string[];
  };
}

const mockRequest: InterventionRequest = {
  id: 'int-001',
  agentId: 'AI Fix Generator',
  action: 'Deploy Emergency Patch',
  contract: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  risk: 'critical',
  justification: 'Critical reentrancy vulnerability detected in withdrawal function. Immediate patching required to prevent potential $2.5M exploit.',
  timestamp: new Date(),
  details: {
    vulnerabilityType: 'Reentrancy Attack Vector',
    confidence: 0.94,
    potentialImpact: '$2,500,000 at risk',
    affectedFunctions: ['withdraw()', 'emergencyWithdraw()', 'batchWithdraw()']
  }
};

interface HumanInterventionPanelProps {
  request?: InterventionRequest;
  onApprove?: (comments: string) => void;
  onReject?: (comments: string) => void;
}

export const HumanInterventionPanel: React.FC<HumanInterventionPanelProps> = ({
  request = mockRequest,
  onApprove,
  onReject
}) => {
  const [comments, setComments] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleApprove = () => {
    onApprove?.(comments);
    setComments('');
  };

  const handleReject = () => {
    onReject?.(comments);
    setComments('');
  };

  if (!request) {
    return (
      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-background/30 border-green-500/20">
        <div className="text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <h3 className="text-lg font-semibold text-green-400">All Clear</h3>
          <p className="text-sm text-muted-foreground">No human intervention required at this time.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-red-500/10 to-background/30 border-red-500/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-400">Human Intervention Required</h3>
            <p className="text-sm text-muted-foreground">Critical action awaiting approval</p>
          </div>
          <Badge className={`px-3 py-1 ${getRiskColor(request.risk)}`}>
            {request.risk.toUpperCase()} RISK
          </Badge>
        </div>

        {/* Request Details */}
        <div className="space-y-3 p-3 rounded-lg bg-background/40 border border-red-500/20">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Agent:</span>
              <p className="font-medium">{request.agentId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Action:</span>
              <p className="font-medium text-red-400">{request.action}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Contract:</span>
              <p className="font-mono text-xs text-primary">{request.contract}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Time:</span>
              <p className="text-xs">{request.timestamp.toLocaleTimeString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence:</span>
              <p className="text-xs">{(request.details.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground text-sm">Justification:</span>
            <p className="text-sm mt-1 text-foreground">{request.justification}</p>
          </div>

          {/* Toggle Details */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </Button>

          {showDetails && (
            <div className="mt-3 p-3 rounded-lg bg-background/60 border border-primary/10 space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Vulnerability Type:</span>
                <p className="text-xs font-medium">{request.details.vulnerabilityType}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Potential Impact:</span>
                <p className="text-xs font-medium text-red-400">{request.details.potentialImpact}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Affected Functions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.details.affectedFunctions.map(func => (
                    <Badge key={func} variant="outline" className="text-xs">
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Comments & Instructions</label>
          <Textarea
            placeholder="Add your review comments or special instructions for the agent..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-20 bg-background/60"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="destructive" 
            onClick={handleReject}
            className="flex-1 flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
          <Button 
            onClick={handleApprove}
            className="flex-1 flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            Approve & Execute
          </Button>
        </div>

        {/* Metadata */}
        <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t border-primary/10">
          <Clock className="w-3 h-3" />
          <span>Request #{request.id} • Requires admin approval</span>
        </div>
      </div>
    </Card>
  );
};