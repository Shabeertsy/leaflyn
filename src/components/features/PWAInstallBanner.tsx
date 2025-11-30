import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

const PWAInstallBanner: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show banner after 2 seconds if installable
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  const handleInstall = async () => {
    await installApp();
    setShowBanner(false);
  };

  if (!showBanner || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 lg:hidden animate-slide-down">
      <div className="bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white rounded-2xl shadow-2xl p-4 border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Download size={24} className="text-[#2d5016]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1">Install Leaflyn App</h3>
            <p className="text-sm text-white/90 leading-snug">
              Add to your home screen for a better experience!
            </p>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-white text-[#2d5016] font-bold text-sm py-2 px-4 rounded-lg hover:bg-white/90 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-white/90 hover:text-white text-sm font-medium"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
