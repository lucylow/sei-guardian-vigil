/**
 * SEI Guardian Vigil Agent Templates & Boilerplate
 * 
 * This file provides ready-to-use templates for developers to build AI agents on Sei Network.
 * Each template demonstrates best practices and Sei-specific optimizations.
 */

// ===== PYTHON AGENT TEMPLATE =====

export const pythonAgentTemplate = `#!/usr/bin/env python3
"""
SEI Guardian Vigil AI Agent Template - Python
Built for Sei Network's parallelized EVM and fast finality
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import aiohttp
from web3 import Web3
from web3.middleware import geth_poa_middleware

class AuditPriority(Enum):
    LOW = 0
    MEDIUM = 1
    HIGH = 2
    CRITICAL = 3

@dataclass
class Vulnerability:
    type: str
    severity: str
    description: str
    line_number: Optional[int]
    recommendation: str
    confidence: float

@dataclass
class AuditResult:
    contract_address: str
    vulnerabilities: List[Vulnerability]
    scan_time_ms: int
    block_height: int
    finality_time_ms: int
    agent_id: str
    timestamp: int

class SeiAgentTemplate:
    """
    Base template for AI agents on Sei Network
    Leverages parallel execution and fast finality
    """
    
    def __init__(self, 
                 rpc_url: str = "https://rpc.sei.io",
                 registry_address: str = "0x...",
                 agent_name: str = "MySecurityAgent"):
        self.rpc_url = rpc_url
        self.registry_address = registry_address
        self.agent_name = agent_name
        self.web3 = Web3(Web3.HTTPProvider(rpc_url))
        
        # Add Sei-specific middleware
        self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Agent capabilities
        self.capabilities = [
            "static-analysis",
            "reentrancy-detection", 
            "access-control-audit",
            "overflow-detection"
        ]
        
        # Performance metrics
        self.total_audits = 0
        self.successful_audits = 0
        self.avg_scan_time = 0
        
    async def initialize(self) -> bool:
        """Initialize agent connection to Sei Network"""
        try:
            # Test connection
            latest_block = self.web3.eth.block_number
            print(f"✅ Connected to Sei Network at block {latest_block}")
            
            # Get network metrics
            metrics = await self.get_network_metrics()
            print(f"📊 Current TPS: {metrics['current_tps']:,}")
            print(f"⚡ Finality: {metrics['finality_time_ms']}ms")
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize: {e}")
            return False
    
    async def get_network_metrics(self) -> Dict[str, Any]:
        """Get real-time Sei Network metrics"""
        try:
            current_block = self.web3.eth.block_number
            current_block_data = self.web3.eth.get_block(current_block)
            previous_block_data = self.web3.eth.get_block(current_block - 1)
            
            block_time = current_block_data['timestamp'] - previous_block_data['timestamp']
            gas_price = self.web3.eth.gas_price
            
            # Estimate TPS from recent blocks
            recent_blocks = []
            for i in range(10):
                try:
                    block = self.web3.eth.get_block(current_block - i)
                    recent_blocks.append(block)
                except:
                    break
            
            total_transactions = sum(len(block['transactions']) for block in recent_blocks)
            avg_tps = int(total_transactions / (len(recent_blocks) * block_time / 1000))
            
            return {
                'current_block': current_block,
                'block_time_ms': block_time * 1000,
                'finality_time_ms': 400,  # Sei's typical finality
                'current_tps': avg_tps,
                'gas_price_gwei': self.web3.from_wei(gas_price, 'gwei'),
                'network_latency_ms': 50
            }
            
        except Exception as e:
            print(f"Failed to get network metrics: {e}")
            return {
                'current_block': 0,
                'block_time_ms': 400,
                'finality_time_ms': 400,
                'current_tps': 20000,
                'gas_price_gwei': 0.001,
                'network_latency_ms': 50
            }
    
    async def audit_contract(self, contract_address: str, contract_code: str = "") -> AuditResult:
        """
        Perform security audit of a smart contract
        Optimized for Sei Network's fast finality
        """
        start_time = time.time()
        
        try:
            print(f"🔍 Starting audit of {contract_address}")
            
            # Initialize vulnerabilities list
            vulnerabilities = []
            
            # 1. Static Analysis (Parallel execution enabled by Sei)
            static_vulns = await self.perform_static_analysis(contract_code)
            vulnerabilities.extend(static_vulns)
            
            # 2. Reentrancy Detection
            reentrancy_vulns = await self.detect_reentrancy(contract_code)
            vulnerabilities.extend(reentrancy_vulns)
            
            # 3. Access Control Audit
            access_vulns = await self.audit_access_control(contract_code)
            vulnerabilities.extend(access_vulns)
            
            # 4. Integer Overflow Detection
            overflow_vulns = await self.detect_integer_overflow(contract_code)
            vulnerabilities.extend(overflow_vulns)
            
            # Calculate scan time
            scan_time_ms = int((time.time() - start_time) * 1000)
            
            # Get current block for on-chain verification
            block_height = self.web3.eth.block_number
            
            # Sei's fast finality enables immediate results
            finality_time_ms = 400
            
            # Create audit result
            result = AuditResult(
                contract_address=contract_address,
                vulnerabilities=vulnerabilities,
                scan_time_ms=scan_time_ms,
                block_height=block_height,
                finality_time_ms=finality_time_ms,
                agent_id=self.agent_name,
                timestamp=int(time.time())
            )
            
            # Update metrics
            self.total_audits += 1
            self.successful_audits += 1
            self.avg_scan_time = (self.avg_scan_time * (self.total_audits - 1) + scan_time_ms) / self.total_audits
            
            print(f"✅ Audit completed in {scan_time_ms}ms")
            print(f"🚨 Found {len(vulnerabilities)} vulnerabilities")
            print(f"📊 Block: {block_height}, Finality: {finality_time_ms}ms")
            
            return result
            
        except Exception as e:
            print(f"❌ Audit failed: {e}")
            raise
    
    async def perform_static_analysis(self, contract_code: str) -> List[Vulnerability]:
        """Perform static code analysis (can run in parallel on Sei)"""
        vulnerabilities = []
        
        if not contract_code:
            return vulnerabilities
        
        # Check for dangerous patterns
        dangerous_patterns = [
            ("delegatecall", "Dangerous Low-Level Call", "High", 
             "delegatecall can lead to unexpected behavior", "Avoid or implement strict validation"),
            ("callcode", "Dangerous Low-Level Call", "High",
             "callcode is deprecated and dangerous", "Use call instead"),
            ("suicide", "Self-Destruct", "Medium",
             "Contract can be destroyed", "Ensure proper access control"),
            ("block.timestamp", "Timestamp Dependence", "Medium",
             "Logic depends on block timestamp", "Use block numbers for critical logic")
        ]
        
        for pattern, vuln_type, severity, description, recommendation in dangerous_patterns:
            if pattern in contract_code.lower():
                vulnerabilities.append(Vulnerability(
                    type=vuln_type,
                    severity=severity,
                    description=description,
                    line_number=None,
                    recommendation=recommendation,
                    confidence=0.85
                ))
        
        return vulnerabilities
    
    async def detect_reentrancy(self, contract_code: str) -> List[Vulnerability]:
        """Detect potential reentrancy vulnerabilities"""
        vulnerabilities = []
        
        if not contract_code:
            return vulnerabilities
        
        # Check for reentrancy patterns
        if "call.value" in contract_code or "call{value:" in contract_code:
            if "nonReentrant" not in contract_code and "ReentrancyGuard" not in contract_code:
                vulnerabilities.append(Vulnerability(
                    type="Reentrancy",
                    severity="Critical",
                    description="Potential reentrancy vulnerability in external calls",
                    line_number=None,
                    recommendation="Implement reentrancy guard or follow Checks-Effects-Interactions pattern",
                    confidence=0.90
                ))
        
        return vulnerabilities
    
    async def audit_access_control(self, contract_code: str) -> List[Vulnerability]:
        """Audit access control mechanisms"""
        vulnerabilities = []
        
        if not contract_code:
            return vulnerabilities
        
        # Check for missing access control
        admin_functions = ["setAdmin", "upgrade", "pause", "mint", "burn"]
        
        for func in admin_functions:
            if func in contract_code:
                if "onlyOwner" not in contract_code and "modifier" not in contract_code:
                    vulnerabilities.append(Vulnerability(
                        type="Access Control",
                        severity="High",
                        description=f"Function {func} lacks proper access control",
                        line_number=None,
                        recommendation="Implement access control modifiers",
                        confidence=0.80
                    ))
        
        return vulnerabilities
    
    async def detect_integer_overflow(self, contract_code: str) -> List[Vulnerability]:
        """Detect potential integer overflow vulnerabilities"""
        vulnerabilities = []
        
        if not contract_code:
            return vulnerabilities
        
        # Check for arithmetic operations without bounds checking
        arithmetic_ops = ["+=", "-=", "*=", "/="]
        
        for op in arithmetic_ops:
            if op in contract_code:
                if "SafeMath" not in contract_code and "require" not in contract_code:
                    vulnerabilities.append(Vulnerability(
                        type="Integer Overflow",
                        severity="Medium",
                        description=f"Arithmetic operation {op} without overflow protection",
                        line_number=None,
                        recommendation="Use SafeMath or implement bounds checking",
                        confidence=0.75
                    ))
        
        return vulnerabilities
    
    async def submit_audit_result(self, result: AuditResult) -> str:
        """Submit audit result to Sei Network (fast finality)"""
        try:
            # In a real implementation, this would submit to the blockchain
            # For demo purposes, we'll simulate the transaction
            
            print(f"📤 Submitting audit result to Sei Network...")
            
            # Simulate blockchain submission
            await asyncio.sleep(0.1)  # Simulate network delay
            
            # Generate transaction hash
            tx_hash = f"0x{result.contract_address[-8:]}{int(time.time())}"
            
            print(f"✅ Audit result submitted! TX: {tx_hash}")
            print(f"⚡ Finality achieved in {result.finality_time_ms}ms")
            
            return tx_hash
            
        except Exception as e:
            print(f"❌ Failed to submit result: {e}")
            raise
    
    def get_agent_stats(self) -> Dict[str, Any]:
        """Get agent performance statistics"""
        return {
            'name': self.agent_name,
            'total_audits': self.total_audits,
            'successful_audits': self.successful_audits,
            'success_rate': self.successful_audits / max(self.total_audits, 1),
            'avg_scan_time_ms': self.avg_scan_time,
            'capabilities': self.capabilities,
            'sei_network_compatible': True,
            'last_active': int(time.time())
        }

# ===== USAGE EXAMPLE =====

async def main():
    """Example usage of the agent template"""
    
    # Initialize agent
    agent = SeiAgentTemplate(
        rpc_url="https://rpc.sei.io",
        agent_name="StaticGuardian"
    )
    
    # Connect to Sei Network
    if not await agent.initialize():
        print("Failed to initialize agent")
        return
    
    # Sample contract code for testing
    sample_contract = '''
    contract VulnerableContract {
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
    }
    '''
    
    # Perform audit
    try:
        result = await agent.audit_contract(
            "0x1234567890123456789012345678901234567890",
            sample_contract
        )
        
        # Submit result to blockchain
        tx_hash = await agent.submit_audit_result(result)
        
        # Show agent stats
        stats = agent.get_agent_stats()
        print(f"\\n📊 Agent Statistics:")
        print(f"   Total Audits: {stats['total_audits']}")
        print(f"   Success Rate: {stats['success_rate']:.2%}")
        print(f"   Avg Scan Time: {stats['avg_scan_time_ms']:.0f}ms")
        
    except Exception as e:
        print(f"Audit failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
`;

// ===== TYPESCRIPT AGENT TEMPLATE =====

export const typescriptAgentTemplate = `/**
 * SEI Guardian Vigil AI Agent Template - TypeScript
 * Built for Sei Network's parallelized EVM and fast finality
 */

import { ethers } from 'ethers';
import { SeiAgentSDK, AuditResult, AgentMetadata } from './seiAgentSDK';

export interface Vulnerability {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  lineNumber?: number;
  recommendation: string;
  confidence: number;
}

export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  version: string;
  rpcUrl: string;
  registryAddress: string;
}

export abstract class BaseSeiAgent {
  protected sdk: SeiAgentSDK;
  protected config: AgentConfig;
  protected stats: {
    totalAudits: number;
    successfulAudits: number;
    avgScanTime: number;
    lastActive: number;
  };

  constructor(config: AgentConfig) {
    this.config = config;
    this.sdk = new SeiAgentSDK(config.rpcUrl, config.registryAddress);
    this.stats = {
      totalAudits: 0,
      successfulAudits: 0,
      avgScanTime: 0,
      lastActive: Date.now()
    };
  }

  /**
   * Initialize agent connection to Sei Network
   */
  async initialize(): Promise<boolean> {
    try {
      console.log(\`🚀 Initializing \${this.config.name} on Sei Network...\`);
      
      // Test connection
      const networkMetrics = await this.sdk.getSeiNetworkMetrics();
      
      console.log(\`✅ Connected to Sei Network at block \${networkMetrics.currentBlockHeight.toLocaleString()}\`);
      console.log(\`📊 Current TPS: \${networkMetrics.currentTPS.toLocaleString()}\`);
      console.log(\`⚡ Finality: \${networkMetrics.avgFinalityTimeMs}ms\`);
      
      return true;
    } catch (error) {
      console.error(\`❌ Failed to initialize: \${error}\`);
      return false;
    }
  }

  /**
   * Abstract method for contract analysis - must be implemented by subclasses
   */
  abstract analyzeContract(contractCode: string, contractAddress: string): Promise<Vulnerability[]>;

  /**
   * Perform security audit with Sei Network optimization
   */
  async auditContract(contractAddress: string, contractCode: string = ''): Promise<AuditResult> {
    const startTime = Date.now();
    
    try {
      console.log(\`🔍 Starting audit of \${contractAddress}\`);
      
      // Perform contract analysis
      const vulnerabilities = await this.analyzeContract(contractCode, contractAddress);
      
      // Calculate scan time
      const scanTimeMs = Date.now() - startTime;
      
      // Get current block for on-chain verification
      const networkMetrics = await this.sdk.getSeiNetworkMetrics();
      
      // Create audit result
      const result: AuditResult = {
        auditId: ethers.utils.id(contractAddress + Date.now().toString()),
        contractAddress,
        agentId: this.config.name,
        vulnerabilities,
        scanTimeMs,
        status: 'completed',
        timestamp: Date.now(),
        blockHeight: networkMetrics.currentBlockHeight,
        finalityTimeMs: networkMetrics.avgFinalityTimeMs
      };
      
      // Update stats
      this.stats.totalAudits++;
      this.stats.successfulAudits++;
      this.stats.avgScanTime = (this.stats.avgScanTime * (this.stats.totalAudits - 1) + scanTimeMs) / this.stats.totalAudits;
      this.stats.lastActive = Date.now();
      
      console.log(\`✅ Audit completed in \${scanTimeMs}ms\`);
      console.log(\`🚨 Found \${vulnerabilities.length} vulnerabilities\`);
      console.log(\`📊 Block: \${networkMetrics.currentBlockHeight}, Finality: \${networkMetrics.avgFinalityTimeMs}ms\`);
      
      return result;
    } catch (error) {
      console.error(\`❌ Audit failed: \${error}\`);
      throw error;
    }
  }

  /**
   * Submit audit result to Sei Network (fast finality)
   */
  async submitAuditResult(result: AuditResult): Promise<string> {
    try {
      console.log(\`📤 Submitting audit result to Sei Network...\`);
      
      // In a real implementation, this would submit to the blockchain
      // For demo purposes, we'll simulate the transaction
      
      // Simulate blockchain submission delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate transaction hash
      const txHash = ethers.utils.id(result.contractAddress + Date.now().toString());
      
      console.log(\`✅ Audit result submitted! TX: \${txHash}\`);
      console.log(\`⚡ Finality achieved in \${result.finalityTimeMs}ms\`);
      
      return txHash;
    } catch (error) {
      console.error(\`❌ Failed to submit result: \${error}\`);
      throw error;
    }
  }

  /**
   * Get agent performance statistics
   */
  getAgentStats() {
    return {
      name: this.config.name,
      description: this.config.description,
      capabilities: this.config.capabilities,
      version: this.config.version,
      totalAudits: this.stats.totalAudits,
      successfulAudits: this.stats.successfulAudits,
      successRate: this.stats.successfulAudits / Math.max(this.stats.totalAudits, 1),
      avgScanTime: this.stats.avgScanTime,
      lastActive: this.stats.lastActive,
      seiNetworkCompatible: true
    };
  }
}

/**
 * Example Static Analysis Agent Implementation
 */
export class StaticAnalysisAgent extends BaseSeiAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async analyzeContract(contractCode: string, contractAddress: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];
    
    if (!contractCode) return vulnerabilities;
    
    // Check for dangerous patterns
    const dangerousPatterns = [
      {
        pattern: /delegatecall/gi,
        type: 'Dangerous Low-Level Call',
        severity: 'High' as const,
        description: 'delegatecall can lead to unexpected behavior',
        recommendation: 'Avoid or implement strict validation'
      },
      {
        pattern: /callcode/gi,
        type: 'Dangerous Low-Level Call',
        severity: 'High' as const,
        description: 'callcode is deprecated and dangerous',
        recommendation: 'Use call instead'
      },
      {
        pattern: /suicide/gi,
        type: 'Self-Destruct',
        severity: 'Medium' as const,
        description: 'Contract can be destroyed',
        recommendation: 'Ensure proper access control'
      },
      {
        pattern: /block\\.timestamp/gi,
        type: 'Timestamp Dependence',
        severity: 'Medium' as const,
        description: 'Logic depends on block timestamp',
        recommendation: 'Use block numbers for critical logic'
      }
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.pattern.test(contractCode)) {
        vulnerabilities.push({
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.description,
          lineNumber: undefined,
          recommendation: pattern.recommendation,
          confidence: 0.85
        });
      }
    }
    
    // Check for reentrancy patterns
    if (contractCode.includes('call.value') || contractCode.includes('call{value:')) {
      if (!contractCode.includes('nonReentrant') && !contractCode.includes('ReentrancyGuard')) {
        vulnerabilities.push({
          type: 'Reentrancy',
          severity: 'Critical',
          description: 'Potential reentrancy vulnerability in external calls',
          lineNumber: undefined,
          recommendation: 'Implement reentrancy guard or follow Checks-Effects-Interactions pattern',
          confidence: 0.90
        });
      }
    }
    
    return vulnerabilities;
  }
}

/**
 * Example Usage
 */
async function main() {
  const config: AgentConfig = {
    name: 'StaticGuardian',
    description: 'AI-powered static analysis agent for Solidity contracts',
    capabilities: ['static-analysis', 'reentrancy-detection', 'access-control-audit'],
    version: '1.0.0',
    rpcUrl: 'https://rpc.sei.io',
    registryAddress: '0x...'
  };
  
  const agent = new StaticAnalysisAgent(config);
  
  if (await agent.initialize()) {
    const sampleContract = \`
      contract VulnerableContract {
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
      }
    \`;
    
    try {
      const result = await agent.auditContract(
        '0x1234567890123456789012345678901234567890',
        sampleContract
      );
      
      const txHash = await agent.submitAuditResult(result);
      
      const stats = agent.getAgentStats();
      console.log(\`\\n📊 Agent Statistics:\`);
      console.log(\`   Total Audits: \${stats.totalAudits}\`);
      console.log(\`   Success Rate: \${(stats.successRate * 100).toFixed(1)}%\`);
      console.log(\`   Avg Scan Time: \${stats.avgScanTime.toFixed(0)}ms\`);
      
    } catch (error) {
      console.error(\`Audit failed: \${error}\`);
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
`;

// ===== SOLIDITY AGENT CONTRACT TEMPLATE =====

export const solidityAgentTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * SEI Guardian Vigil Agent Contract Template
 * Built for Sei Network's parallelized EVM and fast finality
 * 
 * This contract enables AI agents to:
 * - Register and manage their capabilities
 * - Submit audit results with on-chain verification
 * - Earn rewards for successful vulnerability detection
 * - Coordinate with other agents through the registry
 */

contract SeiAgentContract is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // ===== STRUCTS =====
    
    struct Agent {
        string name;
        string description;
        string[] capabilities;
        string metadataURI;
        address owner;
        bool isActive;
        uint256 totalAudits;
        uint256 successfulAudits;
        uint256 totalRewards;
        uint256 lastActive;
        uint256 createdAt;
    }
    
    struct AuditRequest {
        address contractAddress;
        uint8 priority; // 0=low, 1=medium, 2=high, 3=critical
        address requester;
        uint256 timestamp;
        bool isCompleted;
    }
    
    struct AuditResult {
        bytes32 auditId;
        address contractAddress;
        address agentAddress;
        string[] vulnerabilityTypes;
        uint8[] severities; // 0=low, 1=medium, 2=high, 3=critical
        uint256 scanTimeMs;
        uint256 blockHeight;
        uint256 finalityTimeMs;
        uint256 timestamp;
        bool isValid;
    }
    
    struct Vulnerability {
        string vulnType;
        uint8 severity;
        string description;
        string recommendation;
        uint256 lineNumber;
        uint256 confidence;
    }
    
    // ===== STATE VARIABLES =====
    
    Counters.Counter private _auditRequestIds;
    Counters.Counter private _auditResultIds;
    
    mapping(address => Agent) public agents;
    mapping(bytes32 => AuditRequest) public auditRequests;
    mapping(bytes32 => AuditResult) public auditResults;
    mapping(address => uint256) public agentRewards;
    
    uint256 public totalAgents;
    uint256 public totalAuditRequests;
    uint256 public totalAuditResults;
    uint256 public totalRewardsDistributed;
    
    // ===== EVENTS =====
    
    event AgentRegistered(
        address indexed agent,
        string name,
        string metadataURI,
        uint256 timestamp
    );
    
    event AgentStatusUpdated(
        address indexed agent,
        bool isActive,
        uint256 timestamp
    );
    
    event AuditRequested(
        bytes32 indexed requestId,
        address indexed contractAddress,
        uint8 priority,
        address indexed requester,
        uint256 timestamp
    );
    
    event AuditCompleted(
        bytes32 indexed resultId,
        address indexed contractAddress,
        address indexed agentAddress,
        uint256 vulnerabilitiesFound,
        uint256 scanTimeMs,
        uint256 timestamp
    );
    
    event RewardsDistributed(
        address indexed agent,
        uint256 amount,
        uint256 timestamp
    );
    
    // ===== MODIFIERS =====
    
    modifier onlyRegisteredAgent() {
        require(agents[msg.sender].owner != address(0), "Agent not registered");
        require(agents[msg.sender].isActive, "Agent not active");
        _;
    }
    
    modifier onlyValidPriority(uint8 priority) {
        require(priority <= 3, "Invalid priority level");
        _;
    }
    
    // ===== CONSTRUCTOR =====
    
    constructor() {
        _auditRequestIds.increment(); // Start from 1
        _auditResultIds.increment();  // Start from 1
    }
    
    // ===== AGENT MANAGEMENT =====
    
    /**
     * Register a new AI agent on Sei Network
     * Leverages fast finality for instant agent activation
     */
    function registerAgent(
        string memory name,
        string memory description,
        string[] memory capabilities,
        string memory metadataURI
    ) external nonReentrant {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(capabilities.length > 0, "Must specify capabilities");
        require(agents[msg.sender].owner == address(0), "Agent already registered");
        
        // Create new agent
        agents[msg.sender] = Agent({
            name: name,
            description: description,
            capabilities: capabilities,
            metadataURI: metadataURI,
            owner: msg.sender,
            isActive: true,
            totalAudits: 0,
            successfulAudits: 0,
            totalRewards: 0,
            lastActive: block.timestamp,
            createdAt: block.timestamp
        });
        
        totalAgents++;
        
        emit AgentRegistered(msg.sender, name, metadataURI, block.timestamp);
    }
    
    /**
     * Update agent status (active/inactive)
     */
    function updateAgentStatus(bool isActive) external onlyRegisteredAgent {
        agents[msg.sender].isActive = isActive;
        agents[msg.sender].lastActive = block.timestamp;
        
        emit AgentStatusUpdated(msg.sender, isActive, block.timestamp);
    }
    
    /**
     * Update agent capabilities
     */
    function updateCapabilities(string[] memory newCapabilities) external onlyRegisteredAgent {
        require(newCapabilities.length > 0, "Must specify capabilities");
        agents[msg.sender].capabilities = newCapabilities;
        agents[msg.sender].lastActive = block.timestamp;
    }
    
    // ===== AUDIT MANAGEMENT =====
    
    /**
     * Submit a contract for AI-powered security audit
     * Demonstrates Sei's parallelized execution for multiple agent analysis
     */
    function submitAuditRequest(
        address contractAddress,
        uint8 priority
    ) external onlyValidPriority(priority) returns (bytes32) {
        require(contractAddress != address(0), "Invalid contract address");
        
        bytes32 requestId = keccak256(abi.encodePacked(
            contractAddress,
            msg.sender,
            block.timestamp,
            _auditRequestIds.current()
        ));
        
        auditRequests[requestId] = AuditRequest({
            contractAddress: contractAddress,
            priority: priority,
            requester: msg.sender,
            timestamp: block.timestamp,
            isCompleted: false
        });
        
        _auditRequestIds.increment();
        totalAuditRequests++;
        
        emit AuditRequested(requestId, contractAddress, priority, msg.sender, block.timestamp);
        
        return requestId;
    }
    
    /**
     * Submit audit results with Sei network metrics
     */
    function submitAuditResult(
        bytes32 requestId,
        address contractAddress,
        string[] memory vulnerabilityTypes,
        uint8[] memory severities,
        uint256 scanTimeMs,
        uint256 finalityTimeMs
    ) external onlyRegisteredAgent nonReentrant {
        require(auditRequests[requestId].contractAddress == contractAddress, "Contract mismatch");
        require(!auditRequests[requestId].isCompleted, "Request already completed");
        require(vulnerabilityTypes.length == severities.length, "Array length mismatch");
        
        // Validate severities
        for (uint i = 0; i < severities.length; i++) {
            require(severities[i] <= 3, "Invalid severity level");
        }
        
        bytes32 resultId = keccak256(abi.encodePacked(
            requestId,
            msg.sender,
            block.timestamp,
            _auditResultIds.current()
        ));
        
        // Create audit result
        auditResults[resultId] = AuditResult({
            auditId: resultId,
            contractAddress: contractAddress,
            agentAddress: msg.sender,
            vulnerabilityTypes: vulnerabilityTypes,
            severities: severities,
            scanTimeMs: scanTimeMs,
            blockHeight: block.number,
            finalityTimeMs: finalityTimeMs,
            timestamp: block.timestamp,
            isValid: true
        });
        
        // Mark request as completed
        auditRequests[requestId].isCompleted = true;
        
        // Update agent stats
        agents[msg.sender].totalAudits++;
        agents[msg.sender].lastActive = block.timestamp;
        
        // Calculate rewards based on vulnerabilities found and priority
        uint256 reward = calculateReward(requestId, vulnerabilityTypes.length);
        if (reward > 0) {
            agents[msg.sender].successfulAudits++;
            agents[msg.sender].totalRewards += reward;
            agentRewards[msg.sender] += reward;
            totalRewardsDistributed += reward;
            
            emit RewardsDistributed(msg.sender, reward, block.timestamp);
        }
        
        _auditResultIds.increment();
        totalAuditResults++;
        
        emit AuditCompleted(
            resultId,
            contractAddress,
            msg.sender,
            vulnerabilityTypes.length,
            scanTimeMs,
            block.timestamp
        );
    }
    
    // ===== REWARD SYSTEM =====
    
    /**
     * Calculate rewards for successful vulnerability detection
     * Rewards are higher for critical vulnerabilities and high-priority audits
     */
    function calculateReward(bytes32 requestId, uint256 vulnerabilityCount) internal view returns (uint256) {
        AuditRequest storage request = auditRequests[requestId];
        
        // Base reward per vulnerability
        uint256 baseReward = 100; // 100 wei base
        
        // Priority multiplier
        uint256 priorityMultiplier = 1;
        if (request.priority == 1) priorityMultiplier = 2;      // Medium
        else if (request.priority == 2) priorityMultiplier = 5; // High
        else if (request.priority == 3) priorityMultiplier = 10; // Critical
        
        // Calculate total reward
        uint256 totalReward = baseReward * vulnerabilityCount * priorityMultiplier;
        
        return totalReward;
    }
    
    /**
     * Withdraw accumulated rewards
     */
    function withdrawRewards() external nonReentrant {
        uint256 amount = agentRewards[msg.sender];
        require(amount > 0, "No rewards to withdraw");
        
        agentRewards[msg.sender] = 0;
        
        // Transfer rewards (in production, this would be SEI tokens)
        payable(msg.sender).transfer(amount);
    }
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * Get agent information
     */
    function getAgentInfo(address agentAddress) external view returns (Agent memory) {
        return agents[agentAddress];
    }
    
    /**
     * Get audit request details
     */
    function getAuditRequest(bytes32 requestId) external view returns (AuditRequest memory) {
        return auditRequests[requestId];
    }
    
    /**
     * Get audit result details
     */
    function getAuditResult(bytes32 resultId) external view returns (AuditResult memory) {
        return auditResults[resultId];
    }
    
    /**
     * Get agent rewards
     */
    function getAgentRewards(address agentAddress) external view returns (uint256) {
        return agentRewards[agentAddress];
    }
    
    /**
     * Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 _totalAgents,
        uint256 _totalAuditRequests,
        uint256 _totalAuditResults,
        uint256 _totalRewardsDistributed
    ) {
        return (totalAgents, totalAuditRequests, totalAuditResults, totalRewardsDistributed);
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * Emergency pause (only owner)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
    }
    
    /**
     * Update reward parameters (only owner)
     */
    function updateRewardParameters(uint256 newBaseReward) external onlyOwner {
        // Implementation for updating reward parameters
    }
    
    // ===== FALLBACK & RECEIVE =====
    
    receive() external payable {
        // Contract can receive SEI tokens for rewards
    }
    
    fallback() external {
        revert("Function not found");
    }
}
`;

// ===== LANGCHAIN INTEGRATION TEMPLATE =====

export const langchainIntegrationTemplate = `"""
SEI Guardian Vigil LangChain Integration Template
Enables AI agents to interact with Sei Network through LangChain tools
"""

from langchain.tools import BaseTool
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from typing import Optional, Type
from pydantic import BaseModel, Field
import asyncio
import json
from sei_agent_sdk import SeiAgentSDK

# ===== SEI AGENT TOOLS =====

class AuditContractInput(BaseModel):
    contract_address: str = Field(description="The contract address to audit")
    priority: str = Field(description="Audit priority: low, medium, high, or critical")
    agent_id: Optional[str] = Field(default=None, description="Specific agent ID to use")

class AuditContractTool(BaseTool):
    name = "sei_audit_contract"
    description = "Submit a smart contract for AI-powered security audit on Sei Network"
    args_schema: Type[BaseModel] = AuditContractInput
    
    def __init__(self, sei_sdk: SeiAgentSDK):
        super().__init__()
        self.sei_sdk = sei_sdk
    
    def _run(self, contract_address: str, priority: str, agent_id: str = None) -> str:
        """Submit contract for audit"""
        try:
            # Validate priority
            priority_map = {"low": 0, "medium": 1, "high": 2, "critical": 3}
            if priority.lower() not in priority_map:
                return f"Invalid priority: {priority}. Must be low, medium, high, or critical."
            
            # Submit audit request
            audit_id = self.sei_sdk.submit_contract_for_audit(
                agent_id or "default_agent",
                contract_address,
                priority.lower()
            )
            
            return f"Contract audit submitted successfully! Audit ID: {audit_id}"
            
        except Exception as e:
            return f"Failed to submit audit: {str(e)}"

class GetAuditResultInput(BaseModel):
    audit_id: str = Field(description="The audit ID to retrieve results for")

class GetAuditResultTool(BaseTool):
    name = "sei_get_audit_result"
    description = "Get results of a completed security audit from Sei Network"
    args_schema: Type[BaseModel] = GetAuditResultInput
    
    def __init__(self, sei_sdk: SeiAgentSDK):
        super().__init__()
        self.sei_sdk = sei_sdk
    
    def _run(self, audit_id: str) -> str:
        """Get audit results"""
        try:
            result = self.sei_sdk.get_audit_result(audit_id)
            
            if result.status == "completed":
                vuln_summary = f"Found {len(result.vulnerabilities)} vulnerabilities"
                if result.vulnerabilities:
                    vuln_details = []
                    for vuln in result.vulnerabilities:
                        vuln_details.append(f"- {vuln.severity} {vuln.type}: {vuln.description}")
                    vuln_summary += "\\n" + "\\n".join(vuln_details)
                
                return f"Audit completed! {vuln_summary}\\nScan time: {result.scanTimeMs}ms\\nFinality: {result.finalityTimeMs}ms"
            else:
                return f"Audit status: {result.status}"
                
        except Exception as e:
            return f"Failed to get audit result: {str(e)}"

class GetNetworkMetricsTool(BaseTool):
    name = "sei_network_metrics"
    description = "Get real-time Sei Network metrics and performance data"
    
    def __init__(self, sei_sdk: SeiAgentSDK):
        super().__init__()
        self.sei_sdk = sei_sdk
    
    def _run(self) -> str:
        """Get network metrics"""
        try:
            metrics = self.sei_sdk.get_sei_network_metrics()
            
            return f"""Sei Network Metrics:
- Current Block: {metrics.currentBlockHeight:,}
- Block Time: {metrics.avgBlockTimeMs}ms
- Finality: {metrics.avgFinalityTimeMs}ms
- Current TPS: {metrics.currentTPS:,}
- Gas Price: {metrics.gasPrice}
- Network Latency: {metrics.networkLatencyMs}ms"""
            
        except Exception as e:
            return f"Failed to get network metrics: {str(e)}"

class DiscoverAgentsTool(BaseTool):
    name = "sei_discover_agents"
    description = "Discover active AI agents on the Sei Network"
    
    def __init__(self, sei_sdk: SeiAgentSDK):
        super().__init__()
        self.sei_sdk = sei_sdk
    
    def _run(self) -> str:
        """Discover agents"""
        try:
            agents = self.sei_sdk.discover_active_agents()
            
            if not agents:
                return "No active agents found"
            
            agent_list = []
            for agent in agents:
                agent_list.append(f"- {agent.name}: {agent.description} (Capabilities: {', '.join(agent.capabilities)})")
            
            return f"Found {len(agents)} active agents:\\n" + "\\n".join(agent_list)
            
        except Exception as e:
            return f"Failed to discover agents: {str(e)}"

# ===== LANGCHAIN AGENT SETUP =====

def create_sei_langchain_agent(api_key: str, rpc_url: str = "https://rpc.sei.io"):
    """Create a LangChain agent with SEI Guardian Vigil tools"""
    
    # Initialize SEI SDK
    sei_sdk = SeiAgentSDK(rpc_url)
    
    # Initialize LLM
    llm = ChatOpenAI(
        temperature=0,
        openai_api_key=api_key,
        model_name="gpt-4"
    )
    
    # Create SEI tools
    tools = [
        AuditContractTool(sei_sdk),
        GetAuditResultTool(sei_sdk),
        GetNetworkMetricsTool(sei_sdk),
        DiscoverAgentsTool(sei_sdk)
    ]
    
    # Initialize agent
    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )
    
    return agent

# ===== USAGE EXAMPLE =====

async def main():
    """Example usage of SEI Guardian Vigil with LangChain"""
    
    # Initialize agent
    agent = create_sei_langchain_agent(
        api_key="your-openai-api-key",
        rpc_url="https://rpc.sei.io"
    )
    
    # Example conversation
    conversation = [
        "What's the current status of the Sei Network?",
        "Submit contract 0x1234567890123456789012345678901234567890 for high priority audit",
        "What agents are available on the network?",
        "Check the results of the audit I just submitted"
    ]
    
    for message in conversation:
        print(f"\\n🤖 User: {message}")
        response = agent.run(message)
        print(f"🤖 Agent: {response}")

if __name__ == "__main__":
    asyncio.run(main())
`;

// ===== EXPORT ALL TEMPLATES =====

export const agentTemplates = {
  python: pythonAgentTemplate,
  typescript: typescriptAgentTemplate,
  solidity: solidityAgentTemplate,
  langchain: langchainIntegrationTemplate
};

export const getTemplate = (language: keyof typeof agentTemplates) => {
  return agentTemplates[language];
};

export const getAllTemplates = () => {
  return agentTemplates;
};
