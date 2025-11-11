import React from 'react';
import { StoreIcon } from './Icons';

interface StorePromotionProps {
  onNavigate: () => void;
}

const StorePromotion: React.FC<StorePromotionProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl flex flex-col items-center text-center shadow-lg border border-gray-700/50">
      <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4 border-2 border-blue-500/30">
        <StoreIcon />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Enter the Store</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs">
        Buy, sell, and swap your favorite digital collectibles and assets.
      </p>
      <button 
        onClick={onNavigate}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
      >
        Explore Store
      </button>
    </div>
  );
};

export default StorePromotion;