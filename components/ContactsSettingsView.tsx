import React from 'react';
import { ArrowLeftIcon } from './Icons';

const ContactsSettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full p-4">
      <header className="relative flex items-center justify-center mb-8">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold">Contacts</h1>
      </header>
      <div className="flex-grow flex items-center justify-center text-center text-gray-500">
        <p>Your contact list will be managed here.</p>
      </div>
    </div>
  );
};

export default ContactsSettingsView;
