import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/95 border-emerald-400 shadow-glow-teal';
      case 'error':
        return 'bg-red-500/95 border-red-400';
      case 'warning':
        return 'bg-amber-500/95 border-amber-400';
      case 'info':
        return 'bg-cyan-500/95 border-cyan-400 shadow-glow-cyan';
      default:
        return 'bg-slate-700/95 border-slate-600';
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

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-300';
      case 'error':
        return 'bg-red-300';
      case 'warning':
        return 'bg-amber-300';
      case 'info':
        return 'bg-cyan-300';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border-2 shadow-2xl backdrop-blur-md animate-slide-in-right ${getToastStyles()}`}
      style={{ minWidth: '320px', maxWidth: '480px' }}
    >
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/30 rounded-full font-bold text-lg animate-bounce-in">
          {getIcon()}
        </div>
        <p className="flex-1 text-white font-semibold text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-all hover:rotate-90"
        >
          ✕
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-black/20">
        <div
          className={`h-full transition-all ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;
