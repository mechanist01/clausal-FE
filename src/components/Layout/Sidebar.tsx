import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Upload, AlertTriangle, Brain, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth0();

  const navItems = [
    { id: 'contracts', label: 'Contracts', icon: FileText, path: '/' },
    { id: 'analyze', label: 'Analyze', icon: Upload, path: '/analyze' },
    { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle, path: '/risks' },
    { id: 'contractiq', label: 'Contract IQ', icon: Brain, path: '/contractiq' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#1a73e8]">Contractly</h1>
        <p className="text-sm text-gray-600">Sales Contract Analysis</p>
      </div>
      <nav className="p-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-2 mb-2 rounded-lg transition-colors
              ${location.pathname === item.path 
                ? 'bg-[#e8f0fe] text-[#1a73e8]' 
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;