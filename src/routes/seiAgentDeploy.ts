import express from "express";
import { generateSeiAgentCodeFromFlow } from "../lib/agentDeployment";
import { deployAgentOnSei } from "../lib/seiDeploy";

const router = express.Router();

router.post("/deploy-agent", async (req, res) => {
  try {
    const flowJson = req.body.flow;

    // Add schema validation logic here...

    const agentCode = generateSeiAgentCodeFromFlow(flowJson);
    const deploymentInfo = await deployAgentOnSei(agentCode);

    res.json({
      success: true,
      message: "Agent deployed successfully on Sei blockchain",
      deploymentInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;