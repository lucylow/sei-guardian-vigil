import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw, 
  Info,
  Copy,
  LogOut
} from 'lucide-react';
import { useSeiBlockchain } from '@/hooks/useSeiBlockchain';

export default function MetaMaskConnector() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  
  const { 
    wallet, 
    error, 
    connectEVMWallet, 
    disconnectWallet, 
    clearError,
    SEI_NETWORKS 
  } = useSeiBlockchain();

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const hasMetaMask = typeof window !== 'undefined' && !!(window as any).ethereum;
      setIsMetaMaskInstalled(hasMetaMask);
      
      if (hasMetaMask) {
        checkCurrentNetwork();
      }
    };
    
    checkMetaMask();
    
    // Listen for MetaMask account changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      
      (window as any).ethereum.on('chainChanged', () => {
        checkCurrentNetwork();
      });
    }
  }, []);

  const checkCurrentNetwork = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const seiChainId = `0x${SEI_NETWORKS.evm.chainId.toString(16)}`;
        
        if (chainId === seiChainId) {
          setCurrentNetwork('Sei EVM');
        } else {
          setCurrentNetwork('Other Network');
        }
      }
    } catch (error) {
      console.error('Failed to check current network:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      clearError();
      await connectEVMWallet();
      await checkCurrentNetwork();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setCurrentNetwork(null);
  };

  const copyAddress = async () => {
    if (wallet?.address) {
      try {
        await navigator.clipboard.writeText(wallet.address);
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const openMetaMask = () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }
  };

  const addSeiNetwork = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${SEI_NETWORKS.evm.chainId.toString(16)}`,
            chainName: 'Sei EVM',
            nativeCurrency: {
              name: 'SEI',
              symbol: 'SEI',
              decimals: 18
            },
            rpcUrls: [SEI_NETWORKS.evm.rpc],
            blockExplorerUrls: ['https://sei.evmscan.io/'],
            iconUrls: ['https://sei.io/favicon.ico']
          }],
        });
        await checkCurrentNetwork();
      }
    } catch (error) {
      console.error('Failed to add Sei network:', error);
    }
  };

  if (wallet && wallet.type === 'evm') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            MetaMask Connected
          </CardTitle>
          <CardDescription>
            Successfully connected to Sei EVM network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Network Status */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {currentNetwork || 'Sei EVM'}
            </Badge>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Address</div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                {wallet.address}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Disconnect */}
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Connect MetaMask to Sei
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to interact with Sei EVM network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* MetaMask Installation Check */}
        {!isMetaMaskInstalled && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              MetaMask is not installed. Please{' '}
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                install MetaMask extension
              </a>{' '}
              first.
            </AlertDescription>
          </Alert>
        )}

        {/* Network Status */}
        {currentNetwork && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">Current Network</span>
            </div>
            <div className="text-xs">
              <Badge variant={currentNetwork === 'Sei EVM' ? 'default' : 'destructive'}>
                {currentNetwork}
              </Badge>
              {currentNetwork !== 'Sei EVM' && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSeiNetwork}
                    className="w-full"
                  >
                    Add Sei EVM Network
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connection Instructions */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800 space-y-2">
            <div className="font-medium">Before connecting:</div>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Make sure MetaMask is unlocked</li>
              <li>Switch to Sei EVM network (or add it if not present)</li>
              <li>Click "Connect MetaMask" below</li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {currentNetwork !== 'Sei EVM' && (
            <Button
              variant="outline"
              onClick={addSeiNetwork}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Add Sei EVM Network to MetaMask
            </Button>
          )}
          
          <Button
            onClick={handleConnect}
            disabled={!isMetaMaskInstalled || isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </div>

        {/* Help Links */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            Need help? Check out our{' '}
            <a 
              href="https://docs.sei.io/develop/evm/getting-started" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Sei EVM documentation
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
