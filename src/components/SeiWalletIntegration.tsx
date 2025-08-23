import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Shield, Zap, Globe, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useSeiWallet } from "@/contexts/SeiWalletContext";

declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
  }
}

const SEI_RPC = "https://rpc.sei.io";
const SEI_WS = "wss://rpc.sei.io/websocket";
const COSMWASM_CONTRACT = "sei1yourcosmwasmcontractaddress"; // Replace with actual contract
const EVM_CONTRACT = "0xYourEVMContractAddress"; // Replace with actual contract

interface WalletState {
  address: string;
  client?: any;
  provider?: any;
  signer?: any;
}

export function SeiWalletIntegration() {
  const { 
    cosmosWallet, 
    evmWallet, 
    setCosmosWallet, 
    setEvmWallet, 
    disconnectWallets 
  } = useSeiWallet();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const [networkStatus, setNetworkStatus] = useState("Disconnected");

  // Connect to Keplr wallet for CosmWasm
  const connectCosmosWallet = useCallback(async () => {
    if (!window.keplr) {
      alert("Please install Keplr wallet extension");
      return;
    }

    setIsConnecting(true);
    try {
      await window.keplr.enable("sei");
      const offlineSigner = window.keplr.getOfflineSigner("sei");
      const accounts = await offlineSigner.getAccounts();
      
      // Import CosmJS client dynamically to avoid SSR issues
      const { SigningCosmWasmClient } = await import("@cosmjs/cosmwasm-stargate");
      const client = await SigningCosmWasmClient.connectWithSigner(SEI_RPC, offlineSigner);
      
      setCosmosWallet({
        address: accounts[0].address,
        client
      });
      
      setNetworkStatus("Connected to Sei");
    } catch (error) {
      console.error("Failed to connect Cosmos wallet:", error);
      alert("Failed to connect Cosmos wallet: " + (error as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Connect to MetaMask/Compass for EVM
  const connectEvmWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or Compass wallet extension");
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Import ethers dynamically to avoid SSR issues
      const { ethers } = await import("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setEvmWallet({
        address,
        provider,
        signer
      });
      
      setNetworkStatus("Connected to Sei EVM");
    } catch (error) {
      console.error("Failed to connect EVM wallet:", error);
      alert("Failed to connect EVM wallet: " + (error as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }, []);



  // WebSocket connection for live blockchain events
  useEffect(() => {
    if (!cosmosWallet && !evmWallet) return;

    const ws = new WebSocket(SEI_WS);
    
    ws.onopen = () => {
      setWsStatus("Connected");
      // Subscribe to vulnerability events
      ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: {
          query: "tm.event = 'Tx' AND message.action = 'vulnerability_detected'"
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.result?.events) {
          const vulnName = data.result.events["vulnerability.name"]?.[0] || "Unknown Vulnerability";
          setLiveEvents(prev => [vulnName, ...prev].slice(0, 10));
        }
      } catch (error) {
        console.warn("WebSocket message error:", error);
      }
    };

    ws.onerror = () => setWsStatus("Error");
    ws.onclose = () => setWsStatus("Disconnected");

    return () => ws.close();
  }, [cosmosWallet, evmWallet]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Sei Blockchain Integration
        </CardTitle>
        <CardDescription>
          Connect your wallet to interact with the Sei blockchain and deploy agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="status">Network Status</TabsTrigger>
            <TabsTrigger value="events">Live Events</TabsTrigger>
          </TabsList>

          <TabsContent value="wallets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cosmos Wallet */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Cosmos (Keplr)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cosmosWallet ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-mono">
                          {cosmosWallet.address.slice(0, 12)}...{cosmosWallet.address.slice(-8)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="w-full justify-center">
                        CosmWasm Ready
                      </Badge>
                    </div>
                  ) : (
                    <Button 
                      onClick={connectCosmosWallet} 
                      disabled={isConnecting}
                      className="w-full"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Connect Keplr
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* EVM Wallet */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    EVM (MetaMask/Compass)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {evmWallet ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-mono">
                          {evmWallet.address.slice(0, 12)}...{evmWallet.address.slice(-8)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="w-full justify-center">
                        EVM Ready
                      </Badge>
                    </div>
                  ) : (
                    <Button 
                      onClick={connectEvmWallet} 
                      disabled={isConnecting}
                      variant="outline"
                      className="w-full"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Connect EVM
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Disconnect Button */}
            {(cosmosWallet || evmWallet) && (
              <div className="flex justify-center">
                <Button 
                  onClick={disconnectWallets} 
                  variant="destructive"
                  size="sm"
                >
                  Disconnect All Wallets
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Network Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      networkStatus === "Disconnected" ? "bg-red-500" : "bg-green-500"
                    }`} />
                    <span className="text-sm">{networkStatus}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">WebSocket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      wsStatus === "Connected" ? "bg-green-500" : "bg-yellow-500"
                    }`} />
                    <span className="text-sm">{wsStatus}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Connection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>RPC Endpoint:</strong> {SEI_RPC}</div>
                <div><strong>WebSocket:</strong> {SEI_WS}</div>
                <div><strong>CosmWasm Contract:</strong> {COSMWASM_CONTRACT}</div>
                <div><strong>EVM Contract:</strong> {EVM_CONTRACT}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Live Blockchain Events
                </CardTitle>
                <CardDescription>
                  Real-time vulnerability detection and security events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {liveEvents.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No recent events detected</p>
                    <p className="text-xs">Connect a wallet to start monitoring</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {liveEvents.map((event, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-sm">{event}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
