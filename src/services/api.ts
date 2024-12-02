// services/api.ts
import type { ChatMessage } from '../types/contracts'; // Ensure correct import for ChatMessage

const API_URL = 'http://127.0.0.1:5000';

export const analyzeContract = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message: errorData.message || 'Failed to analyze contract',
        status: response.status,
        details: errorData.details
      });
    }

    return await response.json(); // Returns the analysis result
  } catch (error) {
    console.error('Error in analyzeContract:', error);
    throw handleApiError(error);
  }
};

export const sendChatMessage = async (
  message: string, 
  contractId: string,
  chatHistory: ChatMessage[] // Added chatHistory parameter
): Promise<ChatMessage> => {
  try {
    const response = await fetch(`${API_URL}/contractIQ`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, contractId, chatHistory }), // Include chatHistory in the request body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message: errorData.message || 'Failed to send message',
        status: response.status,
        details: errorData.details
      });
    }

    return await response.json(); // Returns the ChatMessage object
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw handleApiError(error);
  }
};

export class ApiError extends Error {
  status?: number;
  details?: string;

  constructor({ message, status, details }: { 
    message: string; 
    status?: number; 
    details?: string; 
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError({
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500,
    details: error.details || 'Internal server error'
  });
};