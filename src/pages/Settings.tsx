import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Database, 
  Info, 
  HelpCircle, 
  LogOut,
  Trash2,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { offlineStorage } from '../utils/offlineStorage';
import { secretCodeManager } from '../utils/secretCode';

interface SettingsProps {
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await offlineStorage.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleDeleteAllData = async () => {
    try {
      await offlineStorage.clearAll();
      alert('All data has been deleted successfully.');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete data:', error);
      alert('Failed to delete data. Please try again.');
    }
  };

  const handleExportData = async () => {
    try {
      const allData = await offlineStorage.getAllData();
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: allData
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safelink-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSecretCode = () => {
    const code = secretCodeManager.getSecretCode();
    return code ? code.code : 'No code found';
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={i18n.language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="input-field"
                        >
                          <option value="en">English</option>
                          <option value="kpelle">Kpelle</option>
                          <option value="bassa">Bassa</option>
                          <option value="kru">Kru</option>
                          <option value="vai">Vai</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Health Reminders</p>
                          <p className="text-sm text-gray-600">Get reminders for health tracking</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Emergency Alerts</p>
                          <p className="text-sm text-gray-600">Receive emergency notifications</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Mentorship Updates</p>
                          <p className="text-sm text-gray-600">Get notified about mentorship messages</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Secret Code</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Your Secret Code</p>
                          <p className="text-sm text-gray-600">Keep this code safe and private</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="px-3 py-1 bg-white border rounded font-mono">
                            {showSecretCode ? getSecretCode() : '••••••••'}
                          </code>
                          <button
                            onClick={() => setShowSecretCode(!showSecretCode)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            {showSecretCode ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Privacy</h3>
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">Your Data is Protected</h4>
                            <ul className="text-green-800 text-sm mt-1 space-y-1">
                              <li>• All data is stored locally on your device</li>
                              <li>• No personal information is collected</li>
                              <li>• Anonymous usage analytics only</li>
                              <li>• No tracking or profiling</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Storage Used</span>
                        <span className="text-sm text-gray-600">
                          {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.available)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(storageInfo.used / storageInfo.available) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                    <div className="space-y-4">
                      <button
                        onClick={handleExportData}
                        className="w-full btn-outline flex items-center justify-center space-x-2"
                      >
                        <Download size={16} />
                        <span>Export All Data</span>
                      </button>
                      
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete All Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About SafeLink</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Version 1.0.0</h4>
                        <p className="text-blue-800 text-sm">
                          SafeLink is an anonymous, inclusive, and scalable SRHR platform for youth. 
                          Built with privacy-first principles and designed to work offline.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Anonymous SRHR chatbot</li>
                          <li>• Clinic and service finder</li>
                          <li>• Health and cycle tracker</li>
                          <li>• Interactive educational games</li>
                          <li>• Emergency support and panic button</li>
                          <li>• Peer mentorship system</li>
                          <li>• SMS/USSD integration for offline access</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
                    <div className="space-y-4">
                      <button className="w-full btn-outline flex items-center justify-center space-x-2">
                        <HelpCircle size={16} />
                        <span>Help & FAQ</span>
                      </button>
                      
                      <button className="w-full btn-outline flex items-center justify-center space-x-2">
                        <Info size={16} />
                        <span>Contact Support</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onLogout}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center space-x-2 mx-auto"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete All Data</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                This will permanently delete all your data including chat history, 
                health tracking, and settings. This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllData}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
