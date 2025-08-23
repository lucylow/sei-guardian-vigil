import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Rocket, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText,
  Network,
  Settings,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSeiWallet } from "@/contexts/SeiWalletContext";

interface DeploymentConfig {
  network: "testnet" | "mainnet";
  gasLimit: string;
  gasPrice: string;
  memo?: string;
}

interface AgentWorkflow {
  nodes: any[];
  edges: any[];
  metadata: {
    name: string;
    description: string;
    version: string;
    author: string;
  };
}

interface OnChainDeploymentProps {
  agentWorkflow: AgentWorkflow | null;
}

const SEI_RPC = "https://rpc.sei.io";
const SEI_TESTNET_RPC = "https://rpc.atlantic-2.seinetwork.io";
const COSMWASM_CONTRACT = "sei1yourcosmwasmcontractaddress"; // Replace with actual contract
const EVM_CONTRACT = "0xYourEVMContractAddress"; // Replace with actual contract

export function OnChainDeployment({ 
  agentWorkflow
}: OnChainDeploymentProps) {
  const { cosmosWallet, evmWallet } = useSeiWallet();
  
  // Update agent workflow metadata with wallet address if available
  const enrichedWorkflow = agentWorkflow ? {
    ...agentWorkflow,
    metadata: {
      ...agentWorkflow.metadata,
      author: cosmosWallet?.address || evmWallet?.address || "Unknown"
    }
  } : null;
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    network: "testnet",
    gasLimit: "200000",
    gasPrice: "0.025",
    memo: ""
  });
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>("");
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [deploymentType, setDeploymentType] = useState<"cosmwasm" | "evm">("cosmwasm");
  
  const { toast } = useToast();

  // Deploy to CosmWasm
  const deployToCosmWasm = useCallback(async () => {
    if (!cosmosWallet?.client || !enrichedWorkflow) {
      toast({
        title: "❌ Deployment Failed",
        description: "Cosmos wallet not connected or no agent workflow",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus("Preparing CosmWasm deployment...");

    try {
      // Prepare the deployment message
      const deployMsg = {
        deploy_agent: {
          workflow: enrichedWorkflow,
          metadata: enrichedWorkflow.metadata,
          config: deploymentConfig
        }
      };

      // Calculate fees
      const fee = {
        amount: [{ 
          denom: "usei", 
          amount: Math.ceil(parseFloat(deploymentConfig.gasLimit) * parseFloat(deploymentConfig.gasPrice)).toString()
        }],
        gas: deploymentConfig.gasLimit
      };

      setDeploymentStatus("Broadcasting transaction to Sei blockchain...");

      // Execute the deployment
      const result = await cosmosWallet.client.execute(
        cosmosWallet.address,
        COSMWASM_CONTRACT,
        deployMsg,
        fee,
        deploymentConfig.memo || undefined
      );

      setDeploymentResult({
        type: "cosmwasm",
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed,
        height: result.height,
        network: deploymentConfig.network
      });

      setDeploymentStatus("✅ Deployment successful!");
      
      toast({
        title: "🚀 Agent Deployed Successfully!",
        description: `Transaction: ${result.transactionHash.slice(0, 20)}...`,
      });

    } catch (error) {
      console.error("CosmWasm deployment failed:", error);
      setDeploymentStatus(`❌ Deployment failed: ${(error as Error).message}`);
      
      toast({
        title: "❌ Deployment Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  }, [cosmosWallet, agentWorkflow, deploymentConfig, toast]);

  // Deploy to EVM
  const deployToEVM = useCallback(async () => {
    if (!evmWallet?.signer || !enrichedWorkflow) {
      toast({
        title: "❌ Deployment Failed",
        description: "EVM wallet not connected or no agent workflow",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus("Preparing EVM deployment...");

    try {
      // Import ethers dynamically
      const { ethers } = await import("ethers");
      
      // Prepare the deployment data
      const deploymentData = {
        workflow: enrichedWorkflow,
        metadata: enrichedWorkflow.metadata,
        config: deploymentConfig
      };

      setDeploymentStatus("Creating smart contract transaction...");

      // Create contract instance
      const abi = ["function deployAgent(string memory json) external"];
      const contract = new ethers.Contract(EVM_CONTRACT, abi, evmWallet.signer);

      // Prepare transaction
      const tx = await contract.deployAgent(JSON.stringify(deploymentData), {
        gasLimit: ethers.utils.parseUnits(deploymentConfig.gasLimit, "wei"),
        gasPrice: ethers.utils.parseUnits(deploymentConfig.gasPrice, "gwei")
      });

      setDeploymentStatus("Waiting for transaction confirmation...");

      // Wait for confirmation
      const receipt = await tx.wait();

      setDeploymentResult({
        type: "evm",
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber,
        network: deploymentConfig.network
      });

      setDeploymentStatus("✅ EVM deployment successful!");
      
      toast({
        title: "🚀 Agent Deployed to EVM!",
        description: `Transaction: ${receipt.transactionHash.slice(0, 20)}...`,
      });

    } catch (error) {
      console.error("EVM deployment failed:", error);
      setDeploymentStatus(`❌ EVM deployment failed: ${(error as Error).message}`);
      
      toast({
        title: "❌ EVM Deployment Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  }, [evmWallet, agentWorkflow, deploymentConfig, toast]);

  // Handle deployment
  const handleDeploy = useCallback(async () => {
    if (deploymentType === "cosmwasm") {
      await deployToCosmWasm();
    } else {
      await deployToEVM();
    }
  }, [deploymentType, deployToCosmWasm, deployToEVM]);

  // Check if deployment is possible
  const canDeploy = enrichedWorkflow && ((cosmosWallet && deploymentType === "cosmwasm") || 
                   (evmWallet && deploymentType === "evm"));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          On-Chain Deployment
        </CardTitle>
        <CardDescription>
          Deploy your agent workflow to the Sei blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deploy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-4">
            {/* Deployment Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`border-2 cursor-pointer transition-colors ${
                deploymentType === "cosmwasm" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`} onClick={() => setDeploymentType("cosmwasm")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    CosmWasm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {cosmosWallet ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {cosmosWallet ? "Wallet Connected" : "Wallet Required"}
                      </span>
                    </div>
                    <Badge variant={cosmosWallet ? "default" : "secondary"}>
                      {cosmosWallet ? "Ready" : "Not Connected"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 cursor-pointer transition-colors ${
                deploymentType === "evm" ? "border-purple-500 bg-purple-50" : "border-gray-200"
              }`} onClick={() => setDeploymentType("evm")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    EVM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {evmWallet ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {evmWallet ? "Wallet Connected" : "Wallet Required"}
                      </span>
                    </div>
                    <Badge variant={evmWallet ? "default" : "secondary"}>
                      {evmWallet ? "Ready" : "Not Connected"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deployment Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleDeploy}
                disabled={!canDeploy || isDeploying}
                size="lg"
                className="min-w-[200px]"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Deploy Agent
                  </>
                )}
              </Button>
            </div>

            {/* Deployment Status */}
            {deploymentStatus && (
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    {deploymentStatus.includes("✅") ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : deploymentStatus.includes("❌") ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    <span className="text-sm">{deploymentStatus}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select
                  value={deploymentConfig.network}
                  onValueChange={(value: "testnet" | "mainnet") => 
                    setDeploymentConfig(prev => ({ ...prev, network: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="testnet">Testnet (Atlantic-2)</SelectItem>
                    <SelectItem value="mainnet">Mainnet (Pacific-1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gasLimit">Gas Limit</Label>
                <Input
                  id="gasLimit"
                  type="number"
                  value={deploymentConfig.gasLimit}
                  onChange={(e) => setDeploymentConfig(prev => ({ 
                    ...prev, 
                    gasLimit: e.target.value 
                  }))}
                  placeholder="200000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gasPrice">Gas Price (usei/gwei)</Label>
                <Input
                  id="gasPrice"
                  type="number"
                  step="0.001"
                  value={deploymentConfig.gasPrice}
                  onChange={(e) => setDeploymentConfig(prev => ({ 
                    ...prev, 
                    gasPrice: e.target.value 
                  }))}
                  placeholder="0.025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">Memo (Optional)</Label>
                <Input
                  id="memo"
                  value={deploymentConfig.memo || ""}
                  onChange={(e) => setDeploymentConfig(prev => ({ 
                    ...prev, 
                    memo: e.target.value 
                  }))}
                  placeholder="Deployment memo"
                />
              </div>
            </div>

            {/* Current Configuration Display */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Network:</strong> {deploymentConfig.network}</div>
                  <div><strong>Gas Limit:</strong> {deploymentConfig.gasLimit}</div>
                  <div><strong>Gas Price:</strong> {deploymentConfig.gasPrice}</div>
                  <div><strong>Estimated Cost:</strong> {
                    Math.ceil(parseFloat(deploymentConfig.gasLimit) * parseFloat(deploymentConfig.gasPrice))
                  } usei</div>
                  {deploymentConfig.memo && <div><strong>Memo:</strong> {deploymentConfig.memo}</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            {deploymentResult ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Deployment Successful
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Transaction Hash</Label>
                      <div className="font-mono text-sm bg-white p-2 rounded border">
                        {deploymentResult.transactionHash}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Network</Label>
                      <Badge variant="outline">{deploymentResult.network}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Gas Used</Label>
                      <div className="text-sm">{deploymentResult.gasUsed}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Block Height</Label>
                      <div className="text-sm">{deploymentResult.height || deploymentResult.blockNumber}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Label className="text-sm font-medium">Deployment Type</Label>
                    <Badge variant="secondary" className="ml-2">
                      {deploymentResult.type === "cosmwasm" ? "CosmWasm" : "EVM"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground py-8">
                    <Rocket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No deployments yet</p>
                    <p className="text-xs">Deploy your first agent to see results here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
