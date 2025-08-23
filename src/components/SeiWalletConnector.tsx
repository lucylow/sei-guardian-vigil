import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  Key, 
  Shield, 
  Network, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Zap, 
  Bot 
} from 'lucide-react';
import { useSeiBlockchain } from '@/hooks/useSeiBlockchain';

export default function SeiWalletConnector() {
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { 
    wallet, 
    networkStatus, 
    currentNetwork, 
    isLoading, 
    error, 
    connectCosmWasmWallet, 
    connectEVMWallet, 
    disconnectWallet, 
    switchNetwork, 
    getAccountBalance, 
    getEVMBalance, 
    clearError, 
    SEI_NETWORKS 
  } = useSeiBlockchain();

  const [balance, setBalance] = useState<string | null>(null);
  const [evmBalance, setEvmBalance] = useState<string | null>(null);

  const handleConnectCosmWasm = async () => {
    if (!mnemonic.trim()) {
      alert('Please enter your mnemonic phrase');
      return;
    }

    try {
      setIsConnecting(true);
      await connectCosmWasmWallet(mnemonic);
      
      // Get balance after connection
      if (wallet?.address) {
        const bal = await getAccountBalance(wallet.address);
        setBalance(bal.amount);
      }
    } catch (error) {
      console.error('Failed to connect CosmWasm wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectEVM = async () => {
    try {
      setIsConnecting(true);
      const connection = await connectEVMWallet();
      
      // Get EVM balance after connection
      if (connection.address) {
        const bal = await getEVMBalance(connection.address);
        setEvmBalance(bal);
      }
    } catch (error) {
      console.error('Failed to connect EVM wallet:', error);
    } finally {
      setIsConnecting(false);
    }
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

  const handleNetworkSwitch = async (network: keyof typeof SEI_NETWORKS) => {
    try {
      await switchNetwork(network);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  // Fetch balances when wallet changes
  React.useEffect(() => {
    const fetchBalances = async () => {
      if (wallet?.address) {
        try {
          if (wallet.type === 'cosmwasm') {
            const bal = await getAccountBalance(wallet.address);
            setBalance(bal.amount);
          } else if (wallet.type === 'evm') {
            const bal = await getEVMBalance(wallet.address);
            setEvmBalance(bal);
          }
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };

    fetchBalances();
  }, [wallet, getAccountBalance, getEVMBalance]);

  if (wallet) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            {wallet.type === 'cosmwasm' ? 'CosmWasm Wallet' : 'EVM Wallet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Address */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Address</Label>
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

          {/* Balance */}
          {balance && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Balance</Label>
              <div className="text-lg font-mono">
                {wallet.type === 'cosmwasm' 
                  ? `${(parseFloat(balance) / 1000000).toFixed(6)} SEI`
                  : `${evmBalance || '0'} ETH`
                }
              </div>
            </div>
          )}

          {/* Network Status */}
          {networkStatus && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Network</Label>
              <div className="flex items-center gap-2">
                <Badge variant={networkStatus.isOnline ? "default" : "destructive"}>
                  {networkStatus.isOnline ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {networkStatus.network}
                </Badge>
                {networkStatus.isOnline && (
                  <span className="text-xs text-muted-foreground">
                    Block {networkStatus.blockHeight}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Network Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Switch Network</Label>
            <div className="flex gap-2">
              {Object.keys(SEI_NETWORKS).map((network) => (
                <Button
                  key={network}
                  variant={currentNetwork === network ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNetworkSwitch(network as keyof typeof SEI_NETWORKS)}
                  disabled={isLoading}
                >
                  {network === 'mainnet' && '🌐'}
                  {network === 'testnet' && '🧪'}
                  {network === 'evm' && '⚡'}
                  {network}
                </Button>
              ))}
            </div>
          </div>

          {/* Disconnect */}
          <Button
            variant="outline"
            onClick={disconnectWallet}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
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
          Connect SEI Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to interact with SEI blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Network Status */}
        {networkStatus && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4" />
              <span className="text-sm font-medium">Network Status</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={networkStatus.isOnline ? "default" : "destructive"}>
                  {networkStatus.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              {networkStatus.isOnline && (
                <>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span>{networkStatus.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Block Height:</span>
                    <span>{networkStatus.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chain ID:</span>
                    <span className="font-mono text-xs">{networkStatus.chainId}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="cosmwasm" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cosmwasm" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              CosmWasm
            </TabsTrigger>
            <TabsTrigger value="evm" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              EVM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cosmwasm" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
              <div className="relative">
                <Input
                  id="mnemonic"
                  type={showMnemonic ? "text" : "password"}
                  placeholder="Enter your 12 or 24 word mnemonic phrase"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                >
                  {showMnemonic ? (
                    <Key className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your mnemonic is encrypted and never stored
              </p>
            </div>

            <Button
              onClick={handleConnectCosmWasm}
              disabled={!mnemonic.trim() || isConnecting || isLoading}
              className="w-full"
            >
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Connect CosmWasm Wallet
            </Button>
          </TabsContent>

          <TabsContent value="evm" className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">EVM Wallet</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Connect MetaMask, Compass, or other EVM-compatible wallets
              </p>
            </div>

            <Button
              onClick={handleConnectEVM}
              disabled={isConnecting || isLoading}
              className="w-full"
            >
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Connect EVM Wallet
            </Button>
          </TabsContent>
        </Tabs>

        {/* Network Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Network</Label>
          <div className="flex gap-2">
            {Object.keys(SEI_NETWORKS).map((network) => (
              <Button
                key={network}
                variant={currentNetwork === network ? "default" : "outline"}
                size="sm"
                onClick={() => handleNetworkSwitch(network as keyof typeof SEI_NETWORKS)}
                disabled={isLoading}
                className="flex-1"
              >
                {network === 'mainnet' && '🌐'}
                {network === 'testnet' && '🧪'}
                {network === 'evm' && '⚡'}
                {network}
              </Button>
            ))}
          </div>
        </div>

        {/* Network Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Current Network</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>RPC Endpoint:</span>
              <span className="font-mono text-xs truncate max-w-[200px]">
                {SEI_NETWORKS[currentNetwork].rpc}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Chain ID:</span>
              <span className="font-mono text-xs">
                {SEI_NETWORKS[currentNetwork].chainId}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
