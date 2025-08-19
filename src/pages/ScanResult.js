import { useParams, Link } from "react-router-dom";
import SentinelNavigation from "../components/SentinelNavigation";

export default function ScanResult() {
  const { scanId } = useParams();
  const findings = [
    { 
      severity: "critical", 
      type: "Reentrancy Attack", 
      desc: "Function withdraw() can be re-entered before the first call completes, allowing attackers to drain funds", 
      cwe: "CWE-841",
      confidence: 95,
      impact: "Funds can be stolen from the contract",
      recommendation: "Use ReentrancyGuard or implement checks-effects-interactions pattern"
    },
    { 
      severity: "high", 
      type: "Integer Overflow", 
      desc: "Unsafe arithmetic in calcReward() function can overflow, leading to incorrect reward calculations", 
      cwe: "CWE-190",
      confidence: 87,
      impact: "Reward calculations may be incorrect",
      recommendation: "Use SafeMath library or check for overflow conditions"
    },
    { 
      severity: "medium", 
      type: "Access Control", 
      desc: "Missing access control on admin functions allows unauthorized users to call privileged operations", 
      cwe: "CWE-285",
      confidence: 78,
      impact: "Unauthorized users can perform admin actions",
      recommendation: "Implement proper access control modifiers"
    },
    { 
      severity: "low", 
      type: "Gas Optimization", 
      desc: "Inefficient storage patterns increase gas costs for users", 
      cwe: "CWE-400",
      confidence: 65,
      impact: "Higher transaction costs",
      recommendation: "Optimize storage layout and use packed structs where possible"
    }
  ];

  const colors = { 
    critical: "bg-red-600", 
    high: "bg-orange-500", 
    medium: "bg-yellow-400", 
    low: "bg-green-500" 
  };

  const severityCounts = findings.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <SentinelNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan Results</h1>
              <p className="text-gray-600">Contract scan completed for ID: {scanId}</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                🔄 Re-scan
              </button>
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
                📥 Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(severityCounts).map(([severity, count]) => (
            <div key={severity} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colors[severity]} text-white mr-4`}>
                  <span className="text-2xl">
                    {severity === "critical" ? "🚨" : 
                     severity === "high" ? "⚠️" : 
                     severity === "medium" ? "⚡" : "✅"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase">{severity}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vulnerability Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vulnerability Heatmap</h2>
          <div className="grid grid-cols-4 gap-2">
            {findings.map((finding, i) => (
              <div key={i} className={`p-4 text-white ${colors[finding.severity]} rounded-lg`}>
                <div className="text-sm font-medium mb-1">{finding.type}</div>
                <div className="text-xs opacity-90">{finding.cwe}</div>
                <div className="text-xs mt-2">Confidence: {finding.confidence}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Findings</h2>
          <div className="space-y-6">
            {findings.map((finding, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${colors[finding.severity]}`}>
                      {finding.severity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">Confidence: {finding.confidence}%</span>
                  </div>
                  <span className="text-sm text-gray-500">{finding.cwe}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{finding.type}</h3>
                <p className="text-gray-700 mb-4">{finding.desc}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Impact</h4>
                    <p className="text-sm text-gray-600">{finding.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendation</h4>
                    <p className="text-sm text-gray-600">{finding.recommendation}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Code Snippet
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Apply Fix
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Mark as Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/monitoring" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              👁️ Enable Monitoring
            </Link>
            <Link 
              to="/integrations" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              🔗 Set Up Alerts
            </Link>
            <Link 
              to="/upload" 
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition-colors"
            >
              🔍 Scan Another Contract
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
