// components/ContractIQ/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Brain } from 'lucide-react';
import { sendChatMessage } from '../../services/api';
import { useChatStore } from '../../store/chatStore';
import type { ChatMessage } from '../../types/contracts';

interface ChatProps {
  contractId: string;
}

// LoadingBrain component to show loading animation
const LoadingBrain = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <Brain 
        size={48} 
        className="text-primary animate-pulse" 
        style={{
          animation: `
            pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite,
            float 3s ease-in-out infinite
          `
        }}
      />
      <p className="mt-4 text-gray-500 text-sm animate-pulse">
        Analyzing contract...
      </p>
    </div>
  </div>
);

const Chat: React.FC<ChatProps> = ({ contractId }) => {
  const { 
    getCurrentMessages, 
    isLoading, 
    addMessage, 
    setLoading, 
    setCurrentContract 
  } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentContract(contractId);
  }, [contractId, setCurrentContract]);

  const currentMessages = getCurrentMessages();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    addMessage(contractId, userMessage);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(inputMessage, contractId, currentMessages);
      addMessage(contractId, response);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const messages = getCurrentMessages();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.contractReference && (
                <div className="mt-2 p-2 bg-white/10 rounded text-xs">
                  <p className="font-semibold">{message.contractReference.section}</p>
                  <p>{message.contractReference.content}</p>
                </div>
              )}
              {message.role === 'assistant' && (
                <div className="mt-3 pt-3 border-t border-gray-200/20 flex items-start gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-gray-500" />
                  <p className="text-xs text-gray-500 italic">
                    This analysis is for informational purposes only and does not constitute legal advice. Please consult with a legal professional for advice specific to your situation.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isLoading && <LoadingBrain />} {/* Show loading animation when isLoading is true */}

      <form onSubmit={handleSendMessage} className="p-4 border-t mt-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about your contract..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default Chat;