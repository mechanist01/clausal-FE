// src/types/risk.ts
export interface Risk {
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string | null;
  }