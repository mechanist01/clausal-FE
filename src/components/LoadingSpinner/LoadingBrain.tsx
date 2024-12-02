import React from 'react';
import { Brain } from 'lucide-react';

interface LoadingBrainProps {
  message?: string;
}

export const LoadingBrain: React.FC<LoadingBrainProps> = ({ 
  message = "Analyzing contract..." 
}) => (
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
      <p className="mt-4 text-gray-500 text-sm animate-pulse">
        {message}
      </p>
    </div>
  </div>
);

// Add keyframes for the float animation to your global CSS
const globalStyles = `
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
`;

// Create a style element and append it to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

export default LoadingBrain;