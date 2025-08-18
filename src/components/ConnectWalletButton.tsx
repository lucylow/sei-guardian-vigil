import React, { useState } from "react";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
  }
}

export default function ConnectWalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function connectKeplr() {
    try {
      if (!window.keplr) {
        setError("Keplr wallet is not installed");
        return;
      }

      await window.keplr.experimentalSuggestChain({
        chainId: "atlantic-1",
        chainName: "Sei Testnet (Atlantic)",
        rpc: "https://rpc.atlantic-1.seinetwork.io",
        rest: "https://lcd.atlantic-1.seinetwork.io",
        bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: "sei",
          bech32PrefixAccPub: "seipub",
          bech32PrefixValAddr: "seivaloper",
          bech32PrefixValPub: "seivaloperpub",
          bech32PrefixConsAddr: "seivalcons",
          bech32PrefixConsPub: "seivalconspub"
        },
        currencies: [{
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
        }],
        feeCurrencies: [{
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
          gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 }
        }],
        stakeCurrency: {
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
        },
        features: ["stargate", "ibc-transfer"]
      });

      await window.keplr.enable("atlantic-1");
      const offlineSigner = window.getOfflineSigner("atlantic-1");
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length > 0) setAccount(accounts[0].address);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    }
  }

  return (
    <div>
      {account ? (
        <button className="px-4 py-2 border rounded bg-green-100 text-green-800" disabled>
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </button>
      ) : (
        <button
          onClick={connectKeplr}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
}
