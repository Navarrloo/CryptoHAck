import React from 'react';
import type { Transaction } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './Icons';

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    switch (type) {
        case 'admin_add':
        case 'receive':
        case 'buy':
            return (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 text-green-400">
                    <ArrowDownIcon />
                </div>
            );
        case 'admin_subtract':
        case 'send':
        case 'withdraw':
        case 'swap':
            return (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-400">
                   <ArrowUpIcon />
                </div>
            );
        default:
            return <div className="w-10 h-10 bg-gray-700 rounded-full" />;
    }
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const { type, asset_symbol, amount, usd_value, date } = transaction;
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date));
    
    const titleMap: Record<Transaction['type'], string> = {
        admin_add: 'Received from Admin',
        admin_subtract: 'Deducted by Admin',
        receive: 'Received',
        send: 'Sent',
        buy: 'Bought',
        swap: 'Swapped',
        withdraw: 'Withdrew',
    };
    
    const sign = ['admin_add', 'receive', 'buy'].includes(type) ? '+' : '-';

    return (
        <div className="flex items-center p-3 rounded-xl hover:bg-gray-800/60 cursor-pointer transition-colors">
            <TransactionIcon type={type} />
            <div className="flex-grow ml-4">
                <p className="font-semibold text-white">{titleMap[type] || 'Transaction'}</p>
                <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
            <div className="text-right">
                <p className={`font-semibold text-white ${sign === '+' && type !== 'swap' ? 'text-green-400' : ''} ${sign === '-' ? 'text-red-400' : ''}`}>
                    {type !== 'swap' && sign}{amount.toLocaleString(undefined, {maximumFractionDigits: 5})} {asset_symbol}
                </p>
                 <p className="text-sm text-gray-400">
                    ${usd_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
};

interface RecentActivityProps {
    transactions: Transaction[];
    onNavigate: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions, onNavigate }) => {
    if (transactions.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <button onClick={onNavigate} className="text-sm text-blue-400 hover:text-blue-300">
                    View all
                </button>
            </div>
            <div className="space-y-1">
                {transactions.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
