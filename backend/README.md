# SEI No-Code Studio Backend

A powerful backend runtime for the SEI No-Code Studio that enables users to create, deploy, and manage blockchain automation agents without writing code.

## 🚀 Features

### Event-Based Triggers
- **Smart Contract Events**: Listen to SEI blockchain events in real-time
- **Token Transfers**: Monitor wallet transactions and token movements
- **Block Events**: React to new block confirmations
- **WebSocket Integration**: Real-time event streaming

### Smart Contract Interaction
- **Cubist Integration**: Simplified smart contract read/write operations
- **Gas Management**: Automatic gas estimation and optimization
- **Contract Deployment**: Deploy new contracts from WASM bytecode
- **State Queries**: Read contract state and balances

### Market Data Integration
- **Live SEI Price**: Real-time SEI/USD price feeds
- **Market Statistics**: Volume, market cap, and price history
- **Exchange Rates**: Multi-currency conversion rates
- **Network Stats**: SEI blockchain metrics

### Predefined Templates
- **Token Activity Monitor**: Alert on large transfers
- **AI Wallet Balance Reporter**: AI-powered portfolio insights
- **Price Monitor**: Real-time price tracking
- **Contract Reader/Writer**: Smart contract interaction
- **Contract Deployer**: Deploy new contracts

### User-Friendly Deployment
- **Drag & Drop**: Visual flow builder integration
- **Template Library**: Pre-built automation patterns
- **One-Click Deploy**: Instant agent activation
- **Runtime Management**: Start, stop, and monitor agents

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   No-Code UI    │    │   Agent Runtime  │    │   SEI Network   │
│                 │◄──►│                  │◄──►│                 │
│  Flow Builder   │    │  Template Engine │    │  Smart Contracts│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Event System   │
                       │                  │
                       │  WebSocket Feeds │
                       │  Market Data     │
                       │  Notifications   │
                       └──────────────────┘
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   # Or for development:
   npm run dev
   ```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# SEI Network Configuration
SEI_RPC=https://sei-testnet-rpc.polkachu.com
SEI_WS=wss://sei-testnet-rpc.polkachu.com/websocket
SEI_CHAIN_ID=sei-testnet

# Cubist Configuration
CUBIST_PROJECT_ID=your_project_id
CUBIST_API_KEY=your_api_key

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Test Configuration
TEST_WALLET=sei1testwalletaddress...
```

## 🔧 Usage

### Starting the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

### API Endpoints

#### Health Check
```bash
GET /api/nocode/health
```

#### Agent Management
```bash
# Deploy a new agent
POST /api/nocode/agents/deploy
{
  "name": "My Token Monitor",
  "nodes": [
    {
      "type": "tokenActivityMonitor",
      "config": {
        "wallet": "sei1...",
        "threshold": 1000,
        "email": "alerts@example.com"
      }
    }
  ]
}

# Get all agents
GET /api/nocode/agents

# Get agent status
GET /api/nocode/agents/{agentId}

# Stop agent
POST /api/nocode/agents/{agentId}/stop

# Start agent
POST /api/nocode/agents/{agentId}/start

# Delete agent
DELETE /api/nocode/agents/{agentId}
```

#### Market Data
```bash
# Get current SEI price
GET /api/nocode/market/sei/price

# Get comprehensive market data
GET /api/nocode/market/sei/data
```

#### Contract Interaction
```bash
# Read contract state
POST /api/nocode/contracts/{address}/read
{
  "query": { "balance": { "address": "sei1..." } }
}

# Get wallet balance
GET /api/nocode/wallets/{address}/balance
```

#### Templates
```bash
# Get available templates
GET /api/nocode/templates

# Validate flow configuration
POST /api/nocode/flows/validate
{
  "name": "My Flow",
  "nodes": [...]
}
```

## 🎯 Template Examples

### Token Activity Monitor
```json
{
  "type": "tokenActivityMonitor",
  "config": {
    "wallet": "sei1...",
    "threshold": 500,
    "email": "alerts@example.com",
    "alertTypes": ["incoming", "outgoing"],
    "cooldownMinutes": 5
  }
}
```

### AI Wallet Balance Reporter
```json
{
  "type": "aiWalletBalance",
  "config": {
    "wallet": "sei1...",
    "email": "reports@example.com",
    "scheduled": true,
    "reportFrequency": "daily",
    "includeAIInsights": true
  }
}
```

### Price Monitor
```json
{
  "type": "priceMonitor",
  "config": {
    "intervalMs": 30000,
    "callback": "priceUpdateHandler"
  }
}
```

## 🔌 Integration

### Frontend Integration
The backend is designed to work seamlessly with the SEI No-Code Studio frontend:

```typescript
// Example frontend integration
const deployAgent = async (flowJson: FlowJson) => {
  const response = await fetch('/api/nocode/agents/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flowJson)
  });
  
  return await response.json();
};
```

### WebSocket Events
The backend emits real-time events for monitoring:

```typescript
// Connect to WebSocket for real-time updates
const ws = new WebSocket('ws://localhost:4000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'agent_deployed':
      console.log('Agent deployed:', data.agentId);
      break;
    case 'transfer_detected':
      console.log('Transfer:', data.amount, 'SEI');
      break;
    case 'price_update':
      console.log('SEI Price:', data.price);
      break;
  }
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- agentRuntime.test.ts
```

## 📚 API Documentation

### Flow JSON Schema
```typescript
interface FlowJson {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
}

interface FlowNode {
  id: string;
  type: string;
  config: any;
  position: { x: number; y: number };
}
```

### Agent Status
```typescript
interface DeployedAgent {
  id: string;
  flowId: string;
  status: "running" | "stopped" | "error";
  startTime: string;
  stopTime?: string;
  error?: string;
  instance: any;
}
```

## 🚨 Error Handling

The backend includes comprehensive error handling:

- **Validation Errors**: Invalid flow configurations
- **Network Errors**: SEI RPC connection issues
- **Contract Errors**: Smart contract interaction failures
- **Runtime Errors**: Agent execution issues

All errors are logged and returned with appropriate HTTP status codes.

## 🔒 Security

- **Input Validation**: All user inputs are validated
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Configurable cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## 📈 Monitoring

The backend provides monitoring endpoints:

```bash
# Get agent statistics
GET /api/nocode/agents/stats/overview

# Health check with detailed status
GET /api/nocode/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: This README and inline code comments
- **Community**: SEI Discord/Telegram channels

## 🔮 Roadmap

- [ ] Additional template types
- [ ] Advanced AI integration
- [ ] Multi-chain support
- [ ] Performance optimizations
- [ ] Enhanced monitoring
- [ ] Plugin system
