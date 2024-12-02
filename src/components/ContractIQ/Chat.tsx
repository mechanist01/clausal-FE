// components/ContractIQ/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import type { ChatMessage } from '../../types/contracts';
import useContractService from '../../services/contractService';
import { useContract } from '../../contexts/ContractContext';
import { LoadingBrain } from '../LoadingSpinner/LoadingBrain';
import { useAuth0 } from '@auth0/auth0-react';

interface ChatProps {
  contractId: string;
}

const Chat: React.FC<ChatProps> = ({ contractId }) => {
  const { currentContract } = useContract();
  const { user, getAccessTokenSilently } = useAuth0();
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  useEffect(() => {
    if (currentContract) {
      setCurrentContract(currentContract.id);
      setError(null);
      setRetryCount(0);
    }
    return () => {
      setLoading(false);
    };
  }, [currentContract, setCurrentContract, setLoading]);

  const currentMessages = getCurrentMessages();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      inputRef.current?.focus();
    }
  }, []);

  const sendMessageWithRetry = async (
    userMessage: ChatMessage, 
    token: string, 
    retryAttempt = 0
  ): Promise<ChatMessage> => {
    try {
      const response = await fetch('http://localhost:5000/contractIQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage.content,
          contractId: currentContract?.id,
          userId: user?.sub
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to process chat message');
      }

      if (!data || typeof data.content !== 'string') {
        throw new Error('Invalid response format from server');
      }

      return {
        id: data.id || crypto.randomUUID(),
        contract_id: currentContract?.id || '',
        user_id: user?.sub || '',
        role: 'assistant',
        content: data.content,
        contractReference: data.contractReference
      };
    } catch (error) {
      if (retryAttempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryAttempt + 1)));
        return sendMessageWithRetry(userMessage, token, retryAttempt + 1);
      }
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentContract || !user) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      contract_id: currentContract.id,
      user_id: user.sub || '',
      role: 'user',
      content: inputMessage.trim()
    };

    try {
      setLoading(true);
      setError(null);
      
      addMessage(currentContract.id, userMessage);
      setInputMessage('');

      const token = await getAccessTokenSilently();
      const assistantMessage = await sendMessageWithRetry(userMessage, token);
      addMessage(currentContract.id, assistantMessage);
      setRetryCount(0);

    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      setRetryCount(prev => {
        const newCount = prev + 1;
        if (newCount >= MAX_RETRIES) {
          setError('Maximum retry attempts reached. Please try again later.');
        }
        return newCount;
      });
    } finally {
      setLoading(false);
      
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        inputRef.current?.focus();
      }
    }
  };

  const messages = getCurrentMessages();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative pb-20 md:pb-4">
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
                    This analysis is for informational purposes only and does not constitute legal advice.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isLoading && <LoadingBrain message="Analyzing contract..." />}

      {error && (
        <div className="absolute bottom-20 left-4 right-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
          {retryCount > 0 && retryCount < MAX_RETRIES && (
            <span className="ml-2">Retrying... ({retryCount}/{MAX_RETRIES})</span>
          )}
        </div>
      )}

      <form 
        onSubmit={handleSendMessage} 
        className="p-4 border-t mt-auto bg-white fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto"
      >
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            ref={inputRef}
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
    </div>
  );
};

export default Chat;