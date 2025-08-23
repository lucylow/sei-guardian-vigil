import express from "express";
import axios from "axios";

const router = express.Router();

// Configuration
const MCP_SERVER = process.env['SEI_MCP_URL'] || "http://localhost:3001";

// Helper function to call Sei MCP tools
async function callSeiTool(toolName: string, params: any): Promise<any> {
  try {
    const response = await axios.post(`${MCP_SERVER}/tool`, {
      tool: toolName,
      params: params
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error calling MCP tool ${toolName}:`, error.message);
    throw new Error(`Failed to call MCP tool ${toolName}: ${error.message}`);
  }
}

// Mint agent NFT
router.post("/mint-agent-nft", async (req: express.Request, res: express.Response) => {
  try {
    const { walletAddress, metadataURI } = req.body;
    
    if (!walletAddress || !metadataURI) {
      return res.status(400).json({ error: "Missing walletAddress or metadataURI" });
    }

    const agentNFTContract = process.env['AGENT_NFT_CONTRACT'];
    if (!agentNFTContract) {
      return res.status(500).json({ error: "AGENT_NFT_CONTRACT not configured" });
    }

    const result = await callSeiTool("write-contract", {
      contractAddress: agentNFTContract,
      abi: JSON.stringify([
        "function mint(address to, string memory tokenURI) public returns (uint256)"
      ]),
      functionName: "mint",
      args: [walletAddress, metadataURI],
      network: "sei-testnet"
    });

    res.json({
      success: true,
      tokenId: result.tokenId,
      txHash: result.txHash,
      message: "Agent NFT minted successfully"
    });

  } catch (error: any) {
    console.error("Error minting agent NFT:", error.message);
    res.status(500).json({ 
      error: "Failed to mint agent NFT", 
      details: error.message 
    });
  }
});

// Reward agent with SEI tokens
router.post("/reward-agent", async (req: express.Request, res: express.Response) => {
  try {
    const { agentAddress, amount, reason } = req.body;
    
    if (!agentAddress || !amount) {
      return res.status(400).json({ error: "Missing agentAddress or amount" });
    }

    const result = await callSeiTool("transfer", {
      to: agentAddress,
      amount: amount.toString(),
      network: "sei-testnet",
      reason: reason || "Agent reward"
    });

    res.json({
      success: true,
      txHash: result.txHash,
      message: `${amount} SEI transferred to agent ${agentAddress}`
    });

  } catch (error: any) {
    console.error("Error rewarding agent:", error.message);
    res.status(500).json({ 
      error: "Failed to reward agent", 
      details: error.message 
    });
  }
});

// Get agent NFT details
router.get("/agent-nft/:tokenId", async (req: express.Request, res: express.Response) => {
  try {
    const { tokenId } = req.params;
    
    const agentNFTContract = process.env['AGENT_NFT_CONTRACT'];
    if (!agentNFTContract) {
      return res.status(500).json({ error: "AGENT_NFT_CONTRACT not configured" });
    }

    const result = await callSeiTool("read-contract", {
      contractAddress: agentNFTContract,
      abi: JSON.stringify([
        "function tokenURI(uint256 tokenId) public view returns (string memory)",
        "function ownerOf(uint256 tokenId) public view returns (address)"
      ]),
      functionName: "tokenURI",
      args: [tokenId],
      network: "sei-testnet"
    });

    res.json({
      success: true,
      tokenId: tokenId,
      metadataURI: result.data,
      message: "Agent NFT details retrieved"
    });

  } catch (error: any) {
    console.error("Error getting agent NFT:", error.message);
    res.status(500).json({ 
      error: "Failed to get agent NFT", 
      details: error.message 
    });
  }
});

// Get latest block information
router.get("/block-latest", async (req: express.Request, res: express.Response) => {
  try {
    const result = await callSeiTool("get-block", {
      network: "sei-testnet",
      latest: true
    });

    res.json({
      success: true,
      block: result.data,
      message: "Latest block information retrieved"
    });

  } catch (error: any) {
    console.error("Error getting latest block:", error.message);
    res.status(500).json({ 
      error: "Failed to get latest block", 
      details: error.message 
    });
  }
});

export default router;