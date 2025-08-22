import { AgentService } from './agentService';
import { NoCodeAgentConfig } from './agentDataModels';

// Mock the axios module
jest.mock('axios');
const mockAxios = require('axios');

describe('AgentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAndDeployAgent', () => {
    const mockAgentConfig: NoCodeAgentConfig = {
      name: 'Test Security Agent',
      description: 'A test security auditing agent',
      agentType: 'SecurityAuditor',
      ownerWalletAddress: 'sei1test123456789',
      configuration: {
        targetContracts: ['0x123456789'],
        vulnerabilityTypes: ['reentrancy'],
        alertThreshold: 0.8
      }
    };

    it('should create and deploy an agent successfully', async () => {
      // Mock successful MCP response
      mockAxios.post.mockResolvedValueOnce({
        data: {
          tokenId: 'token_123',
          txHash: 'tx_hash_456'
        }
      });

      const result = await AgentService.createAndDeployAgent(mockAgentConfig);

      expect(result).toBeDefined();
      expect(result.name).toBe(mockAgentConfig.name);
      expect(result.status).toBe('Deployed');
      expect(result.nftTokenId).toBe('token_123');
      expect(result.seiTxHash).toBe('tx_hash_456');
    });

    it('should handle deployment errors gracefully', async () => {
      // Mock failed MCP response
      mockAxios.post.mockRejectedValueOnce(new Error('MCP server error'));

      await expect(AgentService.createAndDeployAgent(mockAgentConfig))
        .rejects
        .toThrow('Failed to deploy agent: Error: MCP server error');
    });
  });

  describe('getAgentById', () => {
    it('should return undefined for non-existent agent', async () => {
      const result = await AgentService.getAgentById('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllAgents', () => {
    it('should return empty array initially', async () => {
      const result = await AgentService.getAllAgents();
      expect(result).toEqual([]);
    });
  });

  describe('updateAgent', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(AgentService.updateAgent('non-existent-id', { name: 'New Name' }))
        .rejects
        .toThrow('Agent not found.');
    });
  });

  describe('deleteAgent', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(AgentService.deleteAgent('non-existent-id'))
        .rejects
        .toThrow('Agent not found.');
    });
  });

  describe('executeAgentTask', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(AgentService.executeAgentTask('non-existent-id', {}))
        .rejects
        .toThrow('Agent not found.');
    });
  });

  describe('activateAgent', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(AgentService.activateAgent('non-existent-id'))
        .rejects
        .toThrow('Agent not found.');
    });
  });

  describe('pauseAgent', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(AgentService.pauseAgent('non-existent-id'))
        .rejects
        .toThrow('Agent not found.');
    });
  });

  describe('getAgentStats', () => {
    it('should return empty stats initially', async () => {
      const stats = await AgentService.getAgentStats();
      expect(stats.total).toBe(0);
      expect(stats.byStatus).toEqual({});
      expect(stats.byType).toEqual({});
    });
  });
});
