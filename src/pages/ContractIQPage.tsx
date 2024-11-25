// pages/ContractIQPage.tsx
import React, { useState, useEffect } from 'react';
import Chat from '../components/ContractIQ/Chat';
import { Contract } from '../types/contracts';
import { AlertTriangle } from 'lucide-react';

const ContractIQPage: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    const storedContract = localStorage.getItem('selectedContract');
    if (storedContract) {
      setSelectedContract(JSON.parse(storedContract));
    }
  }, []);

  if (!selectedContract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Contract Selected</h2>
        <p className="text-gray-600">Please select a contract to start chatting</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <h1 className="text-xl font-semibold mb-1">Contract IQ Assistant</h1>
        <p className="text-gray-600">Analyzing: {selectedContract.metadata.filename}</p>
      </div>
      <div className="h-[calc(100vh-16rem)]">
        <Chat contractId={selectedContract.metadata.filename} />
      </div>
    </div>
  );
};

export default ContractIQPage;