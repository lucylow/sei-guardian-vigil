import { useAccount, useSignMessage } from 'wagmi';
import { CookieSDK } from '@cookie-dot-fun/sdk';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function CookieFunConnect() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleCookieAction = async () => {
    if (!isConnected) return;
    const cookie = new CookieSDK({
      apiKey: process.env.REACT_APP_COOKIE_API_KEY,
      signer: signMessageAsync
    });

    try {
      const data = await cookie.getAgentData('COOKIE', address);
      if (data.holdsToken) {
        const premiumData = await cookie.getPremiumContent();
        console.log('Premium Data:', premiumData);
      } else {
        console.log('Agent Data:', data);
      }
    } catch (error) {
      console.error('cookie.fun error:', error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <button onClick={handleCookieAction} className="bg-yellow-400 px-4 py-2 rounded font-bold">
          Access cookie.fun
        </button>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
