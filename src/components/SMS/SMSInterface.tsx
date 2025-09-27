import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Hash, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Shield
} from 'lucide-react';
import { smsIntegration, SMSMessage, USSDCode } from '../../utils/smsIntegration';
import { useOffline } from '../../hooks/useOffline';

interface SMSInterfaceProps {
  onBack?: () => void;
}

const SMSInterface: React.FC<SMSInterfaceProps> = ({ onBack }) => {
  const { isOnline } = useOffline();
  const [activeTab, setActiveTab] = useState<'sms' | 'ussd'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [smsHistory, setSmsHistory] = useState<SMSMessage[]>([]);
  const [ussdCodes, setUssdCodes] = useState<USSDCode[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSMSHistory();
    loadUSSDCodes();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [smsHistory]);

  const loadSMSHistory = () => {
    const history = smsIntegration.getSMSHistory();
    setSmsHistory(history);
  };

  const loadUSSDCodes = () => {
    const codes = smsIntegration.getUSSDCodes();
    setUssdCodes(codes);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendSMS = async () => {
    if (!phoneNumber.trim() || !message.trim() || isSending) return;

    setIsSending(true);
    try {
      const success = await smsIntegration.sendSMS(phoneNumber.trim(), message.trim());
      if (success) {
        setMessage('');
        loadSMSHistory();
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleUSSDCode = async (code: string) => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number first');
      return;
    }

    try {
      const response = await smsIntegration.processUSSDCode(code, phoneNumber.trim());
      // In a real app, this would show the USSD response
      console.log('USSD Response:', response);
      alert(`USSD Response:\n${response}`);
    } catch (error) {
      console.error('Failed to process USSD code:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="flex flex-col h-screen-safe bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'sms'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>SMS</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ussd')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'ussd'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>USSD</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sms' ? (
          <div className="flex flex-col h-full">
            {/* SMS History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {smsHistory.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No SMS Messages</h3>
                  <p className="text-gray-500">Send your first SMS to get started</p>
                </div>
              ) : (
                smsHistory.map((sms) => (
                  <div
                    key={sms.id}
                    className={`flex ${sms.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                      sms.type === 'outgoing'
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium opacity-75">
                          {sms.phoneNumber}
                        </span>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(sms.status)}
                          <span className={`text-xs font-medium ${getStatusColor(sms.status)}`}>
                            {sms.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{sms.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-75">
                          {formatTime(sms.timestamp)}
                        </span>
                        <span className="text-xs opacity-75">
                          {sms.type === 'outgoing' ? 'Sent' : 'Received'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* SMS Input */}
            <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number (e.g., +231-555-0123)"
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendSMS()}
                />
                <button
                  onClick={handleSendSMS}
                  disabled={!phoneNumber.trim() || !message.trim() || isSending}
                  className="p-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  <Send size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="text-center py-4">
              <Hash className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">USSD Codes</h3>
              <p className="text-gray-600 text-sm">Dial these codes on your phone for quick access</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
              {ussdCodes.map((code) => (
                <div
                  key={code.code}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                          <Hash className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{code.code}</h4>
                          <p className="text-sm text-gray-600">{code.description}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUSSDCode(code.code)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 active:scale-95"
                    >
                      Dial
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">How to Use USSD</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Dial the code on your phone</li>
                    <li>• Follow the menu prompts</li>
                    <li>• Access SRHR information offline</li>
                    <li>• No internet connection required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSInterface;
