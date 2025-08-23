import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Shield, Zap } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
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
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulse ring effect */}
        <div className={`absolute inset-0 rounded-full bg-red-500/20 chatbox-pulse ${isHovered ? 'scale-110' : 'scale-100'} transition-transform duration-300`}></div>
        
        {/* Main button */}
        <Button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative h-16 w-16 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-red-400 hover:from-red-700 hover:via-red-600 hover:to-red-500 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform chatbox-float ${isHovered ? 'scale-110 rotate-3 chatbox-glow' : 'scale-100 rotate-0'}`}
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white drop-shadow-lg" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-red-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
        
        {/* Floating indicator */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all duration-300 chatbox-status-pulse ${isHovered ? 'scale-125' : 'scale-100'}`}>
          <Zap className="w-3 h-3" />
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-500/20 shadow-2xl shadow-red-500/10 z-50 flex flex-col backdrop-blur-sm transition-all duration-300 chatbox-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-500/20 bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-600/10 rounded-t-lg backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25 chatbox-pulse">
            <Shield className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-wide">Sentinel AI</h3>
            <p className="text-xs text-red-300/80 font-medium">Security Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbox-scrollbar">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chatbox-message-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`flex max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              } items-start space-x-2`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-red-600 to-red-500 text-white ml-2'
                    : 'bg-gradient-to-br from-gray-700 to-gray-600 text-red-300 mr-2'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-red-500/10'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-red-100/80' : 'text-red-400/60'}`}>
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
          <div className="flex justify-start chatbox-message-in">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-lg p-3 border border-red-500/10">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full chatbox-typing"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full chatbox-typing" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full chatbox-typing" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-red-500/20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="flex space-x-3">
          <Input
            placeholder="Ask about smart contract security..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-gray-800/80 border-red-500/20 text-white placeholder:text-red-300/50 focus:border-red-500/50 focus:ring-red-500/20 transition-all duration-200"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-red-400/60">SEI Network Security</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full chatbox-status-pulse"></div>
            <span className="text-red-400/60">AI Active</span>
          </div>
        </div>
      </div>
    </Card>
  );
};