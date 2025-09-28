import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Shield, 
  Search,
  Eye,
  Phone,
  Calendar,
  FileText,
  Bell,
  Lock
} from 'lucide-react';
import SecureDataViewer from '../components/DataVisualization/SecureDataViewer';
import { generateSafeHouseData } from '../utils/sampleData';
import { dataSecurityManager } from '../utils/dataSecurity';

interface SafeHouseDashboardProps {
  userData: any;
  onLogout: () => void;
}

const SafeHouseDashboard: React.FC<SafeHouseDashboardProps> = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('residents');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate sample data
  const safeHouseData = generateSafeHouseData();

  // Mock data for demonstration
  const [houseData] = useState({
    totalCapacity: safeHouseData.houseMetrics.totalCapacity,
    currentOccupants: safeHouseData.houseMetrics.currentOccupants,
    availableBeds: safeHouseData.houseMetrics.availableBeds,
    securityLevel: safeHouseData.houseMetrics.securityLevel,
    lastInspection: '2024-01-15'
  });

  const [residents] = useState([
    { 
      id: 1, 
      name: 'Anonymous Resident A', 
      checkIn: '2024-01-10', 
      status: 'Safe',
      room: 'Room 101',
      needs: 'Medical checkup',
      emergencyContact: '+231-XXX-XXXX'
    },
    { 
      id: 2, 
      name: 'Anonymous Resident B', 
      checkIn: '2024-01-12', 
      status: 'Safe',
      room: 'Room 102',
      needs: 'Counseling',
      emergencyContact: '+231-XXX-XXXX'
    },
    { 
      id: 3, 
      name: 'Anonymous Resident C', 
      checkIn: '2024-01-14', 
      status: 'At Risk',
      room: 'Room 103',
      needs: 'Immediate support',
      emergencyContact: '+231-XXX-XXXX'
    }
  ]);

  const [accessLogs] = useState([
    { id: 1, user: 'Anonymous User', action: 'OTP Access Granted', time: '2 min ago', location: 'Main Entrance', status: 'success' },
    { id: 2, user: 'Anonymous User', action: 'Failed OTP Attempt', time: '15 min ago', location: 'Side Door', status: 'failed' },
    { id: 3, user: 'Anonymous User', action: 'Emergency Access', time: '1 hour ago', location: 'Emergency Exit', status: 'emergency' }
  ]);

  const [securityAlerts] = useState([
    { id: 1, type: 'security', message: 'Unauthorized access attempt detected', time: '30 min ago', severity: 'high' },
    { id: 2, type: 'maintenance', message: 'Generator maintenance required', time: '2 hours ago', severity: 'medium' },
    { id: 3, type: 'supplies', message: 'Medical supplies running low', time: '4 hours ago', severity: 'low' }
  ]);

  const tabs = [
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'access', label: 'Access Control', icon: Lock },
    { id: 'resources', label: 'Resources', icon: FileText }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'bg-green-100 text-green-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      case 'Monitoring': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Safe House Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Resident Management & Security</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={18} className="sm:w-5 sm:h-5" />
                {securityAlerts.filter(alert => alert.severity === 'high').length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-700 bg-green-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6 xl:p-8">
          {/* Residents Tab */}
          {activeTab === 'residents' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Resident Management</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Total Capacity</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{houseData.totalCapacity}</p>
                      </div>
                      <Home className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Current Occupants</p>
                        <p className="text-lg sm:text-2xl font-semibold text-green-600">{houseData.currentOccupants}</p>
                      </div>
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Available Beds</p>
                        <p className="text-lg sm:text-2xl font-semibold text-blue-600">{houseData.availableBeds}</p>
                      </div>
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Security Level</p>
                        <p className="text-lg sm:text-2xl font-semibold text-green-600">{houseData.securityLevel}</p>
                      </div>
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Residents List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Current Residents</h3>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search residents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          />
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                          New Resident
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resident</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Needs</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {residents.map((resident) => (
                          <tr key={resident.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{resident.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{resident.room}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{resident.checkIn}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(resident.status)}`}>
                                {resident.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{resident.needs}</td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-blue-600 hover:text-blue-800 mr-3">
                                <Eye size={16} />
                              </button>
                              <button className="text-green-600 hover:text-green-800 mr-3">
                                <Phone size={16} />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <FileText size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Secure Data Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <SecureDataViewer
                    data={safeHouseData.residentStatus}
                    chartType="pie"
                    title="Resident Status Distribution"
                    description="Current status breakdown of all residents"
                    userRole="SAFEHOUSE"
                    onDataAccess={(accessLog) => {
                      dataSecurityManager.logDataAccess(accessLog);
                    }}
                  />
                  
                  <SecureDataViewer
                    data={safeHouseData.capacityTrend}
                    chartType="line"
                    title="Capacity Utilization Trend"
                    description="Monthly capacity usage and occupancy patterns"
                    userRole="SAFEHOUSE"
                    onDataAccess={(accessLog) => {
                      dataSecurityManager.logDataAccess(accessLog);
                    }}
                  />
                </div>

                <SecureDataViewer
                  data={safeHouseData.resourceUsage}
                  chartType="bar"
                  title="Resource Usage Overview"
                  description="Current resource consumption and availability"
                  userRole="SAFEHOUSE"
                  onDataAccess={(accessLog) => {
                    dataSecurityManager.logDataAccess(accessLog);
                  }}
                />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Security Monitoring</h2>
              
              {/* Security Alerts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Security Alerts</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {securityAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.severity === 'high' ? 'bg-red-500' : 
                            alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-xs text-gray-500">{alert.time}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Access Control Tab */}
          {activeTab === 'access' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Access Control</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Access Logs</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {accessLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.user}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{log.action}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{log.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{log.time}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' :
                              log.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Resource Management</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Resource management and supply tracking features will be implemented here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeHouseDashboard;
