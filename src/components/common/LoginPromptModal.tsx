import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

const LoginPromptModal: React.FC = () => {
  const navigate = useNavigate();
  const { showLoginPrompt, setShowLoginPrompt, pendingAction, setPendingAction } = useUIStore();

  if (!showLoginPrompt) return null;

  const handleLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const handleContinue = () => {
    setShowLoginPrompt(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleClose = () => {
    setShowLoginPrompt(false);
    setPendingAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-[#2d5016]/10 rounded-full flex items-center justify-center mb-4">
            <LogIn size={24} className="text-[#2d5016]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sync Your Cart?
          </h3>
          <p className="text-gray-600">
            Login to save your cart and wishlist items across all your devices.
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-[#2d5016] text-white font-bold rounded-xl hover:bg-[#3d6622] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <LogIn size={18} />
            Login to Sync
          </button>
          
          <button
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            Continue as Guest
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
