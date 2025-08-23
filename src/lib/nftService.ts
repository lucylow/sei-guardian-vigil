// Mock NFT Service for Digital Sentinels
// In production, this would integrate with actual blockchain contracts

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    role: string;
    level: number;
    accuracy: number;
    speed: number;
    specialty: string;
    matrixAffinity: number;
    rarity: string;
    matrixStatus: string;
  };
  external_url: string;
  animation_url?: string;
}

export interface MintingResult {
  success: boolean;
  tokenId: string;
  transactionHash?: string;
  metadata: NFTMetadata;
  error?: string;
}

export interface AgentUpgrade {
  agentId: string;
  newLevel: number;
  newXp: number;
  newTraits: {
    accuracy: number;
    speed: number;
    matrixAffinity: number;
  };
  cost: number; // in $SENT tokens
}

class NFTService {
  private tokenCounter = 1000;
  private mintedTokens = new Map<string, NFTMetadata>();

  // Simulate minting a new Digital Sentinel NFT
  async mintAgentNFT(agentData: {
    name: string;
    role: string;
    specialty: string;
    baseTraits: {
      accuracy: number;
      speed: number;
      matrixAffinity: number;
    };
  }): Promise<MintingResult> {
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const tokenId = `0x${this.tokenCounter.toString(16).padStart(8, '0')}`;
      this.tokenCounter++;

      // Generate rarity based on traits
      const rarity = this.calculateRarity(agentData.baseTraits);
      
      // Generate matrix status
      const matrixStatus = this.generateMatrixStatus(agentData.baseTraits);

      const metadata: NFTMetadata = {
        name: `${agentData.name} #${tokenId.slice(-4)}`,
        description: `A Digital Sentinel NFT representing ${agentData.name}, a ${agentData.role} specialized in ${agentData.specialty}. This AI agent protects the Sei ecosystem from vulnerabilities and threats.`,
        image: `https://ipfs.io/ipfs/sentinel-agents/${tokenId}.png`,
        attributes: {
          role: agentData.role,
          level: 1,
          accuracy: agentData.baseTraits.accuracy,
          speed: agentData.baseTraits.speed,
          specialty: agentData.specialty,
          matrixAffinity: agentData.baseTraits.matrixAffinity,
          rarity,
          matrixStatus
        },
        external_url: `https://sei-sentinel.com/agent/${tokenId}`,
        animation_url: `https://ipfs.io/ipfs/sentinel-agents/${tokenId}.mp4`
      };

      // Store the minted token
      this.mintedTokens.set(tokenId, metadata);

      return {
        success: true,
        tokenId,
        transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        metadata
      };
    } catch (error) {
      return {
        success: false,
        tokenId: '',
        metadata: {} as NFTMetadata,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Simulate upgrading an agent
  async upgradeAgent(agentId: string, upgradeData: {
    xpGained: number;
    newLevel: number;
  }): Promise<boolean> {
    try {
      const token = this.mintedTokens.get(agentId);
      if (!token) {
        throw new Error('Token not found');
      }

      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update metadata
      const updatedMetadata = {
        ...token,
        attributes: {
          ...token.attributes,
          level: upgradeData.newLevel
        }
      };

      this.mintedTokens.set(agentId, updatedMetadata);

      return true;
    } catch (error) {
      console.error('Upgrade failed:', error);
      return false;
    }
  }

  // Get all minted tokens for a wallet
  async getWalletTokens(walletAddress: string): Promise<NFTMetadata[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return all tokens (in real implementation, filter by wallet)
    return Array.from(this.mintedTokens.values());
  }

  // Get token metadata by ID
  async getTokenMetadata(tokenId: string): Promise<NFTMetadata | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mintedTokens.get(tokenId) || null;
  }

  // Simulate battle rewards
  async awardBattleRewards(agentId: string, battleResult: {
    success: boolean;
    xpGained: number;
    tokensEarned: number;
    vulnerabilitiesDetected: number;
  }): Promise<{
    success: boolean;
    newLevel?: number;
    newXp?: number;
    totalTokensEarned: number;
  }> {
    try {
      const token = this.mintedTokens.get(agentId);
      if (!token) {
        throw new Error('Token not found');
      }

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate new level and XP
      const currentLevel = token.attributes.level;
      const newXp = (token.attributes.level * 100) + battleResult.xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;

      // Update token if level increased
      if (newLevel > currentLevel) {
        const updatedMetadata = {
          ...token,
          attributes: {
            ...token.attributes,
            level: newLevel
          }
        };
        this.mintedTokens.set(agentId, updatedMetadata);
      }

      return {
        success: true,
        newLevel,
        newXp,
        totalTokensEarned: battleResult.tokensEarned
      };
    } catch (error) {
      console.error('Awarding rewards failed:', error);
      return {
        success: false,
        totalTokensEarned: 0
      };
    }
  }

  // Calculate rarity based on agent traits
  private calculateRarity(traits: { accuracy: number; speed: number; matrixAffinity: number }): string {
    const totalScore = traits.accuracy + traits.speed + traits.matrixAffinity;
    
    if (totalScore >= 2.7) return 'legendary';
    if (totalScore >= 2.4) return 'epic';
    if (totalScore >= 2.1) return 'rare';
    return 'common';
  }

  // Generate matrix status based on traits
  private generateMatrixStatus(traits: { accuracy: number; speed: number; matrixAffinity: number }): string {
    const matrixScore = traits.matrixAffinity;
    
    if (matrixScore >= 0.95) return 'oracle';
    if (matrixScore >= 0.85) return 'active';
    if (matrixScore >= 0.75) return 'upgrading';
    return 'breached';
  }

  // Simulate IPFS upload
  async uploadToIPFS(file: File, metadata: any): Promise<{ ipfsHash: string; url: string }> {
    // Simulate IPFS upload delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const ipfsHash = `Qm${Math.random().toString(16).slice(2, 46)}`;
    const url = `https://ipfs.io/ipfs/${ipfsHash}`;
    
    return { ipfsHash, url };
  }

  // Get minting statistics
  async getMintingStats(): Promise<{
    totalMinted: number;
    totalValue: number;
    rarityDistribution: Record<string, number>;
    recentMints: Array<{ tokenId: string; name: string; timestamp: Date }>;
  }> {
    const totalMinted = this.mintedTokens.size;
    const totalValue = totalMinted * 100; // Assume 100 $SENT per token
    
    const rarityDistribution = {
      legendary: 0,
      epic: 0,
      rare: 0,
      common: 0
    };

    this.mintedTokens.forEach(token => {
      rarityDistribution[token.attributes.rarity as keyof typeof rarityDistribution]++;
    });

    const recentMints = Array.from(this.mintedTokens.entries())
      .slice(-5)
      .map(([tokenId, metadata]) => ({
        tokenId,
        name: metadata.name,
        timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24h
      }))
      .reverse();

    return {
      totalMinted,
      totalValue,
      rarityDistribution,
      recentMints
    };
  }
}

export const nftService = new NFTService();

// Export types for use in components
export type { NFTMetadata, MintingResult, AgentUpgrade };
