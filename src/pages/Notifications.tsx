import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Heart,
  Shield,
  BookOpen,
  Users,
  ArrowLeft,
  Filter,
  Search,
  CheckCheck
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  category: 'health' | 'safety' | 'education' | 'community' | 'system';
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'health' | 'safety' | 'education' | 'community' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample notifications for SRHR app
  const sampleNotifications: Notification[] = useMemo(() => [
    {
      id: '1',
      type: 'reminder',
      title: 'Health Check Reminder',
      message: 'It\'s time for your monthly health check. Book an appointment with a healthcare provider.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      actionUrl: '/clinics',
      actionText: 'Find Clinics',
      category: 'health'
    },
    {
      id: '2',
      type: 'info',
      title: 'New Educational Content',
      message: 'New articles about contraception methods are now available in the Articles section.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      isRead: false,
      actionUrl: '/articles',
      actionText: 'Read Articles',
      category: 'education'
    },
    {
      id: '3',
      type: 'success',
      title: 'Quiz Completed',
      message: 'Great job! You completed the STI Prevention quiz with a score of 85%.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      actionUrl: '/games',
      actionText: 'Take More Quizzes',
      category: 'education'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Privacy Reminder',
      message: 'Remember to clear your browser history if you\'re using a shared device.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      category: 'safety'
    },
    {
      id: '5',
      type: 'info',
      title: 'Community Support',
      message: 'New peer mentors are available for support. Connect with someone who understands your situation.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: false,
      actionUrl: '/mentorship',
      actionText: 'Find Mentors',
      category: 'community'
    },
    {
      id: '6',
      type: 'success',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Johnson has been confirmed for tomorrow at 2:00 PM.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      isRead: true,
      actionUrl: '/tracker',
      actionText: 'View Details',
      category: 'health'
    },
    {
      id: '7',
      type: 'reminder',
      title: 'Medication Reminder',
      message: 'Don\'t forget to take your prescribed medication. Set a reminder for consistent timing.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isRead: true,
      category: 'health'
    },
    {
      id: '8',
      type: 'info',
      title: 'System Update',
      message: 'SafeLink has been updated with new features. Check out the improved accessibility options.',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      isRead: true,
      category: 'system'
    }
  ], []);

  useEffect(() => {
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.isRead).length);
  }, [sampleNotifications]);

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'health') return Heart;
    if (category === 'safety') return Shield;
    if (category === 'education') return BookOpen;
    if (category === 'community') return Users;
    
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      case 'reminder':
        return Bell;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'reminder':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return 'bg-pink-100 text-pink-700';
      case 'safety':
        return 'bg-red-100 text-red-700';
      case 'education':
        return 'bg-blue-100 text-blue-700';
      case 'community':
        return 'bg-green-100 text-green-700';
      case 'system':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleAction = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      notification.category === filter;
    
    const matchesSearch = searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { value: 'health', label: 'Health', count: notifications.filter(n => n.category === 'health').length },
    { value: 'safety', label: 'Safety', count: notifications.filter(n => n.category === 'safety').length },
    { value: 'education', label: 'Education', count: notifications.filter(n => n.category === 'education').length },
    { value: 'community', label: 'Community', count: notifications.filter(n => n.category === 'community').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.category === 'system').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 sm:px-6 shadow-lg" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0">
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">Notifications</h1>
              <p className="text-sm text-white/80 truncate">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{option.label}</span>
                {option.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === option.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 p-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search or filter' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type, notification.category);
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 ${
                    !notification.isRead ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl shadow-sm ${getNotificationColor(notification.type)} flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(notification.category)}`}>
                            {notification.category}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          {notification.actionUrl && (
                            <button
                              onClick={() => handleAction(notification)}
                              className="text-xs text-purple-600 hover:text-purple-700 font-semibold px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                              {notification.actionText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
