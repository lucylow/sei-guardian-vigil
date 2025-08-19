import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SentinelNavigation from "../components/SentinelNavigation";

export default function Dashboard() {
  const [stats, setStats] = useState({ contractsScanned: 0, critical: 0, high: 0, medium: 0, low: 0 });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch stats & events from API
    setStats({ contractsScanned: 12, critical: 3, high: 5, medium: 2, low: 10 });
    setEvents([
      { ts: Date.now(), msg: "Contract at addr x123 re-scanned — no new issues" },
      { ts: Date.now()-2000, msg: "New deployment detected at addr y456" },
      { ts: Date.now()-5000, msg: "Critical vulnerability found in contract z789" },
      { ts: Date.now()-8000, msg: "Continuous monitoring enabled for contract abc123" }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SentinelNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Monitor your SEI smart contracts for vulnerabilities in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contracts Scanned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contractsScanned}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High</p>
                <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low</p>
                <p className="text-2xl font-bold text-green-600">{stats.low}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/agents" 
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              🚀 Manage Agents
            </Link>
            <Link 
              to="/upload" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">🔍</span>
              Scan New Contract
            </Link>
            <Link 
              to="/monitoring" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <span className="mr-2">👁️</span>
              View Monitoring
            </Link>
            <Link 
              to="/integrations" 
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <span className="mr-2">🔗</span>
              Manage Integrations
            </Link>
            <Link 
              to="/alerts" 
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <span className="mr-2">🚨</span>
              View Alerts
            </Link>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Monitoring Feed</h2>
          <div className="space-y-3">
            {events.map((ev, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{ev.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(ev.ts).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}