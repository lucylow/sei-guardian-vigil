import WebSocket from "ws";
import { getSeiWsUrl } from "../config/environment.js";

// Example: listen to incoming SEI token transfers
export function listenForSEITransfers(walletAddr: string, callback: Function) {
  const ws = new WebSocket(getSeiWsUrl());

  ws.on("open", () => {
    console.log("🔌 Connected to Sei WebSocket");
    // Subscribe to any transfer events involving the wallet
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "subscribe",
        id: "1",
        params: { query: `wasm.transfer.recipient='${walletAddr}'` }
      })
    );
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.result?.events) {
      console.log("📡 Detected SEI token transfer event:", data.result.events);
      callback(data.result.events);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  return ws;
}

// Listen for smart contract events
export function listenForContractEvents(contractAddr: string, eventType: string, callback: Function) {
  const ws = new WebSocket(getSeiWsUrl());

  ws.on("open", () => {
    console.log(`🔌 Connected to Sei WebSocket for contract ${contractAddr}`);
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "subscribe",
        id: "2",
        params: { query: `wasm.${eventType}.contract_address='${contractAddr}'` }
      })
    );
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.result?.events) {
      console.log(`📡 Detected ${eventType} event for contract ${contractAddr}:`, data.result.events);
      callback(data.result.events);
    }
  });

  return ws;
}

// Listen for block events
export function listenForBlocks(callback: Function) {
  const ws = new WebSocket(getSeiWsUrl());

  ws.on("open", () => {
    console.log("🔌 Connected to Sei WebSocket for block events");
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "subscribe",
        id: "3",
        params: { query: "tm.event='NewBlock'" }
      })
    );
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.result?.data?.value?.block) {
      const block = data.result.data.value.block;
      console.log(`📦 New block: ${block.header.height}`);
      callback(block);
    }
  });

  return ws;
}
