import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Asset, DBUser } from '../types';
import { ArrowLeftIcon, ChevronDownIcon } from './Icons';
import { supabase } from '../lib/supabase';

interface AdminPanelViewProps {
  baseAssets: Omit<Asset, 'balance' | 'usdValue'>[];
  assetsWithPrices: Asset[];
  onBalanceChange: (targetUserId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => void;
  onBack: () => void;
  allUsers: DBUser[];
}

type UserWallet = {
    asset_symbol: string;
    balance: number;
}

const UserWalletsView: React.FC<{
    user: DBUser,
    baseAssets: Omit<Asset, 'balance' | 'usdValue'>[],
    priceMap: Map<string, number>;
    onAction: (userId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => void,
    onRefresh: () => void;
}> = ({ user, baseAssets, priceMap, onAction, onRefresh }) => {
    const [wallets, setWallets] = useState<UserWallet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [cryptoAmountPreview, setCryptoAmountPreview] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState<Record<string, boolean>>({});

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

    const handleAmountChange = (symbol: string, value: string) => {
        setAmounts(prev => ({...prev, [symbol]: value}));

        const price = priceMap.get(symbol) || 0;
        const usdValue = parseFloat(value);
        if (price > 0 && !isNaN(usdValue) && usdValue > 0) {
            const cryptoValue = usdValue / price;
            setCryptoAmountPreview(prev => ({ ...prev, [symbol]: `≈ ${cryptoValue.toFixed(8)} ${symbol}` }));
        } else {
            setCryptoAmountPreview(prev => ({ ...prev, [symbol]: '' }));
        }
    };
    
    const handleAction = async (symbol: string, operation: 'add' | 'subtract') => {
        const usdAmount = parseFloat(amounts[symbol] || '0');
        const price = priceMap.get(symbol) || 0;

        if (isNaN(usdAmount) || usdAmount <= 0) {
            alert("Please enter a valid positive USD amount.");
            return;
        }
        if (price <= 0) {
            alert(`Could not retrieve price for ${symbol}. Cannot perform action.`);
            return;
        }

        const cryptoAmount = usdAmount / price;

        setProcessing(prev => ({...prev, [symbol]: true}));
        await onAction(user.id, symbol, cryptoAmount, operation);
        setAmounts(prev => ({...prev, [symbol]: ''}));
        setCryptoAmountPreview(prev => ({ ...prev, [symbol]: '' }));
        await fetchWallets(); // Refresh balances
        onRefresh(); // Refresh balances in parent component if needed for total balance etc.
        setProcessing(prev => ({...prev, [symbol]: false}));
    }
    
    if (isLoading) {
        return <div className="p-4 text-center text-gray-400">Loading balances...</div>
    }

    return (
        <div className="border-t border-gray-700/60 p-4 space-y-3">
            {baseAssets.map(asset => {
                const wallet = wallets.find(w => w.asset_symbol === asset.symbol);
                const balance = wallet?.balance || 0;
                const isActionDisabled = !amounts[asset.symbol] || processing[asset.symbol];

                return (
                    <div key={asset.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 bg-gray-900/50 p-2 rounded-md">
                        {/* Col 1: Icon */}
                        <div className="w-8 h-8">{asset.icon}</div>
                        
                        {/* Col 2: Info */}
                        <div>
                            <p className="font-semibold text-white">{asset.symbol}</p>
                            <p className="text-xs text-gray-400">Balance: {balance.toLocaleString()}</p>
                        </div>
                    
                        {/* Col 3: Input */}
                        <div className="flex flex-col items-end">
                            <input
                              type="number"
                              placeholder="Amount (USD)"
                              value={amounts[asset.symbol] || ''}
                              onChange={(e) => handleAmountChange(asset.symbol, e.target.value)}
                              disabled={processing[asset.symbol]}
                              className="bg-gray-800 border border-gray-700 rounded-md p-2 w-32 text-right text-white focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <div className="text-xs text-blue-400 mt-1 h-4 text-right pr-1">
                                {cryptoAmountPreview[asset.symbol]}
                            </div>
                        </div>
                        
                        {/* Col 4: Buttons */}
                        <div className="flex gap-2">
                           <button onClick={() => handleAction(asset.symbol, 'subtract')} disabled={isActionDisabled} className="w-9 h-9 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-md font-bold text-xl disabled:bg-red-800/50 disabled:cursor-not-allowed transition">-</button>
                           <button onClick={() => handleAction(asset.symbol, 'add')} disabled={isActionDisabled} className="w-9 h-9 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded-md font-bold text-xl disabled:bg-green-800/50 disabled:cursor-not-allowed transition">+</button>
                        </div>
                    </div>
                )
            })}
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

  const handleBalanceChangeWithFeedback = async (targetUserId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => {
      onBalanceChange(targetUserId, symbol, amount, operation);
      const targetUser = allUsers.find(u => u.id === targetUserId);
      const actionText = operation === 'add' ? 'added' : 'subtracted';
      const preposition = operation === 'add' ? 'to' : 'from';
      setMessage(`Successfully ${actionText} ${amount.toFixed(8)} ${symbol} ${preposition} ${targetUser?.username || 'user'}.`);
      setTimeout(() => setMessage(''), 3000);
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