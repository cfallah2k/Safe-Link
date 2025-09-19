import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Search, 
  Navigation,
  Heart,
  Shield,
  Users,
  Calendar
} from 'lucide-react';
import { offlineStorage } from '../../utils/offlineStorage';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  rating: number;
  distance: number;
  coordinates: { lat: number; lng: number };
  type: 'clinic' | 'hospital' | 'counseling' | 'emergency';
  isOpen: boolean;
}

const ClinicFinder: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Sample clinic data (in a real app, this would come from an API)
  const sampleClinics: Clinic[] = useMemo(() => [
    {
      id: '1',
      name: 'Monrovia Health Center',
      address: 'Broad Street, Monrovia',
      phone: '+231-555-0101',
      hours: 'Mon-Fri: 8AM-5PM, Sat: 9AM-1PM',
      services: ['STI Testing', 'Contraception', 'Prenatal Care', 'Counseling'],
      rating: 4.5,
      distance: 2.3,
      coordinates: { lat: 6.3008, lng: -10.7972 },
      type: 'clinic',
      isOpen: true
    },
    {
      id: '2',
      name: 'Youth Friendly Services Center',
      address: 'Capitol Hill, Monrovia',
      phone: '+231-555-0102',
      hours: 'Mon-Sat: 9AM-6PM',
      services: ['Youth Counseling', 'SRHR Education', 'Peer Support', 'Emergency Contraception'],
      rating: 4.8,
      distance: 1.8,
      coordinates: { lat: 6.3108, lng: -10.8072 },
      type: 'counseling',
      isOpen: true
    },
    {
      id: '3',
      name: 'Redemption Hospital',
      address: 'Bushrod Island, Monrovia',
      phone: '+231-555-0103',
      hours: '24/7 Emergency Services',
      services: ['Emergency Care', 'Maternity', 'Surgery', 'Laboratory'],
      rating: 4.2,
      distance: 4.1,
      coordinates: { lat: 6.3208, lng: -10.8172 },
      type: 'hospital',
      isOpen: true
    },
    {
      id: '4',
      name: 'GBV Support Center',
      address: 'Sinkor, Monrovia',
      phone: '+231-555-0104',
      hours: '24/7 Hotline',
      services: ['Crisis Counseling', 'Legal Support', 'Safe Shelter', 'Medical Care'],
      rating: 4.9,
      distance: 3.2,
      coordinates: { lat: 6.3308, lng: -10.8272 },
      type: 'emergency',
      isOpen: true
    },
    {
      id: '5',
      name: 'Family Planning Clinic',
      address: 'Paynesville, Monrovia',
      phone: '+231-555-0105',
      hours: 'Mon-Fri: 8AM-4PM',
      services: ['Contraception', 'Pregnancy Testing', 'STI Prevention', 'Health Education'],
      rating: 4.6,
      distance: 5.7,
      coordinates: { lat: 6.3408, lng: -10.8372 },
      type: 'clinic',
      isOpen: false
    }
  ], []);

  const loadClinics = useCallback(async () => {
    try {
      const storedClinics = await offlineStorage.getData('clinics');
      if (storedClinics && storedClinics.length > 0) {
        setClinics(storedClinics);
      } else {
        setClinics(sampleClinics);
        // Store sample data for offline use
        await offlineStorage.storeData('clinics', sampleClinics);
      }
    } catch (error) {
      console.error('Failed to load clinics:', error);
      setClinics(sampleClinics);
    }
  }, [sampleClinics]);

  const getUserLocation = () => {
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
          // Use default location (Monrovia)
          setUserLocation({ lat: 6.3008, lng: -10.7972 });
        }
      );
    } else {
      // Use default location
      setUserLocation({ lat: 6.3008, lng: -10.7972 });
    }
  };

  const filterAndSortClinics = useCallback(() => {
    let filtered = clinics;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((clinic: Clinic) =>
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.services.some((service: string) => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((clinic: Clinic) => clinic.type === selectedType);
    }

    // Sort
    filtered.sort((a: Clinic, b: Clinic) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredClinics(filtered);
  }, [clinics, searchTerm, selectedType, sortBy]);

  useEffect(() => {
    // Load clinics from offline storage or use sample data
    loadClinics();
    getUserLocation();
  }, [loadClinics]);

  useEffect(() => {
    filterAndSortClinics();
  }, [filterAndSortClinics]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clinic':
        return Heart;
      case 'hospital':
        return Shield;
      case 'counseling':
        return Users;
      case 'emergency':
        return Calendar;
      default:
        return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'clinic':
        return 'bg-blue-100 text-blue-600';
      case 'hospital':
        return 'bg-red-100 text-red-600';
      case 'counseling':
        return 'bg-green-100 text-green-600';
      case 'emergency':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (coordinates: { lat: number; lng: number }) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search clinics, services, or locations..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="lg:w-48">
            <select
              value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="clinic">Clinics</option>
              <option value="hospital">Hospitals</option>
              <option value="counseling">Counseling</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredClinics.length > 0 ? (
          filteredClinics.map((clinic: Clinic) => {
            const TypeIcon = getTypeIcon(clinic.type);
            return (
              <div key={clinic.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Clinic Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(clinic.type)}`}>
                          <TypeIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>{clinic.distance} km away</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star size={14} className="text-yellow-500" />
                              <span>{clinic.rating}</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${clinic.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                              <Clock size={14} />
                              <span>{clinic.isOpen ? 'Open' : 'Closed'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin size={16} />
                        <span>{clinic.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone size={16} />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock size={16} />
                        <span>{clinic.hours}</span>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Services Offered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {clinic.services.map((service: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:w-48">
                    <button
                      onClick={() => handleCall(clinic.phone)}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <Phone size={16} />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => handleDirections(clinic.coordinates)}
                      className="w-full btn-outline flex items-center justify-center space-x-2"
                    >
                      <Navigation size={16} />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clinics found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Emergency Notice */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-900 mb-2">Emergency Services</h4>
            <p className="text-red-800 text-sm mb-3">
              If you're experiencing a medical emergency or need immediate help, call the emergency hotline or visit the nearest hospital.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCall('+231-555-9999')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Emergency Hotline
              </button>
              <button
                onClick={() => handleCall('+231-555-0104')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                GBV Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicFinder;
