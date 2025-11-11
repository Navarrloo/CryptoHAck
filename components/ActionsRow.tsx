import React from 'react';
import { ArrowUpIcon, WithdrawIcon, SwapIcon, CreditCardIcon } from './Icons';

type ActionType = 'Send' | 'Withdraw' | 'Swap' | 'Buy';

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-colors">
    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

interface ActionsRowProps {
    onAction: (action: ActionType) => void;
}

const ActionsRow: React.FC<ActionsRowProps> = ({ onAction }) => {
  return (
    <div className="flex justify-around items-center py-4">
      <ActionButton icon={<ArrowUpIcon />} label="Send" onClick={() => onAction('Send')} />
      <ActionButton icon={<WithdrawIcon />} label="Вывод" onClick={() => onAction('Withdraw')} />
      <ActionButton icon={<SwapIcon />} label="Swap" onClick={() => onAction('Swap')} />
      <ActionButton icon={<CreditCardIcon />} label="Buy" onClick={() => onAction('Buy')} />
    </div>
  );
};

export default ActionsRow;