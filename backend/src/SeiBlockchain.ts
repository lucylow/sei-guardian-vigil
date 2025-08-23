import axios from "axios";
import { WebSocket } from "ws";
import { Kafka } from "kafkajs";

const MCP_SERVER = process.env.SEI_MCP_URL || "http://localhost:3001";
const SEI_WS_URL = process.env.SEI_WS_URL || "wss://sei-testnet-rpc.polkachu.com/websocket";

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"];
const kafka = new Kafka({ clientId: "sei-sentinel", brokers: KAFKA_BROKERS });
const kafkaProducer = kafka.producer();

let isMock = false;
let wsConnection = null;

async function sendKafkaEvent(topic: string, payload: any) {
  try {
    await kafkaProducer.connect();
    await kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }]
    });
  } catch (err) {
    console.error("Kafka send error:", err.message);
  }
}

export const Blockchain = {
  async callMcp(tool: string, params: any, mockResponse: any) {
    if (isMock) return mockResponse;
    try {
      const resp = await axios.post(`${MCP_SERVER}/tool`, { tool, params });
      return resp.data;
    } catch (err) {
      console.error("MCP call failed, switching to mock mode", err.message);
      isMock = true;
      return mockResponse;
    }
  },

  async mintAgentNFT(wallet: string, metadataURI: string) {
    return this.callMcp(
      "write-contract",
      {
        contractAddress: process.env.AGENT_NFT_CONTRACT,
        abi: "[ERC721 ABI]",
        functionName: "mint",
        args: [wallet, metadataURI],
        network: "sei",
      },
      {
        txHash: `MOCK_TX_MINT_${Date.now()}`,
        tokenId: `mock-${Math.random().toString(36).substring(2, 9)}`
      }
    );
  },

  async transferSent(to: string, amount: number) {
    return this.callMcp(
      "transfer-sei",
      { to, amount, network: "sei" },
      { txHash: `MOCK_TX_TRANSFER_${Date.now()}` }
    );
  },

  initWebSocketListener(eventHandler?: (txData: any) => void) {
    const connect = () => {
      wsConnection = new WebSocket(SEI_WS_URL);

      wsConnection.on("open", () => {
        console.log("Connected to Sei WebSocket");
        wsConnection.send(JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          params: { query: "tm.event = 'Tx' AND message.action='/cosmwasm.wasm.v1.MsgExecuteContract'" },
          id: 1
        }));
      });

      wsConnection.on("message", async (data: any) => {
        try {
          const msg = JSON.parse(data);
          if (msg.result?.data?.type === "tx" && eventHandler) {
            eventHandler(msg.result.data.value);
            // Distributed event: push to Kafka for scalable processing
            await sendKafkaEvent("contract-deployments", msg.result.data.value);
          }
        } catch (e) {
          console.error("Error processing WS message:", e);
        }
      });

      wsConnection.on("close", () => {
        console.log("Disconnected. Reconnecting in 3s...");
        setTimeout(connect, 3000);
      });

      wsConnection.on("error", (err: any) => {
        console.error("WebSocket error:", err.message);
      });
    };

    connect();
  },

  resetMock() {
    isMock = false;
    if (wsConnection) wsConnection.close();
    this.initWebSocketListener();
  },

  isMockActive() {
    return isMock;
  }
};
