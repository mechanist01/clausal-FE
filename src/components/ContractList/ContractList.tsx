import React from 'react';
import { FileText } from 'lucide-react';
import type { Contract } from '../../types/contracts';

interface ContractListProps {
  contracts: Contract[];
  selectedContract: Contract | null;
  onContractSelect: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({
  contracts,
  selectedContract,
  onContractSelect,
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 lg:p-4">
      <h2 className="text-base lg:text-lg font-semibold mb-3">
        Contracts ({contracts.length})
      </h2>
      
      <div className="space-y-2">
        {Array.isArray(contracts) && contracts.map((contract) => {
          const uniqueKey = `${contract.metadata.filename}-${contract.metadata.timestamp}`;
          const isSelected = selectedContract?.metadata.timestamp === contract.metadata.timestamp;
          
          return (
            <button
              key={uniqueKey}
              onClick={() => onContractSelect(contract)}
              className={`w-full flex items-center gap-2 p-2 lg:p-3 rounded-lg transition-colors text-left
                ${isSelected 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-50'}`}
            >
              <FileText className="flex-shrink-0" size={18} />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate text-sm lg:text-base">
                  {contract.metadata.filename}
                </p>
                <p className="text-xs lg:text-sm text-gray-500">
                  {formatDate(contract.metadata.timestamp)} · {formatFileSize(contract.metadata.filesize)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContractList;