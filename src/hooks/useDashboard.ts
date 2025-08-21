import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardMetrics, RealTimeUpdate } from '@/lib/dashboardService';

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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

        // Initialize the dashboard service
        await dashboardService.initialize();

        // Get initial metrics
        const initialMetrics = dashboardService.getMetrics();
        setMetrics(initialMetrics);
        setLastUpdate(new Date());

        // Subscribe to real-time updates
        unsubscribe = dashboardService.subscribeToUpdates(handleUpdate);

      } catch (err) {
        console.error('Failed to initialize dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize dashboard');
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
      console.error('Failed to add activity:', err);
    }
  }, []);

  const addAlert = useCallback(async (alert: Omit<any, 'id' | 'timestamp'>) => {
    try {
      await dashboardService.addAlert(alert);
    } catch (err) {
      console.error('Failed to add alert:', err);
    }
  }, []);

  const updateSecurityMetrics = useCallback(async (securityMetrics: Partial<DashboardMetrics>) => {
    try {
      await dashboardService.updateSecurityMetrics(securityMetrics);
    } catch (err) {
      console.error('Failed to update security metrics:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedMetrics = dashboardService.getMetrics();
      setMetrics(updatedMetrics);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    metrics,
    isLoading,
    error,
    lastUpdate,
    addActivity,
    addAlert,
    updateSecurityMetrics,
    refreshData,
    // Computed values
    systemHealth: metrics?.securityScore || 0,
    activeAgents: metrics?.activeAgents || 0,
    totalContracts: metrics?.totalContracts || 0,
    threatsBlocked: metrics?.threatsBlocked || 0,
    activeAlerts: metrics?.activeAlerts || [],
    recentActivities: metrics?.recentActivities || [],
    latestBlock: metrics?.latestBlock,
    networkMetrics: {
      tps: metrics?.networkTps || 0,
      blockTime: metrics?.blockTime || 0,
      utilization: metrics?.networkUtilization || 0,
      validators: metrics?.validatorCount || 0
    },
    securityMetrics: {
      vulnerabilityDetection: metrics?.vulnerabilityDetection || 0,
      threatResponse: metrics?.threatResponse || 0,
      systemHardening: metrics?.systemHardening || 0,
      monitoringCoverage: metrics?.monitoringCoverage || 0
    },
    agentStatuses: metrics?.agentStatuses || {}
  };
};
