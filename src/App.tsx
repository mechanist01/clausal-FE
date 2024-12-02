import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import Upload from './components/Upload/Upload';
import { Menu, X } from 'lucide-react';
import RiskAssessment from './components/RiskAssessment/RiskAssessment';
import ContractIQPage from './pages/ContractIQPage';
import { LoginPage } from './pages/LoginPage';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { useAuth0 } from '@auth0/auth0-react';
import { ContractProvider } from './contexts/ContractContext';
import { useContract } from './contexts/ContractContext';

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth0();
  const { addContract } = useContract();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-light">
      {isAuthenticated && (
        <>
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
        </>
      )}

      <div className="flex flex-col flex-1 w-full lg:w-auto">
        <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route 
              path="/analyze" 
              element={
                <PrivateRoute>
                  <Upload onUploadSuccess={addContract} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/risks" 
              element={
                <PrivateRoute>
                  <RiskAssessment />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/contractiq" 
              element={
                <PrivateRoute>
                  <ContractIQPage />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white p-4 shadow-sm mt-auto text-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Contractly</p>
          <p className="text-xs text-gray-500 mt-1">
            This tool provides analysis for informational purposes only and does not constitute legal advice.
          </p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ContractProvider>
        <AppContent />
      </ContractProvider>
    </Router>
  );
};

export default App;