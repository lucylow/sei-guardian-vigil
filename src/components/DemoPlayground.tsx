import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ScanResult {
  vulnerabilities: Array<{
    type: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    recommendation: string;
  }>;
  status: string;
  progress: number;
  scanTime: number;
  agentUsed: string;
}

const DemoPlayground: React.FC = () => {
  const [contractCode, setContractCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleContracts = [
    {
      name: "Vulnerable DeFi Contract",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableDeFi {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        // VULNERABILITY: Reentrancy attack possible
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}`
    },
    {
      name: "Access Control Issue",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControlIssue {
    address public owner;
    mapping(address => bool) public whitelist;
    
    constructor() {
        owner = msg.sender;
    }
    
    // VULNERABILITY: Missing access control
    function addToWhitelist(address user) public {
        whitelist[user] = true;
    }
    
    function removeFromWhitelist(address user) public {
        whitelist[user] = false;
    }
    
    function restrictedFunction() public view returns (bool) {
        return whitelist[msg.sender];
    }
}`
    },
    {
      name: "Safe Contract Example",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SafeContract is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");
        
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}`
    }
  ];

  const handleScan = async () => {
    setIsLoading(true);
    setScanResult(null);

    // Simulate API call to SEI Sentinel agents
    let progress = 0;
    const startTime = Date.now();
    const agentNames = ["StaticGuardian", "DarkWebScout", "PatchMaster", "CodeAuditor"];
    const selectedAgent = agentNames[Math.random() * agentNames.length | 0];
    
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress increments
      if (progress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        
        // Generate realistic scan results based on contract content
        const vulnerabilities = generateVulnerabilities(contractCode);
        const scanTime = Date.now() - startTime;
        
        setScanResult({
          vulnerabilities,
          status: "Scan Complete",
          progress: 100,
          scanTime,
          agentUsed: selectedAgent
        });
      } else {
        setScanResult({
          vulnerabilities: [],
          status: "Scanning...",
          progress: Math.min(progress, 99),
          scanTime: 0,
          agentUsed: selectedAgent
        });
      }
    }, 300);
  };

  const generateVulnerabilities = (code: string): ScanResult['vulnerabilities'] => {
    const vulnerabilities: ScanResult['vulnerabilities'] = [];
    
    // Check for common vulnerabilities
    if (code.includes("call.value") || code.includes("call{value:")) {
      vulnerabilities.push({
        type: "Reentrancy",
        severity: "Critical",
        description: "Potential reentrancy vulnerability detected. External calls are made before state changes.",
        recommendation: "Implement reentrancy guard or follow Checks-Effects-Interactions pattern."
      });
    }
    
    if (code.includes("msg.sender.call") && !code.includes("nonReentrant")) {
      vulnerabilities.push({
        type: "Reentrancy",
        severity: "High",
        description: "External call pattern that could lead to reentrancy attacks.",
        recommendation: "Add nonReentrant modifier or implement proper state management."
      });
    }
    
    if (code.includes("public") && !code.includes("onlyOwner") && !code.includes("modifier")) {
      vulnerabilities.push({
        type: "Access Control",
        severity: "Medium",
        description: "Function lacks proper access control mechanisms.",
        recommendation: "Implement access control modifiers or role-based permissions."
      });
    }
    
    if (code.includes("delegatecall") || code.includes("callcode")) {
      vulnerabilities.push({
        type: "Dangerous Low-Level Calls",
        severity: "High",
        description: "Use of low-level calls that can lead to unexpected behavior.",
        recommendation: "Avoid low-level calls when possible, or implement strict validation."
      });
    }
    
    if (code.includes("block.timestamp") && code.includes("now")) {
      vulnerabilities.push({
        type: "Timestamp Dependence",
        severity: "Medium",
        description: "Contract logic depends on block timestamp which can be manipulated.",
        recommendation: "Avoid using block.timestamp for critical logic, consider using block numbers."
      });
    }
    
    return vulnerabilities;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const loadSampleContract = (contract: typeof sampleContracts[0]) => {
    setContractCode(contract.code);
    setScanResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Interactive Security Scan Demo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Experience SEI Sentinel's AI-powered security scanning in action. Submit your own contract or try our sample contracts.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample Contracts */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Try Sample Contracts:</h4>
            <div className="flex flex-wrap gap-2">
              {sampleContracts.map((contract, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleContract(contract)}
                >
                  {contract.name}
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Paste your Solidity or CosmWasm contract code here..."
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          />
          
          <Button 
            onClick={handleScan} 
            disabled={isLoading || !contractCode}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Scanning with SEI Sentinel...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Run Security Scan
              </>
            )}
          </Button>

          {scanResult && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={scanResult.status === "Scan Complete" ? "default" : "secondary"}>
                    {scanResult.status}
                  </Badge>
                </div>
                {scanResult.agentUsed && (
                  <div className="text-sm text-muted-foreground">
                    Agent: {scanResult.agentUsed}
                  </div>
                )}
              </div>
              
              <Progress value={scanResult.progress} className="w-full" />
              
              {scanResult.scanTime > 0 && (
                <div className="text-sm text-muted-foreground">
                  Scan completed in {scanResult.scanTime}ms (leveraging Sei's fast finality)
                </div>
              )}

              {scanResult.status === "Scan Complete" && (
                <div className="space-y-3">
                  {scanResult.vulnerabilities.length > 0 ? (
                    <>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Found {scanResult.vulnerabilities.length} potential security issue(s)
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Detected Vulnerabilities:</h4>
                        {scanResult.vulnerabilities.map((vuln, index) => (
                          <Card key={index} className="border-l-4 border-l-red-500">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant={getSeverityColor(vuln.severity)}>
                                  {vuln.severity}
                                </Badge>
                                <span className="text-sm font-medium">{vuln.type}</span>
                              </div>
                              <p className="text-sm mb-2">{vuln.description}</p>
                              <div className="text-xs text-muted-foreground">
                                <strong>Recommendation:</strong> {vuln.recommendation}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        No vulnerabilities detected! Your contract appears to follow security best practices.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPlayground;
