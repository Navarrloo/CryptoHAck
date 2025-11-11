import React from 'react';
import { EthereumIcon, ChevronDownIcon, BellIcon } from './Icons';

interface HeaderProps {
  network: string;
  user?: {
    first_name?: string;
    last_name?: string;
    username?: string;
  }
}

const Header: React.FC<HeaderProps> = ({ network, user }) => {
  const displayName = user?.first_name || user?.username || "Wallet";

  return (
    <header className="flex justify-between items-center w-full">
      {/* Profile on the left */}
      <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-full p-1 pr-3 cursor-pointer hover:bg-gray-700/70 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-lg font-bold">🦊</span>
        </div>
        <span className="text-sm font-medium">{displayName}</span>
      </div>
      
      {/* Network in the middle */}
      <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-full p-1 px-3 cursor-pointer hover:bg-gray-700/70 transition-colors">
        <EthereumIcon />
        <span className="text-sm font-medium">{network}</span>
        <ChevronDownIcon />
      </div>

      {/* Bell on the right */}
      <button className="relative text-gray-400 hover:text-white transition-colors" aria-label="Notifications">
        <BellIcon />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </button>
    </header>
  );
};

export default Header;
