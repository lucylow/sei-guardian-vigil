import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const SentinelChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m Sentinel AI, your smart contract security assistant. I can help you analyze vulnerabilities, understand audit reports, and provide security recommendations for Sei network contracts.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('reentrancy')) {
      return 'Reentrancy vulnerabilities are critical on Sei. I recommend using the Checks-Effects-Interactions pattern. Here\'s what I found in your contracts:\n\n• YeiSwap has 2 potential reentrancy points\n• Consider using OpenZeppelin\'s ReentrancyGuard\n• Test with our parallel execution simulator';
    }
    
    if (input.includes('gas') || input.includes('optimization')) {
      return 'Gas optimization on Sei can save significant costs due to parallel execution. Current opportunities:\n\n• Batch operations: ~15% savings\n• Storage optimization: ~23% savings\n• Use Sei-native functions for DeFi operations\n\nWould you like me to analyze a specific contract?';
    }
    
    if (input.includes('audit') || input.includes('security')) {
      return 'Security audit recommendations for Sei contracts:\n\n✅ Static analysis completed\n⚠️ 3 medium-risk issues found\n🔍 Dynamic testing in progress\n\nKey findings:\n• Access control patterns need review\n• Consider MEV protection on Sei\n• Update to latest Sei SDK version';
    }
    
    if (input.includes('sei') || input.includes('network')) {
      return 'Sei Network security insights:\n\n📊 Current network health: 98.5%\n⚡ Block time: 392ms (excellent)\n🔗 Validator uptime: 99.2%\n\nSei-specific recommendations:\n• Leverage parallel execution for gas savings\n• Use built-in order matching for DEX contracts\n• Consider Sei\'s twin-turbo consensus for high-frequency apps';
    }
    
    return 'I can help you with:\n\n🔍 Contract vulnerability analysis\n⚡ Gas optimization strategies\n🛡️ Security audit reviews\n📈 Sei network insights\n🚀 Best practices for Sei development\n\nWhat specific area would you like to explore?';
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-card border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-teal-500/10 to-cyan-400/10 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Sentinel AI</h3>
            <p className="text-xs text-muted-foreground">Security Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              } items-start space-x-2`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-2'
                    : 'bg-gradient-to-br from-teal-500 to-cyan-400 text-white mr-2'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about smart contract security..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};