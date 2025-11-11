import React from 'react';
import { ChevronRightIcon } from './Icons';

interface SettingsViewProps {
  isAdmin: boolean;
  onNavigate: (page: 'Admin') => void;
  onClearData: () => void;
}

const SettingsItem: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <button onClick={onClick} className="w-full flex justify-between items-center p-4 bg-gray-800/60 rounded-lg hover:bg-gray-700/80 transition-colors text-left">
    <span className="font-medium">{label}</span>
    <ChevronRightIcon />
  </button>
);

const SettingsView: React.FC<SettingsViewProps> = ({ isAdmin, onNavigate, onClearData }) => {
  return (
    <div className="p-4 flex flex-col h-full">
      <header className="text-center mb-8 pt-2">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      <div className="space-y-3 flex-grow">
        <SettingsItem label="General" />
        <SettingsItem label="Security & Privacy" />
        <SettingsItem label="Networks" />
        <SettingsItem label="Contacts" />
        {isAdmin && (
           <div className="pt-4">
             <button
                onClick={() => onNavigate('Admin')}
                className="w-full text-center p-4 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
             >
                Admin Panel
             </button>
           </div>
        )}
         <div className="pt-8">
            <h2 className="text-sm font-semibold text-gray-400 px-2 mb-2">Danger Zone</h2>
            <button
                onClick={onClearData}
                className="w-full flex justify-between items-center p-4 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors"
            >
                <span className="font-medium">Clear Wallet Data</span>
            </button>
         </div>

      </div>
       <footer className="text-center text-gray-500 text-sm pb-24">
         <p>Crypto Wallet v1.0.0</p>
      </footer>
    </div>
  );
};

export default SettingsView;