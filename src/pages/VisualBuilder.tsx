import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Code, Play, Save, Download } from "lucide-react";

export default function VisualBuilder() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [canvasComponents, setCanvasComponents] = useState([]);
  const [showCode, setShowCode] = useState(false);

  const componentPalette = [
    {
      id: "nft-mint",
      name: "NFT Mint",
      category: "Core Functions",
      description: "Mint new NFTs",
      icon: "🎨",
      properties: {
        name: "NFT Mint Function",
        description: "Mint new NFT tokens",
        accessControl: "public",
        gasLimit: "100000"
      }
    },
    {
      id: "battle-logic",
      name: "Battle Logic",
      category: "Game Mechanics",
      description: "Handle agent battles",
      icon: "⚔️",
      properties: {
        name: "Battle Logic",
        description: "Process battle outcomes",
        accessControl: "public",
        gasLimit: "150000"
      }
    },
    {
      id: "access-control",
      name: "Access Control",
      category: "Security",
      description: "Restrict function access",
      icon: "🔒",
      properties: {
        name: "Access Control",
        description: "Restrict function access to authorized users",
        accessControl: "restricted",
        gasLimit: "50000"
      }
    },
    {
      id: "reward-system",
      name: "Reward System",
      category: "Economics",
      description: "Distribute rewards",
      icon: "💰",
      properties: {
        name: "Reward System",
        description: "Calculate and distribute rewards",
        accessControl: "public",
        gasLimit: "120000"
      }
    },
    {
      id: "event-emitter",
      name: "Event Emitter",
      category: "Notifications",
      description: "Emit blockchain events",
      icon: "📡",
      properties: {
        name: "Event Emitter",
        description: "Emit events for off-chain listeners",
        accessControl: "public",
        gasLimit: "30000"
      }
    }
  ];

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const componentData = JSON.parse(e.dataTransfer.getData("component"));
    const newComponent = {
      ...componentData,
      id: `${componentData.id}-${Date.now()}`,
      position: { x: e.clientX - 100, y: e.clientY - 100 }
    };
    setCanvasComponents(prev => [...prev, newComponent]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };

  const generateCode = () => {
    const code = `// Generated Smart Contract
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GeneratedContract is ERC721, Ownable {
    ${canvasComponents.map(comp => `
    // ${comp.name}
    function ${comp.id.replace('-', '_')}() external {
        // ${comp.description}
        // Gas limit: ${comp.properties.gasLimit}
        // Access: ${comp.properties.accessControl}
    }`).join('\n')}
    
    constructor() ERC721("GeneratedContract", "GEN") {}
}`;
    return code;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
            <Palette className="w-10 h-10 mr-3 text-purple-500" />
            Visual Contract Builder
          </h1>
          <p className="text-muted-foreground">Drag and drop components to build your smart contract visually</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Component Palette */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Component Palette</CardTitle>
                <CardContent className="text-sm text-muted-foreground">
                  Drag components to the canvas
                </CardContent>
              </CardHeader>
              <CardContent className="space-y-3">
                {componentPalette.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    className="p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{component.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{component.name}</div>
                        <div className="text-xs text-muted-foreground">{component.description}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {component.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Canvas</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCode(!showCode)}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      {showCode ? "Hide Code" : "Show Code"}
                    </Button>
                    <Button size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showCode ? (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{generateCode()}</code>
                    </pre>
                  </div>
                ) : (
                  <div
                    className="min-h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    {canvasComponents.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Palette className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p>Drag components here to build your contract</p>
                        </div>
                      </div>
                    ) : (
                      canvasComponents.map((component) => (
                        <div
                          key={component.id}
                          className={`absolute p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedComponent?.id === component.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 bg-white'
                          }`}
                          style={{
                            left: component.position.x,
                            top: component.position.y
                          }}
                          onClick={() => handleComponentSelect(component)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{component.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{component.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {component.properties.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Properties</CardTitle>
                <CardContent className="text-sm text-muted-foreground">
                  {selectedComponent ? "Edit component properties" : "Select a component to edit"}
                </CardContent>
              </CardHeader>
              <CardContent>
                {selectedComponent ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        value={selectedComponent.properties.name}
                        onChange={(e) => {
                          const updated = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? {
                                  ...comp,
                                  properties: { ...comp.properties, name: e.target.value }
                                }
                              : comp
                          );
                          setCanvasComponents(updated);
                          setSelectedComponent({
                            ...selectedComponent,
                            properties: { ...selectedComponent.properties, name: e.target.value }
                          });
                        }}
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        value={selectedComponent.properties.description}
                        onChange={(e) => {
                          const updated = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? {
                                  ...comp,
                                  properties: { ...comp.properties, description: e.target.value }
                                }
                              : comp
                          );
                          setCanvasComponents(updated);
                          setSelectedComponent({
                            ...selectedComponent,
                            properties: { ...selectedComponent.properties, description: e.target.value }
                          });
                        }}
                        className="w-full p-2 border rounded mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Access Control</label>
                      <select
                        value={selectedComponent.properties.accessControl}
                        onChange={(e) => {
                          const updated = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? {
                                  ...comp,
                                  properties: { ...comp.properties, accessControl: e.target.value }
                                }
                              : comp
                          );
                          setCanvasComponents(updated);
                          setSelectedComponent({
                            ...selectedComponent,
                            properties: { ...selectedComponent.properties, accessControl: e.target.value }
                          });
                        }}
                        className="w-full p-2 border rounded mt-1"
                      >
                        <option value="public">Public</option>
                        <option value="restricted">Restricted</option>
                        <option value="owner">Owner Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Gas Limit</label>
                      <input
                        type="number"
                        value={selectedComponent.properties.gasLimit}
                        onChange={(e) => {
                          const updated = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? {
                                  ...comp,
                                  properties: { ...comp.properties, gasLimit: e.target.value }
                                }
                              : comp
                          );
                          setCanvasComponents(updated);
                          setSelectedComponent({
                            ...selectedComponent,
                            properties: { ...selectedComponent.properties, gasLimit: e.target.value }
                          });
                        }}
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCanvasComponents(prev => prev.filter(comp => comp.id !== selectedComponent.id));
                        setSelectedComponent(null);
                      }}
                      className="w-full"
                    >
                      Remove Component
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Palette className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Select a component to edit its properties</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Test Contract
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Code
                </Button>
                <Button variant="outline" className="w-full">
                  <Code className="w-4 h-4 mr-2" />
                  Deploy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
