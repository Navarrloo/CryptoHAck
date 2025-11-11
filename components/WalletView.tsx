import React from 'react';
import Header from './Header';
import BalanceCard from './BalanceCard';
import ActionsRow from './ActionsRow';
import AssetList from './AssetList';
import type { Asset } from '../types';

interface WalletViewProps {
    assets: Asset[];
    totalBalance: number;
    user?: any;
    onAction: (action: 'Send' | 'Withdraw') => void;
    balanceChange: {
        value: number;
        percentage: number;
    };
}

const WalletView: React.FC<WalletViewProps> = ({ assets, totalBalance, user, onAction, balanceChange }) => {
    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-900/40 to-transparent -z-0"></div>
            <div className="relative z-10 p-4 pt-6 space-y-4 flex-shrink-0">
                <Header network="Ethereum Mainnet" user={user} />
                <BalanceCard balance={totalBalance} balanceChange={balanceChange} />
                <ActionsRow onAction={onAction} />
            </div>
            <div className="flex-grow overflow-y-auto px-2 pb-4 z-10 min-h-0">
                <AssetList assets={assets} />
            </div>
        </div>
    );
};

export default WalletView;