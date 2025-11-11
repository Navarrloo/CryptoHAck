import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from './Icons';
import type { Asset, DBUser } from '../types';

interface ActionViewProps {
  title: string;
  onBack: () => void;
  assets: Asset[];
  allUsers?: DBUser[];
  onSend?: (recipientId: string, symbol: string, amount: number) => Promise<void>;
  onWithdraw?: (symbol: string, amount: number) => Promise<boolean>;
}

interface SendViewContentProps {
    assets: Asset[];
    allUsers: DBUser[];
    onSend: (recipientId: string, symbol: string, amount: number) => Promise<void>;
}

const SendViewContent: React.FC<SendViewContentProps> = ({ assets, allUsers, onSend }) => {
    const [selectedAsset, setSelectedAsset] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (assets.length > 0 && !selectedAsset) {
            setSelectedAsset(assets[0].symbol);
        }
        if (allUsers.length > 0 && !recipientId) {
            setRecipientId(allUsers[0].id);
        }
    }, [assets, allUsers, selectedAsset, recipientId]);
    
    const handleSendClick = async () => {
        const numericAmount = parseFloat(amount);
        if (!recipientId) {
            alert('Please select a recipient.');
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }
        
        setIsSending(true);
        await onSend(recipientId, selectedAsset, numericAmount);
        setIsSending(false);
    };

    const currentBalance = assets.find(a => a.symbol === selectedAsset)?.balance || 0;

    return (
        <div className="w-full max-w-sm mx-auto space-y-4">
            <div>
                <label className="text-sm text-gray-400">Recipient</label>
                <select 
                    value={recipientId} 
                    onChange={(e) => setRecipientId(e.target.value)} 
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                    disabled={allUsers.length === 0}
                >
                    {allUsers.length === 0 ? <option>No other users found</option> :
                     allUsers.map(user => <option key={user.id} value={user.id}>{user.username || user.first_name}</option>)}
                </select>
            </div>
             <div>
                <label className="text-sm text-gray-400">Asset</label>
                <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500">
                    {assets.map(asset => <option key={asset.id} value={asset.symbol}>{asset.name}</option>)}
                </select>
                 <div className="text-xs text-gray-400 mt-1 text-right">
                    Balance: {currentBalance.toLocaleString()} {selectedAsset}
                </div>
            </div>
            <div>
                <label className="text-sm text-gray-400">Amount</label>
                <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.0" 
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button 
                onClick={handleSendClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800/50 disabled:cursor-not-allowed"
                disabled={isSending || !recipientId || !amount || allUsers.length === 0}
            >
                {isSending ? 'Sending...' : 'Send'}
            </button>
        </div>
    );
};

interface WithdrawViewContentProps {
    assets: Asset[];
    onWithdraw: (symbol: string, amount: number) => Promise<boolean>;
    onBack: () => void;
}

const WithdrawViewContent: React.FC<WithdrawViewContentProps> = ({ assets, onWithdraw, onBack }) => {
    const [assetSymbol, setAssetSymbol] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'card' | 'phone'>('card');
    const [contactInfo, setContactInfo] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleWithdrawClick = async () => {
        const numericAmount = parseFloat(amount);
        if (!assetSymbol.trim()) {
            alert('Please enter an asset symbol (e.g., BTC).');
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }
        if (!contactInfo.trim()) {
            alert(`Please enter a valid ${method === 'card' ? 'card number' : 'phone number'}.`);
            return;
        }
        
        setIsProcessing(true);
        const success = await onWithdraw(assetSymbol.toUpperCase(), numericAmount);
        if (success) {
            setIsSubmitted(true);
        }
        setIsProcessing(false);
    };

    const currentBalance = assets.find(a => a.symbol.toUpperCase() === assetSymbol.toUpperCase())?.balance || 0;
    
    if (isSubmitted) {
        return (
            <div className="w-full max-w-sm mx-auto text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Success!</h2>
                <p className="text-gray-300 mt-2">Your funds will be processed within 24 hours.</p>
                <button 
                    onClick={onBack}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm mx-auto space-y-4">
             <div>
                <label className="text-sm text-gray-400">Asset Symbol</label>
                <input 
                    type="text" 
                    value={assetSymbol}
                    onChange={e => setAssetSymbol(e.target.value)}
                    placeholder="e.g. BTC" 
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500 uppercase" />
            </div>
            <div>
                <label className="text-sm text-gray-400">Amount</label>
                <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.0" 
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500" />
                <div className="text-xs text-gray-400 mt-1 text-right">
                    Balance: {currentBalance.toLocaleString()} {assetSymbol.toUpperCase()}
                </div>
            </div>
             <div>
                <label className="text-sm text-gray-400">Withdrawal Method</label>
                 <div className="flex gap-2 mt-1">
                     <button onClick={() => setMethod('card')} className={`flex-1 p-2 rounded-md ${method === 'card' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors`}>Card Number</button>
                     <button onClick={() => setMethod('phone')} className={`flex-1 p-2 rounded-md ${method === 'phone' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors`}>Phone Number</button>
                 </div>
            </div>
             <div>
                <label className="text-sm text-gray-400">{method === 'card' ? 'Card Number' : 'Phone Number'}</label>
                <input 
                    type="text"
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder={method === 'card' ? '0000 0000 0000 0000' : '+1 123 456 7890'}
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button 
                onClick={handleWithdrawClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800/50 disabled:cursor-not-allowed"
                disabled={isProcessing || !assetSymbol || !amount || !contactInfo}
            >
                {isProcessing ? 'Processing...' : 'Withdraw'}
            </button>
        </div>
    );
};

const ActionView: React.FC<ActionViewProps> = ({ title, onBack, assets, allUsers, onSend, onWithdraw }) => {
  return (
    <div className="flex flex-col h-full p-4">
      <header className="relative flex items-center justify-center mb-8">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      <div className="flex-grow flex flex-col items-center justify-start text-center text-gray-400 pt-8">
        {title === 'Send' && allUsers && onSend && <SendViewContent assets={assets} allUsers={allUsers} onSend={onSend} />}
        {title === 'Withdraw' && onWithdraw && <WithdrawViewContent assets={assets} onWithdraw={onWithdraw} onBack={onBack} />}
      </div>
    </div>
  );
};

export default ActionView;