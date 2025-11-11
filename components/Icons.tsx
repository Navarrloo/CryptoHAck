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
export const SolanaIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 108 108" fill="none">
        <rect width="108" height="108" rx="54" fill="url(#sol-paint0_linear_28_103)"/>
        <path d="M36.19 72.86C33.64 72.86 31.52 72.06 29.83 70.47C28.14 68.88 27.29 66.82 27.29 64.29V43.71C27.29 41.18 28.14 39.12 29.83 37.53C31.52 35.94 33.64 35.14 36.19 35.14H46.81C49.36 35.14 51.48 35.94 53.17 37.53C54.86 39.12 55.71 41.18 55.71 43.71V50.86H47.57V43.71C47.57 42.66 47.33 41.87 46.85 41.34C46.37 40.81 45.71 40.54 44.86 40.54H38.14C37.29 40.54 36.63 40.81 36.15 41.34C35.67 41.87 35.43 42.66 35.43 43.71V64.29C35.43 65.34 35.67 66.13 36.15 66.66C36.63 67.19 37.29 67.46 38.14 67.46H44.86C45.71 67.46 46.37 67.19 46.85 66.66C47.33 66.13 47.57 65.34 47.57 64.29V57.14H55.71V64.29C55.71 66.82 54.86 68.88 53.17 70.47C51.48 72.06 49.36 72.86 46.81 72.86H36.19Z" fill="white"/>
        <path d="M60.43 72.86C57.88 72.86 55.76 72.06 54.07 70.47C52.38 68.88 51.54 66.82 51.54 64.29V43.71C51.54 41.18 52.38 39.12 54.07 37.53C55.76 35.94 57.88 35.14 60.43 35.14H71.05C73.6 35.14 75.72 35.94 77.41 37.53C79.1 39.12 79.95 41.18 79.95 43.71V50.86H71.81V43.71C71.81 42.66 71.57 41.87 71.09 41.34C70.61 40.81 69.95 40.54 69.1 40.54H62.38C61.53 40.54 60.87 40.81 60.39 41.34C59.91 41.87 59.67 42.66 59.67 43.71V64.29C59.67 65.34 59.91 66.13 60.39 66.66C60.87 67.19 61.53 67.46 62.38 67.46H69.1C69.95 67.46 70.61 67.19 71.09 66.66C71.57 66.13 71.81 65.34 71.81 64.29V57.14H79.95V64.29C79.95 66.82 79.1 68.88 77.41 70.47C75.72 72.06 73.6 72.86 71.05 72.86H60.43Z" fill="white"/>
        <defs>
        <linearGradient id="sol-paint0_linear_28_103" x1="-2.11333e-06" y1="108" x2="111.5" y2="-4.49999" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9945FF"/>
        <stop offset="1" stopColor="#14F195"/>
        </linearGradient>
        </defs>
    </svg>
);
export const XrpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill="#23292F"/>
      <path fill="#FFF" d="m14.9 20.3-3.2 3.1 3.2 3.2 1.2-1.2-2-2 2-2-1.2-1.1zm18.3 0-1.2 1.1 2 2-2 2 1.2 1.2 3.2-3.2-3.2-3.1zm-8.8 11-4.2-11.4-4.2 11.4h2.5l1.7-4.8 1.7 4.8h2.5z"/>
    </svg>
);
export const CardanoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill="#0D1E30"/>
      <path fill="#0033AD" d="M24.4,41.2c-8.5,0-15.4-6.9-15.4-15.4c0-4,1.5-7.6,4-10.4l11.4,11.4C24.4,26.9,24.4,41.2,24.4,41.2z"/>
      <path fill="#0033AD" d="M29.2,34.4c-1.3,1-2.9,1.7-4.8,1.7c-3.2,0-6-1.7-7.7-4.3l7.2-7.2L29.2,34.4z"/>
      <path fill="#0033AD" d="M37,29.3c-2,3-5.1,5-8.8,5c-1.9,0-3.6-0.5-5.2-1.3l10.4-10.4C35.1,24.2,36.3,26.5,37,29.3z"/>
      <path fill="#0033AD" d="M39.4,21c-0.5,2.7-1.8,5-3.8,6.7l-9.8-9.8c1.7-2,4.1-3.3,6.8-3.8C35.5,14.1,38,17.2,39.4,21z"/>
      <path fill="#0033AD" d="M24.4,6.8c8.5,0,15.4,6.9,15.4,15.4c0,1.9-0.4,3.8-1,5.5l-14.3-14.3C24.4,13.4,24.4,6.8,24.4,6.8z"/>
    </svg>
);
export const DogecoinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#C3A634"/>
        <path fill="#FFF" d="M24.3 10.5c-4.4 0-7.8 1.5-10.1 4.5s-3.5 7.1-3.5 12.5c0 4.2 1.3 7.7 3.9 10.3 2.6 2.6 6.1 4 10.1 4.2h.5c.3 0 .5-.1.7-.2.2-.1.3-.3.3-.6v-4.4c0-.5-.1-.9-.4-1.2-.3-.3-.7-.5-1.1-.5h-1.9c-1.1 0-2.1-.2-3.1-.6-1-.4-1.9-.9-2.6-1.5-1.1-1-1.7-2.6-1.7-4.8 0-2.4.9-4.2 2.7-5.5.9-.6 2.4-1.2 4.4-1.6 2-.4 3.9-.6 5.8-.6h.1c.3 0 .5-.1.7-.2.2-.1.3-.3.3-.6v-4.4c0-.3-.1-.5-.3-.6-.2-.1-.4-.2-.7-.2h-.5z"/>
        <path fill="#FFF" d="M30.6 20.2c-1.3-1.6-3-2.4-5.1-2.4-1.5 0-2.8.3-4.1.8-1.2.5-2.3 1.2-3.1 2.1-.6.7-1.1 1.4-1.4 2.2-.3.8-.4 1.7-.4 2.5 0 .3.1.5.3.7.1.1.3.2.6.2h.1c2.2 0 4-.4 5.3-1.1 1.3-.7 2.3-1.8 3-3.2.1-.3 0-.5-.2-.7-.1-.1-.3-.2-.5-.2h-.1z"/>
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
export const StoreIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
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