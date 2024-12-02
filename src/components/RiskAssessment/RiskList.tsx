import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Shield, Lock, DollarSign, XSquare, ScrollText, Scale } from 'lucide-react';
import type { Risk } from '../../types/risks';

const CATEGORY_ICONS = {
  compensation: DollarSign,
  termination: XSquare,
  ip: ScrollText,
  covenants: Scale,
  confidentiality: Lock,
  liability: Shield
};

interface RiskListProps {
  risks: Risk[];
}

const RiskList: React.FC<RiskListProps> = ({ risks }) => {
  const [expandedRiskIds, setExpandedRiskIds] = useState<Set<string>>(new Set());

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

  if (!risks?.length) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Risks Found</h3>
        <p className="text-gray-600">No risk assessment data is available for this contract.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {risks.map((risk, index) => {
        const isExpanded = expandedRiskIds.has(index.toString());
        const CategoryIcon = CATEGORY_ICONS[risk.category] || AlertTriangle;

        return (
          <div 
            key={`${risk.category}-${index}`}
            className={`
              border rounded-lg transition-all duration-200 overflow-hidden
              ${risk.severity === 'high' ? 'border-red-200 bg-red-50' :
                risk.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50'}
            `}
          >
            <button
              onClick={() => toggleRiskExpansion(index)}
              className="w-full text-left p-4 focus:outline-none"
            >
              <div className="flex items-start gap-3">
                <CategoryIcon className="flex-shrink-0 mt-1" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium capitalize">
                      {risk.category}
                    </span>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full border
                      ${risk.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                        risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'}
                    `}>
                      {risk.severity.toUpperCase()}
                    </span>
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
      })}
    </div>
  );
};

export default RiskList;