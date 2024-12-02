import React from 'react';
import Upload from '../components/Upload/Upload';
import ContractAnalysis from '../components/ContractAnalysis/ContractAnalysis';
import ContractList from '../components/ContractList/ContractList';
import { useContract } from '../contexts/ContractContext';
import type { Contract } from '../types/contracts';

const HomePage: React.FC = () => {
  const { 
    contracts, 
    currentContract, 
    isLoading, 
    addContract, 
    setSelectedContract,
    clearContracts
  } = useContract();

  const handleUploadSuccess = (contractData: Contract) => {
    addContract(contractData);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-4">
      {/* Mobile view */}
      <div className="block lg:hidden">
        {contracts.length > 0 && (
          <ContractList 
            contracts={contracts}
            selectedContract={currentContract}
            onContractSelect={setSelectedContract}
            onClearContracts={clearContracts}
          />
        )}
        
        {currentContract ? (
          <div className="mt-4">
            <ContractAnalysis 
              key={currentContract.id} 
              contract={currentContract} 
              isLoading={isLoading} 
            />
          </div>
        ) : (
          <Upload onUploadSuccess={handleUploadSuccess} />
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:grid lg:grid-cols-[300px,1fr] lg:gap-6">
        <div className="space-y-4">
          <ContractList 
            contracts={contracts}
            selectedContract={currentContract}
            onContractSelect={setSelectedContract}
            onClearContracts={clearContracts}
          />
        </div>
        
        {currentContract === null ? (
          <Upload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <ContractAnalysis 
            key={currentContract.id} 
            contract={currentContract} 
            isLoading={isLoading} 
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;