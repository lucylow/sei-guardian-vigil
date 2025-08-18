import { createAgent } from "elizaos";
import {
  seiPlugin,
  authorizeAgent,
  deployContract,
  listenToMCP,
} from "@elizaos/plugin-sei";
import { ChatOpenAI } from "langchain/chat_models";
import fs from "fs";
import path from "path";

const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function bootAgentWithSei(code) {
  // Save generated agent code
  const filePath = path.join("/tmp", `Agent_${Date.now()}.ts`);
  fs.writeFileSync(filePath, code);

  // Initialize ElizaOS agent
  const agent = await createAgent({
    id: "sentinel-agent",
    plugins: [seiPlugin],
  });

  // Authorize blockchain actions
  await authorizeAgent({
    agentId: "sentinel-agent",
    permissions: ["read_chain", "deploy_contract", "simulate_tx"],
  });

  // Deploy contract/agent
  const result = await deployContract({
    optimizedBytecode: fs.readFileSync(filePath, "utf8"),
    gasLimit: "auto",
    signer: process.env.SEI_PRIVATE_KEY,
    nftIdentity: true,
  });

  // Listen for new contract deployments and trigger AI audit
  listenToMCP("contract_deployed", async (contract) => {
    console.log("📡 Detected new contract:", contract.address);
    await runAuditTask(agent, contract);
  });

  return {
    txHash: result.txHash,
    agentNft: result.nftMinted,
  };
}

// AI-powered audit workflow using LangChain
export async function runAuditTask(agent, { address, bytecode }) {
  console.log(`⚡ Running AI audit for contract: ${address}`);

  const prompt = `
  You are a Sei blockchain smart contract auditor.
  Analyze this contract bytecode for vulnerabilities:
  ${bytecode}

  Return:
  1. List of vulnerabilities (if any).
  2. Suggested fix code / patch in pseudocode.
  3. Risk rating (critical/high/medium/low).
  `;

  const auditReport = await llm.invoke(prompt);
  console.log("🔍 Audit Result:", auditReport.content);

  // Store in agent memory
  await agent.memory.save({
    contract: address,
    report: auditReport.content,
  });

  // If critical vulnerability, propose and deploy fix
  if (auditReport.content.includes("critical")) {
    console.log("🚨 Critical issue found, deploying patch candidate...");
    // Simulate fixData.bytecode (replace bug pattern for demo)
    const fixData = { bytecode: bytecode.replace("vulnerable_opcode", "fixed_opcode") };
    const result = await deployContract({
      optimizedBytecode: fixData.bytecode,
      gasLimit: "auto",
      signer: process.env.SEI_PRIVATE_KEY,
      requireHumanApproval: true,
    });
    console.log(`✅ Fix deployed. TxHash: ${result.txHash}`);
    return { ...auditReport, fixTx: result.txHash };
  }

  return auditReport;
}
