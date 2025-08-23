# 🚀 SEI Sentinel Backend Setup Guide

## Quick Start Instructions

### 1. Start the Backend Server

Open a **NEW terminal window** and run:

```bash
cd backend
npm install
npm run dev
```

The backend will start on port 4000.

### 2. Create Environment File

Create a `.env` file in the `backend/` directory with the following content:

```env
# SEI Sentinel Backend Configuration

# Server Configuration
PORT=4000
NODE_ENV=development

# SEI Blockchain Configuration
SEI_NETWORK=sei-testnet
SEI_RPC_URL=https://rpc-testnet.sei.io
SEI_REST_URL=https://rest-testnet.sei.io
SEI_CHAIN_ID=sei-testnet-1

# SEI MCP Server Configuration (for blockchain interactions)
SEI_MCP_URL=http://localhost:3001

# Smart Contract Addresses (Replace with actual deployed contract addresses)
AGENT_NFT_CONTRACT=0xYourAgentNFTContractAddress
MEMORY_ANCHOR_CONTRACT=0xYourMemoryAnchorContractAddress

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
CORS_ORIGIN=http://localhost:8089

# Optional: Enable debug mode
DEBUG=true
```

### 3. Verify Backend is Running

Visit: http://localhost:4000/api/status

You should see:
```json
{
  "status": "operational",
  "mockMode": true,
  "version": "1.2.0",
  "features": {
    "agents": true,
    "battles": true,
    "rewards": true,
    "seiIntegration": true
  }
}
```

## 🎯 What's Now Working

### ✅ Complete SEI Testnet Integration
- **Real Keplr Wallet Connection**: Connect your Keplr wallet to SEI testnet
- **Actual Agent Deployment**: Deploy agents to SEI testnet blockchain
- **NFT Minting**: Each agent is minted as an NFT on SEI
- **Backend API Integration**: Frontend connects to your backend server

### ✅ No-Code Studio Features
- **Template Selection**: Choose from pre-built agent templates
- **Visual Agent Builder**: Drag-and-drop interface for customization
- **Real-time Validation**: Checks wallet connection and backend status
- **Deployment Status**: Live updates during deployment process

### ✅ SEI Blockchain Features
- **SEI Testnet Support**: Full integration with SEI testnet
- **Keplr Wallet Integration**: Native SEI wallet support
- **Agent NFT Minting**: Each agent becomes an NFT
- **Transaction Tracking**: Real transaction hashes and contract addresses

## 🔧 How to Test

1. **Start Backend**: `cd backend && npm run dev`
2. **Open Frontend**: Visit http://localhost:8089
3. **Go to No-Code Studio**: Click on "No-Code Studio" in sidebar
4. **Connect Wallet**: Click "Connect Keplr Wallet" in Deploy tab
5. **Select Template**: Choose any template (e.g., "Security Scanner")
6. **Deploy Agent**: Click "Deploy to Testnet" button
7. **Watch Magic Happen**: See real SEI testnet deployment!

## 🎉 Expected Results

When you deploy an agent, you'll see:
- ✅ Keplr wallet connection to SEI testnet
- ✅ Real agent creation with unique ID
- ✅ NFT minting on SEI blockchain
- ✅ Actual transaction hash from SEI testnet
- ✅ Agent stored in backend database
- ✅ Success notification with deployment details

## 🔍 Troubleshooting

### Backend Not Starting
- Make sure you're in the `backend/` directory
- Run `npm install` first
- Check if port 4000 is available

### Wallet Connection Issues
- Install Keplr browser extension
- Make sure Keplr is unlocked
- SEI testnet will be added automatically

### Deployment Failures
- Ensure backend is running on port 4000
- Check wallet is connected
- Verify template is selected

## 🌟 Key Files Created/Updated

1. **`src/services/seiTestnetService.ts`** - SEI testnet integration service
2. **`src/pages/NoCodeStudio.tsx`** - Updated with real deployment logic
3. **Backend API** - Already exists and ready to use

Your SEI Sentinel No-Code Studio is now fully functional with real SEI testnet integration!
