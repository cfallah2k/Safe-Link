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
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-md touch-manipulation"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ paddingTop: 'max(60px, env(safe-area-inset-top))' }}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('app.name')}</h1>
              <p className="text-xs text-gray-500">{t('app.tagline')}</p>
            </div>
          </div>

          {/* Navigation items */}
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 touch-manipulation
                    ${active 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                    }
                  `}
                  style={{ minHeight: '44px' }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Privacy indicator */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                {t('common.anonymous')}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your data is protected and anonymous
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
