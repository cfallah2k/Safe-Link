import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  MousePointer, 
  Volume2, 
  Smartphone, 
  Wifi,
  WifiOff,
  Download,
  BarChart3,
  Users,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { smsService } from '../../services/smsService';
import { ussdService } from '../../services/ussdService';
import { voiceCommandService } from '../../services/voiceCommandService';
import { keyboardNavigationService } from '../../services/keyboardNavigationService';
import { offlineAccessibilityService } from '../../services/offlineAccessibilityService';

const AccessibilityDashboard: React.FC = () => {
  const { settings } = useAccessibility();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [smsUsers, setSmsUsers] = useState(0);
  const [ussdSessions, setUssdSessions] = useState(0);
  const [offlineContent, setOfflineContent] = useState(0);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, total: 0 });

  useEffect(() => {
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load data
    loadDashboardData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadDashboardData = async () => {
    // Load SMS users
    const smsUsersList = smsService.getAllUsers();
    setSmsUsers(smsUsersList.length);

    // Load USSD sessions
    const ussdSessionsList = ussdService.getActiveSessions();
    setUssdSessions(ussdSessionsList.length);

    // Load offline content
    const content = offlineAccessibilityService.getAllContent();
    setOfflineContent(content.length);

    // Load storage info
    const storage = await offlineAccessibilityService.getStorageInfo();
    setStorageInfo(storage);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-gray-400" />
    );
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Accessibility Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage accessibility features for rural communities and people with disabilities
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          <div className={`p-4 rounded-lg border ${
            isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {isOnline ? <Wifi className="w-6 h-6 text-green-600" /> : <WifiOff className="w-6 h-6 text-red-600" />}
              <div>
                <h3 className={`font-semibold ${isOnline ? 'text-green-900' : 'text-red-900'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </h3>
                <p className={`text-sm ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                  {isOnline ? 'All services available' : 'Offline mode active - limited functionality'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Visual Accessibility */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              {getStatusIcon(settings.highContrast || settings.fontSize !== 'normal')}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Visual Accessibility</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>High Contrast:</span>
                <span className={getStatusColor(settings.highContrast)}>
                  {getStatusText(settings.highContrast)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Font Size:</span>
                <span className="text-gray-600">{settings.fontSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Color Blind:</span>
                <span className="text-gray-600">{settings.colorBlindMode}</span>
              </div>
            </div>
          </div>

          {/* Motor Accessibility */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
              {getStatusIcon(settings.keyboardNavigation || settings.voiceCommands)}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Motor Accessibility</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Keyboard Nav:</span>
                <span className={getStatusColor(settings.keyboardNavigation)}>
                  {getStatusText(settings.keyboardNavigation)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Voice Commands:</span>
                <span className={getStatusColor(settings.voiceCommands)}>
                  {getStatusText(settings.voiceCommands)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Large Touch:</span>
                <span className={getStatusColor(settings.largeTouchTargets)}>
                  {getStatusText(settings.largeTouchTargets)}
                </span>
              </div>
            </div>
          </div>

          {/* Hearing Accessibility */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              {getStatusIcon(settings.visualAlerts || settings.captions)}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hearing Accessibility</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Visual Alerts:</span>
                <span className={getStatusColor(settings.visualAlerts)}>
                  {getStatusText(settings.visualAlerts)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Captions:</span>
                <span className={getStatusColor(settings.captions)}>
                  {getStatusText(settings.captions)}
                </span>
              </div>
            </div>
          </div>

          {/* Rural/Basic Phone */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              {getStatusIcon(settings.smsMode || settings.ussdMode || settings.offlineMode)}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rural/Basic Phone</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>SMS Mode:</span>
                <span className={getStatusColor(settings.smsMode)}>
                  {getStatusText(settings.smsMode)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>USSD Mode:</span>
                <span className={getStatusColor(settings.ussdMode)}>
                  {getStatusText(settings.ussdMode)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Offline Mode:</span>
                <span className={getStatusColor(settings.offlineMode)}>
                  {getStatusText(settings.offlineMode)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* SMS Usage */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">SMS Users</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{smsUsers}</div>
            <p className="text-sm text-gray-600">Active SMS users</p>
          </div>

          {/* USSD Sessions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">USSD Sessions</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">{ussdSessions}</div>
            <p className="text-sm text-gray-600">Active USSD sessions</p>
          </div>

          {/* Offline Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Offline Content</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{offlineContent}</div>
            <p className="text-sm text-gray-600">Downloaded items</p>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Storage Usage</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Used</span>
                <span>{formatBytes(storageInfo.used)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ 
                    width: `${storageInfo.total > 0 ? (storageInfo.used / storageInfo.total) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Available:</span>
                <span className="ml-2 font-medium">{formatBytes(storageInfo.available)}</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="ml-2 font-medium">{formatBytes(storageInfo.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Service Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Voice Recognition</span>
                <span className={getStatusColor(voiceCommandService.isSupported())}>
                  {getStatusText(voiceCommandService.isSupported())}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Keyboard Navigation</span>
                <span className={getStatusColor(keyboardNavigationService.getIsEnabled())}>
                  {getStatusText(keyboardNavigationService.getIsEnabled())}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SMS Service</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">USSD Service</span>
                <span className="text-green-600">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Offline Storage</span>
                <span className="text-green-600">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accessibility Context</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityDashboard;
