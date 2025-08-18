import fs from "fs";
import path from "path";

/**
 * Minimal test version: always returns mock txHash/agentNft for pipeline debugging.
 * Logs errors for visibility.
 */
export async function deployToSei(codeString) {
  try {
    // Save generated code to temporary file
    const timestamp = Date.now();
    const outPath = path.join("/tmp", `SeiAgent_${timestamp}.ts`);
    fs.writeFileSync(outPath, codeString);

    // Always return mock txHash and agentNft for test
    const mockTxHash = `0xMOCKTX${timestamp}`;
    const mockAgentNft = `sei1mockagent${timestamp}`;

    console.log(`📝 [DEBUG] Agent code saved to: ${outPath}`);
    console.log(`🚀 [DEBUG] Mock deployment to Sei testnet`);
    console.log(`💎 [DEBUG] Agent NFT minted: ${mockAgentNft}`);
    console.log(`📄 [DEBUG] Transaction: ${mockTxHash}`);

    return {
      txHash: mockTxHash,
      agentNft: mockAgentNft,
      deployedAt: new Date().toISOString(),
      codeFile: outPath
    };
  } catch (error) {
    console.error("[DEBUG] Deployment error:", error);
    throw new Error(`Deployment failed: ${error.message}`);
  }
}