import React from "react";
import { useParams } from "react-router-dom";
import VulnerabilityItem from "../components/VulnerabilityItemWithExplainability";

export default function ScanResult() {
  const { scanId } = useParams();

  // Rich fake findings for demo purposes
  const findings = [
    {
      severity: "critical",
      type: "Reentrancy",
      description: "Function withdraw() can be re-entered without state update.",
      cwe: "CWE-841",
      owasp: "A1_2017-Injection",
      aiReasoning:
        "Reentrancy enables attackers to exploit contract calls to repeatedly drain Ether before the balance is updated.",
      fixRecommendation:
        "Apply the Checks-Effects-Interactions pattern and use OpenZeppelin’s ReentrancyGuard modifier.",
      confidence: 0.97
    },
    {
      severity: "high",
      type: "Integer Overflow",
      description: "calcReward() function at line 89 does not check overflow.",
      cwe: "CWE-190",
      owasp: "A5_2021-Security_Misconfiguration",
      aiReasoning:
        "Unchecked arithmetic can overflow and lead to miscalculated reward values, impacting tokenomics.",
      fixRecommendation:
        "Use Solidity 0.8+ with built-in overflow checks or SafeMath libraries.",
      confidence: 0.92
    },
    {
      severity: "medium",
      type: "Access Control Flaw",
      description: "OnlyOwner modifier missing in updateConfig().",
      cwe: "CWE-284",
      owasp: "A5_2017-Broken_Access_Control",
      aiReasoning:
        "Any user can update core configuration parameters, potentially redirecting funds.",
      fixRecommendation:
        "Restrict updateConfig() to privileged roles and add require(msg.sender == owner) checks.",
      confidence: 0.88
    },
    {
      severity: "low",
      type: "Gas Optimization",
      description: "Repeated storage reads in loop at stakingRewards().",
      cwe: "CWE-710",
      owasp: "A9_2021-Security_Logging_and_Monitoring_Failures",
      aiReasoning:
        "Redundant storage reads increase gas usage and execution time but do not cause direct exploits.",
      fixRecommendation:
        "Cache storage variables in memory when used in loops to reduce gas cost.",
      confidence: 0.75
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Scan Results — {scanId || "Demo"}</h1>
      {findings.map((v, i) => (
        <VulnerabilityItem key={i} vuln={v} />
      ))}
    </div>
  );
}
