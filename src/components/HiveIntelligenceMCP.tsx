import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HiveKey {
  keyName: string;
  key: string;
  environment: string;
}

export const HiveIntelligenceMCP: React.FC = () => {
  const [keys, setKeys] = useState<HiveKey[]>([]);
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] = useState('development');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/dev-onboarding/hive/keys');
      const data = await response.json();
      const keyArray = Object.entries(data).map(([name, info]: [string, any]) => ({
        keyName: name,
        key: info.key,
        environment: info.environment
      }));
      setKeys(keyArray);
    } catch (error) {
      console.error('Failed to fetch keys:', error);
      toast({
        title: "Error",
        description: "Failed to fetch API keys",
        variant: "destructive"
      });
    }
  };

  const generateKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/dev-onboarding/hive/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyName,
          environment
        }),
      });

      if (response.ok) {
        const newKey = await response.json();
        setKeys(prev => [...prev, newKey]);
        setKeyName('');
        toast({
          title: "Success",
          description: "API key generated successfully",
        });
      } else {
        throw new Error('Failed to generate key');
      }
    } catch (error) {
      console.error('Failed to generate key:', error);
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const getEnvironmentBadge = (env: string) => {
    return env === 'production' ? (
      <Badge variant="destructive">Production</Badge>
    ) : (
      <Badge variant="secondary">Development</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            Hive Intelligence MCP
          </CardTitle>
          <CardDescription>
            Generate and manage keys for Hive Intelligence MCP authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* New Key Generation Form */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h3 className="text-lg font-semibold mb-4">New Development Key</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="Enter key name"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateKey}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Key'}
                </Button>
              </div>
            </div>
          </div>

          {/* Keys Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Keys</h3>
            {keys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys generated yet. Create your first key above.
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((keyData, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {keyData.keyName}
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm bg-muted px-2 py-1 rounded max-w-xs truncate">
                            {keyData.key}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getEnvironmentBadge(keyData.environment)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(keyData.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};