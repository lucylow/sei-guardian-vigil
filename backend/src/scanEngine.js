import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { analyze } from '@solidity-parser/parser';

class VulnerabilityScanner {
  constructor() {
    this.vulnerabilityPatterns = {
      reentrancy: /external_call.*state_change/g,
      accessControl: /require\(.*owner.*\)/g,
      integerOverflow: /\+|\-|\*(?!.*SafeMath)/g,
      uncheckedCall: /\.call\(|\.delegatecall\(/g,
      gasLimit: /gasleft\(\)|gas:/g
    };
  }

  async scanContract(contractCode, contractAddress = null) {
    const startTime = Date.now();
    const findings = [];

    try {
      // 1. Static Analysis
      const staticFindings = await this.staticAnalysis(contractCode);
      findings.push(...staticFindings);

      // 2. Dynamic Analysis (if deployed)
      if (contractAddress) {
        const dynamicFindings = await this.dynamicAnalysis(contractAddress);
        findings.push(...dynamicFindings);
      }

      // 3. AI/ML Analysis
      const aiFindings = await this.aiAnalysis(contractCode);
      findings.push(...aiFindings);

      const scanTime = Date.now() - startTime;
      
      return {
        success: true,
        scanTime,
        findings: findings.sort((a, b) => b.severity - a.severity),
        summary: this.generateSummary(findings)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        scanTime: Date.now() - startTime
      };
    }
  }

  async staticAnalysis(contractCode) {
    const findings = [];
    
    // Reentrancy Detection
    if (this.vulnerabilityPatterns.reentrancy.test(contractCode)) {
      findings.push({
        type: 'Reentrancy',
        severity: 9,
        description: 'Potential reentrancy vulnerability detected',
        line: this.findLineNumber(contractCode, 'external_call'),
        cwe: 'CWE-841',
        recommendation: 'Use ReentrancyGuard or checks-effects-interactions pattern'
      });
    }

    // Access Control Issues
    const accessControlMatches = contractCode.match(/function\s+(\w+).*public/g);
    if (accessControlMatches) {
      accessControlMatches.forEach(match => {
        if (!match.includes('onlyOwner') && !match.includes('require')) {
          findings.push({
            type: 'Access Control',
            severity: 7,
            description: 'Public function without access control',
            function: match.match(/function\s+(\w+)/)[1],
            cwe: 'CWE-284',
            recommendation: 'Add proper access control modifiers'
          });
        }
      });
    }

    // Integer Overflow
    if (this.vulnerabilityPatterns.integerOverflow.test(contractCode)) {
      findings.push({
        type: 'Integer Overflow',
        severity: 6,
        description: 'Potential integer overflow without SafeMath',
        cwe: 'CWE-190',
        recommendation: 'Use SafeMath library or Solidity 0.8+ built-in checks'
      });
    }

    return findings;
  }

  async dynamicAnalysis(contractAddress) {
    const findings = [];
    const client = await CosmWasmClient.connect('https://sei-testnet-rpc.polkachu.com');
    
    try {
      // Check contract state
      const contractInfo = await client.getContract(contractAddress);
      
      // Simulate common attack vectors
      const attackVectors = [
        { name: 'Large Transfer', amount: '999999999999999999' },
        { name: 'Zero Address', recipient: '0x0000000000000000000000000000000000000000' },
        { name: 'Self Destruct', method: 'selfdestruct' }
      ];

      for (const vector of attackVectors) {
        try {
          // Simulate attack (dry run)
          const result = await this.simulateAttack(contractAddress, vector);
          if (result.vulnerable) {
            findings.push({
              type: 'Dynamic Vulnerability',
              severity: 8,
              description: `Contract vulnerable to ${vector.name} attack`,
              attack: vector.name,
              recommendation: 'Implement proper input validation and bounds checking'
            });
          }
        } catch (e) {
          // Attack failed - good sign
        }
      }
    } catch (error) {
      console.error('Dynamic analysis failed:', error);
    }

    return findings;
  }

  async aiAnalysis(contractCode) {
    // Simplified AI analysis using pattern matching
    // In production, this would use actual ML models
    const findings = [];
    
    const suspiciousPatterns = [
      { pattern: /selfdestruct/g, type: 'Self Destruct', severity: 10 },
      { pattern: /delegatecall/g, type: 'Delegate Call', severity: 8 },
      { pattern: /tx\.origin/g, type: 'tx.origin Usage', severity: 7 },
      { pattern: /block\.timestamp/g, type: 'Timestamp Dependence', severity: 5 }
    ];

    suspiciousPatterns.forEach(({ pattern, type, severity }) => {
      const matches = contractCode.match(pattern);
      if (matches) {
        findings.push({
          type,
          severity,
          description: `Detected ${matches.length} instance(s) of ${type}`,
          occurrences: matches.length,
          recommendation: this.getRecommendation(type)
        });
      }
    });

    return findings;
  }

  generateSummary(findings) {
    const critical = findings.filter(f => f.severity >= 8).length;
    const high = findings.filter(f => f.severity >= 6 && f.severity < 8).length;
    const medium = findings.filter(f => f.severity >= 4 && f.severity < 6).length;
    const low = findings.filter(f => f.severity < 4).length;

    return {
      total: findings.length,
      critical,
      high,
      medium,
      low,
      riskScore: this.calculateRiskScore(findings)
    };
  }

  calculateRiskScore(findings) {
    return findings.reduce((score, finding) => score + finding.severity, 0);
  }

  findLineNumber(code, pattern) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(pattern)) {
        return i + 1;
      }
    }
    return null;
  }

  getRecommendation(type) {
    const recommendations = {
      'Self Destruct': 'Remove selfdestruct or add multi-sig protection',
      'Delegate Call': 'Use call instead of delegatecall when possible',
      'tx.origin Usage': 'Use msg.sender instead of tx.origin',
      'Timestamp Dependence': 'Avoid using block.timestamp for critical logic'
    };
    return recommendations[type] || 'Review and secure this pattern';
  }
}

module.exports = VulnerabilityScanner;