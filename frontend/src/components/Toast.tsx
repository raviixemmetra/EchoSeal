import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-400';
      case 'error':
        return 'bg-red-500/90 border-red-400';
      case 'warning':
        return 'bg-yellow-500/90 border-yellow-400';
      case 'info':
        return 'bg-blue-500/90 border-blue-400';
      default:
        return 'bg-slate-700/90 border-slate-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border-2 shadow-2xl backdrop-blur-md animate-slide-in-down ${getToastStyles()}`}
      style={{ minWidth: '300px', maxWidth: '500px' }}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white/20 rounded-full font-bold">
        {getIcon()}
      </div>
      <p className="flex-1 text-white font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
