import React from 'react';

const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={filled ? "#FBBF24" : "rgba(251, 191, 36, 0.3)"}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const TestimonialCard: React.FC<{ name: string, handle: string, quote: string }> = ({ name, handle, quote }) => (
    <div className="bg-gray-800/50 p-4 rounded-xl space-y-3 w-64 flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                {name.charAt(0)}
            </div>
            <div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-sm text-gray-400">{handle}</p>
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
        { name: 'Alex', handle: '@alex_crypto', quote: 'The best wallet I have ever used. Fast, secure, and intuitive. Highly recommended!' },
        { name: 'Maria', handle: '@blockchain_gal', quote: 'Finally, a wallet that understands what users need. The UI is just fantastic.' },
        { name: 'John Doe', handle: '@johndoe', quote: 'Seamless experience from start to finish. Sending crypto has never been easier.' },
        { name: 'CryptoKing', handle: '@king', quote: 'Switched from another big wallet and not looking back. This is the future.' },
    ];
    return (
        <div className="py-6">
            <h3 className="text-lg font-bold text-white px-2 mb-4">What Our Users Say</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                 {reviews.map(review => (
                    <TestimonialCard key={review.handle} {...review} />
                 ))}
            </div>
        </div>
    );
};

export default Testimonials;