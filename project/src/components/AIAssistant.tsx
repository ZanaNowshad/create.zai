import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader, ArrowRight } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'code' | 'command' | 'text';
  language?: string;
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectContentType = (content: string): { type: Message['type']; language?: string } => {
    if (content.startsWith('```')) {
      const match = content.match(/```(\w+)?\n/);
      return { type: 'code', language: match?.[1] || 'plaintext' };
    }
    if (content.startsWith('$')) {
      return { type: 'command' };
    }
    return { type: 'text' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an AI coding assistant. Provide code snippets with proper markdown formatting and shell commands starting with $. Keep responses concise and focused.',
            },
            ...messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: 'user', content: input },
          ],
        }),
      });

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      const { type, language } = detectContentType(aiContent);

      const aiMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        type,
        language,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = (content: string, type: Message['type']) => {
    if (type === 'command') {
      // Send to terminal
      const command = content.replace(/^\$\s*/, '');
      // Implement terminal execution
    } else if (type === 'code') {
      // Send to editor
      const code = content.replace(/```\w*\n/, '').replace(/```$/, '');
      // Implement editor insertion
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Assistant</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`relative max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {message.type === 'code' && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {message.language}
                </div>
              )}
              <pre className={`text-sm ${message.type === 'code' ? 'font-mono' : ''}`}>
                <code>{message.content}</code>
              </pre>
              {message.role === 'assistant' && (message.type === 'code' || message.type === 'command') && (
                <button
                  onClick={() => handleExecute(message.content, message.type)}
                  className="absolute -right-2 -bottom-2 p-1 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <ArrowRight size={12} />
                </button>
              )}
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <Loader className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI assistant..."
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-purple-600 dark:bg-purple-500 p-2 text-white hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
