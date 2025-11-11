import React from 'react';

interface BalanceCardProps {
  balance: number;
  balanceChange: {
    value: number;
    percentage: number;
  };
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, balanceChange }) => {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);
  
  const { value: changeValue, percentage: changePercentage } = balanceChange;
  const isPositive = changeValue >= 0;

  const formattedChangeValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
  }).format(changeValue);

  return (
    <div className="text-center py-6">
      <p className="text-sm text-gray-400">Total Balance</p>
      <h1 className="text-5xl font-bold tracking-tight mt-2">{formattedBalance}</h1>
      <div className={`flex justify-center items-center mt-3 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isPositive ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          )}
        </svg>
        <span>{formattedChangeValue} ({changePercentage.toFixed(2)}%)</span>
      </div>
    </div>
  );
};

export default BalanceCard;