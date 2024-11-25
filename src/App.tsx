import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import Upload from './components/Upload/Upload';
import { Menu, X } from 'lucide-react';
import RiskAssessment from './components/RiskAssessment/RiskAssessment';
import ContractIQPage from './pages/ContractIQPage';


interface Contract {
  analysis: any;
  metadata: {
    filename: string;
    filesize: number;
    timestamp: string;
  };
  status: string;
}

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-light">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed lg:static lg:translate-x-0 z-40 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex flex-col flex-1 w-full lg:w-auto">
          <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<Upload onUploadSuccess={(data) => {}} />} />
              <Route path="/risks" element={<RiskAssessment />} />
              <Route path="/contractiq" element={<ContractIQPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="bg-white p-4 shadow-sm mt-auto text-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Clausal</p>
            <p className="text-xs text-gray-500 mt-1">
              This tool provides analysis for informational purposes only and does not constitute legal advice.
            </p>
          </footer>
        </div>
      </div>
    </Router>
  );
};

export default App;