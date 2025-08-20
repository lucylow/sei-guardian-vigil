
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Shield, TrendingUp, Hash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSeiData } from '@/hooks/useSeiData';

export const ThreatIntelFeed: React.FC = () => {
  const { threats } = useSeiData();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "low": return "bg-green-500/20 text-green-300 border-green-500/50";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return "🔴";
      case "high": return "🟠";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-background/50 to-background/30 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Threat Intelligence Feed
          </h3>
          <Badge variant="outline" className="text-xs">
            {threats.filter(t => t.severity === 'critical' || t.severity === 'high').length} High Priority
          </Badge>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {threats.slice(0, 8).map((threat) => (
            <div key={threat.id} className="space-y-3 p-3 rounded-lg border border-primary/10 bg-background/40 hover:bg-background/60 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">{getSeverityIcon(threat.severity)}</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-tight text-foreground">{threat.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{threat.description}</p>
                  </div>
                </div>
                <Badge className={getSeverityColor(threat.severity)}>
                  {threat.severity}
                </Badge>
              </div>
              
              {threat.tags && threat.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {threat.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                      #{tag}
                    </Badge>
                  ))}
                  {threat.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{threat.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {threat.source}
                  </div>
                  {threat.affectedNetworks && threat.affectedNetworks.length > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {threat.affectedNetworks.slice(0, 2).join(', ')}
                      {threat.affectedNetworks.length > 2 && ` +${threat.affectedNetworks.length - 2}`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(threat.publishedAt, { addSuffix: true })}
                </div>
              </div>

              {threat.iocs && threat.iocs.length > 0 && (
                <div className="text-xs p-2 bg-accent/10 rounded border border-accent/20">
                  <div className="flex items-center gap-1 text-accent-foreground font-medium mb-1">
                    <Hash className="w-3 h-3" />
                    IOCs ({threat.iocs.length})
                  </div>
                  <div className="font-mono text-muted-foreground space-y-0.5">
                    {threat.iocs.slice(0, 2).map((ioc, index) => (
                      <div key={index} className="truncate">{ioc}</div>
                    ))}
                    {threat.iocs.length > 2 && (
                      <div className="text-accent">+{threat.iocs.length - 2} more indicators</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
