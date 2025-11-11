
import React from 'react';
import type { Asset } from '../types';

interface AssetItemProps {
  asset: Asset;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset }) => {
  const formattedUsdValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(asset.usdValue);

  return (
    <div className="flex items-center p-3 rounded-xl hover:bg-gray-800/60 cursor-pointer transition-colors">
      <div className="w-10 h-10 mr-4 flex items-center justify-center">
        {asset.icon}
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-white">{asset.name}</p>
        <p className="text-sm text-gray-400">{asset.symbol}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-white">{asset.balance.toLocaleString()}</p>
        <p className="text-sm text-gray-400">{formattedUsdValue}</p>
      </div>
    </div>
  );
};

export default AssetItem;
