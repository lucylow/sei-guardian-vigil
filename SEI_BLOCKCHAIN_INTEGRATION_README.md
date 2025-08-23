# SEI Blockchain Integration for SEI Sentinel

This document explains how to use the comprehensive SEI blockchain integration system that enables on-chain governance, voting, and smart contract interactions.

## 🚀 Features

- **Dual Wallet Support**: CosmWasm (native SEI) and EVM (MetaMask/Compass)
- **On-Chain Governance**: Submit proposals, vote, and execute governance decisions
- **Real-time Blockchain Data**: Live network status, block height, and transaction monitoring
- **Multi-Network Support**: Mainnet, Testnet, and EVM networks
- **Smart Contract Integration**: Direct interaction with CosmWasm governance contracts

## 📦 Installation

Install the required dependencies:

```bash
npm install @cosmjs/cosmwasm-stargate @cosmjs/proto-signing @cosmjs/stargate ethers
```

## 🔧 Setup

### 1. Import the Blockchain Service

```typescript
import { useSeiBlockchain } from '@/hooks/useSeiBlockchain';
```

### 2. Use the Hook in Your Component

```typescript
function MyComponent() {
  const {
    wallet,
    networkStatus,
    currentNetwork,
    connectCosmWasmWallet,
    connectEVMWallet,
    submitGovernanceProposal,
    voteOnProposal,
    // ... other functions
  } = useSeiBlockchain();

  // Your component logic
}
```

## 💼 Wallet Connection

### CosmWasm Wallet (Native SEI)

```typescript
const handleConnectCosmWasm = async () => {
  try {
    const mnemonic = "your twelve word mnemonic phrase here";
    const connection = await connectCosmWasmWallet(mnemonic);
    console.log('Connected:', connection.address);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

### EVM Wallet (MetaMask/Compass)

```typescript
const handleConnectEVM = async () => {
  try {
    const { address } = await connectEVMWallet();
    console.log('Connected:', address);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

## 🏛️ Governance Functions

### Submit a New Proposal

```typescript
const handleSubmitProposal = async () => {
  try {
    const result = await submitGovernanceProposal(
      "sei1contractaddress...", // Contract address
      "Proposal Title",
      "Detailed description of the proposal",
      "Optional metadata"
    );
    console.log('Proposal submitted:', result);
  } catch (error) {
    console.error('Failed to submit:', error);
  }
};
```

### Vote on a Proposal

```typescript
const handleVote = async (proposalId: number, vote: 'yes' | 'no' | 'abstain') => {
  try {
    const result = await voteOnProposal(
      "sei1contractaddress...", // Contract address
      proposalId,
      vote,
      "Vote metadata"
    );
    console.log('Vote submitted:', result);
  } catch (error) {
    console.error('Failed to vote:', error);
  }
};
```

### Execute a Passed Proposal

```typescript
const handleExecuteProposal = async (proposalId: number) => {
  try {
    const result = await executeProposal(
      "sei1contractaddress...", // Contract address
      proposalId
    );
    console.log('Proposal executed:', result);
  } catch (error) {
    console.error('Failed to execute:', error);
  }
};
```

## 📊 Query Functions

### Get Governance Proposals

```typescript
const loadProposals = async () => {
  try {
    const proposals = await getGovernanceProposals(
      "sei1contractaddress...", // Contract address
      undefined, // startAfter (optional)
      50 // limit
    );
    console.log('Proposals:', proposals);
  } catch (error) {
    console.error('Failed to load proposals:', error);
  }
};
```

### Get Account Balance

```typescript
const getBalance = async (address: string) => {
  try {
    const balance = await getAccountBalance(address);
    console.log('Balance:', balance);
  } catch (error) {
    console.error('Failed to get balance:', error);
  }
};
```

### Get Network Status

```typescript
const checkNetwork = async () => {
  try {
    const status = await getNetworkStatus();
    console.log('Network:', status);
  } catch (error) {
    console.error('Failed to get network status:', error);
  }
};
```

## 🌐 Network Management

### Switch Networks

```typescript
const handleNetworkSwitch = async (network: 'mainnet' | 'testnet' | 'evm') => {
  try {
    await switchNetwork(network);
    console.log('Switched to:', network);
  } catch (error) {
    console.error('Failed to switch network:', error);
  }
};
```

### Available Networks

- **Mainnet**: `https://rpc.sei.juno.deuslabs.fi`
- **Testnet**: `https://testnet-rpc.sei.juno.deuslabs.fi`
- **EVM**: `https://evm-rpc.sei.juno.deuslabs.fi`

## 🔍 Smart Contract Integration

### Contract ABI

The system includes a predefined ABI for governance contracts:

```typescript
export const GOVERNANCE_CONTRACT_ABI = {
  // Query messages
  get_proposal: { get_proposal: { proposal_id: "number" } },
  get_proposals: { get_proposals: { start_after: "string", limit: "number" } },
  
  // Execute messages
  submit_proposal: { submit_proposal: { title: "string", description: "string", metadata: "string" } },
  vote: { vote: { proposal_id: "number", vote: "string", metadata: "string" } },
  execute_proposal: { execute_proposal: { proposal_id: "number" } },
};
```

### Custom Contract Interactions

For custom contracts, you can use the underlying blockchain service:

```typescript
import { seiBlockchain } from '@/lib/seiBlockchain';

// Query custom contract
const result = await seiBlockchain.cosmWasmClient.queryContractSmart(
  contractAddress,
  { custom_query: { param: "value" } }
);

// Execute custom contract
const txResult = await seiBlockchain.signingClient.execute(
  senderAddress,
  contractAddress,
  { custom_execute: { param: "value" } },
  fee
);
```

## 🛡️ Security Features

- **Mnemonic Encryption**: Private keys are never stored or transmitted
- **Transaction Signing**: All transactions are signed locally
- **Network Validation**: Automatic validation of SEI addresses and network connections
- **Error Handling**: Comprehensive error handling and user feedback

## 📱 UI Components

### SeiWalletConnector

A complete wallet connection component with support for both wallet types:

```typescript
import SeiWalletConnector from '@/components/SeiWalletConnector';

function App() {
  return (
    <div>
      <SeiWalletConnector />
      {/* Your app content */}
    </div>
  );
}
```

### OnChainGovernance

A full-featured governance interface:

```typescript
import OnChainGovernance from '@/components/OnChainGovernance';

function GovernancePage() {
  return (
    <div>
      <OnChainGovernance />
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configurations:

```env
# SEI Network RPC endpoints
VITE_SEI_MAINNET_RPC=https://rpc.sei.juno.deuslabs.fi
VITE_SEI_TESTNET_RPC=https://testnet-rpc.sei.juno.deuslabs.fi
VITE_SEI_EVM_RPC=https://evm-rpc.sei.juno.deuslabs.fi

# Default gas settings
VITE_DEFAULT_GAS=200000
VITE_DEFAULT_FEE=1000
```

### Custom Network Configuration

```typescript
import { SEI_NETWORKS } from '@/lib/seiBlockchain';

// Add custom network
SEI_NETWORKS.custom = {
  rpc: "https://custom-rpc.sei.network",
  rest: "https://custom-lcd.sei.network",
  chainId: "sei-custom-1",
  prefix: "sei",
  gasPrice: "0.025usei",
  gasAdjustment: 1.3
};
```

## 🧪 Testing

### Testnet Usage

For development and testing, use the testnet:

```typescript
// Switch to testnet
await switchNetwork('testnet');

// Use testnet contract addresses
const testnetContract = "sei1testnetcontract...";
```

### Mock Data

For development without blockchain connection:

```typescript
// Mock wallet connection
const mockWallet = {
  address: "sei1mockaddress...",
  type: 'cosmwasm' as const,
  isConnected: true
};

// Mock network status
const mockNetworkStatus = {
  isOnline: true,
  blockHeight: 1234567,
  chainId: "sei-testnet-1",
  rpc: "https://testnet-rpc.sei.juno.deuslabs.fi"
};
```

## 🚨 Error Handling

### Common Errors

1. **Wallet Not Connected**
   ```typescript
   if (!wallet) {
     setError('Please connect your wallet first');
     return;
   }
   ```

2. **Invalid Contract Address**
   ```typescript
   if (!validateSEIAddress(contractAddress)) {
     setError('Invalid SEI contract address');
     return;
   }
   ```

3. **Network Connection Issues**
   ```typescript
   if (!networkStatus?.isOnline) {
     setError('Network is offline. Please check your connection.');
     return;
   }
   ```

### Error Recovery

```typescript
const handleError = (error: Error) => {
  console.error('Operation failed:', error);
  
  if (error.message.includes('insufficient funds')) {
    setError('Insufficient balance for transaction');
  } else if (error.message.includes('network')) {
    setError('Network connection issue. Please try again.');
  } else {
    setError('Operation failed. Please try again.');
  }
};
```

## 📚 Examples

### Complete Governance Component

```typescript
import React, { useState, useEffect } from 'react';
import { useSeiBlockchain } from '@/hooks/useSeiBlockchain';

function GovernanceDashboard() {
  const [proposals, setProposals] = useState([]);
  const [contractAddress, setContractAddress] = useState('');
  
  const {
    wallet,
    networkStatus,
    getGovernanceProposals,
    submitGovernanceProposal,
    voteOnProposal
  } = useSeiBlockchain();

  useEffect(() => {
    if (contractAddress && wallet) {
      loadProposals();
    }
  }, [contractAddress, wallet]);

  const loadProposals = async () => {
    try {
      const data = await getGovernanceProposals(contractAddress);
      setProposals(data);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    }
  };

  const handleVote = async (proposalId: number, vote: 'yes' | 'no') => {
    try {
      await voteOnProposal(contractAddress, proposalId, vote);
      await loadProposals(); // Refresh data
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  return (
    <div>
      <h1>Governance Dashboard</h1>
      
      {/* Contract Configuration */}
      <input
        type="text"
        placeholder="Enter contract address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      
      {/* Network Status */}
      {networkStatus && (
        <div>
          Network: {networkStatus.chainId} | 
          Block: {networkStatus.blockHeight} | 
          Status: {networkStatus.isOnline ? 'Online' : 'Offline'}
        </div>
      )}
      
      {/* Proposals List */}
      {proposals.map(proposal => (
        <div key={proposal.id}>
          <h3>{proposal.title}</h3>
          <p>{proposal.description}</p>
          <button onClick={() => handleVote(proposal.id, 'yes')}>
            Vote Yes
          </button>
          <button onClick={() => handleVote(proposal.id, 'no')}>
            Vote No
          </button>
        </div>
      ))}
    </div>
  );
}

export default GovernanceDashboard;
```

## 🔗 Integration with Existing App

### Add to Navigation

```typescript
// In your Layout component
const navItems = [
  // ... existing items
  { 
    to: "/governance", 
    label: "Governance", 
    icon: Gavel, 
    description: "On-chain governance & voting" 
  },
  { 
    to: "/wallet", 
    label: "Wallet", 
    icon: Wallet, 
    description: "Connect SEI wallet" 
  }
];
```

### Add Routes

```typescript
// In your App.tsx
import OnChainGovernance from '@/components/OnChainGovernance';
import SeiWalletConnector from '@/components/SeiWalletConnector';

function App() {
  return (
    <Routes>
      {/* ... existing routes */}
      <Route path="/governance" element={<OnChainGovernance />} />
      <Route path="/wallet" element={<SeiWalletConnector />} />
    </Routes>
  );
}
```

## 🎯 Best Practices

1. **Always check wallet connection** before performing blockchain operations
2. **Validate contract addresses** before making calls
3. **Handle errors gracefully** and provide user feedback
4. **Use appropriate gas limits** for different operations
5. **Test on testnet** before deploying to mainnet
6. **Implement proper loading states** for better UX
7. **Cache blockchain data** when appropriate to reduce RPC calls

## 🆘 Support

For issues or questions:

1. Check the console for detailed error messages
2. Verify network connectivity and RPC endpoint status
3. Ensure wallet is properly connected and has sufficient balance
4. Check contract address validity and permissions

## 🔄 Updates

This integration system is designed to be easily updatable:

- **Network configurations** can be modified in `seiBlockchain.ts`
- **Contract ABIs** can be updated for new contract versions
- **New functions** can be added to the blockchain service
- **UI components** can be customized for different use cases

---

**Note**: This system provides a foundation for SEI blockchain integration. For production use, ensure proper security measures, error handling, and user experience considerations are implemented.
