import React from "react";
import { useParams } from "react-router-dom";

export default function ScanResult() {
  const { scanId } = useParams();
  const findings = [
    { severity: "critical", type: "Reentrancy", desc: "Function withdraw() can be re-entered", cwe: "CWE-841" },
    { severity: "high", type: "Integer Overflow", desc: "Unsafe arithmetic in calcReward()", cwe: "CWE-190" },
  ];

  const colors = { critical: "bg-red-600", high: "bg-orange-500", medium: "bg-yellow-400", low: "bg-green-500" };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Scan Results – {scanId}</h1>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {findings.map((f, i) => (
          <div key={i} className={`p-2 text-white ${colors[f.severity]}`}>
            <strong>{f.severity.toUpperCase()}</strong> – {f.type}
            <p className="text-xs">{f.desc} ({f.cwe})</p>
          </div>
        ))}
      </div>
      <button className="bg-gray-700 text-white py-2 px-4 rounded">Download PDF</button>
    </div>
  );
}
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
