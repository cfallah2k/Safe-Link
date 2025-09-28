import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecretCodeEntryProps {
  onCodeVerified: (role: string) => void;
}

const SecretCodeEntry: React.FC<SecretCodeEntryProps> = ({ onCodeVerified }) => {
  const [secretCode, setSecretCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Secret codes for different roles (in production, these would be stored securely)
  const roleCodes: { [key: string]: string } = {
    'ADMIN': 'SAFELINK_ADMIN_2024',
    'POLICE': 'SAFELINK_POLICE_2024', 
    'SAFEHOUSE': 'SAFELINK_SAFE_2024',
    'MEDICAL': 'SAFELINK_MED_2024',
    'NGO': 'SAFELINK_NGO_2024'
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if code matches any role
    const matchedRole = Object.entries(roleCodes).find(([_, code]) => code === secretCode);
    
    if (matchedRole) {
      // Code is valid, proceed to role-specific portal
      onCodeVerified(matchedRole[0]);
    } else {
      setError('Invalid secret code. Please check and try again.');
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretCode(e.target.value);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Secure Access Portal
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Enter your secure access code to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Secret Code Form */}
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <label htmlFor="secretCode" className="block text-sm font-medium text-gray-700 mb-2">
              Secret Access Code
            </label>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                id="secretCode"
                value={secretCode}
                onChange={handleCodeChange}
                placeholder="Enter your secret code"
                className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                required
                disabled={isVerifying}
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isVerifying}
              >
                {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!secretCode.trim() || isVerifying}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Verify Access</span>
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 This is a secure portal. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecretCodeEntry;
