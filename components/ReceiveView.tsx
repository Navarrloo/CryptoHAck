import React from 'react';
import { ArrowLeftIcon, CopyIcon, QrCodeIcon } from './Icons';

interface ReceiveViewProps {
    onBack: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const ReceiveView: React.FC<ReceiveViewProps> = ({ onBack, showToast }) => {
    // This is a mock address. In a real app, you'd get this from the user's wallet state.
    const mockAddress = '0x1A2b3C4d5E6f7G8h9I0j1K2L3M4n5O6p7Q8r9S0t';

    const handleCopy = () => {
        navigator.clipboard.writeText(mockAddress);
        showToast('Address copied to clipboard!', 'success');
    };

    return (
        <div className="flex flex-col h-full p-4">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-2xl font-bold">Receive</h1>
            </header>
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 pb-16">
                <div className="p-4 bg-white rounded-2xl">
                     <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mockAddress}&bgcolor=ffffff&color=0d1117&qzone=1`}
                        alt="Wallet QR Code"
                        className="w-48 h-48"
                    />
                </div>
                
                <div className="w-full max-w-xs">
                     <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={mockAddress}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pr-12 text-center text-white text-sm break-all"
                        />
                        <button onClick={handleCopy} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white">
                            <CopyIcon />
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg max-w-xs">
                    <p className="text-sm text-gray-300">
                        Only send assets compatible with the Ethereum network (ERC-20). Sending other assets may result in permanent loss.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ReceiveView;
