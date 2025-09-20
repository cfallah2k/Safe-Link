import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Wifi, 
  WifiOff, 
  Battery, 
  Volume2, 
  VolumeX, 
  Settings, 
  Power,
  Home,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Globe,
  Phone,
  MapPin,
  Heart,
  BookOpen,
  Users,
  Shield,
  MessageCircle,
  Calendar,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';

interface KioskSettings {
  brightness: number;
  volume: number;
  language: string;
  autoShutdown: boolean;
  maintenanceMode: boolean;
  offlineMode: boolean;
}

interface KioskStats {
  uptime: string;
  sessionsToday: number;
  totalSessions: number;
  batteryLevel: number;
  isOnline: boolean;
  lastMaintenance: string;
}

const KioskInterface: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'services' | 'education' | 'emergency' | 'settings' | 'maintenance'>('home');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settings, setSettings] = useState<KioskSettings>({
    brightness: 80,
    volume: 70,
    language: 'liberian_english',
    autoShutdown: true,
    maintenanceMode: false,
    offlineMode: false
  });
  const [stats, setStats] = useState<KioskStats>({
    uptime: '2h 15m',
    sessionsToday: 12,
    totalSessions: 1247,
    batteryLevel: 85,
    isOnline: true,
    lastMaintenance: '2024-01-15'
  });

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'liberian_english', label: 'Liberian English' },
    { value: 'bassa', label: 'Bassa' },
    { value: 'kpelle', label: 'Kpelle' },
    { value: 'kru', label: 'Kru' },
    { value: 'vai', label: 'Vai' }
  ];

  const mainServices = [
    {
      id: 'health_info',
      title: 'Health Information',
      description: 'Learn about sexual and reproductive health',
      icon: Heart,
      color: 'bg-red-500',
      path: 'education'
    },
    {
      id: 'find_clinics',
      title: 'Find Clinics',
      description: 'Locate nearby health services',
      icon: MapPin,
      color: 'bg-blue-500',
      path: 'services'
    },
    {
      id: 'emergency_help',
      title: 'Emergency Help',
      description: 'Get immediate assistance',
      icon: Shield,
      color: 'bg-orange-500',
      path: 'emergency'
    },
    {
      id: 'education_games',
      title: 'Educational Games',
      description: 'Learn through interactive games',
      icon: Play,
      color: 'bg-green-500',
      path: 'education'
    }
  ];

  const emergencyContacts = [
    { name: 'Emergency Hotline', phone: '+231-555-9999', type: 'emergency' },
    { name: 'GBV Support', phone: '+231-555-0104', type: 'crisis' },
    { name: 'Youth Health', phone: '+231-555-0202', type: 'health' },
    { name: 'Police', phone: '+231-555-9111', type: 'police' }
  ];

  const educationalTopics = [
    {
      title: 'Understanding Your Body',
      description: 'Learn about reproductive health and anatomy',
      duration: '5 minutes',
      type: 'video'
    },
    {
      title: 'Safe Relationships',
      description: 'Information about consent and healthy relationships',
      duration: '3 minutes',
      type: 'interactive'
    },
    {
      title: 'Contraception Options',
      description: 'Learn about different birth control methods',
      duration: '4 minutes',
      type: 'guide'
    },
    {
      title: 'STI Prevention',
      description: 'How to protect yourself from sexually transmitted infections',
      duration: '3 minutes',
      type: 'video'
    }
  ];

  const nearbyClinics = [
    {
      name: 'Rural Health Center',
      distance: '2.5 km',
      services: ['STI Testing', 'Contraception', 'Prenatal Care'],
      hours: 'Mon-Fri: 8AM-4PM',
      phone: '+231-555-1001'
    },
    {
      name: 'Community Health Post',
      distance: '5.1 km',
      services: ['Basic Health Services', 'Health Education'],
      hours: 'Mon-Sat: 9AM-3PM',
      phone: '+231-555-1002'
    },
    {
      name: 'Mobile Health Unit',
      distance: '8.3 km',
      services: ['STI Testing', 'Vaccinations', 'Health Screening'],
      hours: 'Wed & Fri: 10AM-2PM',
      phone: '+231-555-1003'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleServiceSelect = (service: any) => {
    setCurrentView(service.path);
  };

  const handleEmergencyCall = (contact: any) => {
    // In a real kiosk, this would initiate a call
    alert(`Calling ${contact.name}: ${contact.phone}`);
  };

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const resetKiosk = () => {
    setCurrentView('home');
    setSettings({
      brightness: 80,
      volume: 70,
      language: 'liberian_english',
      autoShutdown: true,
      maintenanceMode: false,
      offlineMode: false
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderHomeView = () => (
    <div className="h-full flex flex-col">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Safe-Linkz Kiosk</h1>
        <p className="text-xl opacity-90">Your safe space for sexual and reproductive health information</p>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Anonymous & Confidential</span>
          </div>
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>Multiple Languages</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>Youth-Friendly</span>
          </div>
        </div>
      </div>

      {/* Main Services Grid */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose a Service</h2>
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mainServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`${service.color} text-white p-8 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-lg`}
              >
                <Icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-sm opacity-90">{service.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>All services are free, confidential, and anonymous. Touch any service to begin.</p>
      </div>
    </div>
  );

  const renderServicesView = () => (
    <div className="h-full flex flex-col">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Find Health Services</h1>
            <p className="text-lg opacity-90">Locate nearby clinics and health centers</p>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {nearbyClinics.map((clinic, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{clinic.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{clinic.distance} away</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{clinic.hours}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {clinic.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEmergencyCall({ name: clinic.name, phone: clinic.phone })}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEducationView = () => (
    <div className="h-full flex flex-col">
      <div className="bg-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Health Education</h1>
            <p className="text-lg opacity-90">Learn about sexual and reproductive health</p>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {educationalTopics.map((topic, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 mb-3">{topic.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {topic.duration}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {topic.type}
                    </span>
                  </div>
                </div>
                <button className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                  <Play className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmergencyView = () => (
    <div className="h-full flex flex-col">
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Emergency Help</h1>
            <p className="text-lg opacity-90">Get immediate assistance when you need it</p>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{contact.name}</h3>
                  <p className="text-lg text-gray-600">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleEmergencyCall(contact)}
                  className="p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Phone className="w-8 h-8" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Safety Tips</h4>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• All calls are confidential and anonymous</li>
                  <li>• Emergency services are available 24/7</li>
                  <li>• You can speak in your preferred language</li>
                  <li>• Help is available for all types of emergencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="h-full flex flex-col">
      <div className="bg-gray-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kiosk Settings</h1>
            <p className="text-lg opacity-90">Configure kiosk preferences</p>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brightness: {settings.brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.brightness}
                  onChange={(e) => handleSettingsChange('brightness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {settings.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => handleSettingsChange('volume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Language Settings</h3>
            <select
              value={settings.language}
              onChange={(e) => handleSettingsChange('language', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.autoShutdown}
                  onChange={(e) => handleSettingsChange('autoShutdown', e.target.checked)}
                  className="rounded"
                />
                <span>Auto shutdown at night</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.offlineMode}
                  onChange={(e) => handleSettingsChange('offlineMode', e.target.checked)}
                  className="rounded"
                />
                <span>Offline mode</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span>{stats.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span>Sessions Today:</span>
                <span>{stats.sessionsToday}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Sessions:</span>
                <span>{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span>Battery Level:</span>
                <span>{stats.batteryLevel}%</span>
              </div>
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Status Bar */}
      <div className="bg-gray-800 text-white p-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Monitor className="w-4 h-4" />
            <span>Safe-Linkz Kiosk</span>
          </div>
          <div className="flex items-center space-x-1">
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Battery className="w-4 h-4" />
            <span>{stats.batteryLevel}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="p-1 hover:bg-gray-700 rounded"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className="p-1 hover:bg-gray-700 rounded"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={resetKiosk}
            className="p-1 hover:bg-gray-700 rounded"
            title="Reset Kiosk"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full overflow-hidden">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'services' && renderServicesView()}
        {currentView === 'education' && renderEducationView()}
        {currentView === 'emergency' && renderEmergencyView()}
        {currentView === 'settings' && renderSettingsView()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-800 text-white p-2">
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'home' ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentView('services')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'services' ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Services</span>
          </button>
          <button
            onClick={() => setCurrentView('education')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'education' ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Education</span>
          </button>
          <button
            onClick={() => setCurrentView('emergency')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'emergency' ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Emergency</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KioskInterface;
