import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Contract, ContractContextType } from '../types/contracts';
import { supabase } from '../config/supabase';
import { useAuth0 } from '@auth0/auth0-react';

// Updated demo contract definition
const DEMO_CONTRACT: Contract = {
  id: 'demo-contract',
  metadata: {
    filename: 'Sample_Sales_Contract.pdf',
    filesize: 1024 * 1024,
    timestamp: new Date().toISOString()
  },
  analysis: {
    metadata: {
      contractDate: '2024-01-01',
      parties: {
        company: 'TechCorp Inc.',
        contractor: 'Sales Representative'
      },
      jurisdiction: 'California',
      governingLaw: 'California Law'
    },
    classification: {
      type: 'Sales Representative Agreement',
      primaryCharacteristics: [
        'Commission-based compensation',
        'Territory restrictions',
        'Non-compete provisions',
        'Performance targets'
      ]
    },
    compensation: {
      baseCompensation: {
        type: 'Annual Salary',
        amount: 75000,
        currency: null,
        frequency: 'Monthly',
        isGuaranteed: true
      },
      commission: {
        type: null,
        baseRate: 0.05,
        tiers: [
          { threshold: 100000, rate: 0.07 },
          { threshold: 250000, rate: 0.09 },
          { threshold: 500000, rate: 0.12 }
        ],
        caps: {
          exists: true
        }
      }
    },
    termination: {
      noticePeriod: {
        days: 30,
        isReciprocal: true
      },
      immediateTerminationClauses: [
        'Material breach of contract',
        'Violation of confidentiality',
        'Criminal conduct',
        'Failure to meet minimum performance targets'
      ]
    },
    intellectualProperty: {
      ownership: {
        workProduct: 'Company owns all work product'
      },
      moralRights: {
        waived: true
      }
    },
    restrictiveCovenants: {
      nonCompete: {
        duration: 1,
        geographicScope: ['California', 'Oregon', 'Washington'],
        businessScope: 'Enterprise Software Sales'
      },
      nonSolicitation: {
        duration: 2,
        applies: {
          customers: 'All current and prospective customers',
          employees: 'All employees and contractors',
          suppliers: 'Key suppliers and vendors'
        }
      }
    },
    confidentiality: {
      duration: {
        type: 'Perpetual'
      },
      scope: [
        'Customer information',
        'Pricing strategies',
        'Sales methodologies',
        'Product roadmaps',
        'Business strategies'
      ],
      exceptions: [
        'Publicly available information',
        'Required by law',
        'Prior written approval'
      ]
    },
    liability: {
      indemnification: {
        scope: [
          'Breach of contract',
          'Negligent acts',
          'Intellectual property infringement'
        ],
        insuranceRequired: true
      },
      limitations: {
        capAmount: '12 months of compensation',
        exclusions: [
          'Willful misconduct',
          'Gross negligence',
          'Breach of confidentiality'
        ]
      }
    }
  }
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const loadStoredData = () => {
      console.log('Loading stored data...');
      const storedContracts = localStorage.getItem('contracts');
      const storedSelectedContract = localStorage.getItem('selectedContract');
      
      let contractsToLoad: Contract[] = [DEMO_CONTRACT]; // Always start with demo contract
      
      if (storedContracts) {
        try {
          const parsedContracts = JSON.parse(storedContracts);
          
          // Ensure uniqueness by ID and exclude any existing demo contract
          const userContracts = Array.isArray(parsedContracts) 
            ? parsedContracts.filter(contract => contract.id !== 'demo-contract')
            : [parsedContracts].filter(contract => contract.id !== 'demo-contract');
          
          contractsToLoad = [...contractsToLoad, ...userContracts];
          
          setContracts(contractsToLoad);
          
          if (storedSelectedContract) {
            const parsedSelected = JSON.parse(storedSelectedContract);
            console.log('Setting selected contract:', parsedSelected);
            setCurrentContract(parsedSelected);
          } else {
            // If no contract is selected, default to demo contract
            setCurrentContract(DEMO_CONTRACT);
          }
        } catch (error) {
          console.error('Error loading stored contracts:', error);
          setContracts([DEMO_CONTRACT]);
          setCurrentContract(DEMO_CONTRACT);
          localStorage.removeItem('contracts');
          localStorage.removeItem('selectedContract');
        }
      } else {
        // If no contracts stored, initialize with demo contract
        setContracts([DEMO_CONTRACT]);
        setCurrentContract(DEMO_CONTRACT);
        localStorage.setItem('contracts', JSON.stringify([DEMO_CONTRACT]));
        localStorage.setItem('selectedContract', JSON.stringify(DEMO_CONTRACT));
      }
    };

    loadStoredData();
  }, []);

  const setSelectedContract = (contract: Contract | null) => {
    setCurrentContract(contract);
    if (contract) {
      localStorage.setItem('selectedContract', JSON.stringify(contract));
    } else {
      localStorage.removeItem('selectedContract');
    }
  };

  const addContract = (contract: Contract) => {
    setContracts(prevContracts => {
      // Check if contract with same ID already exists
      const exists = prevContracts.some(c => c.id === contract.id);
      if (exists) {
        // Update existing contract
        const updatedContracts = prevContracts.map(c => 
          c.id === contract.id ? contract : c
        );
        localStorage.setItem('contracts', JSON.stringify(updatedContracts));
        return updatedContracts;
      }
      
      // Add new contract while preserving demo contract
      const updatedContracts = [
        DEMO_CONTRACT,
        ...prevContracts.filter(c => c.id !== 'demo-contract'),
        contract
      ];
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
      return updatedContracts;
    });
    setSelectedContract(contract);
  };

  const clearContracts = () => {
    // Reset to only demo contract
    setContracts([DEMO_CONTRACT]);
    setCurrentContract(DEMO_CONTRACT);
    localStorage.setItem('contracts', JSON.stringify([DEMO_CONTRACT]));
    localStorage.setItem('selectedContract', JSON.stringify(DEMO_CONTRACT));
  };

  const refreshContract = async (id: string) => {
    // Don't refresh demo contract
    if (id === 'demo-contract') return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data: contract, error: supabaseError } = await supabase
        .from('contracts')
        .select(`
          *,
          analysis_results (*)
        `)
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      
      if (contract) {
        const contractData = contract as Contract;
        setSelectedContract(contractData);
        setContracts(prevContracts => {
          const updated = prevContracts.map(c => 
            c.id === contractData.id ? contractData : c
          );
          localStorage.setItem('contracts', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contract');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContractContext.Provider value={{
      contracts,
      currentContract,
      isLoading,
      error,
      setSelectedContract,
      addContract,
      clearContracts,
      refreshContract
    }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};