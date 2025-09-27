import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  AlertCircle,
  Search,
  Star,
  Heart,
  Users,
  Home,
  Building
} from 'lucide-react';

interface SafeHouse {
  id: string;
  name: string;
  type: 'safe-house' | 'clinic' | 'support-center' | 'emergency-shelter';
  address: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  rating: number;
  isOpen: boolean;
  capacity: number;
  currentOccupancy: number;
  securityLevel: 'high' | 'medium' | 'low';
  features: string[];
  contactPhone: string;
  emergencyContact: string;
  operatingHours: string;
  requiresOTP: boolean;
  otpExpiry: number; // minutes
}

interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  type: 'start' | 'turn' | 'straight' | 'destination';
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface OTPVerification {
  code: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

const SecureMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSafeHouse, setSelectedSafeHouse] = useState<SafeHouse | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [secureCode, setSecureCode] = useState('');
  const [otpVerification, setOtpVerification] = useState<OTPVerification | null>(null);
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimatedArrival, setEstimatedArrival] = useState<Date | null>(null);

  // Sample safe houses database
  const safeHouses: SafeHouse[] = [
    {
      id: 'safe_1',
      name: 'Liberty Safe House',
      type: 'safe-house',
      address: '123 Peace Street, Monrovia',
      description: 'A secure safe house providing temporary shelter and support for survivors of gender-based violence.',
      coordinates: { lat: 6.3008, lng: -10.7970 },
      distance: 1.2,
      rating: 4.8,
      isOpen: true,
      capacity: 20,
      currentOccupancy: 8,
      securityLevel: 'high',
      features: ['24/7 Security', 'Counseling Services', 'Medical Support', 'Legal Aid'],
      contactPhone: '+231-555-0123',
      emergencyContact: '+231-555-0124',
      operatingHours: '24/7',
      requiresOTP: true,
      otpExpiry: 30
    },
    {
      id: 'safe_2',
      name: 'Youth Support Center',
      type: 'support-center',
      address: '456 Hope Avenue, Monrovia',
      description: 'Youth-focused support center providing counseling, education, and safe spaces for young people.',
      coordinates: { lat: 6.3108, lng: -10.8070 },
      distance: 2.1,
      rating: 4.6,
      isOpen: true,
      capacity: 15,
      currentOccupancy: 12,
      securityLevel: 'medium',
      features: ['Youth Counseling', 'Educational Programs', 'Peer Support', 'Recreation'],
      contactPhone: '+231-555-0456',
      emergencyContact: '+231-555-0457',
      operatingHours: '8 AM - 8 PM',
      requiresOTP: true,
      otpExpiry: 45
    },
    {
      id: 'safe_3',
      name: 'Emergency Shelter',
      type: 'emergency-shelter',
      address: '789 Safety Boulevard, Monrovia',
      description: 'Emergency shelter for immediate crisis situations with 24/7 availability.',
      coordinates: { lat: 6.3208, lng: -10.8170 },
      distance: 3.5,
      rating: 4.9,
      isOpen: true,
      capacity: 30,
      currentOccupancy: 5,
      securityLevel: 'high',
      features: ['Emergency Response', 'Medical Care', 'Legal Support', 'Family Reunification'],
      contactPhone: '+231-555-0789',
      emergencyContact: '+231-555-0790',
      operatingHours: '24/7',
      requiresOTP: true,
      otpExpiry: 15
    },
    {
      id: 'safe_4',
      name: 'Women\'s Health Clinic',
      type: 'clinic',
      address: '321 Care Street, Monrovia',
      description: 'Specialized women\'s health clinic providing comprehensive reproductive health services.',
      coordinates: { lat: 6.3308, lng: -10.8270 },
      distance: 4.2,
      rating: 4.7,
      isOpen: true,
      capacity: 25,
      currentOccupancy: 18,
      securityLevel: 'medium',
      features: ['Medical Services', 'Counseling', 'Family Planning', 'STI Testing'],
      contactPhone: '+231-555-0321',
      emergencyContact: '+231-555-0322',
      operatingHours: '7 AM - 7 PM',
      requiresOTP: false,
      otpExpiry: 0
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: Building },
    { value: 'safe-house', label: 'Safe Houses', icon: Home },
    { value: 'clinic', label: 'Clinics', icon: Heart },
    { value: 'support-center', label: 'Support Centers', icon: Users },
    { value: 'emergency-shelter', label: 'Emergency Shelters', icon: AlertCircle }
  ];

  const filteredSafeHouses = safeHouses.filter(safeHouse => {
    const matchesSearch = safeHouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         safeHouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         safeHouse.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || safeHouse.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safe-house':
        return Home;
      case 'clinic':
        return Heart;
      case 'support-center':
        return Users;
      case 'emergency-shelter':
        return AlertCircle;
      default:
        return Building;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safe-house':
        return 'bg-green-100 text-green-700';
      case 'clinic':
        return 'bg-blue-100 text-blue-700';
      case 'support-center':
        return 'bg-purple-100 text-purple-700';
      case 'emergency-shelter':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCapacityStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return { status: 'Full', color: 'text-red-600 bg-red-100' };
    if (percentage >= 70) return { status: 'Almost Full', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'Available', color: 'text-green-600 bg-green-100' };
  };

  const requestOTP = async (safeHouse: SafeHouse) => {
    // Store the selected safe house for navigation after OTP verification
    setSelectedSafeHouse(safeHouse);
    
    // Simulate OTP generation
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + safeHouse.otpExpiry * 60 * 1000);
    
    setOtpVerification({
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 3
    });
    
    setShowOTPModal(true);
    
    // In a real app, this would send the OTP via SMS
    console.log(`OTP for ${safeHouse.name}: ${code}`);
  };

  const verifyOTP = (enteredCode: string, enteredSecureCode: string) => {
    if (!otpVerification) return false;
    
    // Check both OTP and secure code
    if (enteredCode === otpVerification.code && enteredSecureCode === 'SAFE2024') {
      setShowOTPModal(false);
      setOtpCode('');
      setSecureCode('');
      setOtpVerification(null);
      
      // Start navigation after successful verification
      if (selectedSafeHouse) {
        startNavigation(selectedSafeHouse);
      }
      return true;
    } else {
      setOtpVerification({
        ...otpVerification,
        attempts: otpVerification.attempts + 1
      });
      return false;
    }
  };

  const startNavigation = (safeHouse: SafeHouse) => {
    setSelectedSafeHouse(safeHouse);
    setIsNavigating(true);
    setCurrentStep(0);
    
    // Simulate navigation steps
    const steps: NavigationStep[] = [
      {
        instruction: 'Start navigation to ' + safeHouse.name,
        distance: 0,
        duration: 0,
        type: 'start',
        coordinates: userLocation || { lat: 6.3008, lng: -10.7970 }
      },
      {
        instruction: 'Turn right onto Main Street',
        distance: 0.5,
        duration: 2,
        type: 'turn',
        coordinates: { lat: 6.3018, lng: -10.7980 }
      },
      {
        instruction: 'Continue straight for 0.7 km',
        distance: 0.7,
        duration: 3,
        type: 'straight',
        coordinates: { lat: 6.3028, lng: -10.7990 }
      },
      {
        instruction: 'You have arrived at ' + safeHouse.name,
        distance: 0,
        duration: 0,
        type: 'destination',
        coordinates: safeHouse.coordinates
      }
    ];
    
    setNavigationSteps(steps);
    
    // Calculate estimated arrival
    const totalDuration = steps.reduce((total, step) => total + step.duration, 0);
    setEstimatedArrival(new Date(Date.now() + totalDuration * 60 * 1000));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Monrovia coordinates
          setUserLocation({ lat: 6.3008, lng: -10.7970 });
        }
      );
    } else {
      // Fallback to Monrovia coordinates
      setUserLocation({ lat: 6.3008, lng: -10.7970 });
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Secure Map Navigation</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Find safe spaces with secure OTP verification for your protection
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search safe spaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {typeOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedType(option.value)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedType === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Safe Houses List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredSafeHouses.map(safeHouse => {
              const TypeIcon = getTypeIcon(safeHouse.type);
              const capacityStatus = getCapacityStatus(safeHouse.currentOccupancy, safeHouse.capacity);
              
              return (
                <div key={safeHouse.id} className="card group hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl shadow-sm ${getTypeColor(safeHouse.type)} flex-shrink-0`}>
                      <TypeIcon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                            {safeHouse.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{safeHouse.address}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(safeHouse.type)}`}>
                              {safeHouse.type.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getSecurityColor(safeHouse.securityLevel)}`}>
                              {safeHouse.securityLevel.toUpperCase()} SECURITY
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${capacityStatus.color}`}>
                              {capacityStatus.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{safeHouse.distance} km</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{safeHouse.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {safeHouse.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{safeHouse.currentOccupancy}/{safeHouse.capacity}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{safeHouse.operatingHours}</span>
                          </span>
                          <span className={safeHouse.isOpen ? 'text-green-600' : 'text-red-600'}>
                            {safeHouse.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              if (safeHouse.requiresOTP) {
                                requestOTP(safeHouse);
                              } else {
                                // For non-OTP locations, still require verification for security
                                requestOTP(safeHouse);
                              }
                            }}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Modal */}
          {isNavigating && selectedSafeHouse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Navigation to {selectedSafeHouse.name}</h3>
                  <button
                    onClick={() => {
                      setIsNavigating(false);
                      setSelectedSafeHouse(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  {navigationSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        index === currentStep
                          ? 'border-blue-500 bg-blue-50'
                          : index < currentStep
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === currentStep
                            ? 'bg-blue-500 text-white'
                            : index < currentStep
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{step.instruction}</p>
                          {step.distance > 0 && (
                            <p className="text-xs text-gray-500">
                              {step.distance} km • {step.duration} min
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {estimatedArrival && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Estimated Arrival:</strong> {estimatedArrival.toLocaleTimeString()}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(navigationSteps.length - 1, currentStep + 1))}
                    disabled={currentStep === navigationSteps.length - 1}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OTP Verification Modal */}
          {showOTPModal && otpVerification && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">OTP Verification Required</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter the OTP sent to your phone to get directions to:
                  </p>
                  {selectedSafeHouse && (
                    <p className="text-sm font-medium text-blue-600">
                      {selectedSafeHouse.name}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      maxLength={6}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secure Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={secureCode}
                      onChange={(e) => setSecureCode(e.target.value)}
                      placeholder="Enter your secure access code"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Contact your support team if you don't have a secure code
                    </p>
                  </div>

                  {otpVerification.attempts > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">
                        Invalid OTP. {otpVerification.maxAttempts - otpVerification.attempts} attempts remaining.
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      OTP expires in {Math.ceil((otpVerification.expiresAt.getTime() - Date.now()) / 60000)} minutes
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowOTPModal(false);
                      setOtpCode('');
                      setSecureCode('');
                      setOtpVerification(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (verifyOTP(otpCode, secureCode)) {
                        // Both OTP and secure code verified successfully - navigation will start automatically
                        console.log('OTP and secure code verified successfully - starting navigation');
                      }
                    }}
                    disabled={otpCode.length !== 6 || !secureCode.trim() || otpVerification.attempts >= otpVerification.maxAttempts}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify & Get Directions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SecureMap;
