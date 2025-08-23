import axios from "axios";

// WebSocket type for Node.js environment
declare global {
  interface WebSocket {
    readyState: number;
    OPEN: number;
    send(data: string): void;
    close(): void;
    onopen: ((event: any) => void) | null;
    onmessage: ((event: any) => void) | null;
    onerror: ((event: any) => void) | null;
    onclose: ((event: any) => void) | null;
  }
  
  var WebSocket: {
    new(url: string): WebSocket;
    readonly OPEN: number;
  };
}

// Configuration
const MCP_SERVER = process.env['SEI_MCP_URL'] || "http://localhost:3001";
const SEI_WS_URL = process.env['SEI_WS_URL'] || "wss://sei-testnet-rpc.polkachu.com/websocket";

// Mock mode flag
let mockMode = false;

// WebSocket connection for real-time updates
let wsConnection: WebSocket | null = null;

// Mock blockchain data for development
const mockBlockchain = {
  balance: 1000,
  transactions: [],
  contracts: []
};

// Initialize WebSocket connection
function initWebSocketListener(callback: (data: any) => void): void {
  try {
    wsConnection = new WebSocket(SEI_WS_URL);
    
    wsConnection.onopen = () => {
      console.log("🔗 Connected to Sei WebSocket");
      mockMode = false;
    };
    
    wsConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };
    
    wsConnection.onerror = (err) => {
      console.error("WebSocket error:", err);
      mockMode = true;
    };
    
    wsConnection.onclose = () => {
      console.log("WebSocket connection closed, switching to mock mode");
      mockMode = true;
    };
    
  } catch (err: any) {
    console.error("Failed to initialize WebSocket:", err.message);
    mockMode = true;
  }
}

// Test MCP server connection
async function testMcpConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${MCP_SERVER}/health`);
    return response.status === 200;
  } catch (err: any) {
    console.error("MCP call failed, switching to mock mode", err.message);
    mockMode = true;
    return false;
  }
}

// Transfer SEI tokens
async function transferSent(toAddress: string, amount: number): Promise<any> {
  if (mockMode) {
    console.log(`💰 Mock transfer: ${amount} SEI to ${toAddress}`);
    return { success: true, txHash: `mock_${Date.now()}` };
  }

  try {
    const response = await axios.post(`${MCP_SERVER}/tool`, {
      tool: "transfer",
      params: {
        to: toAddress,
        amount: amount.toString(),
        contractAddress: process.env['AGENT_NFT_CONTRACT'],
        network: "sei-testnet"
      }
    });
    
    return response.data;
  } catch (err: any) {
    console.error("Transfer failed:", err.message);
    throw new Error(`Transfer failed: ${err.message}`);
  }
}

// Send real-time update
function sendUpdate(data: any): void {
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.send(JSON.stringify({
      type: "update",
      data: data,
      timestamp: Date.now()
    }));
  }
}

// Get blockchain status
function getStatus(): any {
  if (mockMode) {
    return {
      mode: "mock",
      balance: mockBlockchain.balance,
      transactions: mockBlockchain.transactions.length,
      contracts: mockBlockchain.contracts.length
    };
  }
  
  return {
    mode: "live",
    mcpServer: MCP_SERVER,
    websocket: wsConnection?.readyState === WebSocket.OPEN ? "connected" : "disconnected"
  };
}

// Check if mock mode is active
function isMockActive(): boolean {
  return mockMode;
}

// Cleanup function
function cleanup(): void {
  if (wsConnection) wsConnection.close();
}

// Initialize blockchain
async function init(): Promise<void> {
  console.log("🚀 Initializing Sei Blockchain integration...");
  
  // Test MCP connection
  const mcpConnected = await testMcpConnection();
  
  if (mcpConnected) {
    console.log("✅ MCP server connected, using live mode");
    initWebSocketListener((data) => {
      console.log("📡 Blockchain update:", data);
    });
  } else {
    console.log("⚠️ Using mock mode for development");
  }
}

export const Blockchain = {
  init,
  initWebSocketListener,
  transferSent,
  sendUpdate,
  getStatus,
  isMockActive,
  cleanup
};
