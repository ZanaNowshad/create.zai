import React, { useState, useEffect } from 'react';
import { Users, MessageSquare } from 'lucide-react';

type User = {
  id: string;
  name: string;
  color: string;
  active: boolean;
};

type ChatMessage = {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
};

export default function Collaboration() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'You', color: '#8B5CF6', active: true },
    { id: '2', name: 'Alice', color: '#EC4899', active: true },
    { id: '3', name: 'Bob', color: '#10B981', active: false },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      userId: '1', // Current user
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Collaboration</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Active Users</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: user.color,
                    opacity: user.active ? 1 : 0.5,
                  }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {messages.map((message) => {
            const user = users.find((u) => u.id === message.userId);
            return (
              <div key={message.id} className="flex space-x-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: user?.color }}
                >
                  {user?.name[0]}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-purple-600 dark:bg-purple-500 p-2 text-white hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
