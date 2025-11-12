import React from 'react';
import type { DiscoverAsset } from '../types';
import { BtcIcon, EthereumIcon, TetherIcon, SolanaIcon, XrpIcon, CardanoIcon, DogecoinIcon, NotcoinIcon } from './Icons';

// Helper to get icon based on symbol
const getIconBySymbol = (symbol: string): React.ReactNode => {
    switch (symbol.toUpperCase()) {
        case 'BTC': return <BtcIcon />;
        case 'ETH': return <EthereumIcon />;
        case 'USDT': return <TetherIcon />;
        case 'SOL': return <SolanaIcon />;
        case 'XRP': return <XrpIcon />;
        case 'ADA': return <CardanoIcon />;
        case 'DOGE': return <DogecoinIcon />;
        case 'NOT': return <NotcoinIcon />;
        default: return <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">{symbol.slice(0, 3)}</div>;
    }
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
}

const formatMarketCap = (value: number): string => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
};

const DiscoverAssetItem: React.FC<{ asset: DiscoverAsset }> = ({ asset }) => {
    const isPositive = asset.priceChange24h >= 0;
    return (
        <div className="flex items-center py-3 px-2 hover:bg-gray-800/60 cursor-pointer transition-colors">
            <div className="w-10 h-10 mr-4 flex items-center justify-center">
                {getIconBySymbol(asset.symbol)}
            </div>
            <div className="flex-grow">
                <p className="text-white">{asset.name}</p>
                <p className="text-sm text-gray-400">{asset.symbol}</p>
            </div>
             <div className="text-right flex-shrink-0 w-28">
                 <p className="font-semibold text-white">{formatMarketCap(asset.marketCap)}</p>
                 <p className="text-sm text-gray-400">Market Cap</p>
            </div>
            <div className="text-right flex-shrink-0 w-28 ml-2">
                <p className="font-semibold text-white">{formatCurrency(asset.price)}</p>
                <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                </p>
            </div>
        </div>
    );
};

interface DiscoverViewProps {
  assets: DiscoverAsset[];
  isLoading: boolean;
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ assets, isLoading }) => {
  return (
    <div className="p-4 flex flex-col h-full">
      <header className="text-center mb-8 pt-2">
        <h1 className="text-2xl font-bold">Discover Assets</h1>
      </header>
      <div className="flex-grow overflow-y-auto pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : assets.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {assets.map(asset => (
              <DiscoverAssetItem key={asset.symbol} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
             <div className="w-24 h-24 bg-gray-800 rounded-full mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M21 12.87V8.13a1 1 0 00-.6-.93l-6.54-3.44a1 1 0 00-.8 0l-6.54 3.44a1 1 0 00-.6.93v4.74a1 1 0 00.6.93l6.54 3.44a1 1 0 00.8 0l6.54-3.44a1 1 0 00.6-.93z"/><path d="M21 8.78l-7.14 3.75L6.86 8.78"/><path d="M14.5 21.22V12"/></svg>
             </div>
            <h2 className="text-xl font-semibold text-white">Could Not Load Assets</h2>
            <p>Please check your connection or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverView;