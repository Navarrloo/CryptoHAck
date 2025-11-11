import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = "fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 z-50";
  const typeClasses = type === 'success'
    ? "bg-green-600/90 backdrop-blur-sm"
    : "bg-red-600/90 backdrop-blur-sm";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

export default Toast;
