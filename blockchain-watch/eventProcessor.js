import { Blockchain } from '../backend/src/SeiBlockchain';
import axios from 'axios';

export class EventProcessor {
  constructor() {
    this.contractCache = new Map();
  }

  async handleNewContract(txData) {
    const contractAddress = txData.contract_address;
    if (this.contractCache.has(contractAddress)) return;
    this.contractCache.set(contractAddress, Date.now());
    try {
      console.log(`Rescanning contract: ${contractAddress}`);
      const response = await axios.post('http://localhost:4000/api/scan', {
        contract: contractAddress,
        metadata: {
          type: 'redeployed',
          address: contractAddress,
          block: txData.height
        }
      });
      if (response.data.findings?.length > 0) {
        console.warn(`Vulnerabilities detected in ${contractAddress}`);
        // Trigger alerts/notifications here
      }
    } catch (error) {
      console.error(`Rescan failed for ${contractAddress}:`, error.message);
    }
  }

  start() {
    Blockchain.initWebSocketListener((event) => {
      if (event.type === 'contract_deployment') {
        this.handleNewContract(event);
      } else if (event.type === 'contract_interaction') {
        // Handle suspicious interactions
      }
    });
  }
}

new EventProcessor().start();
