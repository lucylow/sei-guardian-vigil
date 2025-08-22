/**
 * @file agentDataModels.ts
 * @description Defines the data models for AI agents created via the No-Code Studio,
 *              including their configuration and how they map to on-chain NFT metadata.
 */

// --- 1. Core Agent Definition (from No-Code Studio Input) ---
export interface NoCodeAgentConfig {
  id?: string;
  name: string;
  description: string;
  agentType: 'SecurityAuditor' | 'ThreatResponder' | 'ComplianceGuard' | 'Custom';
  ownerWalletAddress: string;
  configuration: {
    targetContracts?: string[];
    vulnerabilityTypes?: string[];
    alertThreshold?: number;
    [key: string]: any;
  };
  avatarUrl?: string;
}

// --- 2. Internal Agent Representation (Backend Model) ---
export interface AgentRecord {
  id: string;
  name: string;
  description: string;
  agentType: NoCodeAgentConfig['agentType'];
  ownerWalletAddress: string;
  configuration: NoCodeAgentConfig['configuration'];
  status: 'Pending' | 'Deployed' | 'Active' | 'Paused' | 'Error';
  createdAt: number;
  lastUpdated: number;
  nftTokenId?: string;
  seiTxHash?: string;
  avatarUrl?: string;
}

// --- 3. Agent NFT Metadata (On-Chain Representation) ---
export interface AgentNFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number | boolean;
    display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  }>;
}

export function agentRecordToNFTMetadata(agent: AgentRecord): AgentNFTMetadata {
  const attributes: AgentNFTMetadata['attributes'] = [
    { trait_type: 'AgentType', value: agent.agentType },
    { trait_type: 'Owner', value: agent.ownerWalletAddress },
    { trait_type: 'Status', value: agent.status },
    { trait_type: 'DeployedAt', value: agent.createdAt, display_type: 'date' },
  ];

  for (const key in agent.configuration) {
    if (Object.prototype.hasOwnProperty.call(agent.configuration, key)) {
      attributes.push({ trait_type: key, value: agent.configuration[key] });
    }
  }

  return {
    name: agent.name,
    description: agent.description,
    image: agent.avatarUrl || 'ipfs://QmaDefaultAgentImageHash',
    external_url: `https://sei-sentinel.lovable.app/agents/${agent.id}`,
    attributes: attributes,
  };
}
