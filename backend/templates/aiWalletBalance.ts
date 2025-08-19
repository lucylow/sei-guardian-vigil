import { readContract, getWalletBalance } from "../services/contractInteraction.js";
import { getSeiPrice } from "../services/marketData.js";
import nodemailer from "nodemailer";

export interface AIWalletBalanceConfig {
  wallet: string;
  email: string;
  reportFrequency?: "daily" | "weekly" | "monthly";
  includeAIInsights?: boolean;
  customPrompt?: string;
}

export async function aiWalletBalance(config: AIWalletBalanceConfig) {
  const { wallet, email, reportFrequency = "daily", includeAIInsights = true, customPrompt } = config;
  
  console.log(`🤖 Starting AI wallet balance reporter for wallet: ${wallet}`);
  console.log(`📊 Report frequency: ${reportFrequency}`);
  console.log(`📧 Reports will be sent to: ${email}`);

  try {
    // Get wallet balance
    const balance = await getWalletBalance(wallet);
    const seiBalance = parseFloat(balance.amount) / 1e6;
    
    // Get current SEI price
    const seiPrice = await getSeiBalance();
    const usdValue = seiBalance * seiPrice;
    
    // Get additional token balances if available
    const tokenBalances = await getTokenBalances(wallet);
    
    // Generate AI insights if enabled
    let aiInsights = "";
    if (includeAIInsights) {
      aiInsights = await generateAIInsights({
        seiBalance,
        usdValue,
        tokenBalances,
        customPrompt
      });
    }
    
    // Send comprehensive report
    await sendWalletReport(email, {
      wallet,
      seiBalance,
      usdValue,
      seiPrice,
      tokenBalances,
      aiInsights,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📧 Wallet report sent to ${email}`);
    
    return {
      status: "success",
      seiBalance,
      usdValue,
      aiInsights
    };
    
  } catch (error) {
    console.error("Error generating wallet balance report:", error);
    throw error;
  }
}

async function getTokenBalances(wallet: string) {
  try {
    // This would typically query multiple token contracts
    // For now, returning mock data structure
    return [
      {
        symbol: "SEI",
        balance: "1000.0",
        contract: "sei1xxxxbank_contract_here"
      }
      // Add more tokens as needed
    ];
  } catch (error) {
    console.error("Error getting token balances:", error);
    return [];
  }
}

async function generateAIInsights(data: any) {
  try {
    // For now, using a simple template-based approach
    // In production, this would integrate with OpenAI, Anthropic, or local LLM
    
    const insights = [];
    
    // Balance analysis
    if (data.seiBalance > 10000) {
      insights.push("💰 High SEI balance detected - consider staking for passive income");
    } else if (data.seiBalance < 100) {
      insights.push("⚠️ Low SEI balance - consider adding funds for transaction fees");
    }
    
    // Market analysis
    if (data.usdValue > 10000) {
      insights.push("🚀 Significant portfolio value - monitor market conditions");
    }
    
    // Token diversity
    if (data.tokenBalances.length > 1) {
      insights.push("🔄 Good token diversity - portfolio is well distributed");
    } else {
      insights.push("📈 Consider diversifying with other SEI ecosystem tokens");
    }
    
    // Custom insights based on prompt
    if (data.customPrompt) {
      insights.push(`💡 Custom insight: ${data.customPrompt}`);
    }
    
    return insights.join("\n\n");
    
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return "Unable to generate AI insights at this time.";
  }
}

async function sendWalletReport(email: string, reportData: any) {
  try {
    const transporter = nodemailer.createTransporter({ 
      sendmail: true,
      // Alternative configuration for production
      // host: process.env.SMTP_HOST,
      // port: parseInt(process.env.SMTP_PORT || "587"),
      // secure: false,
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASS
      // }
    });

    const subject = `🤖 SEI Wallet Balance Report - ${reportData.wallet}`;
    const message = `
📊 SEI Wallet Balance Report

Wallet Address: ${reportData.wallet}
Report Time: ${reportData.timestamp}

💰 Balance Summary:
- SEI Balance: ${reportData.seiBalance.toFixed(6)} SEI
- USD Value: $${reportData.usdValue.toFixed(2)}
- Current SEI Price: $${reportData.seiPrice.toFixed(4)}

🪙 Token Holdings:
${reportData.tokenBalances.map(token => 
  `  - ${token.symbol}: ${token.balance}`
).join('\n')}

🤖 AI Insights:
${reportData.aiInsights}

---
SEI Guardian Vigil - No-Code Studio
Powered by AI Analysis
    `;

    await transporter.sendMail({
      from: "reports@sei-nocode.app",
      to: email,
      subject: subject.trim(),
      text: message.trim(),
    });

    console.log(`📧 Wallet report sent to ${email}`);
  } catch (error) {
    console.error("Failed to send wallet report:", error);
  }
}

// Scheduled reporting functionality
export function createScheduledReporter(config: AIWalletBalanceConfig) {
  let intervalId: NodeJS.Timeout | null = null;
  
  const start = () => {
    if (intervalId) return;
    
    const frequencyMs = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    }[config.reportFrequency];
    
    console.log(`⏰ Starting scheduled wallet reports every ${config.reportFrequency}`);
    
    // Send initial report
    aiWalletBalance(config);
    
    // Schedule recurring reports
    intervalId = setInterval(() => {
      aiWalletBalance(config);
    }, frequencyMs);
  };
  
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.log("🛑 Stopped scheduled wallet reports");
    }
  };
  
  return { start, stop };
}

// Export for use in other modules
export { aiWalletBalance as default };
