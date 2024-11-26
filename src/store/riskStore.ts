// store/riskStore.ts
import { create } from 'zustand';
import type { Risk, RiskAssessmentSummary } from '../types/risks';

interface RiskState {
  currentContractId: string | null;
  risks: Record<string, Risk[]>;
  summaries: Record<string, RiskAssessmentSummary>;
  isLoading: boolean;
  error: string | null;
  currentRisks: () => Risk[];
  currentSummary: () => RiskAssessmentSummary | null;
  setCurrentContract: (contractId: string) => void;
  addRiskAssessment: (contractId: string, risks: Risk[], summary: RiskAssessmentSummary) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRiskAssessment: (contractId: string) => void;
}

export const useRiskStore = create<RiskState>()((set, get) => ({
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

  addRiskAssessment: (contractId: string, newRisks: Risk[], summary: RiskAssessmentSummary) => {
    set((state) => ({
      risks: {
        ...state.risks,
        [contractId]: newRisks
      },
      summaries: {
        ...state.summaries,
        [contractId]: summary
      }
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearRiskAssessment: (contractId: string) => {
    set((state) => {
      const { [contractId]: _, ...remainingRisks } = state.risks;
      const { [contractId]: __, ...remainingSummaries } = state.summaries;
      return {
        risks: remainingRisks,
        summaries: remainingSummaries
      };
    });
  }
}));