import SentinelNavigation from "../components/SentinelNavigation";

export default function Integrations() {
  const integrations = [
    {
      name: "GitHub Actions",
      description: "Automated security scanning in your CI/CD pipeline",
      status: "Connected",
      lastUsed: "2 hours ago"
    },
    {
      name: "Slack Notifications",
      description: "Real-time vulnerability alerts in your Slack workspace",
      status: "Connected",
      lastUsed: "1 hour ago"
    },
    {
      name: "Discord Webhook",
      description: "Security alerts sent to your Discord server",
      status: "Connected",
      lastUsed: "30 minutes ago"
    },
    {
      name: "Email Alerts",
      description: "Critical vulnerability notifications via email",
      status: "Connected",
      lastUsed: "5 minutes ago"
    }
  ];

  const apiKeys = [
    {
      name: "Production API Key",
      key: "sk_live_...",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      permissions: ["scan", "monitor", "reports"]
    },
    {
      name: "Development API Key",
      key: "sk_test_...",
      created: "2024-01-20",
      lastUsed: "1 day ago",
      permissions: ["scan", "reports"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SentinelNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations & API Keys</h1>
          <p className="text-gray-600">Connect SEI SENTINEL with your development workflow and tools</p>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                🔑 Generate New Key
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((key, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{key.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{key.key}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key.lastUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((perm, j) => (
                          <span key={j} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Copy</button>
                        <button className="text-red-600 hover:text-red-900">Revoke</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Connected Integrations</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                ➕ Add Integration
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{integration.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {integration.status}
                        </span>
                        <span className="text-sm text-gray-500">Last used: {integration.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Configure</button>
                      <button className="text-red-600 hover:text-red-900 text-sm">Disconnect</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Start Examples</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Actions */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">GitHub Actions</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`name: Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Scan Contract
        run: |
          curl -X POST https://api.seisentinel.com/scan \\
            -H "Authorization: Bearer ${{ secrets.SEI_API_KEY }}" \\
            -F "file=@contract.wasm"`}
                  </pre>
                </div>
              </div>

              {/* cURL Example */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">cURL Command</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`# Scan by address
curl -X POST https://api.seisentinel.com/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"address": "sei1..."}'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}