// store/chatStore.ts
import { create } from 'zustand';
import type { ChatMessage } from '../types/contracts';

interface ChatState {
  messages: ChatMessage[]; // Array of chat messages
  isLoading: boolean; // Loading state
  addMessage: (message: ChatMessage) => void; // Function to add a message
  setLoading: (loading: boolean) => void; // Function to set loading state
  clearMessages: () => void; // Function to clear messages
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [], // Initial state for messages
  isLoading: false, // Initial loading state
  addMessage: (message: ChatMessage) => set((state) => ({ 
    messages: [...state.messages, message] // Add new message to the state
  })),
  setLoading: (loading: boolean) => set({ isLoading: loading }), // Update loading state
  clearMessages: () => set({ messages: [] }) // Clear all messages
}));