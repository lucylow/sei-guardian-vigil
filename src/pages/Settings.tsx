import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Wallet, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Key,
  User,
  Network,
  Zap,
  Save,
  RefreshCw,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    security: true,
    updates: false
  });

  const [networkSettings, setNetworkSettings] = useState({
    rpcUrl: "https://rpc.sei.io",
    chainId: "atlantic-1",
    gasPrice: "0.001",
    autoConfirm: true
  });

  const [agentSettings, setAgentSettings] = useState({
    maxConcurrent: 5,
    autoRetry: true,
    timeout: 30000,
    priority: "medium"
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleNetworkChange = (key: string, value: string | boolean) => {
    setNetworkSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAgentChange = (key: string, value: string | number | boolean) => {
    setAgentSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend/localStorage
    console.log("Saving settings...", { notifications, networkSettings, agentSettings });
  };

  const resetSettings = () => {
    // Reset to defaults
    setNotifications({
      email: true,
      push: false,
      security: true,
      updates: false
    });
    setNetworkSettings({
      rpcUrl: "https://rpc.sei.io",
      chainId: "atlantic-1",
      gasPrice: "0.001",
      autoConfirm: true
    });
    setAgentSettings({
      maxConcurrent: 5,
      autoRetry: true,
      timeout: 30000,
      priority: "medium"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your SEI Guardian Vigil experience, manage wallets, and customize agent behavior.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter username" defaultValue="guardian_user" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" defaultValue="user@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone" 
                  className="w-full p-2 border rounded-md"
                  defaultValue="UTC"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security preferences and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout Duration (minutes)</Label>
                <Input 
                  id="sessionTimeout" 
                  type="number" 
                  defaultValue="30" 
                  min="5" 
                  max="480"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Settings */}
        <TabsContent value="wallet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                Connected Wallets
              </CardTitle>
              <CardDescription>
                Manage your connected wallets and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Keplr Wallet</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        sei1taedai5...f6qw87jfg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Connected</Badge>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">No Additional Wallets</p>
                      <p className="text-sm text-muted-foreground">
                        Connect additional wallets for multi-signature operations
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-600" />
                Wallet Permissions
              </CardTitle>
              <CardDescription>
                Configure what actions each wallet can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Agent Management</Label>
                    <p className="text-sm text-muted-foreground">
                      Create, upgrade, and manage AI agents
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Contract Audits</Label>
                    <p className="text-sm text-muted-foreground">
                      Submit contracts for security analysis
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reward Claims</Label>
                    <p className="text-sm text-muted-foreground">
                      Claim rewards for successful security findings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                Network Configuration
              </CardTitle>
              <CardDescription>
                Configure Sei Network connection settings and RPC endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rpcUrl">RPC Endpoint</Label>
                  <Input 
                    id="rpcUrl" 
                    value={networkSettings.rpcUrl}
                    onChange={(e) => handleNetworkChange('rpcUrl', e.target.value)}
                    placeholder="https://rpc.sei.io"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chainId">Chain ID</Label>
                  <Input 
                    id="chainId" 
                    value={networkSettings.chainId}
                    onChange={(e) => handleNetworkChange('chainId', e.target.value)}
                    placeholder="atlantic-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gasPrice">Gas Price (SEI)</Label>
                  <Input 
                    id="gasPrice" 
                    value={networkSettings.gasPrice}
                    onChange={(e) => handleNetworkChange('gasPrice', e.target.value)}
                    placeholder="0.001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gasLimit">Gas Limit</Label>
                  <Input 
                    id="gasLimit" 
                    defaultValue="200000"
                    placeholder="200000"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-confirm Transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm transactions without manual approval
                  </p>
                </div>
                <Switch 
                  checked={networkSettings.autoConfirm}
                  onCheckedChange={(checked) => handleNetworkChange('autoConfirm', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Performance Settings
              </CardTitle>
              <CardDescription>
                Optimize network performance and transaction handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxRetries">Max Retries</Label>
                  <Input 
                    id="maxRetries" 
                    type="number" 
                    defaultValue="3" 
                    min="1" 
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retryDelay">Retry Delay (ms)</Label>
                  <Input 
                    id="retryDelay" 
                    type="number" 
                    defaultValue="1000" 
                    min="100" 
                    max="10000"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Parallel Transaction Processing</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable parallel processing for multiple transactions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Settings */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Agent Configuration
              </CardTitle>
              <CardDescription>
                Configure AI agent behavior and performance parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxConcurrent">Max Concurrent Agents</Label>
                  <Input 
                    id="maxConcurrent" 
                    type="number" 
                    value={agentSettings.maxConcurrent}
                    onChange={(e) => handleAgentChange('maxConcurrent', parseInt(e.target.value))}
                    min="1" 
                    max="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Scan Timeout (ms)</Label>
                  <Input 
                    id="timeout" 
                    type="number" 
                    value={agentSettings.timeout}
                    onChange={(e) => handleAgentChange('timeout', parseInt(e.target.value))}
                    min="5000" 
                    max="300000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Default Priority</Label>
                <select 
                  id="priority" 
                  className="w-full p-2 border rounded-md"
                  value={agentSettings.priority}
                  onChange={(e) => handleAgentChange('priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-retry Failed Scans</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically retry failed security scans
                  </p>
                </div>
                <Switch 
                  checked={agentSettings.autoRetry}
                  onCheckedChange={(checked) => handleAgentChange('autoRetry', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Data Management
              </CardTitle>
              <CardDescription>
                Configure data retention and storage preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retentionDays">Data Retention (days)</Label>
                  <Input 
                    id="retentionDays" 
                    type="number" 
                    defaultValue="90" 
                    min="7" 
                    max="365"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStorage">Max Storage (GB)</Label>
                  <Input 
                    id="maxStorage" 
                    type="number" 
                    defaultValue="10" 
                    min="1" 
                    max="100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-cleanup Old Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically remove old scan results and logs
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Critical security vulnerability notifications
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.security}
                    onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Update Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Platform updates and new features
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.updates}
                    onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Notification Channels
              </CardTitle>
              <CardDescription>
                Configure additional notification channels and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">D</span>
                    </div>
                    <div>
                      <Label>Discord</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to Discord channel
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <div>
                      <Label>Telegram</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to Telegram bot
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div>
                      <Label>Slack</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to Slack workspace
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
