import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardMetrics, RealTimeUpdate } from '@/lib/dashboardService';

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleUpdate = useCallback((update: RealTimeUpdate) => {
    setMetrics(prev => prev ? { ...prev, ...update.data } : null);
    setLastUpdate(update.timestamp);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Initializing dashboard hook...');

        // Initialize the dashboard service
        await dashboardService.initialize();

        // Get initial metrics
        const initialMetrics = dashboardService.getMetrics();
        setMetrics(initialMetrics);
        setLastUpdate(new Date());
        setIsInitialized(true);

        // Subscribe to real-time updates
        unsubscribe = dashboardService.subscribeToUpdates(handleUpdate);

        console.log('✅ Dashboard hook initialized successfully');

      } catch (err) {
        console.error('❌ Failed to initialize dashboard:', err);
        
        // Try to get metrics even if initialization fails
        try {
          const fallbackMetrics = dashboardService.getMetrics();
          setMetrics(fallbackMetrics);
          setLastUpdate(new Date());
          setIsInitialized(true);
          console.log('🔄 Using fallback metrics');
        } catch (fallbackErr) {
          console.error('❌ Failed to get fallback metrics:', fallbackErr);
          setError('Failed to initialize dashboard. Please refresh the page.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [handleUpdate]);

  const addActivity = useCallback(async (activity: Omit<any, 'id' | 'timestamp'>) => {
    try {
      await dashboardService.addActivity(activity);
    } catch (err) {
      console.error('❌ Failed to add activity:', err);
      // Don't set error state for activity additions
    }
  }, []);

  const addAlert = useCallback(async (alert: Omit<any, 'id' | 'timestamp'>) => {
    try {
      await dashboardService.addAlert(alert);
    } catch (err) {
      console.error('❌ Failed to add alert:', err);
      // Don't set error state for alert additions
    }
  }, []);

  const updateSecurityMetrics = useCallback(async (securityMetrics: Partial<DashboardMetrics>) => {
    try {
      await dashboardService.updateSecurityMetrics(securityMetrics);
    } catch (err) {
      console.error('❌ Failed to update security metrics:', err);
      // Don't set error state for metric updates
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Refreshing dashboard data...');
      
      const updatedMetrics = dashboardService.getMetrics();
      setMetrics(updatedMetrics);
      setLastUpdate(new Date());
      
      console.log('✅ Dashboard data refreshed');
      
    } catch (err) {
      console.error('❌ Failed to refresh dashboard data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryInitialization = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Retrying dashboard initialization...');
      
      // Re-initialize the service
      await dashboardService.initialize();
      
      const initialMetrics = dashboardService.getMetrics();
      setMetrics(initialMetrics);
      setLastUpdate(new Date());
      setIsInitialized(true);
      
      console.log('✅ Dashboard re-initialized successfully');
      
    } catch (err) {
      console.error('❌ Failed to re-initialize dashboard:', err);
      setError('Failed to re-initialize. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    metrics,
    isLoading,
    error,
    lastUpdate,
    isInitialized,
    addActivity,
    addAlert,
    updateSecurityMetrics,
    refreshData,
    retryInitialization,
    // Computed values with fallbacks
    systemHealth: metrics?.securityScore || 94,
    activeAgents: metrics?.activeAgents || 6,
    totalContracts: metrics?.totalContracts || 156,
    threatsBlocked: metrics?.threatsBlocked || 127,
    activeAlerts: metrics?.activeAlerts || [],
    recentActivities: metrics?.recentActivities || [],
    latestBlock: metrics?.latestBlock || {
      blockNumber: 12345678,
      blockHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      timestamp: Date.now(),
      transactionCount: 45
    },
    networkMetrics: {
      tps: metrics?.networkTps || 3200,
      blockTime: metrics?.blockTime || 350,
      utilization: metrics?.networkUtilization || 72,
      validators: metrics?.validatorCount || 125
    },
    securityMetrics: {
      vulnerabilityDetection: metrics?.vulnerabilityDetection || 94,
      threatResponse: metrics?.threatResponse || 89,
      systemHardening: metrics?.systemHardening || 96,
      monitoringCoverage: metrics?.monitoringCoverage || 98
    },
    agentStatuses: metrics?.agentStatuses || {
      orchestrator: 'active',
      securityAnalyst: 'active',
      webCrawler: 'active',
      chatbot: 'idle',
      monitor: 'active',
      fixGenerator: 'busy',
      ragAgent: 'active',
      guardrail: 'active',
    }
  };
};
