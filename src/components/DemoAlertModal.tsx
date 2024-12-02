import React from 'react';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoAlertModalProps {
  feature: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DemoAlertModal: React.FC<DemoAlertModalProps> = ({ 
  feature, 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Upload Your Contract
          </h3>
          
          <p className="mt-2 text-gray-600">
            To use {feature}, please upload your own contract. The sample contract is for demonstration purposes only.
          </p>

          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none"
            >
              Upload Contract
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};