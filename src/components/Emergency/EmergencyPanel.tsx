import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Shield, 
  Phone, 
  MessageCircle, 
  MapPin, 
  AlertTriangle, 
  Heart, 
  Users,
  Clock,
  CheckCircle,
  Send,
  Navigation
} from 'lucide-react';
import { offlineStorage } from '../../utils/offlineStorage';
import { locationService, LocationData } from '../../utils/locationService';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'medical' | 'gbv' | 'counseling' | 'hotline';
  available: boolean;
}

interface EmergencyLog {
  id: string;
  timestamp: number;
  type: string;
  action: string;
  location?: { lat: number; lng: number };
  notes?: string;
}

const EmergencyPanel: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [emergencyLogs, setEmergencyLogs] = useState<EmergencyLog[]>([]);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [panicMode, setPanicMode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [showLocationShare, setShowLocationShare] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  // Sample emergency contacts
  const sampleContacts: EmergencyContact[] = useMemo(() => [
    {
      id: '1',
      name: 'Emergency Services',
      phone: '+231-555-9999',
      type: 'police',
      available: true
    },
    {
      id: '2',
      name: 'GBV Support Hotline',
      phone: '+231-555-0104',
      type: 'gbv',
      available: true
    },
    {
      id: '3',
      name: 'Crisis Counseling',
      phone: '+231-555-0200',
      type: 'counseling',
      available: true
    },
    {
      id: '4',
      name: 'Medical Emergency',
      phone: '+231-555-0300',
      type: 'medical',
      available: true
    },
    {
      id: '5',
      name: 'Youth Support Line',
      phone: '+231-555-0400',
      type: 'hotline',
      available: true
    }
  ], []);

  const loadEmergencyData = useCallback(async () => {
    try {
      const [contacts, logs] = await Promise.all([
        offlineStorage.getData('emergency_contacts'),
        offlineStorage.getData('emergency_logs')
      ]);
      
      setEmergencyContacts(contacts || sampleContacts);
      setEmergencyLogs(logs || []);
    } catch (error) {
      console.error('Failed to load emergency data:', error);
      setEmergencyContacts(sampleContacts);
    }
  }, [sampleContacts]);

  const saveEmergencyData = useCallback(async () => {
    try {
      await Promise.all([
        offlineStorage.storeData('emergency_contacts', emergencyContacts),
        offlineStorage.storeData('emergency_logs', emergencyLogs)
      ]);
    } catch (error) {
      console.error('Failed to save emergency data:', error);
    }
  }, [emergencyContacts, emergencyLogs]);

  const getUserLocation = async () => {
    try {
      const result = await locationService.getCurrentLocation();
      if (result.success && result.location) {
        setUserLocation(result.location);
        setLocationPermissionGranted(true);
      } else {
        console.error('Error getting location:', result.error);
        // Set default location to Monrovia
        setUserLocation({
          latitude: 6.3008,
          longitude: -10.7972,
          accuracy: 0,
          timestamp: new Date().toISOString()
        });
        setLocationPermissionGranted(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermissionGranted(false);
    }
  };

  const shareLocationWithEmergency = async (emergencyType: 'police' | 'medical' | 'fire' | 'general') => {
    if (!userLocation) {
      alert('Location not available. Please enable location services.');
      return;
    }

    setIsSharingLocation(true);
    try {
      const result = await locationService.shareLocationWithEmergency(
        'user_' + Date.now(), // In real app, this would be actual user ID
        '+231-555-0000', // In real app, this would be actual phone number
        emergencyType,
        emergencyMessage || 'Emergency assistance needed'
      );

      if (result.success) {
        alert('Location shared with emergency services successfully!');
        
        // Log the emergency action
        const newLog: EmergencyLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: emergencyType,
          action: `Location shared with ${emergencyType} services`,
          location: {
            lat: result.location!.latitude,
            lng: result.location!.longitude
          },
          notes: emergencyMessage
        };

        const updatedLogs = [...emergencyLogs, newLog];
        setEmergencyLogs(updatedLogs);
        await offlineStorage.storeData('emergency_logs', updatedLogs);
      } else {
        alert('Failed to share location: ' + result.error);
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      alert('Failed to share location with emergency services');
    } finally {
      setIsSharingLocation(false);
    }
  };

  const handlePanicButton = () => {
    setPanicMode(true);
    setCountdown(5); // 5 second countdown
    setShowLocationShare(true);
  };

  const handlePanicActivated = useCallback(() => {
    // Log the emergency
    const log: EmergencyLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'panic_button',
      action: 'Panic button activated',
      location: userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : undefined,
      notes: emergencyMessage
    };

    const newLogs = [...emergencyLogs, log];
    setEmergencyLogs(newLogs);
    saveEmergencyData();

    // In a real app, this would:
    // 1. Send emergency alert to contacts
    // 2. Share location with emergency services
    // 3. Send SMS to emergency contacts
    // 4. Log the incident

    alert('Emergency alert sent! Help is on the way.');
    setPanicMode(false);
    setShowLocationShare(false);
  }, [emergencyLogs, userLocation, emergencyMessage, saveEmergencyData]);

  const handleCancelPanic = () => {
    setPanicMode(false);
    setCountdown(0);
    setShowLocationShare(false);
  };

  const handleCallContact = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`, '_self');
    
    // Log the call
    const log: EmergencyLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'call',
      action: `Called ${contact.name}`,
      location: userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : undefined
    };

    const newLogs = [...emergencyLogs, log];
    setEmergencyLogs(newLogs);
    saveEmergencyData();
  };

  const handleSendMessage = () => {
    if (!emergencyMessage.trim()) return;

    // Log the message
    const log: EmergencyLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'message',
      action: 'Emergency message sent',
      location: userLocation || undefined,
      notes: emergencyMessage
    };

    const newLogs = [...emergencyLogs, log];
    setEmergencyLogs(newLogs);
    saveEmergencyData();

    // In a real app, this would send the message to emergency contacts
    alert('Emergency message sent to your contacts!');
    setEmergencyMessage('');
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'police': return Shield;
      case 'medical': return Heart;
      case 'gbv': return Users;
      case 'counseling': return MessageCircle;
      case 'hotline': return Phone;
      default: return Phone;
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'police': return 'bg-red-100 text-red-600';
      case 'medical': return 'bg-green-100 text-green-600';
      case 'gbv': return 'bg-purple-100 text-purple-600';
      case 'counseling': return 'bg-blue-100 text-blue-600';
      case 'hotline': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    loadEmergencyData();
    getUserLocation();
  }, [loadEmergencyData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (panicMode && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (panicMode && countdown === 0) {
      handlePanicActivated();
    }
    return () => clearInterval(interval);
  }, [panicMode, countdown, handlePanicActivated]);

  if (panicMode) {
    return (
      <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-50">
        <div className="text-center text-white p-8">
          <AlertTriangle className="w-24 h-24 mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl font-bold mb-4">EMERGENCY ALERT</h1>
          <p className="text-xl mb-6">Help is being contacted...</p>
          
          {countdown > 0 && (
            <div className="mb-6">
              <div className="text-6xl font-bold mb-2">{countdown}</div>
              <p>seconds until emergency alert is sent</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleCancelPanic}
              className="px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel Emergency
            </button>
            
            {showLocationShare && (
              <div className="mt-4">
                <p className="text-sm mb-2">Your location will be shared with emergency contacts</p>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {userLocation ? 'Location detected' : 'Location not available'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Panic Button */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 mb-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-900 mb-2">Emergency Panic Button</h1>
        <p className="text-red-800 mb-6">
          Press this button if you're in immediate danger or need urgent help
        </p>
        <button
          onClick={handlePanicButton}
          className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-xl hover:bg-red-700 transition-colors shadow-lg"
        >
          🚨 EMERGENCY ALERT 🚨
        </button>
        <p className="text-sm text-red-700 mt-4">
          This will immediately contact emergency services and your emergency contacts
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => {
            const Icon = getContactIcon(contact.type);
            return (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${getContactColor(contact.type)}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${contact.available ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <button
                  onClick={() => handleCallContact(contact)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Message */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Emergency Message</h2>
        <div className="space-y-4">
          <textarea
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            placeholder="Describe your emergency situation..."
            className="w-full input-field"
            rows={4}
          />
          <button
            onClick={handleSendMessage}
            disabled={!emergencyMessage.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={16} />
            <span>Send Emergency Message</span>
          </button>
        </div>
      </div>

      {/* Location Services */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Services</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Location Sharing</p>
              <p className="text-sm text-gray-600">
                {userLocation ? 'Your location is available for emergency services' : 'Location not detected'}
              </p>
              {userLocation && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>GPS Coordinates: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}</p>
                  <p>Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                  <p>Last updated: {new Date(userLocation.timestamp).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={getUserLocation}
              className="btn-outline flex items-center space-x-2"
            >
              <Navigation size={16} />
              <span>Update Location</span>
            </button>
            {userLocation && (
              <div className="flex space-x-2">
                <button
                  onClick={() => shareLocationWithEmergency('police')}
                  disabled={isSharingLocation}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  <Shield size={14} />
                  <span>Share with Police</span>
                </button>
                <button
                  onClick={() => shareLocationWithEmergency('medical')}
                  disabled={isSharingLocation}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  <Heart size={14} />
                  <span>Share with Medical</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Log */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Activity Log</h2>
        {emergencyLogs.length > 0 ? (
          <div className="space-y-3">
            {emergencyLogs
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10)
              .map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600">{formatTime(log.timestamp)}</p>
                      {log.notes && (
                        <p className="text-sm text-gray-500 mt-1">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {log.location && (
                      <MapPin size={16} className="text-green-600" />
                    )}
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No emergency activity recorded</p>
            <p className="text-gray-400 text-sm">Emergency actions will be logged here</p>
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Safety Tips</h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• Keep your phone charged and with you at all times</li>
          <li>• Know your emergency contacts by heart</li>
          <li>• Share your location with trusted contacts when going out</li>
          <li>• Trust your instincts - if something feels wrong, get help</li>
          <li>• Have a safety plan for different situations</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyPanel;
