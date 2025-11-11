import React from 'react';

interface PlaceholderViewProps {
  title: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
      <div className="w-24 h-24 bg-gray-800 rounded-full mb-6 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M21 12.87V8.13a1 1 0 00-.6-.93l-6.54-3.44a1 1 0 00-.8 0l-6.54 3.44a1 1 0 00-.6.93v4.74a1 1 0 00.6.93l6.54 3.44a1 1 0 00.8 0l6.54-3.44a1 1 0 00.6-.93z"/><path d="M21 8.78l-7.14 3.75L6.86 8.78"/><path d="M14.5 21.22V12"/></svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p>This section is coming soon. Stay tuned!</p>
    </div>
  );
};

export default PlaceholderView;
