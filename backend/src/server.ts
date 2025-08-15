import express from "express";
import seiMcpRouter from "./seiMcpIntegration";

const app = express();
app.use(express.json());
app.use("/api/sei", seiMcpRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Sentinel backend running on port ${PORT}`));