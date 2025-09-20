import React, { useState, useEffect, useMemo } from 'react';
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
  Users
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

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
      // In a real app, this would navigate to the URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal/Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal for mobile, Dropdown for desktop */}
          <div className="
            fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50
            sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:inset-x-auto sm:transform-none
            w-auto sm:w-80 lg:w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 
            max-h-[80vh] sm:max-h-96 overflow-hidden
          ">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">{unreadCount} unread</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100/50">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type, notification.category);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 sm:p-5 hover:bg-gray-50/50 transition-all duration-200 ${
                          !notification.isRead ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-l-4 border-primary-500' : ''
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
                                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 animate-pulse"></div>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
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

                              {notification.actionUrl && (
                                <button
                                  onClick={() => handleAction(notification)}
                                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                                >
                                  {notification.actionText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
