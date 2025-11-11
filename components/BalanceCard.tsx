
import React from 'react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <div className="text-center py-6">
      <p className="text-sm text-gray-400">Total Balance</p>
      <h1 className="text-5xl font-bold tracking-tight mt-2">{formattedBalance}</h1>
      <div className="flex justify-center items-center mt-3 text-sm text-green-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span>$3,120.55 (24h)</span>
      </div>
    </div>
  );
};

export default BalanceCard;
