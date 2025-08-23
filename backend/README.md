# SEI Sentinel Backend

A robust backend for the SEI Sentinel No-Code Studio that enables users to create, deploy, and manage AI agents on the Sei blockchain.

## 🚀 Features

- **Agent Management**: Create, read, update, delete AI agents
- **Sei Blockchain Integration**: Mint agent NFTs and record on-chain data
- **Real-time Communication**: WebSocket support for live updates
- **Task Execution**: Execute agent tasks with simulated results
- **RESTful API**: Comprehensive API endpoints for frontend integration
- **TypeScript**: Full type safety and modern development experience

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Sei testnet access
- sei-mcp-server running locally or remotely

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:

   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # Sei Blockchain Configuration
   SEI_NETWORK=sei-testnet
   SEI_RPC_URL=https://rpc-testnet.sei.io
   SEI_CHAIN_ID=sei-testnet-1

   # Sei MCP Server Configuration
   SEI_MCP_URL=http://localhost:3001

   # Smart Contract Addresses (Deploy these contracts on Sei testnet first)
   AGENT_NFT_CONTRACT=0xYourAgentNFTContractAddress
   MEMORY_ANCHOR_CONTRACT=0xYourMemoryAnchorContractAddress

   # Security Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Required Environment Variables

- `SEI_MCP_URL`: URL of your running sei-mcp-server
- `AGENT_NFT_CONTRACT`: Address of your deployed Agent NFT contract on Sei testnet
- `SEI_NETWORK`: Target Sei network (sei-testnet or sei-mainnet)

### Optional Environment Variables

- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment mode (development/production)
- `SEI_RPC_URL`: Sei RPC endpoint
- `MEMORY_ANCHOR_CONTRACT`: Address of Memory Anchor contract for recording decisions

## 📡 API Endpoints

### Agent Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/agents/create` | Create and deploy a new agent |
| `GET` | `/api/agents` | Get all agents with optional filtering |
| `GET` | `/api/agents/:id` | Get a specific agent by ID |
| `GET` | `/api/agents/owner/:walletAddress` | Get agents by wallet address |
| `PUT` | `/api/agents/:id` | Update an existing agent |
| `DELETE` | `/api/agents/:id` | Delete an agent and burn its NFT |
| `POST` | `/api/agents/:id/execute-task` | Execute a task for an agent |
| `POST` | `/api/agents/:id/activate` | Activate a deployed agent |
| `POST` | `/api/agents/:id/pause` | Pause an active agent |
| `GET` | `/api/agents/stats/overview` | Get agent statistics |
| `POST` | `/api/agents/bulk-deploy` | Deploy multiple agents in batch |

### Existing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Get API status and features |
| `POST` | `/api/scan` | Scan contracts for vulnerabilities |
| `POST` | `/api/battle/reward` | Distribute battle rewards |
| `GET` | `/api/sei/*` | Sei MCP integration endpoints |

## 🎯 Usage Examples

### Creating an Agent

```typescript
const agentConfig = {
  name: "Security Guardian",
  description: "AI agent for smart contract security auditing",
  agentType: "SecurityAuditor",
  ownerWalletAddress: "sei1abc123...def456",
  configuration: {
    targetContracts: ["0x123...", "0x456..."],
    vulnerabilityTypes: ["reentrancy", "access-control"],
    alertThreshold: 0.8
  }
};

const response = await fetch('/api/agents/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(agentConfig)
});

const result = await response.json();
console.log('Agent deployed:', result.agent);
```

### Executing Agent Tasks

```typescript
const taskPayload = {
  contractAddress: "0x789...",
  scanType: "security-audit",
  priority: "high"
};

const response = await fetch(`/api/agents/${agentId}/execute-task`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(taskPayload)
});

const result = await response.json();
console.log('Task result:', result.result);
```

### Getting Agent Statistics

```typescript
const response = await fetch('/api/agents/stats/overview');
const stats = await response.json();

console.log('Total agents:', stats.stats.total);
console.log('By status:', stats.stats.byStatus);
console.log('By type:', stats.stats.byType);
```

## 🔌 Sei Integration

The backend integrates with the Sei blockchain through:

1. **sei-mcp-server**: For blockchain interactions
2. **Agent NFT Contract**: For minting agent NFTs
3. **Memory Anchor Contract**: For recording agent decisions

### Smart Contract Requirements

You need to deploy these contracts on Sei testnet:

1. **AgentNFT Contract**: ERC721 contract for agent NFTs
2. **Memory Anchor Contract**: For recording agent decisions and audit results

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📊 Monitoring

The backend provides real-time monitoring through:

- **WebSocket connections** for live updates
- **Comprehensive logging** for debugging
- **API status endpoint** for health checks
- **Agent statistics** for performance monitoring

## 🚨 Error Handling

The backend includes comprehensive error handling:

- **Validation errors** for invalid input
- **Blockchain errors** for failed transactions
- **Database errors** for storage issues
- **Network errors** for external service failures

## 🔒 Security Features

- **Input validation** for all API endpoints
- **Wallet address validation** for Sei addresses
- **Rate limiting** to prevent abuse
- **CORS configuration** for frontend security
- **Environment variable protection** for sensitive data

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include logs and error messages
4. Provide steps to reproduce the problem

## 🔮 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication and authorization
- [ ] Advanced agent scheduling
- [ ] Multi-chain support
- [ ] Agent marketplace
- [ ] Advanced analytics dashboard
