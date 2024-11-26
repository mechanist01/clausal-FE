import React, { useState, useEffect } from 'react';
import { AlertTriangle, DollarSign, XSquare, ScrollText, Scale, Lock, Shield, ChevronDown, ChevronUp, Filter, Brain, LucideIcon } from 'lucide-react';
import type { Risk, RiskCategory, RiskAssessmentSummary, RiskSeverity } from '../../types/risks';
import { useRiskStore } from '../../store/riskStore';

const CATEGORY_CONFIG: Record<RiskCategory, {
  icon: LucideIcon;
  label: string;
  description: string;
}> = {
  compensation: {
    icon: DollarSign,
    label: 'Compensation',
    description: 'Payment terms and structure'
  },
  termination: {
    icon: XSquare,
    label: 'Termination',
    description: 'Contract ending conditions'
  },
  ip: {
    icon: ScrollText,
    label: 'IP Rights',
    description: 'Intellectual property ownership'
  },
  covenants: {
    icon: Scale,
    label: 'Covenants',
    description: 'Non-compete and restrictions'
  },
  confidentiality: {
    icon: Lock,
    label: 'Confidentiality',
    description: 'Information protection'
  },
  liability: {
    icon: Shield,
    label: 'Liability',
    description: 'Legal obligations'
  }
};

const RiskSeverityBadge: React.FC<{ severity: RiskSeverity }> = ({ severity }) => {
  const colors: Record<RiskSeverity, string> = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
};

interface RiskCardProps {
  risk: Risk;
  isExpanded: boolean;
  onToggle: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({ risk, isExpanded, onToggle }) => {
  const CategoryIcon = CATEGORY_CONFIG[risk.category].icon;

  return (
    <div className={`
      border rounded-lg transition-all duration-200 overflow-hidden
      ${risk.severity === 'high' ? 'border-red-200 bg-red-50' :
        risk.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
        'border-green-200 bg-green-50'}
    `}>
      <button
        onClick={onToggle}
        className="w-full text-left p-4 focus:outline-none"
      >
        <div className="flex items-start gap-3">
          <CategoryIcon className="flex-shrink-0 mt-1" size={20} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">
                {CATEGORY_CONFIG[risk.category].label}
              </span>
              <RiskSeverityBadge severity={risk.severity} />
            </div>
            <h4 className="font-semibold mt-1">{risk.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
          </div>
          <div className="flex-shrink-0 ml-2">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>
      
      {isExpanded && risk.recommendation && (
        <div className="px-4 pb-4 pt-2">
          <div className="p-3 bg-white/50 rounded-lg">
            <h5 className="font-medium text-sm mb-1">Recommendation</h5>
            <p className="text-sm">{risk.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

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

const LoadingBrain = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
    <div className="flex flex-col items-center">
      <Brain 
        size={48} 
        className="text-primary animate-pulse" 
        style={{
          animation: `
            pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite,
            float 3s ease-in-out infinite
          `
        }}
      />
    
    </div>
  </div>
);

const RiskAssessment: React.FC = () => {
  const { 
    currentRisks,
    currentSummary,
    isLoading,
    error,
    setCurrentContract,
    setLoading,
    setError,
    addRiskAssessment 
  } = useRiskStore();
  
  const [contract, setContract] = useState<any>(null);
  const [expandedRiskIds, setExpandedRiskIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'all'>('all');

  useEffect(() => {
    const storedContract = localStorage.getItem('selectedContract');
    if (storedContract) {
      try {
        const parsedContract = JSON.parse(storedContract);
        console.log('Loaded contract:', parsedContract);
        setContract(parsedContract);
        setCurrentContract(parsedContract.metadata.filename);
      } catch (error) {
        console.error('Error parsing stored contract:', error);
        setError('Failed to load contract data');
      }
    }
  }, [setCurrentContract, setError]);

  const toggleRiskExpansion = (riskIndex: number) => {
    setExpandedRiskIds(prev => {
      const newSet = new Set(prev);
      const riskId = riskIndex.toString();
      if (newSet.has(riskId)) {
        newSet.delete(riskId);
      } else {
        newSet.add(riskId);
      }
      return newSet;
    });
  };

  const assessRisks = async () => {
    if (!contract?.metadata?.filename) {
      setError('No valid contract data found');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://clausal-backend-ryanaregister.replit.app/riskassess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_id: contract.metadata.filename
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assess risks');
      }
      
      const data = await response.json();
      addRiskAssessment(contract.metadata.filename, data.risks, data.summary);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const risks = currentRisks();
  const summary = currentSummary();
  const filteredRisks = selectedCategory === 'all' 
    ? risks 
    : risks.filter(risk => risk.category === selectedCategory);

  if (!contract) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Contract Selected</h3>
        <p className="text-gray-600">Please select a contract to analyze its risks.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Risk Assessment</h2>
        <p className="text-gray-600">
          Analyzing: {contract.metadata?.filename}
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
            onClick={assessRisks}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            disabled={isLoading}
          >
            Start Assessment
          </button>
        </div>
      ) : (
        <>
          {/* Summary */}
          {summary && <RiskSummary summary={summary} />}

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} />
              <span className="font-medium">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              {(Object.entries(CATEGORY_CONFIG) as [RiskCategory, typeof CATEGORY_CONFIG[RiskCategory]][]).map(([category, config]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Risk List */}
          <div className="space-y-4">
            {filteredRisks.map((risk, index) => (
              <RiskCard
                key={index}
                risk={risk}
                isExpanded={expandedRiskIds.has(index.toString())}
                onToggle={() => toggleRiskExpansion(index)}
              />
            ))}
          </div>
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mt-4">
          {error}
        </div>
      )}

      {isLoading && <LoadingBrain />}
    </div>
  );
};

export default RiskAssessment;