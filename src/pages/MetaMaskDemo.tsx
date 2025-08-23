import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';
import MetaMaskConnector from '@/components/MetaMaskConnector';

export default function MetaMaskDemo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            MetaMask + Sei Network Connection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test and troubleshoot your MetaMask wallet connection to the Sei EVM network
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This demo page helps you connect MetaMask to the Sei EVM network. 
            If you're having connection issues, follow the step-by-step instructions below.
          </AlertDescription>
        </Alert>

        {/* Connection Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Connection Guide</CardTitle>
            <CardDescription>
              Follow these steps to successfully connect MetaMask to Sei network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">1. Install MetaMask</h3>
                <p className="text-sm text-gray-600">
                  Make sure you have the MetaMask browser extension installed. 
                  If not, download it from the official website.
                </p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  Download MetaMask <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">2. Unlock MetaMask</h3>
                <p className="text-sm text-gray-600">
                  Open MetaMask and make sure it's unlocked with your password or biometric authentication.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">3. Add Sei Network</h3>
                <p className="text-sm text-gray-600">
                  Use the "Add Sei EVM Network" button below to automatically add Sei network to MetaMask.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">4. Connect Wallet</h3>
                <p className="text-sm text-gray-600">
                  Click "Connect MetaMask" to establish the connection. MetaMask will prompt you to approve the connection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sei EVM Network Details</CardTitle>
            <CardDescription>
              Technical specifications for the Sei EVM network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Network Name:</span>
                  <span className="font-mono text-sm">Sei EVM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Chain ID:</span>
                  <span className="font-mono text-sm">713715</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Currency Symbol:</span>
                  <span className="font-mono text-sm">SEI</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">RPC URL:</span>
                  <span className="font-mono text-sm">https://evm-rpc.sei.juno.deuslabs.fi</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Block Explorer:</span>
                  <span className="font-mono text-sm">https://sei.evmscan.io</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Decimals:</span>
                  <span className="font-mono text-sm">18</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MetaMask Connector */}
        <div className="flex justify-center">
          <MetaMaskConnector />
        </div>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
            <CardDescription>
              Solutions to frequently encountered connection problems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">"User rejected the request"</h3>
              <p className="text-sm text-gray-600">
                This means you clicked "Reject" in MetaMask. Try connecting again and make sure to click "Approve".
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">"Network not found"</h3>
              <p className="text-sm text-gray-600">
                Use the "Add Sei EVM Network" button to automatically add the network to MetaMask.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">"Already processing"</h3>
              <p className="text-sm text-gray-600">
                Check your MetaMask extension for pending requests. Complete or reject any pending transactions first.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">"Insufficient funds"</h3>
              <p className="text-sm text-gray-600">
                You need some SEI tokens in your wallet for gas fees. You can get testnet SEI from a faucet.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              Helpful links and documentation for Sei development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <a 
                  href="https://docs.sei.io/develop/evm/getting-started" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Sei EVM Documentation</div>
                  <div className="text-sm text-gray-600">Official guide to getting started with Sei EVM</div>
                </a>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://sei.evmscan.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Sei EVM Explorer</div>
                  <div className="text-sm text-gray-600">Block explorer for Sei EVM transactions</div>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
