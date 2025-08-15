import { Blockchain } from '../backend/src/SeiBlockchain';
import axios from 'axios';
import { Kafka } from "kafkajs";

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"];
const kafka = new Kafka({ clientId: "sei-sentinel", brokers: KAFKA_BROKERS });
const consumer = kafka.consumer({ groupId: "event-processor" });

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

  async start() {
    await consumer.connect();
    await consumer.subscribe({ topic: "contract-deployments", fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());
        if (event.contract_address) {
          await this.handleNewContract(event);
        }
      }
    });
  }
}

new EventProcessor().start();
