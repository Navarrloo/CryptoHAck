
import React from 'react';
import type { NavItem } from '../types';

interface BottomNavProps {
  items: NavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activeTab, setActiveTab }) => {
  return (
    <nav className="bg-[#161b22]/80 backdrop-blur-lg border-t border-gray-700/50 rounded-t-2xl">
      <div className="flex justify-around items-center h-20">
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center justify-center gap-1 w-20 transition-colors duration-200 ${
              activeTab === item.name ? 'text-blue-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="w-7 h-7">{item.icon}</div>
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
