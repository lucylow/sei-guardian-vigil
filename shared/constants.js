// Vulnerability severity classification
export const SEVERITY_LEVELS = {
  CRITICAL: {
    score: 4,
    color: '#EF4444',
    threshold: 0.9
  },
  HIGH: {
    score: 3,
    color: '#F97316',
    threshold: 0.7
  },
  MEDIUM: {
    score: 2,
    color: '#EAB308',
    threshold: 0.5
  },
  LOW: {
    score: 1,
    color: '#84CC16',
    threshold: 0.3
  },
  INFO: {
    score: 0,
    color: '#3B82F6',
    threshold: 0
  }
};

// Sei network configurations
export const SEI_NETWORKS = {
  MAINNET: {
    id: 'sei-1',
    name: 'Mainnet',
    rpc: 'https://rpc-sei.keplr.app',
    explorer: 'https://sei.explorers.guru'
  },
  TESTNET: {
    id: 'atlantic-1',
    name: 'Testnet',
    rpc: 'https://sei-testnet-rpc.polkachu.com',
    explorer: 'https://testnet.sei.explorers.guru'
  },
  LOCAL: {
    id: 'local',
    name: 'Local Development',
    rpc: 'http://localhost:26657',
    explorer: null
  }
};
