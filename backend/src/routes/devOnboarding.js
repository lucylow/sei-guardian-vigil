import express from "express";
import crypto from "crypto";
const router = express.Router();

// Simulated in-memory storage
const apiKeysDB = {};
const webhooksDB = {};

// Hive Intelligence MCP Key Management
const hiveKeysDB = {};

router.post("/generate-api-key", (req, res) => {
  const { userId, scope } = req.body;
  const apiKey = crypto.randomBytes(16).toString("hex");
  apiKeysDB[userId] = { apiKey, scope };
  res.json({ apiKey });
});

router.post("/register-webhook", (req, res) => {
  const { userId, url, eventType } = req.body;
  webhooksDB[userId] = { url, eventType, status: "online" };
  // Test ping
  console.log(`📡 Test webhook sent to ${url} for event ${eventType}`);
  res.json({ success: true, status: "✅ Online" });
});

router.post("/test-scan", async (req, res) => {
  const { apiKey } = req.body;
  console.log(`🚀 Simulated scan triggered for API key ${apiKey}`);
  // Simulated result
  res.json({
    contract: "sei1abcd1234efgh5678",
    issues: [
      { severity: "critical", type: "Reentrancy", location: "withdraw()" },
    ],
    scanTime: "325ms",
  });
});

// Generate new Hive MCP key
router.post("/hive/generate-key", (req, res) => {
  const { keyName = "dev", environment = "development" } = req.body;
  const key = "dev_" + crypto.randomBytes(16).toString("hex");
  hiveKeysDB[keyName] = { key, environment };
  res.json({ key, environment, keyName });
});

// List all Hive MCP keys
router.get("/hive/keys", (req, res) => {
  res.json(hiveKeysDB);
});

export default router;