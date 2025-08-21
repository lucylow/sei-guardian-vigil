import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileCode, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Play,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { auditService, type AuditResult, type AuditSettings } from '@/lib/auditService';
import { AuditCertificateNFT } from './AuditCertificateNFT';
import { EnhancedAuditPanel } from './EnhancedAuditPanel';

interface ContractUpload {
  id: string;
  name: string;
  content: string;
  language: 'solidity' | 'rust' | 'typescript' | 'javascript';
  blockchain: 'sei' | 'ethereum' | 'polygon' | 'binance';
  size: number;
  timestamp: Date;
  status: 'uploaded' | 'analyzing' | 'completed' | 'failed';
  vulnerabilities?: Vulnerability[];
  auditId?: string;
  auditResult?: AuditResult;
}

interface Vulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  line: number;
  recommendation: string;
  confidence: number;
}

export const SmartContractUploader = () => {
  const [contracts, setContracts] = useState<ContractUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractUpload | null>(null);
  const [auditSettings, setAuditSettings] = useState({
    blockchain: 'sei',
    language: 'rust',
    auditDepth: 'comprehensive',
    includeGasAnalysis: true,
    includeFormalVerification: false
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileUpload(file));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => handleFileUpload(file));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(sol|rs|ts|js|wasm)$/)) {
      alert('Please upload a valid smart contract file (.sol, .rs, .ts, .js, .wasm)');
      return;
    }

    const content = await file.text();
    const language = getLanguageFromExtension(file.name);
    
    const contract: ContractUpload = {
      id: `contract-${Date.now()}`,
      name: file.name,
      content,
      language,
      blockchain: auditSettings.blockchain as any,
      size: file.size,
      timestamp: new Date(),
      status: 'uploaded'
    };

    setContracts(prev => [contract, ...prev]);
    setSelectedContract(contract);
  };

  const getLanguageFromExtension = (filename: string): 'solidity' | 'rust' | 'typescript' | 'javascript' => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'sol': return 'solidity';
      case 'rs': return 'rust';
      case 'ts': return 'typescript';
      case 'js': return 'javascript';
      default: return 'rust';
    }
  };

  const startAudit = async (contract: ContractUpload) => {
    setContracts(prev => 
      prev.map(c => 
        c.id === contract.id 
          ? { ...c, status: 'analyzing' as const }
          : c
      )
    );

    try {
      // Start real AI audit using the audit service
      const auditConfig: AuditSettings = {
        blockchain: contract.blockchain as any,
        language: contract.language as any,
        auditDepth: auditSettings.auditDepth as any,
        includeGasAnalysis: true,
        includeFormalVerification: false
      };

      const auditId = await auditService.startAudit(
        contract.content,
        contract.name,
        auditConfig
      );

      // Update contract with audit ID
      setContracts(prev => 
        prev.map(c => 
          c.id === contract.id 
            ? { ...c, auditId }
            : c
        )
      );

      // Poll for audit results
      const pollAuditResults = async () => {
        const result = await auditService.getAuditResult(auditId);
        if (result && result.status === 'completed') {
          setContracts(prev => 
            prev.map(c => 
              c.id === contract.id 
                ? { ...c, status: 'completed', auditResult: result, vulnerabilities: result.vulnerabilities }
                : c
            )
          );
          return;
        } else if (result && result.status === 'failed') {
          setContracts(prev => 
            prev.map(c => 
              c.id === contract.id 
                ? { ...c, status: 'failed' }
                : c
            )
          );
          return;
        }
        
        // Continue polling if still analyzing
        setTimeout(pollAuditResults, 1000);
      };

      pollAuditResults();

    } catch (error) {
      console.error('Audit failed:', error);
      setContracts(prev => 
        prev.map(c => 
          c.id === contract.id 
            ? { ...c, status: 'failed' }
            : c
        )
      );
    }
  };

  const removeContract = (contractId: string) => {
    setContracts(prev => prev.filter(c => c.id !== contractId));
    if (selectedContract?.id === contractId) {
      setSelectedContract(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <FileCode className="w-4 h-4 text-blue-500" />;
      case 'analyzing': return <Play className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileCode className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Smart Contract</span>
          </CardTitle>
          <CardDescription>
            Upload your smart contract for AI-powered security audit and vulnerability analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audit Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="blockchain">Blockchain</Label>
              <Select 
                value={auditSettings.blockchain} 
                onValueChange={(value) => setAuditSettings(prev => ({ ...prev, blockchain: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sei">🌐 SEI Network</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="binance">Binance Smart Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={auditSettings.language} 
                onValueChange={(value) => setAuditSettings(prev => ({ ...prev, language: value as any }))}
              >
                <SelectTrigger>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rust">Rust (CosmWasm)</SelectItem>
                  <SelectItem value="solidity">Solidity</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="auditDepth">Audit Depth</Label>
              <Select 
                value={auditSettings.auditDepth} 
                onValueChange={(value) => setAuditSettings(prev => ({ ...prev, auditDepth: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop your smart contract files here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports .sol, .rs, .ts, .js, .wasm files
            </p>
            <Button onClick={() => document.getElementById('file-input')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".sol,.rs,.ts,.js,.wasm"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* AI Audit Features */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">AI-Powered Security Analysis</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Vulnerability Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Gas Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>SEI-Specific Checks</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Race Condition Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Parallel Execution Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Professional Reports</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract List */}
      {contracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileCode className="w-5 h-5" />
              <span>Uploaded Contracts ({contracts.length})</span>
            </CardTitle>
            <CardDescription>
              Manage your uploaded contracts and start AI audits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(contract.status)}
                      <div>
                        <h4 className="font-medium">{contract.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Badge variant="outline">{contract.language}</Badge>
                          <Badge variant="outline">{contract.blockchain}</Badge>
                          <span>{(contract.size / 1024).toFixed(1)} KB</span>
                          <span>{contract.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {contract.status === 'uploaded' && (
                        <Button 
                          size="sm" 
                          onClick={() => startAudit(contract)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start AI Audit
                        </Button>
                      )}
                      
                      {contract.status === 'analyzing' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-600">AI Analyzing...</span>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContract(contract)}
                      >
                        View Details
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeContract(contract.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contract Details Modal */}
      {selectedContract && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contract Analysis: {selectedContract.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedContract(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contract Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Language:</Label>
                <Badge variant="outline" className="ml-2">{selectedContract.language}</Badge>
              </div>
              <div>
                <Label className="font-medium">Blockchain:</Label>
                <Badge variant="outline" className="ml-2">{selectedContract.blockchain}</Badge>
              </div>
              <div>
                <Label className="font-medium">Size:</Label>
                <span className="ml-2">{(selectedContract.size / 1024).toFixed(1)} KB</span>
              </div>
              <div>
                <Label className="font-medium">Status:</Label>
                <Badge variant="outline" className="ml-2">{selectedContract.status}</Badge>
              </div>
            </div>

            {/* Security Score */}
            {selectedContract.auditResult && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-900">AI Security Analysis Complete</h4>
                    <p className="text-sm text-green-700">Your contract has been analyzed for vulnerabilities and optimizations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {selectedContract.auditResult.securityScore}/100
                    </div>
                    <div className="text-xs text-green-600">Security Score</div>
                  </div>
                </div>
              </div>
            )}

            {/* Contract Content */}
            <div>
              <Label className="font-medium">Contract Code:</Label>
              <Textarea
                value={selectedContract.content}
                readOnly
                className="mt-2 font-mono text-xs h-32"
              />
            </div>

            {/* Vulnerabilities */}
            {selectedContract.vulnerabilities && selectedContract.vulnerabilities.length > 0 && (
              <div>
                <Label className="font-medium">Vulnerabilities Found:</Label>
                <div className="mt-2 space-y-3">
                  {selectedContract.vulnerabilities.map((vuln) => (
                    <div key={vuln.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{vuln.title}</h5>
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{vuln.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Line: {vuln.line}</span>
                        <span>Confidence: {vuln.confidence}%</span>
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium">Recommendation:</Label>
                        <p className="text-gray-600 mt-1">{vuln.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gas Optimizations */}
            {selectedContract.auditResult?.gasOptimizations && selectedContract.auditResult.gasOptimizations.length > 0 && (
              <div>
                <Label className="font-medium">Gas Optimization Suggestions:</Label>
                <div className="mt-2 space-y-3">
                  {selectedContract.auditResult.gasOptimizations.map((opt) => (
                    <div key={opt.id} className="border rounded-lg p-3 space-y-2 bg-blue-50 border-blue-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-blue-900">{opt.title}</h5>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {opt.potentialSavings}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">{opt.description}</p>
                      <div className="text-xs text-blue-600">
                        <span>Line: {opt.line}</span>
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium text-blue-900">Suggestion:</Label>
                        <p className="text-blue-700 mt-1">{opt.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Actions */}
            {selectedContract.status === 'uploaded' && (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => startAudit(selectedContract)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Start AI Audit
                </Button>
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Custom Analysis
                </Button>
              </div>
            )}

            {/* NFT Certificate Section */}
            {selectedContract.status === 'completed' && selectedContract.auditResult && (
              <AuditCertificateNFT
                auditResult={selectedContract.auditResult}
                contractName={selectedContract.name}
                contractAddress={`0x${Math.random().toString(16).substr(2, 40)}`}
                blockchain={selectedContract.blockchain}
                onCertificateMinted={(certificate) => {
                  console.log('NFT Certificate minted:', certificate);
                  // You can add additional logic here for handling the minted certificate
                }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
