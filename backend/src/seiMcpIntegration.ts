import express from "express";
import axios from "axios";

const router = express.Router();
const MCP_SERVER = process.env.SEI_MCP_URL || "http://localhost:3001";

async function callSeiTool(toolName: string, params: any): Promise<any> {
  try {
    const res = await axios.post(`${MCP_SERVER}/tool`, {
      tool: toolName,
      params,
    });
    return res.data;
  } catch (error) {
    console.error(`Error calling MCP tool ${toolName}:`, error);
    throw new Error(`Failed to call MCP tool ${toolName}`);
  }
}

// --- Backend API Endpoints for SEI Sentinel Features ---

router.post("/mint-agent-nft", async (req, res) => {
  const { agentWallet, metadataURI } = req.body;
  const agentNFTContract = process.env.AGENT_NFT_CONTRACT;
  if (!agentNFTContract) {
    return res.status(500).json({ error: "AGENT_NFT_CONTRACT environment variable not set." });
  }
  try {
    const mintResp = await callSeiTool("write-contract", {
      contractAddress: agentNFTContract,
      abi: "[YOUR_ERC721_ABI_HERE]", // Replace with your actual ERC721 ABI
      functionName: "mint",
      args: [agentWallet, metadataURI],
      network: "sei",
    });
    res.json(mintResp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reward-agent", async (req, res) => {
  const { toAddress, amount } = req.body;
  try {
    const txResp = await callSeiTool("transfer-sei", {
      to: toAddress,
      amount: amount,
      network: "sei",
    });
    res.json(txResp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/agent-nft/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  const agentNFTContract = process.env.AGENT_NFT_CONTRACT;
  if (!agentNFTContract) {
    return res.status(500).json({ error: "AGENT_NFT_CONTRACT environment variable not set." });
  }
  try {
    const resp = await callSeiTool("get-nft-info", {
      tokenAddress: agentNFTContract,
      tokenId,
      network: "sei",
    });
    res.json(resp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/block-latest", async (req, res) => {
  try {
    const resp = await callSeiTool("get-chain-info", { network: "sei" });
    res.json(resp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;