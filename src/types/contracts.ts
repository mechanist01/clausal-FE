export interface Contract {
    analysis: ContractAnalysis;
    metadata: {
      filename: string;
      filesize: number;
      timestamp: string;
    };
    saved_response_file: string;
    status: string;
    id: string;
  }
  
  interface ContractMetadata {
    contractDate: string;
    parties: {
      company: string;
      contractor: string;
    };
    jurisdiction: string;
    governingLaw: string;
  }
  
  export interface ContractAnalysis {
    metadata: ContractMetadata;
    classification: {
        type: string;
        primaryCharacteristics: string[];
    };
    compensation: {
        baseCompensation: {
            type: string;
            amount: number | null;
            currency: string | null;
            frequency: string;
            isGuaranteed: boolean;
        };
        commission: {
            type: string | null;
            baseRate: number;
            tiers: CommissionTier[];
            caps: {
                exists: boolean;
            };
        };
    };
    termination: any;
    intellectualProperty: any;
    restrictiveCovenants: any;
    confidentiality: any;
    liability: any;
  }
  
  interface CommissionTier {
    threshold: number;
    rate: number;
  }
  
  export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    contractReference?: {
        section: string;
        content: string;
    };
  }