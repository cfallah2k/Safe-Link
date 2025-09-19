import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Globe, Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showPrivacy?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showPrivacy = true }) => {
  const { t } = useTranslation();
  const { isOnline } = useOffline();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
      <div className="flex items-center justify-between">
        {/* Left side - Icons and text */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Status icons - Always visible on mobile */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Online/Offline indicator */}
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              )}
            </div>

            {/* Privacy indicator */}
            {showPrivacy && (
              <div className="flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            )}
          </div>

          {/* Title and subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Right side - Language selector and status text */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Language selector - Hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-2">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select className="text-xs sm:text-sm border-0 bg-transparent text-gray-600 focus:outline-none">
              <option value="en">English</option>
              <option value="kpelle">Kpelle</option>
              <option value="bassa">Bassa</option>
              <option value="kru">Kru</option>
              <option value="vai">Vai</option>
            </select>
          </div>

          {/* Status text - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className={`text-xs sm:text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {showPrivacy && (
              <span className="text-xs sm:text-sm font-medium text-green-700">
                {t('common.privacy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
