import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Gamepad2, 
  Shield, 
  Users,
  Heart,
  BookOpen,
  Phone
} from 'lucide-react';
import Header from '../components/Layout/Header';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const quickAccessItems = [
    {
      path: '/chatbot',
      icon: MessageCircle,
      title: t('home.getHelp'),
      description: 'Ask SRHR questions anonymously',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      path: '/clinics',
      icon: MapPin,
      title: t('home.findServices'),
      description: 'Find nearby health services',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      path: '/tracker',
      icon: Calendar,
      title: t('home.trackHealth'),
      description: 'Track your health and cycles',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      path: '/games',
      icon: Gamepad2,
      title: t('home.learnMore'),
      description: 'Learn through interactive games',
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      path: '/emergency',
      icon: Shield,
      title: t('home.emergencyHelp'),
      description: 'Get immediate emergency support',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      path: '/mentorship',
      icon: Users,
      title: 'Peer Support',
      description: 'Connect with trained mentors',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    }
  ];

  const recentActivities = [
    { icon: MessageCircle, text: 'Asked about contraception', time: '2 hours ago' },
    { icon: Calendar, text: 'Tracked menstrual cycle', time: '1 day ago' },
    { icon: Gamepad2, text: 'Completed SRHR quiz', time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={t('home.welcome')} 
        subtitle="Your safe space for SRHR information and support"
      />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero section */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Heart className="w-8 h-8" />
              <h2 className="text-2xl font-bold">SafeLink</h2>
            </div>
            <p className="text-lg opacity-90 mb-6">
              Your anonymous companion for sexual and reproductive health and rights. 
              Get accurate information, find services, and connect with support - all while maintaining complete privacy.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Evidence-Based</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('home.quickAccess')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickAccessItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="card hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${item.textColor} mb-1`}>
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('home.recentActivity')}
            </h3>
            <div className="card">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.text}</p>
                          <p className="text-gray-500 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-gray-400 text-sm">Start exploring SafeLink features</p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Your Privacy is Protected</h4>
                <p className="text-blue-800 text-sm mb-3">
                  SafeLink uses secret codes to ensure your complete anonymity. No personal information is required or stored. 
                  Your conversations, health data, and activities remain private and secure.
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• No phone numbers or names required</li>
                  <li>• All data encrypted and stored locally</li>
                  <li>• Anonymous usage analytics only</li>
                  <li>• No tracking or profiling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
