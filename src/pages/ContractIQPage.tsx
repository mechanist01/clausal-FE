// pages/ContractIQPage.tsx
import React, { useState } from 'react';
import Chat from '../components/ContractIQ/Chat';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { useContract } from '../contexts/ContractContext';
import { DemoAlertModal } from '../components/DemoAlertModal';

const ContractIQPage: React.FC = () => {
  const { currentContract, isLoading } = useContract();
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const isDemoContract = currentContract?.id === 'demo-contract';

  const handleStartChat = () => {
    if (isDemoContract) {
      setShowDemoAlert(true);
      return;
    }
    setChatStarted(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading contract...</p>
      </div>
    );
  }

  if (!currentContract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Contract Selected</h2>
        <p className="text-gray-600">Please select a contract to start chatting</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <h1 className="text-xl font-semibold mb-1">Contract IQ Assistant</h1>
          <p className="text-gray-600">Analyzing: {currentContract.metadata.filename}</p>
        </div>
        
        {!chatStarted ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MessageSquare size={48} className="mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract IQ Chat</h2>
            <p className="text-gray-600 mb-6">
              Ask questions about your contract and get instant, AI-powered answers
            </p>
            <button
              onClick={handleStartChat}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Start Chat
            </button>
          </div>
        ) : (
          <div className="h-[calc(100vh-16rem)]">
            <Chat contractId={currentContract.id} />
          </div>
        )}
      </div>

      <DemoAlertModal
        feature="Contract IQ"
        isOpen={showDemoAlert}
        onClose={() => setShowDemoAlert(false)}
      />
    </>
  );
};

export default ContractIQPage;