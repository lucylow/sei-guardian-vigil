const express = require("express");
const router = express.Router();

router.post("/ai-suggest", async (req, res) => {
  const prompt = req.body.prompt;
  // Example: return hardcoded suggestion for demonstration
  res.json({ suggestions: [ "// AI recommends adding input validation here", "// Consider async error handling" ] });
});

module.exports = router;
