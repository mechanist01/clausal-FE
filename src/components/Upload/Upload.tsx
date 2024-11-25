import React, { useState, useRef, DragEvent } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { analyzeContract } from '../../services/api';
import type { Contract } from '../../types/contracts';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface UploadProps {
  onUploadSuccess: (contractData: Contract) => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeContract(selectedFile);
      onUploadSuccess(response);
      setSelectedFile(null);
    } catch (error: any) {
      setError(error.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a73e8] mb-2">Contract Analysis</h1>
        <p className="text-gray-600">Upload your contract to get detailed insights</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-[#1a73e8] bg-[#e8f0fe]' : 'border-gray-300 hover:border-[#1a73e8]'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop your contract here or{' '}
          <span className="text-[#1a73e8] hover:underline">browse</span>
        </p>
        <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, TXT</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        selectedFile && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{selectedFile.name}</span>
              <button
                className="bg-[#1a73e8] text-white px-4 py-2 rounded hover:bg-[#1557b0]"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Contract'}
              </button>
            </div>
          </div>
        )
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default Upload;