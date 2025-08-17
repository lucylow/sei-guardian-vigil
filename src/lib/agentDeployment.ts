import { writeFileSync } from "fs";
import path from "path";

export function generateSeiAgentCodeFromFlow(flowJson: any): string {
  // Extract core node data from visual flow JSON
  const personality = flowJson.nodes.find(n => n.type === "agentPersonality")?.data || {};
  const skills = flowJson.nodes.filter(n => n.type === "skill");
  const triggers = flowJson.nodes.filter(n => n.type === "trigger");
  const actions = flowJson.nodes.filter(n => n.type === "action");
  const seiIntegration = flowJson.nodes.find(n => n.type === "seiIntegration")?.data || {};

  // Compose Eliza OS + GOAT SDK powered Sei agent code using extracted data
  const code = `
// Auto-generated Sei Agent runtime code

import { ElizaRuntime, Character } from "@elizaos/eliza";
import { GoatPlugin } from "@elizaos/plugin-goat";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";

const character: Character = {
  name: "${personality.name || "SeiAgent"}",
  bio: "${personality.bio || "Autonomous agent running on the Sei blockchain."}",
  traits: ${JSON.stringify(personality.traits || ["helpful", "sei-native"])},
  messageExamples: [
    "Hello! I am your agent interfaced with the Sei Network.",
    "Ready to react to Sei state with swift on-chain actions."
  ]
};

export class GeneratedSeiAgent {
  runtime: ElizaRuntime;
  goatTools: any;

  constructor() {
    this.runtime = new ElizaRuntime({
      character,
      plugins: [GoatPlugin]
    });

    this.goatTools = getOnChainTools({
      wallet: process.env.SEI_AGENT_WALLET_KEY,
      plugins: [${generateIntegrationPlugins(seiIntegration.integrations)}]
    });
  }

  async start() {
    ${triggers.map(trigger => `
    this.runtime.on("${trigger.data.event}", async (data) => {
      ${actions.map(action => `
      if("${action.data.actionType}" === "scanContract") {
        await this.scanContract(data);
      }
      `).join("\n")}
    });`).join("\n")}
  }

  async scanContract(contractData: any) {
    console.log("Sei Agent scanning contract:", contractData);
    // sample action: mint a vulnerability NFT using CrossMint on Sei
    if(contractData.vulnerabilitySeverity === "critical") {
      await this.goatTools.crossmint.mint({
        chain: "sei",
        contractAddress: process.env.BUG_BOUNTY_NFT_CONTRACT,
        recipient: contractData.owner,
        metadata: {
          name: "Critical Vulnerability NFT",
          description: "Awarded for detecting a critical issue on the Sei network.",
          attributes: [{ trait_type: "severity", value: "critical" }]
        }
      });
    }
  }
}

function generateIntegrationPlugins(integrations: string[] = []) {
  const pluginsMap = {
    wallet: "cosmosbank()",
    nft: "crossmint()",
    defi: "defiTools()",
    governance: "governanceManager()",
    monitoring: "chainMonitor()"
  };
  return integrations.map(i => pluginsMap[i]).filter(Boolean).join(", ");
}
`;

  const outputPath = path.join(__dirname, "../../generated_agents", `${personality.name || "SeiAgent"}.ts`);
  writeFileSync(outputPath, code);

  return code;
}