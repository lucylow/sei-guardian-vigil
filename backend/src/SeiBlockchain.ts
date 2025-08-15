import axios from "axios";

const MCP_SERVER = process.env.SEI_MCP_URL || "http://localhost:3001";
const MOCK_MODE = { active: false };

async function safeMCP(tool, params, mockResp) {
  if (MOCK_MODE.active) return mockResp;
  try {
    const r = await axios.post(`${MCP_SERVER}/tool`, { tool, params });
    return r.data;
  } catch (e) {
    MOCK_MODE.active = true;
    console.warn(`[Fallback] MCP Server offline, switching to mock mode`);
    return mockResp;
  }
}

export class SeiBlockchain {
  async sendSENT(toAddress, amount) {
    return await safeMCP(
      "transfer-sei",
      { to: toAddress, amount, network: "sei" },
      {
        txHash: "MOCK_TX_" + Math.floor(Math.random() * 1000000),
        mode: "MOCK",
        to: toAddress,
        amount,
        network: "sei"
      }
    );
  }
  async mintAgentNFT(agentWallet, metadataURI) {
    return await safeMCP(
      "write-contract",
      {
        contractAddress: process.env.AGENT_NFT_CONTRACT,
        abi: "[ERC721 ABI]",
        functionName: "mint",
        args: [agentWallet, metadataURI],
        network: "sei"
      },
      {
        txHash: "MOCK_MINT_" + Math.floor(Math.random() * 1000000),
        mode: "MOCK",
        tokenId: String(Math.floor(Math.random() * 10000)),
        agentWallet,
        metadataURI
      }
    );
  }
  async getNFTMetadata(tokenId) {
    return await safeMCP(
      "get-nft-info",
      {
        tokenAddress: process.env.AGENT_NFT_CONTRACT,
        tokenId,
        network: "sei"
      },
      {
        tokenId,
        agentName: "MockGuardian",
        winStreak: Math.floor(Math.random() * 5),
        badges: ["Critical Slayer", "Speed Demon"],
        mode: "MOCK"
      }
    );
  }
  async getTransaction(txHash) {
    return await safeMCP(
      "get-chain-info",
      { txHash, network: "sei" },
      {
        txHash,
        status: "confirmed",
        block: Math.floor(Math.random() * 10000),
        timestamp: Date.now() - Math.floor(Math.random() * 3600000),
        mode: "MOCK"
      }
    );
  }
  isMockMode() {
    return MOCK_MODE.active;
  }
  resetMock() {
    MOCK_MODE.active = false;
  }
}
