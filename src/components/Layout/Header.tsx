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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Online/Offline indicator */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Language selector */}
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <select className="text-sm border-0 bg-transparent text-gray-600 focus:outline-none">
              <option value="en">English</option>
              <option value="kpelle">Kpelle</option>
              <option value="bassa">Bassa</option>
              <option value="kru">Kru</option>
              <option value="vai">Vai</option>
            </select>
          </div>

          {/* Privacy indicator */}
          {showPrivacy && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {t('common.privacy')}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
