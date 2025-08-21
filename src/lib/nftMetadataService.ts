// NFT Metadata Service for SEI Audit Certificates
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  verification_url: string;
  external_url: string;
  background_color: string;
  animation_url?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface AuditNFTData {
  contractName: string;
  contractAddress: string;
  securityScore: number;
  criticalFindings: number;
  auditDate: string;
  blockchain: string;
  vulnerabilities: any[];
  gasOptimizations: any[];
}

export class NFTMetadataService {
  /**
   * Generate NFT metadata for an audit certificate
   */
  static generateAuditMetadata(data: AuditNFTData): NFTMetadata {
    const score = data.securityScore;
    const level = this.getSecurityLevel(score);
    const color = this.getScoreColor(score);
    
    return {
      name: `SEI Audit Certificate - ${data.contractName}`,
      description: `Smart contract audit certificate for ${data.contractName} verified by SEI Sentinel CS_CAT. Security Score: ${score}/100. This NFT represents a verified security audit and can be used for trust verification across SEI ecosystem.`,
      image: this.generateSVGImage(score, level, data.contractName),
      background_color: color,
      attributes: [
        { trait_type: "Security Score", value: score, display_type: "number" },
        { trait_type: "Security Level", value: level },
        { trait_type: "Audit Date", value: new Date(data.auditDate).toLocaleDateString() },
        { trait_type: "Contract Name", value: data.contractName },
        { trait_type: "Contract Address", value: data.contractAddress },
        { trait_type: "Critical Issues", value: data.criticalFindings, display_type: "number" },
        { trait_type: "Blockchain", value: data.blockchain },
        { trait_type: "Auditor", value: "CS_CAT v2.0" },
        { trait_type: "Verification Status", value: "On-Chain Verified" },
        { trait_type: "Total Vulnerabilities", value: data.vulnerabilities.length, display_type: "number" },
        { trait_type: "Gas Optimizations", value: data.gasOptimizations.length, display_type: "number" },
        { trait_type: "Certificate Type", value: "Security Audit" }
      ],
      verification_url: `https://sentinel.sei.dev/audit/${data.contractAddress}`,
      external_url: `https://sei.dev/audit-certificates/${data.contractName}`
    };
  }

  /**
   * Get security level based on score
   */
  private static getSecurityLevel(score: number): string {
    if (score >= 95) return "Enterprise Grade";
    if (score >= 90) return "Production Ready";
    if (score >= 80) return "Secure";
    if (score >= 70) return "Acceptable";
    if (score >= 60) return "Needs Improvement";
    return "Critical Issues";
  }

  /**
   * Get color based on security score
   */
  private static getScoreColor(score: number): string {
    if (score >= 90) return "#18c687"; // Green
    if (score >= 80) return "#1478FE"; // Blue
    if (score >= 70) return "#f59e0b"; // Yellow
    if (score >= 60) return "#f97316"; // Orange
    return "#ef4444"; // Red
  }

  /**
   * Generate SVG image for NFT
   */
  private static generateSVGImage(score: number, level: string, contractName: string): string {
    const color = this.getScoreColor(score);
    const date = new Date().toLocaleDateString();
    
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1478FE;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="400" fill="url(#grad)" rx="20" filter="url(#shadow)"/>
        
        <!-- SEI Logo -->
        <circle cx="200" cy="80" r="40" fill="white" opacity="0.2"/>
        <text x="200" y="90" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">SEI</text>
        
        <!-- Score Circle -->
        <circle cx="200" cy="180" r="60" fill="white" opacity="0.9" filter="url(#shadow)"/>
        <text x="200" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="${color}">${score}</text>
        <text x="200" y="220" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#666">Security Score</text>
        
        <!-- Security Level -->
        <text x="200" y="260" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${level}</text>
        
        <!-- Contract Name -->
        <text x="200" y="290" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white" opacity="0.9">${contractName}</text>
        
        <!-- Verification Badge -->
        <rect x="150" y="310" width="100" height="30" rx="15" fill="white" opacity="0.9"/>
        <text x="200" y="330" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="${color}">VERIFIED</text>
        
        <!-- Date -->
        <text x="200" y="370" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="white" opacity="0.7">${date}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate IPFS metadata URI
   */
  static async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    // This is a placeholder - in production you would upload to IPFS
    // For demo purposes, we'll return a mock IPFS URI
    const mockIPFSHash = `bafybeih${Math.random().toString(36).substr(2, 44)}`;
    return `ipfs://${mockIPFSHash}`;
  }

  /**
   * Download metadata as JSON file
   */
  static downloadMetadata(metadata: NFTMetadata, filename: string): void {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
