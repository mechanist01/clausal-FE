import React, { useState, useEffect } from 'react';
import Upload from '../components/Upload/Upload';
import ContractAnalysis from '../components/ContractAnalysis/ContractAnalysis';
import ContractList from '../components/ContractList/ContractList';
import type { Contract } from '../types/contracts';
import { useChatStore } from '../store/chatStore';

const HomePage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { clearAllMessages } = useChatStore();

  useEffect(() => {
    const storedContracts = localStorage.getItem('contracts');
    const storedSelectedContract = localStorage.getItem('selectedContract');
    
    if (storedContracts) {
      try {
        const parsed = JSON.parse(storedContracts);
        setContracts(Array.isArray(parsed) ? parsed : [parsed]);
        
        if (storedSelectedContract) {
          setSelectedContract(JSON.parse(storedSelectedContract));
        } else {
          setSelectedContract(Array.isArray(parsed) ? parsed[0] : parsed);
        }
      } catch (error) {
        console.error('Error parsing stored contracts:', error);
        localStorage.removeItem('contracts');
        localStorage.removeItem('selectedContract');
      }
    }
  }, []);

  const handleUploadSuccess = (contractData: Contract) => {
    setIsLoading(true);
    const updatedContracts = [...contracts, contractData];
    setContracts(updatedContracts);
    setSelectedContract(contractData);
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    localStorage.setItem('selectedContract', JSON.stringify(contractData));
    setIsLoading(false);
  };

  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract);
    localStorage.setItem('selectedContract', JSON.stringify(contract));
  };

  const handleClearContracts = () => {
    localStorage.removeItem('contracts');
    localStorage.removeItem('selectedContract');
    clearAllMessages();
    setContracts([]);
    setSelectedContract(null);
  };

  if (contracts.length === 0) {
    return <Upload onUploadSuccess={handleUploadSuccess} />;
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-4">
      {/* Mobile view: Contract list first */}
      <div className="block lg:hidden">
        <ContractList 
          contracts={contracts} 
          selectedContract={selectedContract} 
          onContractSelect={handleContractSelect}
          onClearContracts={handleClearContracts}
        />
        
        {selectedContract && (
          <div className="mt-4">
            <ContractAnalysis 
              key={selectedContract.metadata.timestamp} 
              contract={selectedContract} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </div>

      {/* Desktop view: Side by side */}
      <div className="hidden lg:grid lg:grid-cols-[300px,1fr] lg:gap-6">
        <div className="space-y-4">
          <ContractList 
            contracts={contracts} 
            selectedContract={selectedContract} 
            onContractSelect={handleContractSelect}
            onClearContracts={handleClearContracts}
          />
        </div>
        
        {selectedContract === null ? (
          <Upload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <ContractAnalysis 
            key={selectedContract.metadata.timestamp} 
            contract={selectedContract} 
            isLoading={isLoading} 
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;