# 🔑 SEI SENTINEL - Complete API Keys Integration Guide

## 📋 **Overview**
This document outlines all required API keys and environment variables for the complete SEI SENTINEL stack, including their purpose, usage, and integration points.

## 🚨 **Critical Missing API Keys (Previously Not Integrated)**

### 1. **HIVE_INTELLIGENCE_MCP_API_KEY**
- **Status**: ✅ **NOW INTEGRATED** (New service created)
- **Purpose**: Access to Hive Intelligence's real-time data & memory layer
- **Usage**: Agent reasoning, event processing, contract audit memory
- **Integration**: `backend/services/hiveIntelligence.ts`
- **Example Usage**:
```typescript
import { hiveIntelligence } from '../services/hiveIntelligence.js';

// Store contract audit results
await hiveIntelligence.storeContractAudit(contractAddress, auditResult);

// Get security insights
const insights = await hiveIntelligence.getSecurityInsights(contractAddress);
```

### 2. **CROSSMINT_SERVER_API_KEY & CROSSMINT_CLIENT_API_KEY**
- **Status**: ✅ **NOW INTEGRATED** (Environment config updated)
- **Purpose**: NFT minting and identity management
- **Usage**: 
  - **SERVER**: Backend NFT minting (secure)
  - **CLIENT**: Frontend NFT interactions (safe to expose)
- **Integration**: `backend/config/environment.ts`
- **Example Usage**:
```typescript
// Backend (secure)
const serverKey = env.crossmintServerApiKey;

// Frontend (safe)
const clientKey = env.crossmintClientApiKey;
```

### 3. **JWT_SECRET**
- **Status**: ✅ **NOW INTEGRATED** (New auth middleware created)
- **Purpose**: JWT token signing and verification
- **Usage**: API authentication, user sessions
- **Integration**: `backend/middleware/auth.ts`
- **Example Usage**:
```typescript
import { authenticateToken, generateToken } from '../middleware/auth.js';

// Generate token
const token = generateToken(user);

// Verify token (middleware)
app.use('/api/secure', authenticateToken);
```

### 4. **SEI_NETWORK & GOAT_NETWORK**
- **Status**: ✅ **NOW INTEGRATED** (Environment config updated)
- **Purpose**: Network environment selection
- **Usage**: RPC endpoint selection, key management
- **Integration**: `backend/config/environment.ts`
- **Example Usage**:
```typescript
import { getSeiRpcUrl, getSeiWsUrl, isTestnet } from '../config/environment.js';

const rpcUrl = getSeiRpcUrl(); // Automatically selects based on SEI_NETWORK
const wsUrl = getSeiWsUrl();   // Automatically selects based on SEI_NETWORK
```

## 🔧 **Complete Environment Variables List**

### **Required Variables (Will cause startup failure if missing)**
```bash
# HIVE INTELLIGENCE MCP
HIVE_INTELLIGENCE_MCP_API_KEY=your_hive_intelligence_mcp_api_key_here

# CROSSMINT NFT MINTING
CROSSMINT_SERVER_API_KEY=your_crossmint_server_api_key_here
CROSSMINT_CLIENT_API_KEY=your_crossmint_client_api_key_here

# OPENAI AI SERVICES
OPENAI_API_KEY=your_openai_api_key_here

# SEI WALLET PRIVATE KEYS
SEI_TESTNET_PRIVATE_KEY=your_sei_testnet_private_key_here
SEI_MAINNET_PRIVATE_KEY=your_sei_mainnet_private_key_here

# JWT AUTHENTICATION
JWT_SECRET=your_jwt_secret_key_here

# CONTRACT ADDRESSES
AGENT_NFT_CONTRACT=sei1agent_nft_contract_address_here
```

### **Optional Variables (Will use defaults if missing)**
```bash
# SEI BLOCKCHAIN NETWORKS
SEI_NETWORK=testnet
SEI_TESTNET_RPC=https://sei-testnet-rpc.polkachu.com
SEI_MAINNET_RPC=https://sei-rpc.polkachu.com
SEI_TESTNET_WS=wss://sei-testnet-rpc.polkachu.com/websocket
SEI_MAINNET_WS=wss://sei-rpc.polkachu.com/websocket

# GOAT SDK CONFIGURATION
GOAT_NETWORK=sei-testnet

# CUBIST SDK CONFIGURATION
CUBIST_PROJECT_ID=your_cubist_project_id_here
CUBIST_API_KEY=your_cubist_api_key_here

# EMAIL NOTIFICATIONS (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# TESTING & DEVELOPMENT
TEST_WALLET=sei1test_wallet_address_here
NODE_ENV=development
PORT=4000
```

## 🔌 **Integration Points & Usage**

### **1. Backend Services Integration**

#### **Contract Interaction Service**
```typescript
// backend/services/contractInteraction.ts
import { getSeiRpcUrl } from "../config/environment.js";

export async function readContract(contractAddr: string, queryMsg: any) {
  const client = await cubist.getCosmWasmClient(getSeiRpcUrl());
  // ... rest of implementation
}
```

#### **Event Triggers Service**
```typescript
// backend/services/eventTriggers.ts
import { getSeiWsUrl } from "../config/environment.js";

export function listenForSEITransfers(walletAddr: string, callback: Function) {
  const ws = new WebSocket(getSeiWsUrl());
  // ... rest of implementation
}
```

#### **Agent Runtime Service**
```typescript
// backend/services/agentRuntime.ts
import { env } from "../config/environment.js";

case "tokenActivityMonitor":
  return tokenActivityMonitor({
    wallet: node.config.wallet || env.testWallet || "sei1test...",
    // ... rest of config
  });
```

### **2. Authentication & Security**

#### **JWT Middleware**
```typescript
// backend/middleware/auth.ts
import { env } from '../config/environment.js';

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    // Handle JWT errors
  }
}
```

#### **API Key Authentication**
```typescript
// backend/middleware/auth.ts
export function authenticateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;
  
  const validApiKeys = [
    env.crossmintServerApiKey,
    env.crossmintClientApiKey,
    env.hiveIntelligenceMcpApiKey
  ].filter(key => key && key.length > 0);

  if (!validApiKeys.includes(apiKey)) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  
  next();
}
```

### **3. Frontend Integration**

#### **Environment Variables**
```typescript
// Frontend components can access these safely
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const seiRpc = process.env.REACT_APP_SEI_RPC;
const crossmintClientKey = process.env.REACT_APP_CROSSMINT_CLIENT_API_KEY;
```

#### **API Calls with Authentication**
```typescript
// Example frontend API call
const response = await fetch('/api/secure/agents', {
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 🚀 **Setup Instructions**

### **1. Create Environment File**
```bash
# In backend directory
cp .env.example .env
```

### **2. Fill Required Variables**
```bash
# Edit .env file with your actual API keys
HIVE_INTELLIGENCE_MCP_API_KEY=sk_hive_...
CROSSMINT_SERVER_API_KEY=sk_crossmint_server_...
CROSSMINT_CLIENT_API_KEY=sk_crossmint_client_...
OPENAI_API_KEY=sk_openai_...
JWT_SECRET=your_super_secret_jwt_key_here
# ... etc
```

### **3. Validate Configuration**
```bash
# Start the backend - it will validate all required variables
npm run dev
```

## 🔍 **Verification Checklist**

| Component | Status | Verification Method |
|-----------|--------|-------------------|
| **Hive Intelligence** | ✅ Integrated | Service loads without errors |
| **Crossmint Keys** | ✅ Integrated | Environment config validates |
| **JWT Authentication** | ✅ Integrated | Auth middleware works |
| **SEI Network Config** | ✅ Integrated | RPC/WS endpoints resolve |
| **OpenAI Integration** | ✅ Integrated | LLM services work |
| **Contract Interaction** | ✅ Integrated | Blockchain calls succeed |
| **Event Triggers** | ✅ Integrated | WebSocket connections work |

## 🚨 **Security Notes**

1. **NEVER expose private keys to frontend**
2. **SERVER API keys should only be used in backend**
3. **CLIENT API keys are safe for frontend use**
4. **JWT_SECRET must be strong and unique**
5. **Use HTTPS in production for all API calls**

## 📞 **Support & Troubleshooting**

If you encounter issues with API key integration:

1. **Check environment variables are loaded**: `console.log(env)` in backend startup
2. **Verify API key formats**: Ensure no extra spaces or quotes
3. **Check network connectivity**: Test API endpoints manually
4. **Review error logs**: Look for specific authentication failures

## 🔮 **Future Enhancements**

- [ ] API key rotation support
- [ ] Rate limiting per API key
- [ ] Audit logging for API key usage
- [ ] Multi-tenant API key management
- [ ] API key expiration and renewal

---

**✅ All previously missing API keys are now properly integrated and documented!**
