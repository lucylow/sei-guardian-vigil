import fetch from "node-fetch";

export async function getSeiPrice() {
  try {
    const res = await fetch("https://api.coincap.io/v2/assets/sei");
    const data = await res.json();
    return parseFloat(data.data.priceUsd);
  } catch (error) {
    console.error("Error fetching SEI price:", error);
    throw error;
  }
}

export async function getSeiMarketData() {
  try {
    const res = await fetch("https://api.coincap.io/v2/assets/sei");
    const data = await res.json();
    return {
      price: parseFloat(data.data.priceUsd),
      marketCap: parseFloat(data.data.marketCapUsd),
      volume24h: parseFloat(data.data.volumeUsd24Hr),
      change24h: parseFloat(data.data.changePercent24Hr),
      rank: data.data.rank,
      supply: parseFloat(data.data.supply),
      maxSupply: data.data.maxSupply ? parseFloat(data.data.maxSupply) : null
    };
  } catch (error) {
    console.error("Error fetching SEI market data:", error);
    throw error;
  }
}

export async function getSeiPriceHistory(days: number = 7) {
  try {
    const endTime = Date.now();
    const startTime = endTime - (days * 24 * 60 * 60 * 1000);
    
    const res = await fetch(
      `https://api.coincap.io/v2/assets/sei/history?interval=d1&start=${startTime}&end=${endTime}`
    );
    const data = await res.json();
    
    return data.data.map((item: any) => ({
      timestamp: item.time,
      price: parseFloat(item.priceUsd),
      volume: parseFloat(item.volumeUsd)
    }));
  } catch (error) {
    console.error("Error fetching SEI price history:", error);
    throw error;
  }
}

export async function getSeiExchangeRates() {
  try {
    const res = await fetch("https://api.coincap.io/v2/rates");
    const data = await res.json();
    
    // Filter for SEI-related rates or common currencies
    const seiRates = data.data.filter((rate: any) => 
      rate.id === "sei" || 
      ["usd", "eur", "gbp", "jpy", "cny"].includes(rate.id)
    );
    
    return seiRates.reduce((acc: any, rate: any) => {
      acc[rate.id] = parseFloat(rate.rateUsd);
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
}

export async function getSeiNetworkStats() {
  try {
    // This would typically come from SEI RPC endpoints
    // For now, returning mock data structure
    return {
      totalTransactions: 0,
      activeValidators: 0,
      totalStaked: 0,
      blockHeight: 0,
      averageBlockTime: 0,
      networkStatus: "active"
    };
  } catch (error) {
    console.error("Error fetching SEI network stats:", error);
    throw error;
  }
}

// Real-time price monitoring with WebSocket (alternative to polling)
export function createPriceMonitor(callback: (price: number) => void, intervalMs: number = 30000) {
  let isRunning = false;
  let intervalId: NodeJS.Timeout | null = null;

  const start = () => {
    if (isRunning) return;
    
    isRunning = true;
    intervalId = setInterval(async () => {
      try {
        const price = await getSeiPrice();
        callback(price);
      } catch (error) {
        console.error("Price monitoring error:", error);
      }
    }, intervalMs);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isRunning = false;
  };

  return { start, stop, isRunning: () => isRunning };
}
