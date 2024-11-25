import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Contract } from '../../types/contracts';
import type { Risk } from '../../types/risks';

const RiskAssessment: React.FC = () => {
  const [risks, setRisks] = useState<Risk[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const storedContract = localStorage.getItem('selectedContract');
    if (storedContract) {
      setContract(JSON.parse(storedContract));
    }
  }, []);

  const assessRisks = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/riskassess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contract_id: contract.id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assess risks');
      }
      
      const data = await response.json();
      setRisks(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!contract) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Contract Selected</h3>
        <p className="text-gray-600">Please select a contract to analyze its risks.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (!risks) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
        <p className="text-gray-600 mb-4">Analyze your contract for potential risks and red flags</p>
        <button
          onClick={assessRisks}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {risks.map((risk, index: number) => (
        <div key={index} className="p-4 rounded-lg border" style={{
          backgroundColor: risk.severity === 'high' ? '#FEF2F2' : 
                          risk.severity === 'medium' ? '#FFFBEB' : 
                          '#F0FDF4',
          borderColor: risk.severity === 'high' ? '#FCA5A5' : 
                      risk.severity === 'medium' ? '#FCD34D' : 
                      '#86EFAC'
        }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={
              risk.severity === 'high' ? 'text-red-500' :
              risk.severity === 'medium' ? 'text-yellow-500' :
              'text-green-500'
            } />
            <div>
              <h4 className="font-semibold">{risk.title}</h4>
              <p className="text-sm mt-1">{risk.description}</p>
              {risk.recommendation && (
                <p className="text-sm mt-2 font-medium">
                  Recommendation: {risk.recommendation}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskAssessment;