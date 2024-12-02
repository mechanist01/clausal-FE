// store/riskStore.ts
import { create } from 'zustand';
import type { Risk, RiskAssessmentSummary } from '../types/risks';
import { persist } from 'zustand/middleware';

interface RiskState {
  currentContractId: string | null;
  risks: Record<string, Risk[]>;
  summaries: Record<string, RiskAssessmentSummary>;
  isLoading: boolean;
  error: string | null;
  currentRisks: () => Risk[];
  currentSummary: () => RiskAssessmentSummary | null;
  setCurrentContract: (contractId: string) => void;
  loadRiskAssessment: (contractId: string, getToken: () => Promise<string>) => Promise<void>;
  assessRisks: (contractId: string, getToken: () => Promise<string>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRiskStore = create<RiskState>()(
  persist(
    (set, get) => ({
      currentContractId: null,
      risks: {},
      summaries: {},
      isLoading: false,
      error: null,

      currentRisks: () => {
        const { currentContractId, risks } = get();
        return currentContractId ? risks[currentContractId] || [] : [];
      },

      currentSummary: () => {
        const { currentContractId, summaries } = get();
        return currentContractId ? summaries[currentContractId] || null : null;
      },

      setCurrentContract: (contractId: string) => {
        set({ currentContractId: contractId });
      },

      loadRiskAssessment: async (contractId: string, getToken: () => Promise<string>) => {
        try {
          set({ isLoading: true, error: null });

          const token = await getToken();

          const response = await fetch('http://localhost:5000/riskassess', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
              contract_id: contractId
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to load risk assessment';
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
              errorMessage = `${errorMessage}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const data = await response.json();
          
          if (!data) {
            throw new Error('No data received from server');
          }

          if (!Array.isArray(data.risks) || !data.summary) {
            throw new Error('Invalid response format from server');
          }

          set((state) => ({
            risks: {
              ...state.risks,
              [contractId]: data.risks
            },
            summaries: {
              ...state.summaries,
              [contractId]: data.summary
            }
          }));

        } catch (error) {
          console.error('Error loading risk assessment:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load risk assessment',
            risks: {
              [contractId]: []
            },
            summaries: {
              ...get().summaries,
              [contractId]: {
                totalRisks: 0,
                highPriorityCount: 0,
                mediumPriorityCount: 0,
                lowPriorityCount: 0,
                risksByCategory: {}
              }
            }
          });
        } finally {
          set({ isLoading: false });
        }
      },

      assessRisks: async (contractId: string, getToken: () => Promise<string>) => {
        try {
          set({ isLoading: true, error: null });

          const token = await getToken();

          const response = await fetch('http://localhost:5000/riskassess', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
              contract_id: contractId
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to assess risks';
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
              errorMessage = `${errorMessage}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const data = await response.json();

          if (!Array.isArray(data.risks) || !data.summary) {
            throw new Error('Invalid response format from server');
          }

          set((state) => ({
            risks: {
              ...state.risks,
              [contractId]: data.risks
            },
            summaries: {
              ...state.summaries,
              [contractId]: data.summary
            }
          }));
        } catch (error) {
          console.error('Error in risk assessment:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to assess risks',
            risks: {
              [contractId]: []
            },
            summaries: {
              ...get().summaries,
              [contractId]: {
                totalRisks: 0,
                highPriorityCount: 0,
                mediumPriorityCount: 0,
                lowPriorityCount: 0,
                risksByCategory: {}
              }
            }
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      }
    }),
    {
      name: 'risk-storage',
      partialize: (state) => ({
        risks: state.risks,
        summaries: state.summaries
      })
    }
  )
);