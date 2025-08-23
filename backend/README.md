# SEI Sentinel Backend

Backend for SEI Sentinel No-Code Studio with Sei blockchain integration.

## Features

- **Agent Management**: Create, deploy, and manage AI agents
- **Sei Blockchain Integration**: Mint agent NFTs and interact with Sei testnet
- **No-Code Studio Support**: Handle visual agent builder deployments
- **Real-time Updates**: WebSocket support for live agent monitoring
- **Battle System**: AI agent vulnerability scanning and competition

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Sei MCP Server Configuration
SEI_MCP_URL=http://localhost:3001
AGENT_NFT_CONTRACT=0xYourAgentNFTContractAddress

# Sei Network Configuration
SEI_NETWORK=sei-testnet
SEI_RPC_URL=https://rpc-testnet.sei.io
```

### 3. Start Development Server

```bash
npm run dev
```

The backend will be available at `http://localhost:4000`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Agent Management

- `POST /api/agents/create` - Create and deploy a new agent
- `POST /api/agents/deploy` - Deploy agent from visual builder
- `GET /api/agents/:id` - Get agent by ID
- `GET /api/agents` - Get all agents
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `POST /api/agents/:id/execute-task` - Execute agent task

### Sei Integration

- `POST /api/sei/*` - Sei MCP server integration endpoints

### System Status

- `GET /api/status` - Backend status and feature availability

## Architecture

### Core Components

- **AgentService**: Business logic for agent management
- **AgentRoutes**: RESTful API endpoints
- **SeiMcpIntegration**: Blockchain interaction layer
- **AgentManager**: Agent lifecycle management
- **BattleEngine**: AI agent competition system

### Data Flow

1. **Frontend** → Visual Agent Builder creates agent workflow
2. **Backend** → Receives workflow data via `/api/agents/deploy`
3. **AgentService** → Processes workflow and creates agent configuration
4. **Sei Integration** → Mints NFT on Sei blockchain
5. **Response** → Returns deployment status with NFT details

## Development

### Prerequisites

- Node.js 16+
- Sei MCP Server running (for blockchain integration)
- Deployed Agent NFT contract on Sei testnet

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **MCP Server Connection Failed**
   - Ensure Sei MCP server is running on configured URL
   - Check network connectivity and firewall settings

2. **Agent NFT Contract Error**
   - Verify contract address in environment variables
   - Ensure contract is deployed and accessible on Sei testnet

3. **CORS Issues**
   - Check FRONTEND_URL configuration
   - Verify frontend is running on expected port

### Logs

The backend provides detailed logging for debugging:

- Agent creation and deployment
- Blockchain transaction status
- Error details and stack traces
- Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
