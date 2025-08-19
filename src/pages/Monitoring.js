import { useEffect, useState } from "react";
import SentinelNavigation from "../components/SentinelNavigation";

export default function Monitoring() {
  const [monitored, setMonitored] = useState([
    { 
      addr: "sei1abc...", 
      status: "Healthy", 
      lastScan: "2 hours ago",
      riskScore: 15,
      vulnerabilities: 0
    },
    { 
      addr: "sei1xyz...", 
      status: "At Risk", 
      lastScan: "1 hour ago",
      riskScore: 78,
      vulnerabilities: 3
    },
    { 
      addr: "sei1def...", 
      status: "Healthy", 
      lastScan: "30 minutes ago",
      riskScore: 22,
      vulnerabilities: 1
    },
    { 
      addr: "sei1ghi...", 
      status: "Critical", 
      lastScan: "15 minutes ago",
      riskScore: 95,
      vulnerabilities: 5
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Healthy": return "text-green-600 bg-green-100";
      case "At Risk": return "text-orange-600 bg-orange-100";
      case "Critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return "text-green-600";
    if (score < 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SentinelNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Continuous Monitoring</h1>
          <p className="text-gray-600">Track your deployed contracts for security vulnerabilities in real-time</p>
        </div>

        {/* Monitoring Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monitored Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{monitored.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Healthy</p>
                <p className="text-2xl font-bold text-green-600">
                  {monitored.filter(c => c.status === "Healthy").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {monitored.filter(c => c.status === "At Risk").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {monitored.filter(c => c.status === "Critical").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monitored Contracts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vulnerabilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Scan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monitored.map((contract, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.addr}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRiskColor(contract.riskScore)}`}>
                        {contract.riskScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{contract.vulnerabilities}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.lastScan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Rescan</button>
                        <button className="text-green-600 hover:text-green-900">View Report</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Contract */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Contract to Monitor</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter contract address (sei1...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
              Add Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}