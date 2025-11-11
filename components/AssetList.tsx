
import React from 'react';
import type { Asset } from '../types';
import AssetItem from './AssetItem';

interface AssetListProps {
  assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  return (
    <div className="space-y-2 px-2">
       <div className="flex justify-between items-center mb-4 px-2">
         <h2 className="text-xl font-bold">Assets</h2>
      </div>
      {assets.map((asset) => (
        <AssetItem key={asset.id} asset={asset} />
      ))}
    </div>
  );
};

export default AssetList;