import { useState } from "react";
import SentinelNavigation from "../components/SentinelNavigation";

export default function Alerts() {
  const [filter, setFilter] = useState("all");
  const [alerts] = useState([
    {
      id: 1,
      severity: "critical",
      title: "Reentrancy vulnerability detected",
      contract: "sei1abc...",
      description: "Critical reentrancy vulnerability found in withdraw function",
      timestamp: "5 minutes ago",
      status: "unread"
    },
    {
      id: 2,
      severity: "high",
      title: "Integer overflow in reward calculation",
      contract: "sei1xyz...",
      description: "High-risk integer overflow detected in calcReward function",
      timestamp: "1 hour ago",
      status: "acknowledged"
    },
    {
      id: 3,
      severity: "medium",
      title: "Missing access control",
      contract: "sei1def...",
      description: "Medium-risk access control issue in admin functions",
      timestamp: "2 hours ago",
      status: "resolved"
    },
    {
      id: 4,
      severity: "low",
      title: "Gas optimization opportunity",
      contract: "sei1ghi...",
      description: "Low-risk gas optimization opportunity in storage patterns",
      timestamp: "3 hours ago",
      status: "resolved"
    },
    {
      id: 5,
      severity: "critical",
      title: "New deployment detected",
      contract: "sei1jkl...",
      description: "New contract deployment detected - scanning for vulnerabilities",
      timestamp: "4 hours ago",
      status: "unread"
    }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-600";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-400";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical": return "🚨";
      case "high": return "⚠️";
      case "medium": return "⚡";
      case "low": return "✅";
      default: return "ℹ️";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "unread": return "bg-blue-100 text-blue-800";
      case "acknowledged": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    return alert.severity === filter;
  });

  const alertCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    high: alerts.filter(a => a.severity === "high").length,
    medium: alerts.filter(a => a.severity === "medium").length,
    low: alerts.filter(a => a.severity === "low").length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SentinelNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Alerts</h1>
          <p className="text-gray-600">Monitor and respond to security vulnerabilities in real-time</p>
        </div>

        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {Object.entries(alertCounts).map(([key, count]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${key === "all" ? "bg-blue-100" : getSeverityColor(key)} text-white mr-4`}>
                  <span className="text-2xl">
                    {key === "all" ? "📊" : getSeverityIcon(key)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase">{key}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex space-x-1">
            {Object.entries(alertCounts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Severity Indicator */}
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getSeverityColor(alert.severity)}`}></div>
                  
                  {/* Alert Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{alert.timestamp}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          Contract: <span className="font-mono text-gray-900">{alert.contract}</span>
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)} text-white`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          View Details
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                          Mark Resolved
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Notification Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" id="email" className="mr-3" defaultChecked />
                  <label htmlFor="email" className="text-sm text-gray-700">Email notifications</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="slack" className="mr-3" defaultChecked />
                  <label htmlFor="slack" className="text-sm text-gray-700">Slack notifications</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="discord" className="mr-3" />
                  <label htmlFor="discord" className="text-sm text-gray-700">Discord notifications</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="telegram" className="mr-3" />
                  <label htmlFor="telegram" className="text-sm text-gray-700">Telegram notifications</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Severity Thresholds</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Critical alerts</label>
                  <input type="checkbox" defaultChecked className="mr-3" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">High alerts</label>
                  <input type="checkbox" defaultChecked className="mr-3" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Medium alerts</label>
                  <input type="checkbox" defaultChecked className="mr-3" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Low alerts</label>
                  <input type="checkbox" className="mr-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}