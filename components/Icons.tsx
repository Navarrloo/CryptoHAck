import React from 'react';

export const BtcIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 48 48">
      <defs><circle id="btc-icon-a" cx="24" cy="24" r="24"/></defs>
      <g fill="none" fillRule="evenodd">
        <use fill="#FFB13D" href="#btc-icon-a"/>
        <path fill="#FFF" d="M33.43 23.368c.613-3.69-1.78-5.32-4.94-6.84l.983-3.94-2.45-.613-.96 3.846c-.59-.148-1.193-.288-1.79-.427l.96-3.847-2.45-.613-.984 3.94c-.504-.125-.995-.25-1.48-.37l-2.06-8.243-2.45-.614.002 2.305s-1.284-.337-2.073-.52l.002-2.31-2.45-.613-.77 3.085c-.412-.103-.82-.21-1.225-.316l-1.12-4.486-2.45-.613.985 3.94c-.613.16-1.214.32-1.802.493l-3.32 1.258.91 3.64c.05.15.08.3.1.45.03.14.04.28.04.43l-4.135 1.033 1.08 4.316s2.176.543 2.13.52c.28-.07.54-.15.78-.24l.6 2.4c-.23.07-.45.14-.66.21-.3.09-.6.18-.88.27l-1.12 4.49 2.45.614.983-3.94c.548.15 1.083.3 1.612.44l-.986 3.95 2.45.613.984-3.942c.56.152 1.107.3 1.64.44l3.15 7.89 2.45.612-.983-3.94c2.583.47 4.63.15 5.71-2.49 1.02-2.5-0.12-4.1-1.87-5.25.86-.2 1.55-.57 2.05-1.28.62-.86.9-2.1.61-3.68zm-6.26 6.84c-.72 2.88-4.22 1.3-5.46.98l.84-3.36c1.24.3 4.96.9 4.62 2.38zm1.09-5.92c-.66 2.64-3.62 1.25-4.66 1l.75-2.98c1.04.26 4.24.8 3.91 1.98z"/>
      </g>
    </svg>
);
export const EthereumIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 48 48">
        <g fill="none" fillRule="evenodd">
            <circle cx="24" cy="24" r="24" fill="#627EEA"/>
            <g fill="#FFF" fillRule="nonzero">
                <path d="M24 6.335l-.23.68L13.53 28.76l10.24 7.91.23.18.23-.18 10.24-7.91L24.23 7.015 24 6.335zm0 24.36l-6.4-4.94 6.4 11.91v-6.97zm0-9.87l6.4-4.94-6.4-4.94v9.88z" opacity=".602"/>
                <path d="M24 6.335v14.49l6.4-4.94L24 6.335zm0 24.36v-6.97l-6.4 4.94L24 30.695z"/>
                <path d="M24 23.725l6.4-4.94-6.4-4.94v9.88zM17.6 18.785l6.4 4.94v-9.88l-6.4 4.94z" opacity=".602"/>
                <path d="M17.6 18.785L24 23.725v-4.94l-6.4-4.94z"/>
            </g>
        </g>
    </svg>
);
export const TetherIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 48 48">
        <g fill="none" fillRule="evenodd">
            <circle cx="24" cy="24" r="24" fill="#50AF95"/>
            <path fill="#FFF" fillRule="nonzero" d="M34.002 24.323V21.49h5.175v-4.99H9v4.99h5.17v2.833h-5.17v5.043h5.17v2.831h-5.17v4.99h20.177v-4.99h-5.175v-2.831h5.175v-5.043h-5.176zm-10.001 0h-5.176v-8.48h5.176v8.48zm0 5.043h-5.176v-2.212h5.176v2.212z"/>
        </g>
    </svg>
);

export const ChevronDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const BellIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// Action Icons
export const ArrowUpIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);
export const ArrowDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);
export const WithdrawIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

// Nav Icons
export const WalletIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 01-2-2V4a2 2 0 012-2h12v4"/><path d="M4 6v12a2 2 0 002 2h14v-4"/><path d="M18 12a2 2 0 00-2 2h4a2 2 0 00-2-2z"/></svg>
);
export const CompassIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>
);
export const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
export const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
);

// Navigation Icons
export const ArrowLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

export const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);