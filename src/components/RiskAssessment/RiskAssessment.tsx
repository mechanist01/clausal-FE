import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { RiskCategory, RiskAssessmentSummary } from '../../types/risks';
import { useRiskStore } from '../../store/riskStore';
import { useContract } from '../../contexts/ContractContext';
import { LoadingBrain } from '../LoadingSpinner/LoadingBrain';
import { useAuth0 } from '@auth0/auth0-react';
import RiskList from './RiskList';
import { DemoAlertModal } from '../DemoAlertModal';

interface RiskSummaryProps {
  summary: RiskAssessmentSummary;
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="font-medium text-red-800">High Priority</div>
        <div className="text-2xl font-bold text-red-900">{summary.highPriorityCount}</div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="font-medium text-yellow-800">Medium Priority</div>
        <div className="text-2xl font-bold text-yellow-900">{summary.mediumPriorityCount}</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="font-medium text-green-800">Low Priority</div>
        <div className="text-2xl font-bold text-green-900">{summary.lowPriorityCount}</div>
      </div>
    </div>
  );
};

const RiskAssessment: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { currentContract } = useContract();
  const { 
    currentRisks,
    currentSummary,
    isLoading: isRiskLoading,
    error,
    setCurrentContract,
    assessRisks
  } = useRiskStore();
  
  const [selectedCategory] = useState<RiskCategory | 'all'>('all');
  const [showDemoAlert, setShowDemoAlert] = useState(false);

  const isDemoContract = currentContract?.id === 'demo-contract';

  useEffect(() => {
    if (currentContract) {
      setCurrentContract(currentContract.id);
    }
  }, [currentContract, setCurrentContract]);

  const handleAssessRisks = async () => {
    if (!currentContract?.id) return;
    
    if (isDemoContract) {
      setShowDemoAlert(true);
      return;
    }
    
    await assessRisks(currentContract.id, getAccessTokenSilently);
  };

  const risks = currentRisks();
  const summary = currentSummary();
  const filteredRisks = selectedCategory === 'all' 
    ? risks 
    : risks.filter(risk => risk.category === selectedCategory);

  if (!currentContract) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Contract Selected</h3>
        <p className="text-gray-600">Please select a contract to analyze its risks.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto relative">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Risk Assessment</h2>
          <p className="text-gray-600">
            Analyzing: {currentContract.metadata?.filename}
          </p>
        </div>

        {!risks.length ? (
          <div className="text-center p-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-600 mb-4">
              Analyze your contract for potential risks and red flags
            </p>
            <button
              onClick={handleAssessRisks}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              disabled={isRiskLoading}
            >
              Start Assessment
            </button>
          </div>
        ) : (
          !isDemoContract && (
            <>
              {summary && <RiskSummary summary={summary} />}
              <RiskList risks={filteredRisks} />
            </>
          )
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mt-4">
            {error}
          </div>
        )}

        {isRiskLoading && <LoadingBrain />}
      </div>

      <DemoAlertModal
        feature="Risk Assessment"
        isOpen={showDemoAlert}
        onClose={() => setShowDemoAlert(false)}
      />
    </>
  );
};

export default RiskAssessment;