import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Phone,
  Search,
  Eye,
  CheckCircle,
  TrendingUp,
  Bell,
  FileText,
  Navigation
} from 'lucide-react';

interface PoliceDashboardProps {
  userData: any;
  onLogout: () => void;
}

const PoliceDashboard: React.FC<PoliceDashboardProps> = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('emergency');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const [emergencyData] = useState({
    activeAlerts: 3,
    resolvedToday: 12,
    averageResponseTime: 4.2,
    totalCases: 156
  });

  const [emergencyAlerts] = useState([
    { 
      id: 1, 
      type: 'panic', 
      location: 'Monrovia, Sinkor', 
      time: '2 min ago', 
      status: 'active',
      priority: 'high',
      description: 'Panic button activated - immediate response needed',
      coordinates: { lat: 6.3008, lng: -10.7970 }
    },
    { 
      id: 2, 
      type: 'emergency', 
      location: 'Gbarnga, Bong County', 
      time: '15 min ago', 
      status: 'responding',
      priority: 'medium',
      description: 'Domestic violence incident reported',
      coordinates: { lat: 6.9956, lng: -9.4722 }
    },
    { 
      id: 3, 
      type: 'safety', 
      location: 'Buchanan, Grand Bassa', 
      time: '1 hour ago', 
      status: 'resolved',
      priority: 'low',
      description: 'Safe house security check completed',
      coordinates: { lat: 5.8808, lng: -10.0467 }
    }
  ]);

  const [recentCases] = useState([
    { id: 1, caseNumber: 'CASE-2024-001', type: 'Domestic Violence', location: 'Monrovia', status: 'Under Investigation', assigned: 'Officer Johnson' },
    { id: 2, caseNumber: 'CASE-2024-002', type: 'Sexual Assault', location: 'Gbarnga', status: 'Court Proceedings', assigned: 'Detective Smith' },
    { id: 3, caseNumber: 'CASE-2024-003', type: 'Child Protection', location: 'Buchanan', status: 'Resolved', assigned: 'Officer Brown' }
  ]);

  const tabs = [
    { id: 'emergency', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'cases', label: 'Case Management', icon: FileText },
    { id: 'patrol', label: 'Patrol Routes', icon: Navigation },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'responding': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Police Dashboard</h1>
                <p className="text-sm text-gray-600">Emergency Response & Case Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                {emergencyAlerts.filter(alert => alert.status === 'active').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Emergency Alerts Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Response Center</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Alerts</p>
                        <p className="text-2xl font-semibold text-red-600">{emergencyData.activeAlerts}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Resolved Today</p>
                        <p className="text-2xl font-semibold text-green-600">{emergencyData.resolvedToday}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Response Time</p>
                        <p className="text-2xl font-semibold text-blue-600">{emergencyData.averageResponseTime}m</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Cases</p>
                        <p className="text-2xl font-semibold text-gray-900">{emergencyData.totalCases}</p>
                      </div>
                      <FileText className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Emergency Alerts */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Active Emergency Alerts</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {emergencyAlerts.map((alert) => (
                        <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(alert.status)}`}></div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900">{alert.description}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(alert.priority)}`}>
                                    {alert.priority.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <MapPin size={14} />
                                    <span>{alert.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock size={14} />
                                    <span>{alert.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                <CheckCircle size={16} />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                <Phone size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case Management Tab */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Case Management</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    New Case
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentCases.map((case_) => (
                        <tr key={case_.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{case_.caseNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{case_.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{case_.location}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              case_.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              case_.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {case_.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{case_.assigned}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-blue-600 hover:text-blue-800 mr-3">
                              <Eye size={16} />
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
            </div>
          )}

          {/* Other tabs */}
          {activeTab === 'patrol' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Patrol Routes</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Patrol route management and GPS tracking features will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Advanced reporting and analytics features will be implemented here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
