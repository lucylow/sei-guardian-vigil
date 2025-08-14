import React, { useState } from "react";
import Tooltip from "./Tooltip";
import CodeSnippet from "./CodeSnippet";

const onboardingSteps = [
  { id: "auth", title: "Authentication" },
  { id: "apiKey", title: "API Key" },
  { id: "webhooks", title: "Webhook Setup" },
  { id: "github", title: "GitHub Actions" },
  { id: "test", title: "Test on Sei" }
];

export default function DeveloperOnboarding() {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [webhookStatus, setWebhookStatus] = useState("");
  const [testResult, setTestResult] = useState("");

  const generateKey = async () => {
    // Simulate API key generation
    setApiKey("sk_test_2e4a5e770bafe2c1d8d0e9f3b7c6a5d4");
  };

  const registerWebhook = async () => {
    // Simulate webhook registration
    setWebhookStatus("✅ Online");
  };

  const runTestScan = async () => {
    // Simulate scan result
    setTestResult("Scan completed in 325ms. Vulnerabilities: [Reentrancy]");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠 Developer Onboarding</h1>
      {/* Step 1: Auth */}
      {step === 0 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">1. Connect Wallet or Sign Up</h2>
          <p className="text-sm">Use Keplr/Leap or standard email login.</p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setStep(1)}>
            Next →
          </button>
        </div>
      )}
      {/* Step 2: API Key */}
      {step === 1 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">
            2. Generate API Key <Tooltip text="Used for authenticating API calls – keep it private!" />
          </h2>
          <button onClick={generateKey} className="mt-3 px-4 py-2 bg-green-600 text-white rounded">
            Generate Key
          </button>
          {apiKey && (
            <div className="mt-3">
              <span className="font-mono bg-gray-100 p-2 rounded">{apiKey}</span>
              <CodeSnippet lang="bash">{`export SENTINEL_API_KEY=${apiKey}`}</CodeSnippet>
              <button className="mt-3 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setStep(2)}>
                Next →
              </button>
            </div>
          )}
        </div>
      )}
      {/* Step 3: Webhook */}
      {step === 2 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">
            3. Register Webhook <Tooltip text="Sentinel will POST to this URL when a scan completes." />
          </h2>
          <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded" onClick={registerWebhook}>
            Register Test Webhook
          </button>
          {webhookStatus && <p className="mt-2">{webhookStatus}</p>}
          <button className="mt-3 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setStep(3)}>
            Next →
          </button>
        </div>
      )}
      {/* Step 4: GitHub Action */}
      {step === 3 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">
            4. GitHub Action Setup <Tooltip text="Run Sentinel scans automatically on every PR or push." />
          </h2>
          <CodeSnippet lang="yaml">{`name: Sentinel Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: curl -X POST https://api.sei-sentinel.dev/scan \\
          -H "Authorization: Bearer \${{ secrets.SENTINEL_API_KEY }}" \\
          -d '{ "address": "sei1abcd1234efgh5678" }'`}</CodeSnippet>
          <button className="mt-3 px-3 py-1 bg-green-500 text-white rounded" onClick={() => setStep(4)}>
            Next →
          </button>
        </div>
      )}
      {/* Step 5: Test-on-Sei */}
      {step === 4 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">5. Test on Sei</h2>
          <p>Run a scan now on a known vulnerable contract.</p>
          <button onClick={runTestScan} className="mt-3 px-4 py-2 bg-red-600 text-white rounded">
            🚀 Run Test Scan
          </button>
          {testResult && <div className="mt-3 text-green-700">{testResult}</div>}
        </div>
      )}
    </div>
  );
}