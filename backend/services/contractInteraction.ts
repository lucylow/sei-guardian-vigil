import { cubist } from "@cubist-labs/sdk";
import { env, getSeiRpcUrl } from "../config/environment.js";

export async function readContract(contractAddr: string, queryMsg: any) {
  try {
    const client = await cubist.getCosmWasmClient(getSeiRpcUrl());
    return await client.queryContractSmart(contractAddr, queryMsg);
  } catch (error) {
    console.error("Error reading contract:", error);
    throw error;
  }
}

export async function writeContract(contractAddr: string, execMsg: any) {
  try {
    const signer = await cubist.getSigner(); // Cubist manages keys & gas
    const client = await cubist.getSigningCosmWasmClient(getSeiRpcUrl(), signer);

    const tx = await client.execute(signer.address, contractAddr, execMsg, "auto");
    return tx.transactionHash;
  } catch (error) {
    console.error("Error writing to contract:", error);
    throw error;
  }
}

// Get contract balance
export async function getContractBalance(contractAddr: string) {
  try {
    const client = await cubist.getCosmWasmClient(getSeiRpcUrl());
    const balance = await client.getBalance(contractAddr, "usei");
    return balance;
  } catch (error) {
    console.error("Error getting contract balance:", error);
    throw error;
  }
}

// Get wallet balance
export async function getWalletBalance(walletAddr: string) {
  try {
    const client = await cubist.getCosmWasmClient(getSeiRpcUrl());
    const balance = await client.getBalance(walletAddr, "usei");
    return balance;
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    throw error;
  }
}

// Deploy new contract
export async function deployContract(wasmByteCode: Buffer, initMsg: any) {
  try {
    const signer = await cubist.getSigner();
    const client = await cubist.getSigningCosmWasmClient(getSeiRpcUrl(), signer);
    
    const uploadResult = await client.upload(signer.address, wasmByteCode, "auto");
    const contractAddr = await client.instantiate(
      signer.address,
      uploadResult.codeId,
      initMsg,
      "SEI No-Code Studio Contract",
      "auto"
    );
    
    return {
      codeId: uploadResult.codeId,
      contractAddress: contractAddr.contractAddress,
      transactionHash: uploadResult.transactionHash
    };
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  }
}

// Query contract state
export async function queryContractState(contractAddr: string) {
  try {
    const client = await cubist.getCosmWasmClient(getSeiRpcUrl());
    const contractInfo = await client.getContract(contractAddr);
    return contractInfo;
  } catch (error) {
    console.error("Error querying contract state:", error);
    throw error;
  }
}
