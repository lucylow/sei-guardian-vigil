import express from "express";
import { generateAgentCode } from "../services/codegen.js";
import { deployToSei } from "../services/seiDeploy.js";

const router = express.Router();

// Build agent code from visual flow
router.post("/build", async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    const code = generateAgentCode(nodes, edges);
    res.json({ status: "ok", code });
  } catch (err) {
    console.error("Build error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Deploy agent to Sei testnet
router.post("/deploy", async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    
    // Step 1: Generate agent code
    const code = generateAgentCode(nodes, edges);
    
    // Step 2: Deploy to Sei via GOAT SDK
    const { txHash, agentNft } = await deployToSei(code);
    
    res.json({ status: "ok", txHash, agentNft, code });
  } catch (err) {
    console.error("Deploy error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;