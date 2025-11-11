import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Asset, DBUser } from '../types';
import { ArrowLeftIcon, ChevronDownIcon } from './Icons';
import { supabase } from '../lib/supabase';

interface AdminPanelViewProps {
  baseAssets: Omit<Asset, 'balance' | 'usdValue'>[];
  assetsWithPrices: Asset[];
  onBalanceChange: (targetUserId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => Promise<boolean>;
  onBack: () => void;
  allUsers: DBUser[];
}

type UserWallet = {
    asset_symbol: string;
    balance: number;
}

const AdminAssetSelector: React.FC<{
    assets: Omit<Asset, 'balance' | 'usdValue'>[];
    selectedSymbol: string;
    onSelect: (symbol: string) => void;
}> = ({ assets, selectedSymbol, onSelect }) => {
    return (
        <div>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                {assets.map(asset => (
                    <button
                        key={asset.id}
                        onClick={() => onSelect(asset.symbol)}
                        className={`flex flex-col items-center justify-center gap-1 p-1 rounded-lg w-16 h-16 flex-shrink-0 border-2 transition-all duration-200 ${selectedSymbol.toUpperCase() === asset.symbol ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-700/50 border-transparent hover:border-gray-600'}`}
                    >
                        <div className="w-7 h-7 flex items-center justify-center scale-90">
                            {asset.icon}
                        </div>
                        <span className="text-xs font-semibold text-white">{asset.symbol}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const UserWalletsView: React.FC<{
    user: DBUser,
    baseAssets: Omit<Asset, 'balance' | 'usdValue'>[],
    priceMap: Map<string, number>;
    onAction: (userId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => Promise<boolean>,
    onRefresh: () => void;
}> = ({ user, baseAssets, priceMap, onAction, onRefresh }) => {
    const [wallets, setWallets] = useState<UserWallet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [symbol, setSymbol] = useState('');
    const [usdAmount, setUsdAmount] = useState('');
    const [cryptoAmountPreview, setCryptoAmountPreview] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchWallets = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('wallets').select('asset_symbol, balance').eq('user_id', user.id);
        if (error) {
            console.error(`Error fetching wallets for ${user.id}:`, error);
        } else {
            setWallets(data || []);
        }
        setIsLoading(false);
    }, [user.id]);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    useEffect(() => {
        if(baseAssets.length > 0 && !symbol) {
            setSymbol(baseAssets[0].symbol);
        }
    }, [baseAssets, symbol]);

    useEffect(() => {
        const upperSymbol = symbol.toUpperCase();
        const price = priceMap.get(upperSymbol) || 0;
        const value = parseFloat(usdAmount);
        if (price > 0 && !isNaN(value) && value > 0) {
            const cryptoValue = value / price;
            setCryptoAmountPreview(`≈ ${cryptoValue.toFixed(8)} ${upperSymbol}`);
        } else {
            setCryptoAmountPreview('');
        }
    }, [usdAmount, symbol, priceMap]);
    
    const handleAction = async (operation: 'add' | 'subtract') => {
        const value = parseFloat(usdAmount);
        const upperSymbol = symbol.toUpperCase();
        const price = priceMap.get(upperSymbol) || 0;

        if (!upperSymbol) {
            alert("Please select an asset symbol.");
            return;
        }
        if (isNaN(value) || value <= 0) {
            alert("Please enter a valid positive USD amount.");
            return;
        }
        if (price <= 0) {
            alert(`Could not retrieve price for ${upperSymbol}. Cannot perform action.`);
            return;
        }

        const cryptoAmount = value / price;

        setIsProcessing(true);
        const success = await onAction(user.id, upperSymbol, cryptoAmount, operation);
        if (success) {
            setUsdAmount('');
            setCryptoAmountPreview('');
            await fetchWallets(); // Refresh balances
            onRefresh(); 
        }
        setIsProcessing(false);
    }
    
    if (isLoading) {
        return <div className="p-4 text-center text-gray-400">Loading balances...</div>
    }

    return (
        <div className="border-t border-gray-700/60 p-4 space-y-4">
            <div className="space-y-3 p-3 bg-gray-900/50 rounded-md">
                <AdminAssetSelector assets={baseAssets} selectedSymbol={symbol} onSelect={setSymbol} />
                <div className="grid grid-cols-1 gap-3">
                    <input
                      type="number"
                      placeholder="Amount (USD)"
                      value={usdAmount}
                      onChange={(e) => setUsdAmount(e.target.value)}
                      disabled={isProcessing}
                      className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full text-right text-white focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                 <div className="text-xs text-blue-400 h-4 text-right pr-1">
                    {cryptoAmountPreview}
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleAction('subtract')} disabled={isProcessing || !usdAmount || !symbol} className="w-full h-9 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-md font-bold disabled:bg-red-800/50 disabled:cursor-not-allowed transition">Subtract</button>
                    <button onClick={() => handleAction('add')} disabled={isProcessing || !usdAmount || !symbol} className="w-full h-9 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded-md font-bold disabled:bg-green-800/50 disabled:cursor-not-allowed transition">Add</button>
                 </div>
            </div>
            
            <div>
                 <h4 className="text-sm font-semibold text-gray-400 mb-2">Current Balances</h4>
                 <div className="space-y-2">
                    {wallets.length > 0 ? wallets.map(wallet => (
                        <div key={wallet.asset_symbol} className="flex justify-between items-center bg-gray-900/30 p-2 rounded-md text-sm">
                            <span className="font-mono text-gray-300">{wallet.asset_symbol}</span>
                            <span className="font-semibold text-white">{wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
                        </div>
                    )) : <p className="text-sm text-gray-500 text-center py-2">No wallets found.</p>}
                 </div>
            </div>
        </div>
    )
}


const AdminPanelView: React.FC<AdminPanelViewProps> = ({ baseAssets, assetsWithPrices, onBalanceChange, onBack, allUsers }) => {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const priceMap = useMemo(() => new Map(assetsWithPrices.map(a => [a.symbol, a.price || 0])), [assetsWithPrices]);

  const handleToggleUser = (userId: string) => {
    setExpandedUserId(prevId => (prevId === userId ? null : userId));
  };

  const handleBalanceChangeWithFeedback = async (targetUserId: string, symbol: string, amount: number, operation: 'add' | 'subtract'): Promise<boolean> => {
      const success = await onBalanceChange(targetUserId, symbol, amount, operation);
      if (success) {
        const targetUser = allUsers.find(u => u.id === targetUserId);
        const actionText = operation === 'add' ? 'added' : 'subtracted';
        const preposition = operation === 'add' ? 'to' : 'from';
        setMessage(`Successfully ${actionText} ${amount.toFixed(8)} ${symbol} ${preposition} ${targetUser?.username || 'user'}.`);
        setTimeout(() => setMessage(''), 4000);
      }
      return success;
  }

  return (
    <div className="flex flex-col h-full p-4">
      <header className="relative flex items-center justify-center mb-8">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>

      {message && (
          <div className="mb-4 text-center p-3 rounded-lg bg-gray-700 text-white transition-opacity">
            {message}
          </div>
      )}

      <div className="flex-grow overflow-y-auto space-y-3 pb-20">
        <h2 className="text-lg font-semibold text-gray-300 px-1">Users ({allUsers.length})</h2>
        {allUsers.map(user => (
            <div key={user.id} className="bg-gray-800/70 rounded-lg transition-all overflow-hidden">
                <div 
                    onClick={() => handleToggleUser(user.id)}
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50"
                >
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            {user.username?.slice(0, 1).toUpperCase() || user.first_name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                           <p className="font-semibold text-white">{user.username || user.first_name}</p>
                           <p className="text-xs text-gray-400">ID: {user.telegram_id}</p>
                        </div>
                    </div>
                    <div className={`transform transition-transform ${expandedUserId === user.id ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                    </div>
                </div>
                {expandedUserId === user.id && (
                    <UserWalletsView 
                        key={refreshKey}
                        user={user} 
                        baseAssets={baseAssets}
                        priceMap={priceMap}
                        onAction={handleBalanceChangeWithFeedback} 
                        onRefresh={() => setRefreshKey(k => k + 1)}
                    />
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanelView;