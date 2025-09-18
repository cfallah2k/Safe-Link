import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Copy, Check, ArrowLeft, Download } from 'lucide-react';
import { secretCodeManager } from '../../utils/secretCode';

interface CreateCodeFormProps {
  onBack: () => void;
  onCodeCreated: (code: string) => void;
}

const CreateCodeForm: React.FC<CreateCodeFormProps> = ({ onBack, onCodeCreated }) => {
  const { t } = useTranslation();
  const [secretCode, setSecretCode] = useState<{ code: string; backupCodes: string[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCode = async () => {
    setIsCreating(true);
    
    try {
      // Generate new secret code
      const code = secretCodeManager.createSecretCode();
      
      // Generate backup codes
      const backupCodes = secretCodeManager.generateBackupCodes(3);
      secretCodeManager.storeBackupCodes(backupCodes);
      
      setSecretCode({ code: code.code, backupCodes });
    } catch (error) {
      console.error('Failed to create secret code:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCode = async () => {
    if (secretCode) {
      try {
        await navigator.clipboard.writeText(secretCode.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  const handleDownloadCodes = () => {
    if (secretCode) {
      const content = `SafeLink Secret Codes
Generated: ${new Date().toLocaleString()}

Main Code: ${secretCode.code}

Backup Codes:
${secretCode.backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

IMPORTANT: Keep these codes safe and private. You'll need them to access SafeLink.

SafeLink - Anonymous SRHR Platform`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'safelink-secret-codes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleContinue = () => {
    if (secretCode) {
      onCodeCreated(secretCode.code);
    }
  };

  if (secretCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.codeGenerated')}
            </h1>
            <p className="text-gray-600">
              {t('auth.saveCode')}
            </p>
          </div>

          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('auth.yourCode')}
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-2xl font-mono font-bold text-primary-600 tracking-wider">
                  {secretCodeManager.getDisplayCode(secretCode.code)}
                </div>
              </div>
              
              <button
                onClick={handleCopyCode}
                className="btn-outline flex items-center space-x-2 mx-auto mb-4"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">Backup Codes</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Save these backup codes in case you lose your main code:
                </p>
                <div className="space-y-2">
                  {secretCode.backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded p-2">
                      <span className="font-mono text-sm">{secretCodeManager.getDisplayCode(code)}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(code)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownloadCodes}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Download size={16} />
                <span>Download All Codes</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={onBack}
                  className="btn-outline flex items-center space-x-2"
                >
                  <ArrowLeft size={16} />
                  <span>{t('auth.back')}</span>
                </button>
                <button
                  onClick={handleContinue}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>{t('auth.continue')}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-red-800 font-medium">Important Security Notice</p>
                  <ul className="text-red-700 mt-1 space-y-1">
                    <li>• Never share your secret codes with anyone</li>
                    <li>• Store them in a safe place</li>
                    <li>• If compromised, create a new account immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Create your anonymous account
          </p>
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('auth.createCode')}
            </h2>
            <p className="text-gray-600 text-sm">
              We'll generate a unique secret code for you to access SafeLink anonymously.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">How Secret Codes Work</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• No personal information required</li>
                    <li>• Your identity remains completely anonymous</li>
                    <li>• Code is stored locally on your device</li>
                    <li>• Backup codes provided for recovery</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateCode}
              disabled={isCreating}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={16} />
                  <span>Generate Secret Code</span>
                </>
              )}
            </button>

            <button
              onClick={onBack}
              className="w-full btn-outline"
            >
              {t('auth.back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCodeForm;
