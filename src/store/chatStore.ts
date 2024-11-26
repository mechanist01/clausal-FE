// store/chatStore.ts
import { create } from 'zustand';
import type { ChatMessage } from '../types/contracts';
import { persist } from 'zustand/middleware'; // Import persist middleware

interface ChatState {
  messages: Record<string, ChatMessage[]>; // Map of contractId to messages
  isLoading: boolean; // Loading state
  addMessage: (contractId: string, message: ChatMessage) => void; // Function to add a message
  setLoading: (loading: boolean) => void; // Function to set loading state
  clearMessages: (contractId: string) => void; // Function to clear messages
  clearAllMessages: () => void; // New method to clear all messages
  setCurrentContract: (contractId: string) => void; // Function to set the current contract ID
  getCurrentMessages: () => ChatMessage[]; // Function to get messages for the current contract
  currentContractId: string | null; // Track the current contract ID
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: {}, // Initial state for messages
      isLoading: false, // Initial loading state
      addMessage: (contractId: string, message: ChatMessage) => set((state) => {
        const updatedMessages = {
          ...state.messages,
          [contractId]: [...(state.messages[contractId] || []), message] // Add message to the specific contract's messages
        };
        return { messages: updatedMessages };
      }),
      setLoading: (loading: boolean) => set({ isLoading: loading }), // Update loading state
      clearMessages: (contractId: string) => set((state) => ({
        messages: {
          ...state.messages,
          [contractId]: [] // Clear messages for the specific contract
        }
      })),
      clearAllMessages: () => set({ messages: {} }), // Clear all messages
      setCurrentContract: (contractId: string) => set({ currentContractId: contractId }), // Set the current contract ID
      getCurrentMessages: () => {
        const state = get();
        return state.currentContractId ? state.messages[state.currentContractId] || [] : []; // Get messages for the current contract
      },
      currentContractId: null, // Initial state for currentContractId
    }),
    {
      name: 'chat-storage', // Name for the storage
      skipHydration: false, // Hydration settings
    }
  )
);