import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
}

const tooltipDefinitions: Record<string, string> = {
  // Tab headers
  'Overview': 'Basic information about your contract type and key points',
  'Pay': 'Your compensation structure including base pay and commission details',
  'Terms': 'Contract duration and termination conditions',
  'IP': 'Intellectual property rights and ownership of work',
  'Rules': 'Non-compete and non-solicitation restrictions',
  'Privacy': 'Confidentiality requirements and duration',
  'Liability': 'Your legal obligations and protections',
  
  // Classification
  'Contract Type': 'The legal classification of your employment relationship',
  'Key Points': 'Important highlights and main features of your contract',
  
  // Compensation
  'Base Compensation': 'Your fixed regular payment amount and schedule',
  'Commission Structure': 'How your performance-based earnings are calculated',
  
  // Termination
  'Notice Period': 'Required advance warning time before ending the contract',
  'Immediate Termination': 'Conditions where the contract can be ended without notice',
  
  // IP Rights
  'Work Product Ownership': 'Who owns the work you create during employment',
  'Moral Rights': 'Your rights to be named as creator and protect work integrity',
  
  // Covenants
  'Non-Compete': 'Restrictions on working for competitors after leaving',
  'Non-Solicitation': 'Restrictions on approaching clients or colleagues after leaving',
  
  // Confidentiality
  'Duration': 'The length of time you must keep information confidential - this may be permanent or for a specific period after leaving',
  'Confidential Information': 'Information you must keep private, including customer details, internal processes, pricing, business plans, and trade secrets you learn during employment',
  'Confidentiality Exceptions': 'Situations where you can legally share confidential information: when it becomes public knowledge through no fault of yours, basic skills and experience gained on the job, or when required by law',
  
  // Liability
  'Indemnification': 'Your responsibility to cover legal costs and damages',
  'Limitations': 'Limits on your legal and financial obligations',
  'Liability Scope': 'Specific situations where you might need to cover costs',
  'Liability Exclusions': 'Situations not covered by liability limits'
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title }) => {
  const tooltipText = tooltipDefinitions[title] || 'No description available';

  return (
    <div className="group relative inline-block">
      <HelpCircle size={14} className="inline-block ml-1 text-gray-400" />
      <div className="invisible group-hover:visible absolute z-50 px-2 py-1 text-sm 
                    bg-gray-900 text-white rounded w-48 -right-3 top-6
                    before:content-[''] before:absolute before:top-0 before:right-4 
                    before:-translate-y-2 before:border-4 before:border-transparent 
                    before:border-b-gray-900">
        {tooltipText}
      </div>
    </div>
  );
};

export default InfoTooltip;