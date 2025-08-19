import { listenForSEITransfers } from "../services/eventTriggers.js";
import nodemailer from "nodemailer";

export interface TokenMonitorConfig {
  wallet: string;
  threshold: number;
  email: string;
  alertTypes?: string[];
  cooldownMinutes?: number;
}

export function tokenActivityMonitor(config: TokenMonitorConfig) {
  const { wallet, threshold, email, alertTypes = ["incoming", "outgoing"], cooldownMinutes = 5 } = config;
  
  let lastAlertTime = 0;
  const cooldownMs = cooldownMinutes * 60 * 1000;

  console.log(`🚀 Starting token activity monitor for wallet: ${wallet}`);
  console.log(`📊 Threshold: ${threshold} SEI`);
  console.log(`📧 Alerts will be sent to: ${email}`);

  const ws = listenForSEITransfers(wallet, async (events: any) => {
    try {
      const transferAmount = parseFloat(events["transfer.amount"]?.[0]?.replace("usei", "") || "0") / 1e6;
      const sender = events["transfer.sender"]?.[0];
      const recipient = events["transfer.recipient"]?.[0];
      
      console.log(`📡 Transfer detected: ${transferAmount} SEI from ${sender} to ${recipient}`);

      // Check if amount exceeds threshold
      if (transferAmount > threshold) {
        const now = Date.now();
        
        // Check cooldown to prevent spam
        if (now - lastAlertTime > cooldownMs) {
          const isIncoming = recipient === wallet;
          const isOutgoing = sender === wallet;
          
          if ((isIncoming && alertTypes.includes("incoming")) || 
              (isOutgoing && alertTypes.includes("outgoing"))) {
            
            await sendAlert(email, {
              wallet,
              amount: transferAmount,
              type: isIncoming ? "incoming" : "outgoing",
              sender,
              recipient,
              timestamp: new Date().toISOString()
            });
            
            lastAlertTime = now;
          }
        }
      }
    } catch (error) {
      console.error("Error processing transfer event:", error);
    }
  });

  return {
    stop: () => {
      console.log("🛑 Stopping token activity monitor");
      ws.close();
    },
    updateConfig: (newConfig: Partial<TokenMonitorConfig>) => {
      Object.assign(config, newConfig);
      console.log("⚙️ Updated token monitor configuration:", config);
    }
  };
}

async function sendAlert(email: string, transferData: any) {
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

    const subject = `⚡ SEI Alert: ${transferData.type.toUpperCase()} Transfer Detected`;
    const message = `
🚨 SEI Token Activity Alert

Wallet: ${transferData.wallet}
Amount: ${transferData.amount} SEI
Type: ${transferData.type}
Sender: ${transferData.sender}
Recipient: ${transferData.recipient}
Time: ${transferData.timestamp}

This transfer exceeded your threshold of ${transferData.threshold} SEI.

---
SEI Guardian Vigil - No-Code Studio
    `;

    await transporter.sendMail({
      from: "alerts@sei-nocode.app",
      to: email,
      subject: subject.trim(),
      text: message.trim(),
    });

    console.log(`📧 Alert sent to ${email} for ${transferData.amount} SEI transfer`);
  } catch (error) {
    console.error("Failed to send email alert:", error);
  }
}

// Alternative notification methods
export async function sendDiscordWebhook(webhookUrl: string, transferData: any) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "⚡ SEI Transfer Alert",
          description: `Large transfer detected on wallet ${transferData.wallet}`,
          fields: [
            { name: "Amount", value: `${transferData.amount} SEI`, inline: true },
            { name: "Type", value: transferData.type, inline: true },
            { name: "Sender", value: transferData.sender, inline: false },
            { name: "Recipient", value: transferData.recipient, inline: false }
          ],
          color: transferData.amount > 1000 ? 0xFF0000 : 0xFFA500,
          timestamp: transferData.timestamp
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
  }
}

export async function sendTelegramMessage(botToken: string, chatId: string, transferData: any) {
  try {
    const message = `🚨 SEI Alert: ${transferData.amount} SEI ${transferData.type} transfer on wallet ${transferData.wallet}`;
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML"
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}
