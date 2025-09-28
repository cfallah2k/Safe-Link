import React, { useState } from 'react';
import { Shield, Smartphone, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

interface PortalLoginProps {
  role: string;
  onLoginSuccess: (role: string, userData: any) => void;
  onBack: () => void;
}

const PortalLogin: React.FC<PortalLoginProps> = ({ role, onLoginSuccess, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState('');

  // Role-specific configurations
  const roleConfig = {
    'ADMIN': {
      title: 'Administrator Portal',
      description: 'System administration and management',
      icon: '👨‍💼',
      color: 'from-red-500 to-pink-500'
    },
    'POLICE': {
      title: 'Police Portal',
      description: 'Emergency response and case management',
      icon: '👮‍♂️',
      color: 'from-blue-500 to-indigo-500'
    },
    'SAFEHOUSE': {
      title: 'Safe House Portal',
      description: 'Resident management and security',
      icon: '🏠',
      color: 'from-green-500 to-emerald-500'
    },
    'MEDICAL': {
      title: 'Medical Portal',
      description: 'Patient care and medical services',
      icon: '👩‍⚕️',
      color: 'from-purple-500 to-violet-500'
    },
    'NGO': {
      title: 'NGO Portal',
      description: 'Community programs and outreach',
      icon: '🤝',
      color: 'from-orange-500 to-yellow-500'
    }
  };

  const currentRole = roleConfig[role as keyof typeof roleConfig];

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSendingOtp(true);

    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production, this would send real OTP
    setShowOtpInput(true);
    setIsSendingOtp(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifyingOtp(true);

    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept any 6-digit OTP
    if (otpCode.length === 6) {
      const userData = {
        role,
        phoneNumber,
        loginTime: new Date().toISOString(),
        permissions: getRolePermissions(role)
      };
      onLoginSuccess(role, userData);
    } else {
      setError('Invalid OTP. Please try again.');
      setIsVerifyingOtp(false);
    }
  };

  const getRolePermissions = (role: string) => {
    const permissions: { [key: string]: string[] } = {
      'ADMIN': ['system_access', 'user_management', 'analytics', 'content_management'],
      'POLICE': ['emergency_alerts', 'case_management', 'location_access', 'reports'],
      'SAFEHOUSE': ['resident_management', 'access_control', 'security_alerts', 'resources'],
      'MEDICAL': ['patient_records', 'appointments', 'medical_resources', 'health_analytics'],
      'NGO': ['program_management', 'community_outreach', 'resource_distribution', 'impact_tracking']
    };
    return permissions[role] || [];
  };

  const resendOtp = async () => {
    setIsSendingOtp(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSendingOtp(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-6 sm:p-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Access Portal</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`mx-auto flex items-center justify-center w-16 h-16 bg-gradient-to-r ${currentRole.color} rounded-full mb-4`}>
            <span className="text-2xl">{currentRole.icon}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            {currentRole.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {currentRole.description}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Phone Number Form */}
        {!showOtpInput ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                  disabled={isSendingOtp}
                />
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={!phoneNumber.trim() || isSendingOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSendingOtp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Send OTP</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP Code
              </label>
              <input
                type="text"
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3 py-3 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-mono tracking-widest"
                maxLength={6}
                required
                disabled={isVerifyingOtp}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                OTP sent to {phoneNumber}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={resendOtp}
                disabled={isSendingOtp}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
              >
                {isSendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
              
              <button
                type="submit"
                disabled={otpCode.length !== 6 || isVerifyingOtp}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isVerifyingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 Secure OTP authentication required for {currentRole.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
