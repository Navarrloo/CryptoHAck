import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronRightIcon } from './Icons';

type Page = 'SecretPhraseView';

interface SecuritySettingsViewProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

const SettingsItem: React.FC<{ label: string; sublabel?: string; onClick?: () => void, children?: React.ReactNode }> = ({ label, sublabel, onClick, children }) => (
  <button onClick={onClick} className="w-full flex justify-between items-center p-4 bg-gray-800/60 rounded-lg hover:bg-gray-700/80 transition-colors text-left">
    <div>
        <span className="font-medium">{label}</span>
        {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
    </div>
    {children || <ChevronRightIcon />}
  </button>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onChange(!enabled); }}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({ onBack, onNavigate }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  
  return (
    <div className="flex flex-col h-full p-4">
      <header className="relative flex items-center justify-center mb-8">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold">Security & Privacy</h1>
      </header>
      <div className="flex-grow space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 px-2 mb-1">Security</h2>
        <SettingsItem 
            label="Secret Recovery Phrase" 
            sublabel="The only way to recover your wallet. Keep it secret."
            onClick={() => onNavigate('SecretPhraseView')} 
        />
        <SettingsItem 
            label="Change Passcode"
            sublabel="Set a new passcode for your wallet."
        />
        
        <h2 className="text-sm font-semibold text-gray-400 px-2 mb-1 mt-6">Privacy</h2>
         <SettingsItem 
            label="Use Face ID / Biometrics"
         >
            <ToggleSwitch enabled={biometricsEnabled} onChange={setBiometricsEnabled} />
         </SettingsItem>
         <SettingsItem 
            label="Auto-Lock"
            sublabel="Immediately"
        />
        <SettingsItem 
            label="Clear Browser History"
        />
      </div>
    </div>
  );
};

export default SecuritySettingsView;