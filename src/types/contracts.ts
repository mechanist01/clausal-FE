export interface Contract {
    id: string;
    metadata: {
      filename: string;
      filesize: number;
      timestamp: string;
    };
    analysis: ContractAnalysis;
    user_id?: string;
    content?: string;
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
    contract_id: string;
    user_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at?: string;
    contractReference?: {
        section: string;
        content: string;
    };
  }
  
  export interface ContractContextType {
    contracts: Contract[];
    currentContract: Contract | null;
    isLoading: boolean;
    error: string | null;
    setSelectedContract: (contract: Contract | null) => void;
    addContract: (contract: Contract) => void;
    clearContracts: () => void;
    refreshContract: (id: string) => Promise<void>;
  }