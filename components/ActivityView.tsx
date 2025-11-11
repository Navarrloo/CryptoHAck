import React from 'react';
import type { Transaction, Asset } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './Icons'; // Assuming you have these icons

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
            return (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-400">
                   <ArrowUpIcon />
                </div>
            );
        default:
            return <div className="w-10 h-10 bg-gray-700 rounded-full" />;
    }
}

const TransactionItem: React.FC<{ transaction: Transaction, asset?: Asset }> = ({ transaction, asset }) => {
    const { type, asset_symbol, amount, usd_value, date, to } = transaction;
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
    
    const titleMap = {
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
        <div className="flex items-center p-3">
            <TransactionIcon type={type} />
            <div className="flex-grow ml-4">
                <p className="font-semibold text-white">{titleMap[type] || 'Transaction'}</p>
                <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
            <div className="text-right">
                <p className={`font-semibold text-white ${sign === '+' ? 'text-green-400' : 'text-red-400'}`}>
                    {sign}{amount.toLocaleString()} {asset_symbol}
                </p>
                <p className="text-sm text-gray-400">
                    {sign}${usd_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
};


interface ActivityViewProps {
  transactions: Transaction[];
  assets: Asset[];
}

const ActivityView: React.FC<ActivityViewProps> = ({ transactions, assets }) => {
  const assetMap = new Map(assets.map(asset => [asset.symbol, asset]));

  return (
    <div className="p-4 flex flex-col h-full">
      <header className="text-center mb-8 pt-2">
        <h1 className="text-2xl font-bold">Activity</h1>
      </header>
      <div className="flex-grow overflow-y-auto pb-20">
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} asset={assetMap.get(tx.asset_symbol)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="w-24 h-24 bg-gray-800 rounded-full mb-6 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-white">No Activity Yet</h2>
            <p>Your transaction history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityView;