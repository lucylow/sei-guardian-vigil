import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { sendETH } from "@goat-sdk/wallet-evm";
import { erc721 } from "@goat-sdk/plugin-erc721";

class AutonomousAgentActions {
  constructor() {
    this.walletTools = null;
    this.initializeGoat();
  }

  async initializeGoat() {
    this.walletTools = getOnChainTools({
      wallet: process.env.AGENT_WALLET_PRIVATE_KEY,
      plugins: [erc721()],
      chain: "sei"
    });
  }

  async autonomousMintReward(agentId, achievementType) {
    try {
      const mintResult = await this.walletTools.erc721.mint({
        contractAddress: process.env.ACHIEVEMENT_NFT_CONTRACT,
        to: this.getAgentWallet(agentId),
        tokenURI: this.generateAchievementMetadata(achievementType)
      });

      return {
        success: true,
        txHash: mintResult.hash,
        achievement: achievementType
      };
    } catch (error) {
      console.error("Autonomous minting failed:", error);
      return { success: false, error: error.message };
    }
  }

  async autonomousReward(agentId, amount, reason) {
    try {
      const transfer = await this.walletTools.sendETH({
        to: this.getAgentWallet(agentId),
        amount: amount.toString(),
      });

      return {
        success: true,
        txHash: transfer.hash,
        amount,
        reason
      };
    } catch (error) {
      console.error("Autonomous reward failed:", error);
      return { success: false, error: error.message };
    }
  }

  generateAchievementMetadata(type) {
    const achievements = {
      "first-kill": {
        name: "First Blood",
        description: "Defeated your first vulnerability monster",
        image: "/achievements/first-kill.png",
        rarity: "common"
      },
      "speed-demon": {
        name: "Speed Demon", 
        description: "Completed scan in under 200ms",
        image: "/achievements/speed-demon.png",
        rarity: "rare"
      },
      "legendary-hunter": {
        name: "Legendary Hunter",
        description: "Defeated 100+ vulnerability monsters", 
        image: "/achievements/legendary-hunter.png",
        rarity: "legendary"
      }
    };

    return `data:application/json,${encodeURIComponent(JSON.stringify(achievements[type]))}`;
  }
}

export default AutonomousAgentActions;