// types/risks.ts

import { LucideIcon } from 'lucide-react';

export type RiskSeverity = 'high' | 'medium' | 'low';

export type RiskCategory = 
  | 'compensation'
  | 'termination'
  | 'ip'
  | 'covenants'
  | 'confidentiality'
  | 'liability';

export interface Risk {
  id?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  category: RiskCategory;
  recommendation?: string;
}

export interface RisksByCategory {
  [key: string]: Risk[];
}

export interface RiskAssessmentSummary {
  totalRisks: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  risksByCategory: RisksByCategory;
  lastUpdated?: string;
}

export interface RiskAssessmentResponse {
  risks: Risk[];
  summary: RiskAssessmentSummary;
}

export interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  description: string;
}

export interface RiskCardProps {
  risk: Risk;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface RiskSummaryProps {
  summary: RiskAssessmentSummary;
}