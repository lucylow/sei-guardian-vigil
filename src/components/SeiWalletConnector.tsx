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

  // Handle CosmWasm wallet connection
  const handleConnectCosmWasm = async () => {
    if (!mnemonic.trim()) {
      alert('Please enter your mnemonic phrase');
      return;
    }

    try {
      setIsConnecting(true);
      await connectCosmWasmWallet(mnemonic.trim());
      setMnemonic('');
    } catch (error) {
      console.error('Failed to connect CosmWasm wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle EVM wallet connection
  const handleConnectEVM = async () => {
    try {
      setIsConnecting(true);
      await connectEVMWallet();
    } catch (error) {
      console.error('Failed to connect EVM wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Copy address to clipboard
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

  // Get wallet balance
  const [balance, setBalance] = useState<string | null>(null);
  const [evmBalance, setEvmBalance] = useState<string | null>(null);

  React.useEffect(() => {
    if (wallet?.address) {
      // Get SEI balance for CosmWasm wallet
      if (wallet.type === 'cosmwasm') {
        getAccountBalance(wallet.address)
          .then(setBalance)
          .catch(console.error);
      }
      
      // Get EVM balance for EVM wallet
      if (wallet.type === 'evm') {
        getEVMBalance(wallet.address)
          .then(setEvmBalance)
          .catch(console.error);
      }
    }
  }, [wallet, getAccountBalance, getEVMBalance]);

  // Network switching
  const handleNetworkSwitch = async (network: keyof typeof SEI_NETWORKS) => {
    try {
      await switchNetwork(network);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (wallet) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-500" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            {wallet.type === 'cosmwasm' ? 'CosmWasm Wallet' : 'EVM Wallet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Network Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentNetwork}
              </Badge>
              {networkStatus?.isOnline ? (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          </div>

          {/* Block Height */}
          {networkStatus && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Block Height</span>
              <span className="text-sm font-mono">
                {networkStatus.blockHeight.toLocaleString()}
              </span>
            </div>
          )}

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Address</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-900 rounded border">
              <span className="text-xs font-mono flex-1 truncate">
                {wallet.address}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyAddress}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Balance */}
          {balance && wallet.type === 'cosmwasm' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">SEI Balance</span>
              <span className="text-sm font-mono">{balance} SEI</span>
            </div>
          )}

          {evmBalance && wallet.type === 'evm' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">EVM Balance</span>
              <span className="text-sm font-mono">{evmBalance} ETH</span>
            </div>
          )}

          {/* Network Switcher */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Switch Network</Label>
            <div className="flex gap-2">
              {Object.entries(SEI_NETWORKS).map(([key, network]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={currentNetwork === key ? "default" : "outline"}
                  onClick={() => handleNetworkSwitch(key as keyof typeof SEI_NETWORKS)}
                  className="text-xs"
                >
                  {key === 'mainnet' ? 'Mainnet' : 
                   key === 'testnet' ? 'Testnet' : 'EVM'}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://sei.explorers.guru/account/${wallet.address}`, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Explorer
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={disconnectWallet}
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
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
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Network Status */}
        {networkStatus && (
          <div className="flex items-center justify-between p-3 bg-gray-900 rounded border">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="text-sm">Network Status</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={networkStatus.isOnline ? "default" : "destructive"}>
                {networkStatus.isOnline ? 'Online' : 'Offline'}
              </Badge>
              {networkStatus.isOnline && (
                <span className="text-xs text-muted-foreground">
                  #{networkStatus.blockHeight.toLocaleString()}
                </span>
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
                  {showMnemonic ? <Key className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your mnemonic phrase is encrypted and never stored
              </p>
            </div>

            <Button
              onClick={handleConnectCosmWasm}
              disabled={!mnemonic.trim() || isConnecting || isLoading}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Connect CosmWasm Wallet
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="evm" className="space-y-4">
            <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-blue-300">
                Connect MetaMask, Compass, or other EVM-compatible wallets
              </p>
            </div>

            <Button
              onClick={handleConnectEVM}
              disabled={isConnecting || isLoading}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Connect EVM Wallet
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Network Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Network</Label>
          <div className="flex gap-2">
            {Object.entries(SEI_NETWORKS).map(([key, network]) => (
              <Button
                key={key}
                size="sm"
                variant={currentNetwork === key ? "default" : "outline"}
                onClick={() => handleNetworkSwitch(key as keyof typeof SEI_NETWORKS)}
                className="text-xs flex-1"
              >
                {key === 'mainnet' ? 'Mainnet' : 
                 key === 'testnet' ? 'Testnet' : 'EVM'}
              </Button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground text-center">
          <p>Supported networks: SEI Mainnet, Testnet, and EVM</p>
          <p>Your private keys are never shared or stored</p>
        </div>
      </CardContent>
    </Card>
  );
}
