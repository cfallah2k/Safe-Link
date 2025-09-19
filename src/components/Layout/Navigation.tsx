import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Gamepad2, 
  Shield, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/chatbot', icon: MessageCircle, label: t('navigation.chatbot') },
    { path: '/clinics', icon: MapPin, label: t('navigation.clinics') },
    { path: '/tracker', icon: Calendar, label: t('navigation.tracker') },
    { path: '/games', icon: Gamepad2, label: t('navigation.games') },
    { path: '/emergency', icon: Shield, label: t('navigation.emergency') },
    { path: '/mentorship', icon: Users, label: t('navigation.mentorship') },
    { path: '/settings', icon: Settings, label: t('navigation.settings') },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button - Enhanced for better touch targets */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 touch-manipulation active:scale-95 transition-transform"
        style={{ 
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          minHeight: '48px',
          minWidth: '48px'
        }}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay with better touch handling */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        />
      )}

      {/* Navigation - Enhanced mobile experience */}
      <nav className={`
        fixed left-0 top-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-40 transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none lg:w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ 
        paddingTop: 'max(60px, env(safe-area-inset-top))',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div className="p-4 sm:p-6 h-full flex flex-col">
          {/* Logo - Enhanced for mobile */}
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{t('app.name')}</h1>
              <p className="text-xs text-gray-500 truncate">{t('app.tagline')}</p>
            </div>
          </div>

          {/* Navigation items - Enhanced spacing and touch targets */}
          <div className="space-y-1 flex-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 touch-manipulation
                    active:scale-98 lg:active:scale-100
                    ${active 
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                    }
                  `}
                  style={{ minHeight: '52px' }}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Privacy indicator - Enhanced for mobile */}
          <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm font-medium text-green-700">
                {t('common.anonymous')}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1 leading-relaxed">
              Your data is protected and anonymous
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
