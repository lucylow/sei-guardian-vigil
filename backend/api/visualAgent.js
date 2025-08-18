import express from "express";
import { generateAgentCode } from "../services/codegen.js";
import { bootAgentWithSei } from "../services/elizaSei.js";

const router = express.Router();

// Ping endpoint for debugging frontend-backend connectivity
router.get("/ping", (req, res) => {
  res.json({ status: "ok", message: "visual-agent API is reachable" });
});

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
    const code = generateAgentCode(nodes, edges);

    // Boot agent, deploy on Sei, mint NFT via Crossmint
    const { txHash, agentNft } = await bootAgentWithSei(code);

    res.json({ status: "ok", txHash, agentNft });
  } catch (e) {
    console.error("Deploy error:", e);
    res.status(500).json({ status: "error", error: e.message });
  }
});

export default router;