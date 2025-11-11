import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronRightIcon } from './Icons';

interface SettingRowProps {
    label: string;
    children: React.ReactNode;
}
const SettingRow: React.FC<SettingRowProps> = ({ label, children }) => (
    <div className="flex justify-between items-center p-4 bg-gray-800/60 rounded-lg">
        <span className="font-medium">{label}</span>
        <div>{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);


const GeneralSettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [autoLock, setAutoLock] = useState(false);
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="flex flex-col h-full p-4">
      <header className="relative flex items-center justify-center mb-8">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold">General</h1>
      </header>
      <div className="flex-grow space-y-3">
        <SettingRow label="Dark Mode">
            <ToggleSwitch enabled={darkMode} onChange={setDarkMode} />
        </SettingRow>
        <SettingRow label="Auto-Lock">
             <ToggleSwitch enabled={autoLock} onChange={setAutoLock} />
        </SettingRow>
         <SettingRow label="Primary Currency">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-700 border-none rounded-md py-1 pl-2 pr-8 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
        </SettingRow>
      </div>
    </div>
  );
};

export default GeneralSettingsView;
