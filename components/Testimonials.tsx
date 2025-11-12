import React from 'react';

const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={filled ? "#FBBF24" : "rgba(251, 191, 36, 0.3)"}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const colors = [
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-pink-500 to-red-500',
];

const Avatar: React.FC<{ name: string; index: number }> = ({ name, index }) => {
    const initial = name.charAt(0).toUpperCase();
    const color = colors[index % colors.length];
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            <span className="text-lg font-bold text-white">{initial}</span>
        </div>
    );
};

const TestimonialCard: React.FC<{ name: string, quote: string, index: number }> = ({ name, quote, index }) => (
    <div className="bg-gray-800/50 p-4 rounded-xl space-y-3 w-64 flex-shrink-0">
        <div className="flex items-center gap-3">
            <Avatar name={name} index={index} />
            <div>
                <p className="font-semibold text-white">{name}</p>
            </div>
        </div>
        <div className="flex">
            {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
        </div>
        <p className="text-gray-300 text-sm italic">"{quote}"</p>
    </div>
);


const Testimonials: React.FC = () => {
    const reviews = [
        { name: 'oexex', quote: 'Finally, a wallet that\'s both secure and easy to use. Highly recommend for any serious crypto holder.' },
        { name: 'NAVARRLO', quote: 'The dApp integration is smooth and the interface is super clean. My go-to wallet for all things DeFi.' },
        { name: 'SanderCryp', quote: 'Love how this works inside Telegram. Fast, reliable, and just what the ecosystem needed.' },
        { name: 'Solanama', quote: 'Super fast transactions, perfect for trading on Solana. Hasn\'t let me down once.' },
    ];
    return (
        <div className="py-6">
            <h3 className="text-lg font-bold text-white px-2 mb-4">What Our Users Say</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                 {reviews.map((review, index) => (
                    <TestimonialCard key={review.name} {...review} index={index} />
                 ))}
            </div>
        </div>
    );
};

export default Testimonials;
