import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { secretCodeManager } from '../../utils/secretCode';

interface LoginFormProps {
  onLogin: (code: string) => void;
  onCreateNew: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCreateNew }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStakeholderCode, setIsStakeholderCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // First check if it's a stakeholder code - INSTANT REDIRECT
    const stakeholderCodes: { [key: string]: string } = {
      'SAFELINK_ADMIN_2024': 'ADMIN',
      'SAFELINK_POLICE_2024': 'POLICE', 
      'SAFELINK_SAFE_2024': 'SAFEHOUSE',
      'SAFELINK_MED_2024': 'MEDICAL',
      'SAFELINK_NGO_2024': 'NGO'
    };

    // INSTANT REDIRECT for stakeholders - no loading, no delays
    if (stakeholderCodes[code]) {
      window.location.href = `/dashboard?role=${stakeholderCodes[code]}`;
      return;
    }

    // Only show loading for regular users
    setIsLoading(true);

    try {

      // Otherwise, validate as regular user code
      if (secretCodeManager.validateSecretCode(code)) {
        secretCodeManager.updateLastUsed();
        onLogin(code);
      } else {
        setError('Invalid secret code. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Handle stakeholder codes - preserve underscores and remove spaces
    if (value.includes('SAFE') || value.includes('LINK')) {
      // For stakeholder codes, preserve underscores and remove spaces
      value = value.replace(/\s+/g, ''); // Remove all spaces
      // Allow underscores for stakeholder codes
      value = value.replace(/[^A-Z0-9_]/g, '');
      setIsStakeholderCode(true);
    } else {
      // For regular user codes, remove all non-alphanumeric characters
      value = value.replace(/[^A-Z0-9]/g, '');
      setIsStakeholderCode(false);
    }
    
    // Allow up to 25 characters for stakeholder codes
    value = value.substring(0, 25);
    setCode(value);
    setError('');

    // INSTANT REDIRECT for complete stakeholder codes
    const stakeholderCodes: { [key: string]: string } = {
      'SAFELINK_ADMIN_2024': 'ADMIN',
      'SAFELINK_POLICE_2024': 'POLICE', 
      'SAFELINK_SAFE_2024': 'SAFEHOUSE',
      'SAFELINK_MED_2024': 'MEDICAL',
      'SAFELINK_NGO_2024': 'NGO'
    };

    if (stakeholderCodes[value]) {
      // INSTANT REDIRECT - no waiting, no loading
      window.location.href = `/dashboard?role=${stakeholderCodes[value]}`;
    }
  };

  const formatCodeDisplay = (value: string) => {
    // For stakeholder codes, don't add spaces
    if (value.startsWith('SAFELINK_')) {
      return value;
    }
    
    // For regular user codes, add space after 4 characters
    if (value.length <= 4) return value;
    return `${value.substring(0, 4)} ${value.substring(4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('app.name')}
          </h1>
          <p className="text-gray-600">
            {t('auth.subtitle')}
          </p>
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('auth.welcome')}
            </h2>
            <p className="text-gray-600 text-sm">
              {t('auth.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.enterCode')}
              </label>
              <div className="relative">
                <input
                  type={showCode ? 'text' : 'password'}
                  id="code"
                  value={formatCodeDisplay(code)}
                  onChange={handleCodeChange}
                  placeholder={t('auth.codePlaceholder')}
                  className="input-field pr-20"
                  maxLength={26} // 25 chars + 1 space
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || (code.length < 8 && !code.startsWith('SAFELINK_'))}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('auth.login')}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Only show create code option for regular users, not stakeholders */}
          {!isStakeholderCode && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">
                Don't have a secret code?
              </p>
              <button
                onClick={onCreateNew}
                className="w-full btn-outline"
              >
                {t('auth.create')}
              </button>
            </div>
          )}

          {/* Show stakeholder-specific message when entering stakeholder code */}
          {isStakeholderCode && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">Stakeholder Access</p>
                  <p className="text-blue-700">
                    Enter your assigned stakeholder code to access your role-specific dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Privacy Protected</p>
                <p className="text-blue-700">
                  Your secret code is stored locally and never shared. Your identity remains completely anonymous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
