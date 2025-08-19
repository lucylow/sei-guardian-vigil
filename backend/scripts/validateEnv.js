#!/usr/bin/env node

// =============================================================================
// SEI SENTINEL - Environment Variables Validation Script
// =============================================================================
// Run this script to validate your environment configuration
// node scripts/validateEnv.js

import dotenv from 'dotenv';
import { loadEnvironmentConfig } from '../config/environment.js';

// Load environment variables
dotenv.config();

console.log('🔍 Validating SEI SENTINEL Environment Configuration...\n');

try {
  // Load and validate environment configuration
  const config = loadEnvironmentConfig();
  
  console.log('✅ Environment configuration loaded successfully!\n');
  
  // Display configuration summary
  console.log('📋 Configuration Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // API Keys (masked for security)
  console.log(`🔑 HIVE Intelligence MCP API Key: ${config.hiveIntelligenceMcpApiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 Crossmint Server API Key: ${config.crossmintServerApiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 Crossmint Client API Key: ${config.crossmintClientApiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 OpenAI API Key: ${config.openaiApiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 JWT Secret: ${config.jwtSecret ? '✅ Set' : '❌ Missing'}`);
  
  console.log('');
  
  // Network Configuration
  console.log(`🌐 SEI Network: ${config.seiNetwork}`);
  console.log(`🌐 GOAT Network: ${config.goatNetwork}`);
  console.log(`🔗 SEI Testnet RPC: ${config.seiTestnetRpc ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔗 SEI Mainnet RPC: ${config.seiMainnetRrc ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔗 SEI Testnet WebSocket: ${config.seiTestnetWs ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔗 SEI Mainnet WebSocket: ${config.seiMainnetWs ? '✅ Set' : '❌ Missing'}`);
  
  console.log('');
  
  // Wallet Configuration
  console.log(`💰 SEI Testnet Private Key: ${config.seiTestnetPrivateKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`💰 SEI Mainnet Private Key: ${config.seiMainnetPrivateKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`💰 Test Wallet: ${config.testWallet ? '✅ Set' : '❌ Missing'}`);
  
  console.log('');
  
  // Contract Addresses
  console.log(`📜 Agent NFT Contract: ${config.agentNftContract ? '✅ Set' : '❌ Missing'}`);
  console.log(`📜 SENT Token Contract: ${config.sentTokenContract ? '✅ Set' : '❌ Missing'}`);
  console.log(`📜 Event Logger Contract: ${config.eventLoggerContract ? '✅ Set' : '❌ Missing'}`);
  console.log(`📜 Vulnerability Code ID: ${config.vulnerabilityCodeId ? '✅ Set' : '❌ Missing'}`);
  
  console.log('');
  
  // Email Configuration
  console.log(`📧 SMTP Host: ${config.smtpHost}`);
  console.log(`📧 SMTP Port: ${config.smtpPort}`);
  console.log(`📧 SMTP User: ${config.smtpUser ? '✅ Set' : '❌ Missing'}`);
  console.log(`📧 SMTP Pass: ${config.smtpPass ? '✅ Set' : '❌ Missing'}`);
  
  console.log('');
  
  // Development Settings
  console.log(`⚙️  Node Environment: ${config.nodeEnv}`);
  console.log(`⚙️  Port: ${config.port}`);
  console.log(`⚙️  Kafka Brokers: ${config.kafkaBrokers.join(', ')}`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check for any missing required variables
  const requiredVars = [
    'hiveIntelligenceMcpApiKey',
    'crossmintServerApiKey',
    'crossmintClientApiKey',
    'openaiApiKey',
    'seiTestnetPrivateKey',
    'seiMainnetPrivateKey',
    'jwtSecret',
    'agentNftContract'
  ];
  
  const missingVars = requiredVars.filter(varName => !config[varName as keyof typeof config]);
  
  if (missingVars.length > 0) {
    console.log('\n❌ MISSING REQUIRED ENVIRONMENT VARIABLES:');
    missingVars.forEach(varName => {
      console.log(`   • ${varName}`);
    });
    console.log('\n🚨 Please set these variables in your .env file before starting the application.');
    process.exit(1);
  } else {
    console.log('\n🎉 All required environment variables are set! Your SEI SENTINEL is ready to deploy.');
  }
  
} catch (error) {
  console.error('\n❌ Environment validation failed:', error.message);
  console.log('\n🔧 Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}
