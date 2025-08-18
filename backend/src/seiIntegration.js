const { SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { GasPrice } = require('@cosmjs/stargate');

class SeiBlockchainIntegration {
  constructor() {
    this.client = null;
    this.wallet = null;
    this.contractAddress = process.env.SENT_TOKEN_CONTRACT;
    this.rpcEndpoint = process.env.SEI_RPC_URL || 'https://sei-testnet-rpc.polkachu.com';
  }

  async initialize() {
    try {
      this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        process.env.SEI_MNEMONIC,
        { prefix: 'sei' }
      );

      const [firstAccount] = await this.wallet.getAccounts();
      console.log('Sei wallet address:', firstAccount.address);

      this.client = await SigningCosmWasmClient.connectWithSigner(
        this.rpcEndpoint,
        this.wallet,
        {
          gasPrice: GasPrice.fromString('0.1usei'),
        }
      );

      console.log('Sei blockchain integration initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Sei integration:', error);
      return false;
    }
  }

  async mintAgentNFT(agentData) {
    if (!this.client) throw new Error('Client not initialized');

    const [account] = await this.wallet.getAccounts();
    
    const mintMsg = {
      mint: {
        token_id: agentData.id,
        owner: account.address,
        token_uri: agentData.metadataUri,
        extension: {
          name: agentData.name,
          role: agentData.role,
          accuracy: agentData.accuracy,
          speed: agentData.speed
        }
      }
    };

    try {
      const result = await this.client.execute(
        account.address,
        process.env.AGENT_NFT_CONTRACT,
        mintMsg,
        'auto'
      );

      return {
        success: true,
        txHash: result.transactionHash,
        tokenId: agentData.id
      };
    } catch (error) {
      console.error('Failed to mint agent NFT:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async rewardAgent(agentAddress, amount, reason) {
    if (!this.client) throw new Error('Client not initialized');

    const [account] = await this.wallet.getAccounts();
    
    const transferMsg = {
      transfer: {
        recipient: agentAddress,
        amount: amount.toString()
      }
    };

    try {
      const result = await this.client.execute(
        account.address,
        this.contractAddress,
        transferMsg,
        'auto',
        `Reward: ${reason}`
      );

      await this.recordRewardEvent(agentAddress, amount, reason, result.transactionHash);

      return {
        success: true,
        txHash: result.transactionHash,
        amount,
        recipient: agentAddress
      };
    } catch (error) {
      console.error('Failed to reward agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async recordRewardEvent(recipient, amount, reason, txHash) {
    const eventMsg = {
      record_event: {
        event_type: 'reward_distributed',
        recipient,
        amount: amount.toString(),
        reason,
        tx_hash: txHash,
        timestamp: Date.now()
      }
    };

    try {
      const [account] = await this.wallet.getAccounts();
      await this.client.execute(
        account.address,
        process.env.EVENT_LOGGER_CONTRACT,
        eventMsg,
        'auto'
      );
    } catch (error) {
      console.error('Failed to record reward event:', error);
    }
  }

  async getAgentBalance(agentAddress) {
    if (!this.client) throw new Error('Client not initialized');

    try {
      const balanceQuery = { balance: { address: agentAddress } };
      const result = await this.client.queryContractSmart(
        this.contractAddress,
        balanceQuery
      );
      
      return parseInt(result.balance);
    } catch (error) {
      console.error('Failed to get agent balance:', error);
      return 0;
    }
  }

  async deployVulnerabilityContract(vulnerabilityData) {
    if (!this.client) throw new Error('Client not initialized');

    const [account] = await this.wallet.getAccounts();
    
    const instantiateMsg = {
      name: vulnerabilityData.name,
      severity: vulnerabilityData.severity,
      description: vulnerabilityData.description,
      reward_pool: vulnerabilityData.rewardPool.toString()
    };

    try {
      const result = await this.client.instantiate(
        account.address,
        process.env.VULNERABILITY_CODE_ID,
        instantiateMsg,
        `Vulnerability: ${vulnerabilityData.name}`,
        'auto'
      );

      return {
        success: true,
        contractAddress: result.contractAddress,
        txHash: result.transactionHash
      };
    } catch (error) {
      console.error('Failed to deploy vulnerability contract:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listenForContractEvents() {
    const ws = new WebSocket(`wss://sei-testnet-rpc.polkachu.com/websocket`);
    
    ws.on('open', () => {
      console.log('Connected to Sei WebSocket');
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        method: 'subscribe',
        id: 1,
        params: {
          query: `tm.event='Tx' AND wasm.contract_address EXISTS`
        }
      }));
    });

    ws.on('message', (data) => {
      try {
        const event = JSON.parse(data);
        if (event.result && event.result.data) {
          this.handleContractEvent(event.result.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    return ws;
  }

  handleContractEvent(eventData) {
    console.log('Contract event received:', eventData);
    if (eventData.type === 'contract_instantiated') {
      this.triggerVulnerabilityScan(eventData.contract_address);
    }
  }

  async triggerVulnerabilityScan(contractAddress) {
    const VulnerabilityScanner = require('./scanEngine');
    const scanner = new VulnerabilityScanner();
    
    try {
      const contractInfo = await this.client.getContract(contractAddress);
      const scanResult = await scanner.scanContract(contractInfo.code_info, contractAddress);
      
      if (scanResult.findings.length > 0) {
        const criticalFindings = scanResult.findings.filter(f => f.severity >= 8);
        for (const finding of criticalFindings) {
          await this.createVulnerabilityBattle({
            name: finding.type,
            severity: finding.severity,
            contractAddress,
            description: finding.description
          });
        }
      }
    } catch (error) {
      console.error('Failed to scan new contract:', error);
    }
  }

  async createVulnerabilityBattle(vulnData) {
    console.log('Creating vulnerability battle:', vulnData);
    if (global.battleEngine) {
      global.battleEngine.createVulnerability(vulnData);
    }
  }
}

module.exports = SeiBlockchainIntegration;
