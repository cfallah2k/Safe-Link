import React, { useState } from 'react';
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
  Play,
  Download,
  FileText,
  Smartphone,
  Bell,
  Heart,
  BookOpen,
  Lock,
  ChevronDown,
  GraduationCap,
  Eye,
  MousePointer,
  Volume2,
  Brain
} from 'lucide-react';
import NotificationSystem from '../UI/NotificationSystem';

interface NavigationItem {
  path: string;
  icon: any;
  label: string;
}

interface DropdownMenu {
  title: string;
  icon: any;
  items: NavigationItem[];
}

const DesktopHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Organize navigation items into logical groups
  const dropdownMenus: DropdownMenu[] = [
    {
      title: 'Health & Safety',
      icon: Shield,
      items: [
        { path: '/', icon: Home, label: t('navigation.home') },
        { path: '/clinics', icon: MapPin, label: t('navigation.clinics') },
        { path: '/safe-spaces', icon: Lock, label: 'Safe Spaces' },
        { path: '/emergency', icon: Shield, label: t('navigation.emergency') },
        { path: '/tracker', icon: Calendar, label: t('navigation.tracker') },
      ]
    },
    {
      title: 'Education & Support',
      icon: BookOpen,
      items: [
        { path: '/chatbot', icon: MessageCircle, label: t('navigation.chatbot') },
        { path: '/videos', icon: Play, label: 'Videos' },
        { path: '/articles', icon: FileText, label: 'Articles' },
        { path: '/stories', icon: BookOpen, label: 'Stories' },
        { path: '/mentorship', icon: Users, label: t('navigation.mentorship') },
        { path: '/inclusive-support', icon: Users, label: 'Inclusive Support' },
      ]
    },
    {
      title: 'Interactive Features',
      icon: Gamepad2,
      items: [
        { path: '/games', icon: Gamepad2, label: t('navigation.games') },
        { path: '/consent-game', icon: Heart, label: 'Consent Game' },
        { path: '/sms', icon: Smartphone, label: 'SMS & USSD' },
        { path: '/sms-alerts', icon: Bell, label: 'SRHR Alerts' },
      ]
    },
    {
      title: 'Tools & Settings',
      icon: Settings,
      items: [
        { path: '/notifications', icon: Bell, label: 'Notifications' },
        { path: '/tutorial', icon: GraduationCap, label: 'Tutorial' },
        { path: '/visual-accessibility', icon: Eye, label: 'Visual Accessibility' },
        { path: '/motor-accessibility', icon: MousePointer, label: 'Motor Accessibility' },
        { path: '/hearing-accessibility', icon: Volume2, label: 'Hearing Accessibility' },
        { path: '/cognitive-accessibility', icon: Brain, label: 'Easy to Use' },
        { path: '/offline', icon: Download, label: 'Offline Mode' },
        { path: '/settings', icon: Settings, label: t('navigation.settings') },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isAnyItemActive = (items: NavigationItem[]) => {
    return items.some(item => isActive(item.path));
  };

  const handleDropdownToggle = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  const handleItemClick = () => {
    setActiveDropdown(null);
  };

  return (
    <>
    <header className="bg-white border-b border-gray-200 shadow-sm overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Safe-Linkz</h1>
              <p className="text-xs text-gray-500">Your Safe Space for SRHR</p>
            </div>
          </div>

            {/* Navigation Dropdowns */}
            <nav className="flex items-center space-x-1 overflow-x-auto overflow-visible">
            {dropdownMenus.map((menu) => {
              const Icon = menu.icon;
              const hasActiveItem = isAnyItemActive(menu.items);
              const isOpen = activeDropdown === menu.title;
              
              return (
                <div key={menu.title} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(menu.title)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      hasActiveItem || isOpen
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{menu.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                      <div className="p-2">
                        {menu.items.map((item) => {
                          const ItemIcon = item.icon;
                          const active = isActive(item.path);
                          
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={handleItemClick}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                active
                                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side - Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationSystem />
          </div>
        </div>
      </div>
    </header>

    {/* Backdrop for closing dropdowns */}
    {activeDropdown && (
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setActiveDropdown(null)}
      />
    )}
    </>
  );
};

export default DesktopHeader;
