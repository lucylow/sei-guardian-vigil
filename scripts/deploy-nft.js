// Deployment script for AuditCertificateNFT on SEI blockchain
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AuditCertificateNFT to SEI blockchain...");

  // Get the contract factory
  const AuditCertificateNFT = await ethers.getContractFactory("AuditCertificateNFT");
  
  // Deploy the contract
  const auditNFT = await AuditCertificateNFT.deploy();
  
  // Wait for deployment to complete
  await auditNFT.waitForDeployment();
  
  const address = await auditNFT.getAddress();
  console.log(`✅ AuditCertificateNFT deployed to: ${address}`);
  
  // Get deployment info
  const deployment = await auditNFT.deploymentTransaction();
  console.log(`📝 Transaction hash: ${deployment.hash}`);
  
  // Verify the deployment
  console.log("\n🔍 Verifying deployment...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on SEI Explorer");
  } catch (error) {
    console.log("⚠️  Verification failed (this is normal for local networks):", error.message);
  }
  
  // Set up initial configuration
  console.log("\n⚙️  Setting up initial configuration...");
  
  // Get the deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer address: ${deployer.address}`);
  
  // Set the deployer as an authorized minter
  const setMinterTx = await auditNFT.setMinter(deployer.address, true);
  await setMinterTx.wait();
  console.log("✅ Deployer set as authorized minter");
  
  // Display contract information
  console.log("\n📊 Contract Information:");
  console.log(`   Name: ${await auditNFT.name()}`);
  console.log(`   Symbol: ${await auditNFT.symbol()}`);
  console.log(`   Total Certificates: ${await auditNFT.totalCertificates()}`);
  console.log(`   Owner: ${await auditNFT.owner()}`);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "AuditCertificateNFT",
    address: address,
    deployer: deployer.address,
    transactionHash: deployment.hash,
    timestamp: new Date().toISOString(),
    chainId: await deployer.provider.getNetwork().then(net => net.chainId)
  };
  
  // Write to file
  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, '../deployments');
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("   1. Add the contract address to your frontend configuration");
  console.log("   2. Update the audit service to use the deployed contract");
  console.log("   3. Test minting certificates on SEI testnet");
  console.log("   4. Deploy to SEI mainnet when ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
