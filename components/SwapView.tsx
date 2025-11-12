import React, { useState, useEffect } from 'react';
import type { Asset } from '../types';
import { ArrowLeftIcon, SwapIcon } from './Icons';

interface SwapViewProps {
    onBack: () => void;
    assets: Asset[];
    showToast: (message: string, type: 'success' | 'error') => void;
}

const AssetBox: React.FC<{
    label: string;
    assets: Asset[];
    selectedSymbol: string;
    onSelectSymbol: (symbol: string) => void;
    amount: string;
    onAmountChange?: (amount: string) => void;
    isReadOnly?: boolean;
}> = ({ label, assets, selectedSymbol, onSelectSymbol, amount, onAmountChange, isReadOnly }) => {
    const selectedAsset = assets.find(a => a.symbol === selectedSymbol);
    const balance = selectedAsset?.balance || 0;

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-xs text-gray-400">Balance: {balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
                <input
                    type="number"
                    value={amount}
                    onChange={e => onAmountChange?.(e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="0.0"
                    className="text-2xl font-bold bg-transparent w-full focus:outline-none text-white"
                />
                <select
                    value={selectedSymbol}
                    onChange={e => onSelectSymbol(e.target.value)}
                    className="bg-gray-700/80 border-none rounded-full py-2 pl-3 pr-8 text-white font-semibold focus:ring-2 focus:ring-blue-500 appearance-none"
                    style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em'
                    }}
                >
                    {assets.map(asset => (
                        <option key={asset.id} value={asset.symbol}>{asset.symbol}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


const SwapView: React.FC<SwapViewProps> = ({ onBack, assets, showToast }) => {
    const [fromSymbol, setFromSymbol] = useState(assets.length > 0 ? assets[0].symbol : '');
    const [toSymbol, setToSymbol] = useState(assets.length > 1 ? assets[1].symbol : '');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);

    useEffect(() => {
        const fromAsset = assets.find(a => a.symbol === fromSymbol);
        const toAsset = assets.find(a => a.symbol === toSymbol);
        const amount = parseFloat(fromAmount);

        if (fromAsset && toAsset && fromAsset.price && toAsset.price && !isNaN(amount) && amount > 0) {
            const calculatedToAmount = (amount * fromAsset.price) / toAsset.price;
            setToAmount(calculatedToAmount.toFixed(6));
        } else {
            setToAmount('');
        }
    }, [fromAmount, fromSymbol, toSymbol, assets]);

    const handleSwapAssets = () => {
        const tempSymbol = fromSymbol;
        setFromSymbol(toSymbol);
        setToSymbol(tempSymbol);
    };
    
    const handleSwapClick = () => {
        if (!fromAmount || parseFloat(fromAmount) <= 0) {
            showToast('Please enter a valid amount.', 'error');
            return;
        }
        const fromAsset = assets.find(a => a.symbol === fromSymbol);
        if (fromAsset && parseFloat(fromAmount) > fromAsset.balance) {
            showToast('Insufficient balance.', 'error');
            return;
        }

        setIsSwapping(true);
        // Simulate API call
        setTimeout(() => {
            showToast('Swap successful!', 'success');
            setIsSwapping(false);
            onBack();
        }, 1500);
    };

    const fromAsset = assets.find(a => a.symbol === fromSymbol);
    const toAsset = assets.find(a => a.symbol === toSymbol);
    const exchangeRate = (fromAsset?.price && toAsset?.price) ? (fromAsset.price / toAsset.price).toFixed(5) : 0;

    return (
        <div className="flex flex-col h-full p-4">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-2xl font-bold">Swap</h1>
            </header>

            <div className="flex-grow space-y-4">
                <div className="relative">
                    <AssetBox
                        label="You send"
                        assets={assets}
                        selectedSymbol={fromSymbol}
                        onSelectSymbol={setFromSymbol}
                        amount={fromAmount}
                        onAmountChange={setFromAmount}
                    />
                    <button 
                        onClick={handleSwapAssets}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-700 border-4 border-[#0d1117] rounded-full flex items-center justify-center text-blue-400 hover:rotate-180 transition-transform duration-300">
                        <SwapIcon />
                    </button>
                    <AssetBox
                        label="You get"
                        assets={assets}
                        selectedSymbol={toSymbol}
                        onSelectSymbol={setToSymbol}
                        amount={toAmount}
                        isReadOnly
                    />
                </div>

                {fromAmount && (
                    <div className="text-center text-sm text-gray-400">
                        1 {fromSymbol} ≈ {exchangeRate} {toSymbol}
                    </div>
                )}
            </div>

            <div className="py-4">
                <button 
                    onClick={handleSwapClick}
                    disabled={isSwapping || !fromAmount || parseFloat(fromAmount) <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800/50 disabled:cursor-not-allowed"
                >
                    {isSwapping ? 'Swapping...' : 'Swap'}
                </button>
            </div>
        </div>
    );
};

export default SwapView;
