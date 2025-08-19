// =============================================================================
// SEI SENTINEL - Complete Stack Environment Configuration
// =============================================================================

export interface EnvironmentConfig {
  // HIVE INTELLIGENCE MCP
  hiveIntelligenceMcpApiKey: string;
  
  // CROSSMINT NFT MINTING
  crossmintServerApiKey: string;
  crossmintClientApiKey: string;
  
  // OPENAI AI SERVICES
  openaiApiKey: string;
  
  // SEI BLOCKCHAIN NETWORKS
  seiNetwork: 'testnet' | 'mainnet';
  seiTestnetRpc: string;
  seiMainnetRpc: string;
  seiTestnetWs: string;
  seiMainnetWs: string;
  
  // SEI WALLET PRIVATE KEYS (NEVER EXPOSE TO FRONTEND)
  seiTestnetPrivateKey: string;
  seiMainnetPrivateKey: string;
  
  // GOAT SDK CONFIGURATION
  goatNetwork: string;
  
  // CUBIST SDK CONFIGURATION
  cubistProjectId: string;
  cubistApiKey: string;
  
  // JWT AUTHENTICATION
  jwtSecret: string;
  
  // EMAIL NOTIFICATIONS (SMTP)
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  
  // CONTRACT ADDRESSES
  agentNftContract: string;
  sentTokenContract: string;
  eventLoggerContract: string;
  vulnerabilityCodeId: string;
  
  // TESTING & DEVELOPMENT
  testWallet: string;
  nodeEnv: string;
  port: number;
  
  // KAFKA MESSAGE BROKER (Optional)
  kafkaBrokers: string[];
  
  // GITHUB INTEGRATION (Optional)
  githubToken: string;
  
  // FRONTEND ENVIRONMENT VARIABLES
  reactAppApiBaseUrl: string;
  reactAppSeiRpc: string;
  reactAppCrossmintClientApiKey: string;
}

// Load environment variables with validation
export function loadEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    // HIVE INTELLIGENCE MCP
    hiveIntelligenceMcpApiKey: process.env.HIVE_INTELLIGENCE_MCP_API_KEY || '',
    
    // CROSSMINT NFT MINTING
    crossmintServerApiKey: process.env.CROSSMINT_SERVER_API_KEY || '',
    crossmintClientApiKey: process.env.CROSSMINT_CLIENT_API_KEY || '',
    
    // OPENAI AI SERVICES
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    
    // SEI BLOCKCHAIN NETWORKS
    seiNetwork: (process.env.SEI_NETWORK as 'testnet' | 'mainnet') || 'testnet',
    seiTestnetRpc: process.env.SEI_TESTNET_RPC || 'https://sei-testnet-rpc.polkachu.com',
    seiMainnetRpc: process.env.SEI_MAINNET_RPC || 'https://sei-rpc.polkachu.com',
    seiTestnetWs: process.env.SEI_TESTNET_WS || 'wss://sei-testnet-rpc.polkachu.com/websocket',
    seiMainnetWs: process.env.SEI_MAINNET_WS || 'wss://sei-rpc.polkachu.com/websocket',
    
    // SEI WALLET PRIVATE KEYS
    seiTestnetPrivateKey: process.env.SEI_TESTNET_PRIVATE_KEY || '',
    seiMainnetPrivateKey: process.env.SEI_MAINNET_PRIVATE_KEY || '',
    
    // GOAT SDK CONFIGURATION
    goatNetwork: process.env.GOAT_NETWORK || 'sei-testnet',
    
    // CUBIST SDK CONFIGURATION
    cubistProjectId: process.env.CUBIST_PROJECT_ID || '',
    cubistApiKey: process.env.CUBIST_API_KEY || '',
    
    // JWT AUTHENTICATION
    jwtSecret: process.env.JWT_SECRET || '',
    
    // EMAIL NOTIFICATIONS (SMTP)
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    
    // CONTRACT ADDRESSES
    agentNftContract: process.env.AGENT_NFT_CONTRACT || '',
    sentTokenContract: process.env.SENT_TOKEN_CONTRACT || '',
    eventLoggerContract: process.env.EVENT_LOGGER_CONTRACT || '',
    vulnerabilityCodeId: process.env.VULNERABILITY_CODE_ID || '',
    
    // TESTING & DEVELOPMENT
    testWallet: process.env.TEST_WALLET || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000'),
    
    // KAFKA MESSAGE BROKER
    kafkaBrokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    
    // GITHUB INTEGRATION
    githubToken: process.env.GITHUB_TOKEN || '',
    
    // FRONTEND ENVIRONMENT VARIABLES
    reactAppApiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000',
    reactAppSeiRpc: process.env.REACT_APP_SEI_RPC || 'https://sei-testnet-rpc.polkachu.com',
    reactAppCrossmintClientApiKey: process.env.REACT_APP_CROSSMINT_CLIENT_API_KEY || '',
  };

  // Validate required environment variables
  validateEnvironmentConfig(config);
  
  return config;
}

// Validate that all required environment variables are present
function validateEnvironmentConfig(config: EnvironmentConfig): void {
  const requiredVars = [
    'hiveIntelligenceMcpApiKey',
    'crossmintServerApiKey', 
    'crossmintClientApiKey',
    'openaiApiKey',
    'seiTestnetPrivateKey',
    'seiMainnetPrivateKey',
    'jwtSecret',
    'agentNftContract'
  ];

  const missingVars = requiredVars.filter(varName => !config[varName as keyof EnvironmentConfig]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  console.log('✅ Environment configuration loaded successfully');
}

// Export singleton instance
export const env = loadEnvironmentConfig();

// Helper functions for common configurations
export function getSeiRpcUrl(): string {
  return env.seiNetwork === 'mainnet' ? env.seiMainnetRpc : env.seiTestnetRpc;
}

export function getSeiWsUrl(): string {
  return env.seiNetwork === 'mainnet' ? env.seiMainnetWs : env.seiTestnetWs;
}

export function getSeiPrivateKey(): string {
  return env.seiNetwork === 'mainnet' ? env.seiMainnetPrivateKey : env.seiTestnetPrivateKey;
}

export function isProduction(): boolean {
  return env.nodeEnv === 'production';
}

export function isTestnet(): boolean {
  return env.seiNetwork === 'testnet';
}
