import React, { useState, useEffect } from 'react';
import type { Asset, DBUser } from '../types';
import { ArrowLeftIcon } from './Icons';

interface AdminPanelViewProps {
  assets: Asset[];
  onBalanceChange: (targetUserId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => void;
  onBack: () => void;
  currentUser: DBUser | null;
  allUsers: DBUser[];
}

const AdminPanelView: React.FC<AdminPanelViewProps> = ({ assets, onBalanceChange, onBack, currentUser, allUsers }) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Set default asset
    if (assets.length > 0 && !selectedAsset) {
      const defaultAsset = assets.find(a => a.symbol === 'USDT') || assets[0];
      setSelectedAsset(defaultAsset.symbol);
    }
  }, [assets, selectedAsset]);

  useEffect(() => {
    // Set default user from the prop
    if (!selectedUserId && allUsers.length > 0) {
        if (currentUser && allUsers.find(u => u.id === currentUser.id)) {
            setSelectedUserId(currentUser.id);
        } else {
            setSelectedUserId(allUsers[0].id);
        }
    }
  }, [allUsers, currentUser, selectedUserId]);


  const handleAction = (operation: 'add' | 'subtract') => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setMessage('Please enter a valid positive amount.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!selectedUserId) {
      setMessage('Please select a user.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    onBalanceChange(selectedUserId, selectedAsset, numericAmount, operation);
    
    const targetUser = allUsers.find(u => u.id === selectedUserId);
    setMessage(`Successfully ${operation === 'add' ? 'added' : 'subtracted'} ${numericAmount} ${selectedAsset} ${operation === 'add' ? 'to' : 'from'} ${targetUser?.username || 'user'}.`);
    setAmount('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold text-center flex-grow -ml-10">Admin Panel</h1>
      </header>
      <div className="flex-grow space-y-6">
        <div>
          <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-2">Select User</label>
          <select
            id="user-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
            disabled={allUsers.length === 0}
          >
            {allUsers.map(user => (
              <option key={user.id} value={user.id}>{user.username || user.first_name} ({user.telegram_id})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="asset-select" className="block text-sm font-medium text-gray-300 mb-2">Select Asset</label>
          <select
            id="asset-select"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
            disabled={assets.length === 0}
          >
            {assets.map(asset => (
              <option key={asset.id} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount-input" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
          <input
            id="amount-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 1000"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleAction('add')}
            className="w-full text-center p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-bold disabled:bg-gray-500"
            disabled={!selectedAsset || !selectedUserId}
          >
            Add Funds
          </button>
          <button
            onClick={() => handleAction('subtract')}
            className="w-full text-center p-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-bold disabled:bg-gray-500"
            disabled={!selectedAsset || !selectedUserId}
          >
            Deduct Funds
          </button>
        </div>
        {message && (
          <div className="text-center p-3 rounded-lg bg-gray-700 text-white">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelView;