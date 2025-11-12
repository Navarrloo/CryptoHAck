import React, { useState } from 'react';
import { ArrowLeftIcon } from './Icons';

interface SecretPhraseViewProps {
    onBack: () => void;
}

const mockWords = [
    'witch', 'collapse', 'practice', 'feed', 'shame', 'open',
    'close', 'lake', 'suffer', 'poverty', 'rose', 'tree'
];

const SecretPhraseView: React.FC<SecretPhraseViewProps> = ({ onBack }) => {
    const [acknowledged, setAcknowledged] = useState(false);

    if (!acknowledged) {
        return (
            <div className="flex flex-col h-full p-4 bg-gray-900">
                <header className="relative flex items-center justify-center mb-8">
                    <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-2xl font-bold">Security Warning</h1>
                </header>
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold">Never share your secret phrase.</h2>
                        <p className="text-gray-300">
                            Anyone with this phrase can take your assets forever. Do not share it with anyone, including our support team.
                        </p>
                    </div>
                </div>
                <div className="py-4">
                    <button 
                        onClick={() => setAcknowledged(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-800">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-2xl font-bold">Your Secret Phrase</h1>
            </header>
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                 <p className="text-gray-300">Write these words down in order and store them somewhere safe.</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm p-4 bg-gray-800 rounded-lg">
                    {mockWords.map((word, index) => (
                        <div key={index} className="flex items-center">
                            <span className="text-gray-400 w-8">{index + 1}.</span>
                            <span className="font-mono text-lg text-white">{word}</span>
                        </div>
                    ))}
                </div>
                 <div className="py-4 w-full max-w-sm">
                    <button 
                        onClick={onBack}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecretPhraseView;
