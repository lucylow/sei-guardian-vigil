import React, { useState } from "react";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function AgentDeployDemo() {
  const [flowJson, setFlowJson] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    try {
      const parsed = JSON.parse(flowJson);
      setSubmitting(true);
      const res = await fetch("/api/deploy-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow: parsed })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deployment failed");
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ConnectWalletButton />
      <h1 className="text-2xl font-bold mb-4">SEI SENTINEL Agent Deployment Demo</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Paste Visual Agent Flow JSON:</label>
        <textarea
          rows={15}
          className="w-full border p-2 font-mono"
          value={flowJson}
          onChange={(e) => setFlowJson(e.target.value)}
          disabled={submitting}
          placeholder="Paste your visual flow JSON here..."
        ></textarea>
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? "Deploying..." : "Deploy Agent to Sei"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>}

      {response && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <h2 className="font-bold mb-2">Deployment Successful!</h2>
          <p>Contract Address: <code>{response.deploymentInfo.contractAddress}</code></p>
          <p>Transaction Hash: <code>{response.deploymentInfo.txHash}</code></p>
          <p>Agent Code Hash: <code>{response.deploymentInfo.codeHash}</code></p>
        </div>
      )}
    </div>
  );
}