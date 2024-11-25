import React, { useState } from 'react';
import { FileText, DollarSign, XSquare, ScrollText, Scale, Lock, AlertTriangle } from 'lucide-react';
import InfoTooltip from './InfoToolTip';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const TAB_CONFIGS = [
  { id: 'classification', label: 'Overview', Icon: FileText },
  { id: 'compensation', label: 'Pay', Icon: DollarSign },
  { id: 'termination', label: 'Terms', Icon: XSquare },
  { id: 'ip', label: 'IP', Icon: ScrollText },
  { id: 'covenants', label: 'Rules', Icon: Scale },
  { id: 'confidentiality', label: 'Privacy', Icon: Lock },
  { id: 'liability', label: 'Liability', Icon: AlertTriangle }
];

interface Props {
  contract: any;
  isLoading?: boolean;
}

const ContractAnalysis: React.FC<Props> = ({ contract, isLoading }) => {
  const [activeTab, setActiveTab] = useState('classification');
  const analysisData = contract?.analysis;
  
  if (!analysisData) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600">No analysis data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="border-b overflow-x-auto scrollbar-hide">
            <div className="flex whitespace-nowrap">
              {TAB_CONFIGS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center gap-1 p-3 flex-1 border-b-2 transition-colors text-sm
                    ${activeTab === id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-600 hover:text-primary'}`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <ContractContent analysis={analysisData} activeTab={activeTab} />
          </div>
        </>
      )}
    </div>
  );
};

const ContractContent = ({ analysis, activeTab }: { 
  analysis: any; 
  activeTab: string;
}) => {
  const contentMap = {
    classification: (
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">
            Contract Type
            <InfoTooltip title="Contract Type" />
          </h3>
          <p className="text-primary font-medium">{analysis?.classification?.type}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-2">
            Key Points
            <InfoTooltip title="Key Points" />
          </h3>
          <ul className="space-y-2">
            {analysis?.classification?.primaryCharacteristics?.map((point: string, idx: number) => (
              <li key={idx} className="flex gap-2 bg-gray-50 p-3 rounded-lg text-sm">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    compensation: (
      <div className="space-y-6">
        {analysis.compensation.baseCompensation.amount && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Base Compensation
              <InfoTooltip title="Base Compensation" />
            </h3>
            <p>Type: {analysis.compensation.baseCompensation.type}</p>
            <p>Amount: ${analysis.compensation.baseCompensation.amount.toLocaleString()}</p>
            <p>Frequency: {analysis.compensation.baseCompensation.frequency}</p>
            {analysis.compensation.baseCompensation.isGuaranteed && (
              <p className="text-green-600 mt-2">✓ Guaranteed</p>
            )}
          </div>
        )}

        {analysis.compensation.commission && (
          <div>
            <h3 className="font-semibold mb-3">
              Commission Structure
              <InfoTooltip title="Commission Structure" />
            </h3>
            <div className="space-y-2">
              {analysis.compensation.commission.baseRate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  Base Rate: {typeof analysis.compensation.commission.baseRate === 'number' && analysis.compensation.commission.baseRate <= 1 
                    ? `${(analysis.compensation.commission.baseRate * 100).toFixed(1)}%` 
                    : `$${analysis.compensation.commission.baseRate.toLocaleString()}`}
                </div>
              )}
              {analysis.compensation.commission.tiers?.map((tier: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  {(tier.rate * 100).toFixed(1)}% above ${tier.threshold.toLocaleString()}
                </div>
              ))}
              {analysis.compensation.commission.caps?.exists && (
                <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800">
                  ⚠️ Commission cap applies
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    termination: (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Notice Period
            <InfoTooltip title="Notice Period" />
          </h3>
          <p>{analysis.termination.noticePeriod.days} days{analysis.termination.noticePeriod.isReciprocal ? ' (Reciprocal)' : ''}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">
            Immediate Termination Clauses
            <InfoTooltip title="Immediate Termination" />
          </h3>
          <ul className="space-y-2">
            {analysis.termination.immediateTerminationClauses.map((clause: string, idx: number) => (
              <li key={idx} className="flex gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>{clause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    ip: (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Work Product Ownership
            <InfoTooltip title="Work Product Ownership" />
          </h3>
          <p className="text-[#1a73e8] font-medium">{analysis.intellectualProperty.ownership.workProduct}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Moral Rights
            <InfoTooltip title="Moral Rights" />
          </h3>
          <p>Waived: {analysis.intellectualProperty.moralRights.waived ? 'Yes' : 'No'}</p>
        </div>
      </div>
    ),
    covenants: (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Non-Compete
            <InfoTooltip title="Non-Compete" />
          </h3>
          <p>Duration: {analysis.restrictiveCovenants.nonCompete.duration} year(s)</p>
          {analysis.restrictiveCovenants.nonCompete.geographicScope.length > 0 && (
            <p className="mt-2">Geographic Scope: {analysis.restrictiveCovenants.nonCompete.geographicScope.join(', ')}</p>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Non-Solicitation
            <InfoTooltip title="Non-Solicitation" />
          </h3>
          <p>Duration: {analysis.restrictiveCovenants.nonSolicitation.duration} year(s)</p>
          <div className="mt-2">
            <p>Applies to:</p>
            <ul className="mt-1 space-y-1">
              <li>Customers: {analysis.restrictiveCovenants.nonSolicitation.applies.customers}</li>
              <li>Employees: {analysis.restrictiveCovenants.nonSolicitation.applies.employees}</li>
              <li>Suppliers: {analysis.restrictiveCovenants.nonSolicitation.applies.suppliers}</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    confidentiality: (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Duration
            <InfoTooltip title="Duration" />
          </h3>
          <p>{analysis.confidentiality.duration.type}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">
            Confidential Information
            <InfoTooltip title="Confidential Information" />
          </h3>
          <ul className="space-y-2">
            {analysis.confidentiality.scope.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">
            Confidentiality Exceptions
            <InfoTooltip title="Confidentiality Exceptions" />
          </h3>
          <ul className="space-y-2">
            {analysis.confidentiality.exceptions.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    liability: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">
            Indemnification
            <InfoTooltip title="Indemnification" />
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>Insurance Required: {analysis.liability.indemnification.insuranceRequired ? 'Yes' : 'No'}</p>
            <div className="mt-3">
              <h4 className="font-medium mb-2">
                Scope
                <InfoTooltip title="Liability Scope" />
              </h4>
              <ul className="space-y-2">
                {analysis.liability.indemnification.scope.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">
            Limitations
            <InfoTooltip title="Limitations" />
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>Cap Amount: {analysis.liability.limitations.capAmount}</p>
            <div className="mt-3">
              <h4 className="font-medium mb-2">
                Exclusions
                <InfoTooltip title="Liability Exclusions" />
              </h4>
              <ul className="space-y-2">
                {analysis.liability.limitations.exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return contentMap[activeTab as keyof typeof contentMap] || null;
};

export default ContractAnalysis;