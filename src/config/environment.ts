// =============================================================================
// FRONTEND ENVIRONMENT CONFIGURATION
// =============================================================================

export interface FrontendEnvironmentConfig {
  // API Base URLs
  apiBaseUrl: string;
  
  // SEI Blockchain
  seiRpc: string;
  seiNetwork: string;
  
  // Crossmint (Client-side safe)
  crossmintClientApiKey: string;
  
  // Feature flags
  enableRealTimeUpdates: boolean;
  enableWebSocketConnections: boolean;
}

// Load environment variables with validation
export function loadFrontendEnvironmentConfig(): FrontendEnvironmentConfig {
  const config: FrontendEnvironmentConfig = {
    // API Base URLs
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000',
    
    // SEI Blockchain
    seiRpc: process.env.REACT_APP_SEI_RPC || 'https://sei-testnet-rpc.polkachu.com',
    seiNetwork: process.env.REACT_APP_SEI_NETWORK || 'testnet',
    
    // Crossmint (Client-side safe)
    crossmintClientApiKey: process.env.REACT_APP_CROSSMINT_CLIENT_API_KEY || '',
    
    // Feature flags
    enableRealTimeUpdates: process.env.REACT_APP_ENABLE_REAL_TIME_UPDATES !== 'false',
    enableWebSocketConnections: process.env.REACT_APP_ENABLE_WEBSOCKET !== 'false',
  };

  // Validate required environment variables
  validateFrontendEnvironmentConfig(config);
  
  return config;
}

// Validate that all required environment variables are present
function validateFrontendEnvironmentConfig(config: FrontendEnvironmentConfig): void {
  const requiredVars = [
    'crossmintClientApiKey'
  ];

  const missingVars = requiredVars.filter(varName => !config[varName as keyof FrontendEnvironmentConfig]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing frontend environment variables:', missingVars);
    console.warn('Some features may not work properly. Please check your .env file.');
  } else {
    console.log('✅ Frontend environment configuration loaded successfully');
  }
}

// Export singleton instance
export const frontendEnv = loadFrontendEnvironmentConfig();

// Helper functions for common configurations
export function getApiUrl(endpoint: string): string {
  return `${frontendEnv.apiBaseUrl}${endpoint}`;
}

export function isTestnet(): boolean {
  return frontendEnv.seiNetwork === 'testnet';
}

export function isMainnet(): boolean {
  return frontendEnv.seiNetwork === 'mainnet';
}
