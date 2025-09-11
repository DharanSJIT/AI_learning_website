import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Notification({ notification, onClose }) {
  // Automatically call the onClose function after 3 seconds
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.visible, onClose]);

  if (!notification.visible) return null;

  const isSuccess = notification.type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div 
      className={`fixed top-20 right-5 z-50 flex items-center p-4 rounded-lg shadow-2xl text-white ${bgColor} animate-slideInFromRight`}
    >
      <Icon className="w-6 h-6 mr-3" />
      <span className="font-medium">{notification.message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 -mr-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}