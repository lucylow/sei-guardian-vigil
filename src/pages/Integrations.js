import React from 'react';

export default function Integrations() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Integrations & API Keys</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-bold mb-2">API Keys</h2>
        {/* List API keys, create/revoke buttons */}
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Create API Key</button>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Webhook URLs</h2>
        {/* List webhook URLs, add/remove buttons */}
        <button className="bg-green-600 text-white py-2 px-4 rounded">Add Webhook</button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Integration Snippets</h2>
        <pre className="bg-gray-100 p-2 rounded text-xs">
{`# GitHub Actions
- name: Run SEI Sentinel Scan
  run: curl -X POST https://api.sei-sentinel.com/scan -d @contract.wasm

# Node.js
fetch("https://api.sei-sentinel.com/scan", { method: "POST", body: contractCode });

# Python
import requests
requests.post("https://api.sei-sentinel.com/scan", data=contract_code)
`}
        </pre>
      </div>
    </div>
  );
}