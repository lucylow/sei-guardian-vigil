/* Navigation is now handled by the Layout component */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabDescription, TabConnectionLine } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon,
  Wallet,
  Network,
  Users,
  Bell,
  Shield,
  Database,
  Globe,
  Lock,
  Key
} from "lucide-react";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoUpdates, setAutoUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Tab descriptions for each settings section
  const tabDescriptions = {
    general: "General application settings and preferences",
    wallet: "Wallet configuration and connection settings",
    network: "Network and blockchain connection preferences",
    agents: "AI agent configuration and management",
    notifications: "Notification preferences and alert settings"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/10 to-black font-mono text-red-400">
      {/* Navigation is now handled by the Layout component */}
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-3 tracking-wider">
                SETTINGS
              </h1>
              <p className="text-lg text-red-600/70 font-medium tracking-wide">
                CONFIGURE YOUR APPLICATION PREFERENCES
              </p>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-2xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold px-6 py-3 transform hover:scale-105 hover:-translate-y-1">
              <SettingsIcon className="w-5 h-5 mr-2" />
              SAVE CHANGES
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-300 mb-4 tracking-wide">CONFIGURATION SECTIONS</h3>
          <Tabs defaultValue="general" className="w-full">
            <TabsList variant="security" className="w-full">
              <TabsTrigger value="general" variant="security" icon={<SettingsIcon className="w-5 h-5" />}>
                GENERAL
              </TabsTrigger>
              <TabsTrigger value="wallet" variant="security" icon={<Wallet className="w-5 h-5" />}>
                WALLET
              </TabsTrigger>
              <TabsTrigger value="network" variant="security" icon={<Network className="w-5 h-5" />}>
                NETWORK
              </TabsTrigger>
              <TabsTrigger value="agents" variant="security" icon={<Users className="w-5 h-5" />}>
                AGENTS
              </TabsTrigger>
              <TabsTrigger value="notifications" variant="security" icon={<Bell className="w-5 h-5" />}>
                NOTIFICATIONS
              </TabsTrigger>
            </TabsList>
            
            <TabConnectionLine variant="security" />
            <TabDescription variant="security" descriptions={tabDescriptions} />
            
            {/* General Settings Tab */}
            <TabsContent value="general" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <SettingsIcon className="w-6 h-6 text-red-400" />
                      GENERAL PREFERENCES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-red-300 font-medium">Dark Mode</Label>
                          <p className="text-sm text-red-600/70">Enable dark theme for better visibility</p>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-red-300 font-medium">Auto Updates</Label>
                          <p className="text-sm text-red-600/70">Automatically update the application</p>
                        </div>
                        <Switch
                          checked={autoUpdates}
                          onCheckedChange={setAutoUpdates}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-red-300 font-medium">Notifications</Label>
                          <p className="text-sm text-red-600/70">Enable system notifications</p>
                        </div>
                        <Switch
                          checked={notificationsEnabled}
                          onCheckedChange={setNotificationsEnabled}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Wallet Settings Tab */}
            <TabsContent value="wallet" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Wallet className="w-6 h-6 text-red-400" />
                      WALLET CONFIGURATION
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Wallet Address</Label>
                        <Input 
                          placeholder="Enter wallet address" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Private Key</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter private key" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105">
                        <Key className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Network Settings Tab */}
            <TabsContent value="network" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Network className="w-6 h-6 text-red-400" />
                      NETWORK CONFIGURATION
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">RPC Endpoint</Label>
                        <Input 
                          placeholder="https://rpc.sei.io" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Chain ID</Label>
                        <Input 
                          placeholder="atlantic-1" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Explorer URL</Label>
                        <Input 
                          placeholder="https://sei.explorers.guru" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105">
                        <Globe className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Agents Settings Tab */}
            <TabsContent value="agents" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Users className="w-6 h-6 text-red-400" />
                      AI AGENT CONFIGURATION
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Max Concurrent Agents</Label>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Agent Timeout (seconds)</Label>
                        <Input 
                          type="number" 
                          placeholder="300" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Model Provider</Label>
                        <Input 
                          placeholder="OpenAI, Anthropic, etc." 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105">
                        <Database className="w-4 h-4 mr-2" />
                        Save Agent Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Settings Tab */}
            <TabsContent value="notifications" variant="security">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-black/50 via-red-900/10 to-black/50 border-red-900/50">
                  <CardHeader>
                    <CardTitle className="text-red-300 font-mono tracking-wide text-xl flex items-center space-x-3">
                      <Bell className="w-6 h-6 text-red-400" />
                      NOTIFICATION PREFERENCES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-red-300 font-medium">Security Alerts</Label>
                          <p className="text-sm text-red-600/70">Receive immediate security notifications</p>
                        </div>
                        <Switch
                          checked={true}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-red-300 font-medium">Performance Updates</Label>
                          <p className="text-sm text-red-600/70">Get system performance reports</p>
                        </div>
                        <Switch
                          checked={true}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-red-300 font-medium">Agent Status</Label>
                          <p className="text-sm text-red-600/70">Agent deployment and status updates</p>
                        </div>
                        <Switch
                          checked={false}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-red-300 font-medium">Email Notifications</Label>
                        <Input 
                          type="email" 
                          placeholder="your@email.com" 
                          className="bg-red-900/20 border-red-700/50 text-red-300 placeholder:text-red-600/50"
                        />
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-mono tracking-wide font-bold py-3 transform hover:scale-105">
                        <Lock className="w-4 h-4 mr-2" />
                        Save Notification Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
