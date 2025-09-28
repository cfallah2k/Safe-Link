import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, LogIn, UserPlus, Send } from 'lucide-react';

interface PortalLoginProps {
  role: string;
  onLoginSuccess: (role: string, userData: any) => void;
  onBack: () => void;
}

const PortalLogin: React.FC<PortalLoginProps> = ({ role, onLoginSuccess, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentStep, setCurrentStep] = useState<'login' | 'signup' | 'otp'>('login');

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSendingOtp(true);

    // Check if user exists (simulate API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, assume user exists if phone number is provided
    if (phoneNumber && email) {
      setCurrentStep('otp');
    } else {
      setError('Please provide both phone number and email.');
    }
    setIsSendingOtp(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSendingOtp(true);

    // Simulate account creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (phoneNumber && email) {
      setIsNewUser(true);
      setCurrentStep('otp');
    } else {
      setError('Please provide both phone number and email.');
    }
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
        email,
        isNewUser,
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

        {/* Login/Signup Options */}
        {currentStep === 'login' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign In to Your Account</h2>
              <p className="text-sm text-gray-600">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                  disabled={isSendingOtp}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                  disabled={isSendingOtp}
                />
              </div>

              <button
                type="submit"
                disabled={!phoneNumber.trim() || !email.trim() || isSendingOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSendingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Don't have an account?</p>
              <button
                onClick={() => setCurrentStep('signup')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Create New Account
              </button>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        {currentStep === 'signup' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Create New Account</h2>
              <p className="text-sm text-gray-600">Set up your {currentRole.title} account</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                  disabled={isSendingOtp}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                  disabled={isSendingOtp}
                />
              </div>

              <button
                type="submit"
                disabled={!phoneNumber.trim() || !email.trim() || isSendingOtp}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSendingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
              <button
                onClick={() => setCurrentStep('login')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Sign In Instead
              </button>
            </div>
          </div>
        )}

        {/* OTP Verification */}
        {currentStep === 'otp' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Account</h2>
              <p className="text-sm text-gray-600">
                {isNewUser ? 'We sent a verification code to your phone' : 'Enter the OTP sent to your phone'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to {phoneNumber}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otpCode"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                  disabled={isVerifyingOtp}
                />
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
          </div>
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
