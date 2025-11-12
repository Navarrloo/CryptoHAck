import React from 'react';
import Header from './Header';
import BalanceCard from './BalanceCard';
import ActionsRow from './ActionsRow';
import StorePromotion from './StorePromotion';
import Testimonials from './Testimonials'; // Import new component
import AssetList from './AssetList'; // Import AssetList
import RecentActivity from './RecentActivity';
import type { Asset, Page, Transaction } from '../types';

interface WalletViewProps {
    assets: Asset[];
    transactions: Transaction[];
    totalBalance: number;
    user?: any;
    onAction: (page: Page) => void;
    balanceChange: {
        value: number;
        percentage: number;
    };
}

const WalletView: React.FC<WalletViewProps> = ({ assets, transactions, totalBalance, user, onAction, balanceChange }) => {
    return (
        <div className="relative">
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-900/40 to-transparent -z-0"></div>
            
            <div className="relative z-10 p-4 pt-6 space-y-4">
                <Header network="Ethereum Mainnet" user={user} />
                <div className="text-center text-gray-300 text-sm py-2 px-4 bg-gray-800/50 rounded-lg">
                    Здравствуйте! Мы второй по популярности криптокошелек в телеграме.
                </div>
                <BalanceCard balance={totalBalance} balanceChange={balanceChange} />
                <ActionsRow onAction={onAction} />
            </div>

            <div className="relative z-10 px-4 pb-24 space-y-6">
                <RecentActivity transactions={transactions.slice(0, 3)} onNavigate={() => onAction('Activity')} />
                <AssetList assets={assets} />
                <StorePromotion onNavigate={() => onAction('Discover')} />
                <Testimonials />
            </div>
        </div>
    );
};

export default WalletView;