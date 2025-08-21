import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface ConnectionStatusProps {
  isInitialized: boolean;
  hasError: boolean;
  lastUpdate: Date | null;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isInitialized, 
  hasError, 
  lastUpdate,
  className = "" 
}) => {
  const getStatusInfo = () => {
    if (hasError) {
      return {
        icon: <WifiOff className="w-3 h-3" />,
        text: 'Connection Error',
        variant: 'destructive' as const,
        description: 'External services unavailable'
      };
    }
    
    if (isInitialized) {
      return {
        icon: <CheckCircle className="w-3 h-3" />,
        text: 'Connected',
        variant: 'default' as const,
        description: 'All services operational'
      };
    }
    
    return {
      icon: <Clock className="w-3 h-3" />,
      text: 'Initializing',
      variant: 'secondary' as const,
      description: 'Connecting to services...'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.icon}
        <span className="ml-1">{statusInfo.text}</span>
      </Badge>
      
      <div className="text-xs text-muted-foreground">
        {statusInfo.description}
        {lastUpdate && (
          <div className="text-xs text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
