'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types/news';
import ChatMessageComponent from './ChatMessage';

interface ChatProps {
  articleTitle: string;
  articleContent: string;
  articleKey: string; // Add this to force re-render when article changes
}

export default function Chat({ articleTitle, articleContent, articleKey }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset chat state when article changes
  useEffect(() => {
    setMessages([]);
    setInputValue('');
    setIsLoading(false);
  }, [articleKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [articleKey]); // Focus when article changes

  // Generate relevant prompts based on article content
  const generateSuggestedPrompts = () => {
    const prompts = [
      "What are the main points of this article?",
      "Can you explain this in simpler terms?",
      "What are the latest developments on this topic?",
      "What are the implications of this news?",
    ];

    // Add content-specific prompts based on keywords
    const content = articleContent.toLowerCase();
    const title = articleTitle.toLowerCase();

    if (content.includes('technology') || title.includes('tech')) {
      prompts.push("How might this technology impact society?");
      prompts.push("What are the latest developments in this technology?");
      prompts.push("What are the potential risks and benefits?");
    }

    if (content.includes('economy') || content.includes('financial') || content.includes('market')) {
      prompts.push("What are the economic implications?");
      prompts.push("What are the latest market reactions to this news?");
      prompts.push("How might this affect the markets?");
    }

    if (content.includes('politics') || content.includes('government') || content.includes('policy')) {
      prompts.push("What are the political implications?");
      prompts.push("What are the latest reactions from political leaders?");
      prompts.push("How might this affect policy decisions?");
    }

    if (content.includes('health') || content.includes('medical') || content.includes('covid')) {
      prompts.push("What are the health implications?");
      prompts.push("What are the latest medical developments on this topic?");
      prompts.push("How might this affect public health?");
    }

    if (content.includes('climate') || content.includes('environment') || content.includes('sustainability')) {
      prompts.push("What are the environmental implications?");
      prompts.push("What are the latest climate science findings on this?");
      prompts.push("How does this relate to climate change?");
    }

    // Return unique prompts (max 6)
    return [...new Set(prompts)].slice(0, 6);
  };

  const suggestedPrompts = generateSuggestedPrompts();

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          articleTitle,
          articleContent,
          articleDescription: articleContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.fallback) {
        return data.response + "\n\n💡 Tip: Make sure your Perplexity API key is configured to get full AI responses with web search capabilities.";
      }
      
      return data.response || 'I apologize, but I was unable to generate a response. Please try again.';
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback responses if API fails
      const fallbackResponses = [
        `I'd be happy to discuss "${articleTitle}" with you, but I'm currently experiencing technical difficulties. Please try again in a moment.`,
        `That's an interesting question about this article. Unfortunately, I'm having trouble accessing my AI capabilities right now.`,
        `I apologize, but I'm unable to process your question about this news story at the moment. Please try again later.`,
      ];

      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await generateResponse(inputValue);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try asking your question again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">Ask about this article</h3>
          <p className="text-sm text-gray-300 truncate">{articleTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
            <p className="font-medium text-white">Ask me anything about this article!</p>
            <p className="text-sm mt-2 text-gray-400 leading-relaxed">
              I'm powered by Perplexity AI with real-time web search capabilities. I can help you understand key points, provide context, analyze implications, or search for the latest information about related topics.
            </p>
            
            {/* Suggested prompts */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Try these questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left p-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors text-sm border border-gray-700 hover:border-gray-600"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about this article or search for related info..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}