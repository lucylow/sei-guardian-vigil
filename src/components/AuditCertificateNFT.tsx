import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface AuditCertificate {
  tokenId?: string;
  contractName: string;
  contractAddress: string;
  securityScore: number;
  criticalFindings: number;
  auditDate: string;
  blockchain: string;
  status: 'pending' | 'minted' | 'revoked';
  metadataUri?: string;
  transactionHash?: string;
}

interface AuditCertificateNFTProps {
  auditResult: any;
  contractName: string;
  contractAddress: string;
  blockchain: string;
  onCertificateMinted?: (certificate: AuditCertificate) => void;
}

export const AuditCertificateNFT: React.FC<AuditCertificateNFTProps> = ({
  auditResult,
  contractName,
  contractAddress,
  blockchain,
  onCertificateMinted
}) => {
  const [certificate, setCertificate] = useState<AuditCertificate | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string>('');

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <Sparkles className="w-5 h-5" />
            <span>Audit Certificate NFT</span>
          </CardTitle>
          <CardDescription className="text-blue-700">
            Generate a verifiable NFT certificate for your audited smart contract on SEI blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Generate Audit NFT Certificate
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              This will create a verifiable NFT certificate on SEI blockchain that can be used in NFT marketplaces
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
