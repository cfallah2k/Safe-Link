import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import SecureDataViewer from '../components/DataVisualization/SecureDataViewer';
import { generateAdminData } from '../utils/sampleData';
import { dataSecurityManager } from '../utils/dataSecurity';

interface AdminDashboardProps {
  userData: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate sample data
  const adminData = generateAdminData();

  // Mock data for demonstration
  const [dashboardData] = useState({
    totalUsers: adminData.userMetrics.totalUsers,
    activeUsers: adminData.userMetrics.activeUsers,
    emergencyAlerts: 23,
    systemHealth: 98.5,
    storageUsed: 2.4,
    storageTotal: 10.0
  });

  const [recentAlerts] = useState([
    { id: 1, type: 'emergency', message: 'Panic button activated in Monrovia', time: '2 min ago', status: 'active' },
    { id: 2, type: 'system', message: 'High server load detected', time: '15 min ago', status: 'resolved' },
    { id: 3, type: 'security', message: 'Multiple failed login attempts', time: '1 hour ago', status: 'investigating' }
  ]);

  const [userActivity] = useState([
    { id: 1, user: 'Anonymous User', action: 'Accessed chatbot', time: '5 min ago', location: 'Monrovia' },
    { id: 2, user: 'Anonymous User', action: 'Downloaded resource', time: '12 min ago', location: 'Gbarnga' },
    { id: 3, user: 'Anonymous User', action: 'Used emergency feature', time: '18 min ago', location: 'Buchanan' }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">System Administration Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={18} className="sm:w-5 sm:h-5" />
                {recentAlerts.filter(alert => alert.status === 'active').length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
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
                      ? 'border-blue-500 text-blue-700 bg-blue-50'
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
        <div className="flex-1 p-2 sm:p-4 lg:p-6 xl:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">System Overview</h2>
                
                {/* Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Total Users</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{dashboardData.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Active Users</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{dashboardData.activeUsers.toLocaleString()}</p>
                      </div>
                      <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Emergency Alerts</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{dashboardData.emergencyAlerts}</p>
                      </div>
                      <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">System Health</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{dashboardData.systemHealth}%</p>
                      </div>
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Recent Alerts - Mobile Responsive */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Alerts</h3>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-0 ${
                              alert.status === 'active' ? 'bg-red-500' : 
                              alert.status === 'resolved' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 break-words">{alert.message}</p>
                              <p className="text-xs text-gray-500">{alert.time}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-auto ${
                            alert.status === 'active' ? 'bg-red-100 text-red-700' :
                            alert.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secure Data Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <SecureDataViewer
                    data={adminData.userActivity}
                    chartType="line"
                    title="User Activity Trend"
                    description="Monthly user activity and engagement metrics"
                    userRole="ADMIN"
                    onDataAccess={(accessLog) => {
                      dataSecurityManager.logDataAccess(accessLog);
                    }}
                  />
                  
                  <SecureDataViewer
                    data={adminData.systemUsage}
                    chartType="pie"
                    title="System Resource Usage"
                    description="Current system resource utilization"
                    userRole="ADMIN"
                    onDataAccess={(accessLog) => {
                      dataSecurityManager.logDataAccess(accessLog);
                    }}
                  />
                </div>

                <SecureDataViewer
                  data={adminData.securityAlerts}
                  chartType="bar"
                  title="Security Alerts Distribution"
                  description="Security incidents and threat analysis"
                  userRole="ADMIN"
                  onDataAccess={(accessLog) => {
                    dataSecurityManager.logDataAccess(accessLog);
                  }}
                />
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Management</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-auto pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Export Data
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent User Activity</h3>
                </div>
                
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="p-3 space-y-3">
                    {userActivity.map((activity) => (
                      <div key={activity.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <div className="text-sm text-gray-600">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.location}</div>
                        <div className="flex space-x-2 pt-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            <Eye size={14} className="inline mr-1" />
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm">
                            <Download size={14} className="inline mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userActivity.map((activity) => (
                        <tr key={activity.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{activity.user}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{activity.action}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{activity.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{activity.time}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-blue-600 hover:text-blue-800 mr-3">
                              <Eye size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Download size={16} />
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

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Security Dashboard</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Security monitoring and access control features will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Advanced analytics and reporting features will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">System configuration and maintenance features will be implemented here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
