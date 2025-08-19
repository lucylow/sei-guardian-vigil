// =============================================================================
// HIVE INTELLIGENCE MCP SERVICE
// =============================================================================

import { env } from "../config/environment.js";

export interface HiveMemory {
  id: string;
  type: 'contract_audit' | 'vulnerability' | 'transaction' | 'user_interaction';
  content: any;
  metadata: {
    timestamp: string;
    source: string;
    confidence: number;
    tags: string[];
  };
  relationships: string[]; // IDs of related memories
}

export interface HiveQuery {
  query: string;
  filters?: {
    type?: string;
    tags?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
    confidence?: number;
  };
  limit?: number;
}

export class HiveIntelligenceService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.hiveIntelligenceMcpApiKey;
    this.baseUrl = "https://api.hiveintelligence.com/v1"; // Replace with actual API endpoint
    
    if (!this.apiKey) {
      throw new Error("HIVE_INTELLIGENCE_MCP_API_KEY is required");
    }
  }

  /**
   * Store a new memory in Hive Intelligence
   */
  async storeMemory(memory: Omit<HiveMemory, 'id'>): Promise<HiveMemory> {
    try {
      const response = await fetch(`${this.baseUrl}/memories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(memory)
      });

      if (!response.ok) {
        throw new Error(`Failed to store memory: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error storing memory in Hive Intelligence:", error);
      throw error;
    }
  }

  /**
   * Query memories from Hive Intelligence
   */
  async queryMemories(query: HiveQuery): Promise<HiveMemory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/memories/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        throw new Error(`Failed to query memories: ${response.statusText}`);
      }

      const result = await response.json();
      return result.memories || [];
    } catch (error) {
      console.error("Error querying memories from Hive Intelligence:", error);
      throw error;
    }
  }

  /**
   * Retrieve a specific memory by ID
   */
  async getMemory(memoryId: string): Promise<HiveMemory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memories/${memoryId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get memory: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error getting memory from Hive Intelligence:", error);
      throw error;
    }
  }

  /**
   * Update an existing memory
   */
  async updateMemory(memoryId: string, updates: Partial<HiveMemory>): Promise<HiveMemory> {
    try {
      const response = await fetch(`${this.baseUrl}/memories/${memoryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update memory: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating memory in Hive Intelligence:", error);
      throw error;
    }
  }

  /**
   * Delete a memory
   */
  async deleteMemory(memoryId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/memories/${memoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete memory: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting memory from Hive Intelligence:", error);
      throw error;
    }
  }

  /**
   * Get related memories based on content similarity
   */
  async getRelatedMemories(memoryId: string, limit: number = 5): Promise<HiveMemory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/memories/${memoryId}/related?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get related memories: ${response.statusText}`);
      }

      const result = await response.json();
      return result.memories || [];
    } catch (error) {
      console.error("Error getting related memories from Hive Intelligence:", error);
      throw error;
    }
  }

  /**
   * Store contract audit results
   */
  async storeContractAudit(contractAddress: string, auditResult: any): Promise<HiveMemory> {
    const memory: Omit<HiveMemory, 'id'> = {
      type: 'contract_audit',
      content: {
        contractAddress,
        auditResult,
        vulnerabilities: auditResult.vulnerabilities || [],
        riskScore: auditResult.riskScore || 0
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'sei_sentinel',
        confidence: auditResult.confidence || 0.8,
        tags: ['contract_audit', 'sei_blockchain', 'security']
      },
      relationships: []
    };

    return await this.storeMemory(memory);
  }

  /**
   * Store vulnerability detection
   */
  async storeVulnerability(contractAddress: string, vulnerability: any): Promise<HiveMemory> {
    const memory: Omit<HiveMemory, 'id'> = {
      type: 'vulnerability',
      content: {
        contractAddress,
        vulnerability,
        severity: vulnerability.severity || 'unknown',
        cwe: vulnerability.cwe || 'unknown'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'sei_sentinel',
        confidence: vulnerability.confidence || 0.9,
        tags: ['vulnerability', 'security', 'sei_blockchain']
      },
      relationships: []
    };

    return await this.storeMemory(memory);
  }

  /**
   * Get insights for contract security analysis
   */
  async getSecurityInsights(contractAddress: string): Promise<any> {
    try {
      const query: HiveQuery = {
        query: `security analysis for contract ${contractAddress}`,
        filters: {
          type: 'contract_audit',
          tags: ['security', 'sei_blockchain']
        },
        limit: 10
      };

      const memories = await this.queryMemories(query);
      
      // Analyze patterns and generate insights
      const insights = {
        totalAudits: memories.length,
        riskTrend: this.calculateRiskTrend(memories),
        commonVulnerabilities: this.analyzeCommonVulnerabilities(memories),
        recommendations: this.generateRecommendations(memories)
      };

      return insights;
    } catch (error) {
      console.error("Error getting security insights:", error);
      throw error;
    }
  }

  private calculateRiskTrend(memories: HiveMemory[]): string {
    if (memories.length < 2) return 'insufficient_data';
    
    // Simple risk trend calculation
    const sortedMemories = memories.sort((a, b) => 
      new Date(a.metadata.timestamp).getTime() - new Date(b.metadata.timestamp).getTime()
    );
    
    const firstRisk = sortedMemories[0].content.riskScore || 0;
    const lastRisk = sortedMemories[sortedMemories.length - 1].content.riskScore || 0;
    
    if (lastRisk > firstRisk + 0.1) return 'increasing';
    if (lastRisk < firstRisk - 0.1) return 'decreasing';
    return 'stable';
  }

  private analyzeCommonVulnerabilities(memories: HiveMemory[]): string[] {
    const vulnerabilityCounts: { [key: string]: number } = {};
    
    memories.forEach(memory => {
      if (memory.content.vulnerabilities) {
        memory.content.vulnerabilities.forEach((vuln: any) => {
          const type = vuln.type || 'unknown';
          vulnerabilityCounts[type] = (vulnerabilityCounts[type] || 0) + 1;
        });
      }
    });

    return Object.entries(vulnerabilityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  private generateRecommendations(memories: HiveMemory[]): string[] {
    const recommendations = [];
    
    if (memories.length === 0) {
      recommendations.push("No previous audit data available. Perform initial security scan.");
      return recommendations;
    }

    const recentMemory = memories[memories.length - 1];
    const riskScore = recentMemory.content.riskScore || 0;

    if (riskScore > 0.8) {
      recommendations.push("Critical risk level detected. Immediate security review required.");
    } else if (riskScore > 0.6) {
      recommendations.push("High risk level. Schedule security audit within 24 hours.");
    } else if (riskScore > 0.4) {
      recommendations.push("Medium risk level. Monitor for changes and schedule review.");
    } else {
      recommendations.push("Low risk level. Continue monitoring and regular audits.");
    }

    return recommendations;
  }
}

// Export singleton instance
export const hiveIntelligence = new HiveIntelligenceService();
export default hiveIntelligence;
