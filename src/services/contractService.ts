import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import type { Contract, ContractAnalysis } from '../types/contracts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const MAX_TIMEOUT = 300000; // 5 minutes

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const useContractService = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "openid profile email"
        }
      });

      return {
        Authorization: `Bearer ${token}`
      };
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new ApiError('Authentication failed');
    }
  };

  const analyzeContract = async (file: File): Promise<{ data: Contract }> => {
    const controller = new AbortController();
    
    try {
      const headers = await getHeaders();
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('Starting analysis for', file.name);

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          ...headers,
          'Accept': 'application/json'
        },
        timeout: MAX_TIMEOUT,
        signal: controller.signal,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      // Log raw response for debugging
      console.log('Raw response data:', JSON.stringify(response.data, null, 2));

      const rawData = response.data;
      
      // Add more detailed validation
      if (!rawData) {
        throw new ApiError('Empty response from server');
      }

      if (!rawData.status || rawData.status !== 'success') {
        throw new ApiError('Invalid response status');
      }

      // Extract analysis data
      const contractData: Contract = {
        id: rawData.contractId,
        metadata: {
          filename: rawData.metadata.filename || file.name,
          filesize: rawData.metadata.filesize || file.size,
          timestamp: rawData.metadata.timestamp || new Date().toISOString()
        },
        analysis: rawData.analysis
      };

      console.log('Transformed contract data:', contractData);
      
      return { data: contractData };
      
    } catch (error) {
      console.error('Full error details:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new ApiError(
            'The analysis is taking longer than expected. The file might be too large or complex.'
          );
        }

        if (!error.response) {
          throw new ApiError('Connection failed. Please check your network and try again.');
        }

        // Log error response for debugging
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });

        const status = error.response.status;
        const errorData = error.response.data as any;

        switch (status) {
          case 400:
            throw new ApiError(errorData.message || 'Invalid request');
          case 401:
            throw new ApiError('Authentication required');
          case 413:
            throw new ApiError('File is too large');
          case 415:
            throw new ApiError('File type not supported');
          case 500:
            throw new ApiError('Server error. Please try again later.');
          default:
            throw new ApiError(
              errorData?.message || 'An unexpected error occurred'
            );
        }
      }

      throw new ApiError('Failed to analyze contract');
    } finally {
      controller.abort();
    }
  };

  return {
    analyzeContract
  };
};

export default useContractService;