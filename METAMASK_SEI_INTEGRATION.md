# MetaMask + Sei Network Integration Guide

This guide explains how to connect MetaMask wallet to the Sei EVM network and troubleshoot common connection issues.

## 🚀 Quick Start

1. **Install MetaMask** - Download from [metamask.io](https://metamask.io/download/)
2. **Navigate to `/metamask-demo`** - Use our dedicated demo page
3. **Add Sei Network** - Click "Add Sei EVM Network" button
4. **Connect Wallet** - Click "Connect MetaMask" and approve in MetaMask

## 🔧 Network Configuration

### Sei EVM Network Details
- **Network Name**: Sei EVM
- **Chain ID**: 713715 (0xAE4C3)
- **Currency Symbol**: SEI
- **Decimals**: 18
- **RPC URL**: `https://evm-rpc.sei.juno.deuslabs.fi`
- **Block Explorer**: `https://sei.evmscan.io`

## 📱 Manual Network Addition

If the automatic network addition fails, you can manually add Sei network to MetaMask:

1. Open MetaMask
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network"
4. Click "Add a network manually"
5. Fill in the details:
   - **Network Name**: Sei EVM
   - **New RPC URL**: `https://evm-rpc.sei.juno.deuslabs.fi`
   - **Chain ID**: `713715`
   - **Currency Symbol**: `SEI`
   - **Block Explorer URL**: `https://sei.evmscan.io`

## 🛠️ Troubleshooting Common Issues

### 1. "User rejected the request"
**Cause**: You clicked "Reject" in MetaMask
**Solution**: Try connecting again and click "Approve" when prompted

### 2. "Network not found" / "Chain ID not found"
**Cause**: Sei network is not added to MetaMask
**Solution**: Use the "Add Sei EVM Network" button or manually add the network

### 3. "Already processing" / "Request already pending"
**Cause**: MetaMask has a pending request
**Solution**: Check MetaMask extension for pending requests and complete/reject them first

### 4. "Insufficient funds"
**Cause**: No SEI tokens for gas fees
**Solution**: Get testnet SEI from a faucet or transfer some SEI to your wallet

### 5. "MetaMask is not installed"
**Cause**: MetaMask extension is not installed
**Solution**: Install MetaMask from the official website

### 6. "Failed to switch to Sei network"
**Cause**: Network switching failed
**Solution**: Try manually switching networks in MetaMask or refresh the page

## 🔍 Debugging Steps

### Check MetaMask Status
1. Open MetaMask extension
2. Verify it's unlocked
3. Check current network
4. Ensure no pending requests

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check for network-related errors

### Verify Network Connection
1. Check if you can access `https://evm-rpc.sei.juno.deuslabs.fi`
2. Verify your internet connection
3. Check if any firewall/antivirus is blocking the connection

## 🧪 Testing Your Connection

### Test Transaction
1. Connect your wallet
2. Try sending a small amount of SEI to another address
3. Check if the transaction appears in the block explorer

### Check Balance
1. Verify your SEI balance is displayed correctly
2. Check if the balance updates after transactions

### Network Switching
1. Try switching between different networks
2. Verify you can switch back to Sei EVM

## 📚 Additional Resources

- [Sei EVM Documentation](https://docs.sei.io/develop/evm/getting-started)
- [Sei EVM Block Explorer](https://sei.evmscan.io)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Sei Official Website](https://sei.io/)

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check the console** for detailed error messages
2. **Verify MetaMask version** - ensure you have the latest version
3. **Try a different browser** - some browsers have better MetaMask support
4. **Clear browser cache** - sometimes cached data can cause issues
5. **Check MetaMask settings** - ensure all permissions are granted

## 🔒 Security Notes

- Never share your private keys or seed phrases
- Only connect to trusted dApps
- Verify network details before adding custom networks
- Use hardware wallets for large amounts
- Keep MetaMask updated to the latest version

## 📝 Technical Details

### Implementation Files
- `src/components/MetaMaskConnector.tsx` - Main connector component
- `src/lib/metamaskUtils.ts` - Utility functions for MetaMask integration
- `src/lib/seiBlockchain.ts` - Sei blockchain service
- `src/hooks/useSeiBlockchain.ts` - React hook for blockchain operations

### Key Features
- Automatic network detection
- Network switching with fallback
- Comprehensive error handling
- Real-time connection status
- Balance checking
- Transaction support

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Edge
- ✅ Brave
- ⚠️ Safari (limited support)

## 🎯 Best Practices

1. **Always verify network details** before connecting
2. **Use testnet first** to test functionality
3. **Keep small amounts** in hot wallets
4. **Regularly backup** your MetaMask accounts
5. **Monitor transactions** in the block explorer
6. **Stay updated** with Sei network changes

---

For more detailed technical information, check the source code and component documentation in the project.
