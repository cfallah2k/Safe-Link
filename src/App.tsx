import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import './styles/accessibility.css';

// Components
import OfflineIndicator from './components/OfflineIndicator';
import UpdateNotification from './components/UI/UpdateNotification';
import useServiceWorkerUpdate from './hooks/useServiceWorkerUpdate';
import DesktopHeader from './components/Layout/DesktopHeader';
import LoginForm from './components/Auth/LoginForm';
import CreateCodeForm from './components/Auth/CreateCodeForm';
import SRHRAlerts from './components/SMS/SRHRAlerts';
import StorytellingPlatform from './components/Storytelling/StorytellingPlatform';
import SafeSpaceLocator from './components/SafeSpace/SafeSpaceLocator';
import ConsentEducationGame from './components/Games/ConsentEducationGame';
import InclusiveYouthSupport from './components/Inclusive/InclusiveYouthSupport';
import DashboardAccessManager from './components/Dashboard/DashboardAccessManager';
import AppDownloadModal from './components/AppDownloadModal';
import FloatingDownloadButton from './components/FloatingDownloadButton';
import AppInstallBanner from './components/AppInstallBanner';

// Contexts
import { AccessibilityProvider } from './contexts/AccessibilityContext';

// Pages
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Videos from './pages/Videos';
import Articles from './pages/Articles';
import SMSInterface from './components/SMS/SMSInterface';
import Clinics from './pages/Clinics';
import Tracker from './pages/Tracker';
import Games from './pages/Games';
import Emergency from './pages/Emergency';
import Mentorship from './pages/Mentorship';
import OfflineMode from './pages/OfflineMode';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Tutorial from './pages/Tutorial';
import VisualAccessibility from './pages/VisualAccessibility';
import MotorAccessibility from './pages/MotorAccessibility';
import HearingAccessibility from './pages/HearingAccessibility';
import CognitiveAccessibility from './pages/CognitiveAccessibility';
import MedicationOrder from './pages/MedicationOrder';
import SecureMap from './pages/SecureMap';

// Utils
import { secretCodeManager } from './utils/secretCode';
import { smsIntegration } from './utils/smsIntegration';

// Hooks
import { useAppDownloadModal } from './hooks/useAppDownloadModal';
import { useSEO } from './hooks/useSEO';
import { cacheManager } from './utils/cacheManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const { isUpdateAvailable, updateServiceWorker, dismissUpdate } = useServiceWorkerUpdate();
  const [isLoading, setIsLoading] = useState(true);
  
  // App download modal
  const { showModal, closeModal, handleDownload } = useAppDownloadModal();
  
  // SEO optimization
  const seoConfig = useSEO();

  useEffect(() => {
    // Check if user has a valid secret code
    const hasValidCode = secretCodeManager.hasValidSecretCode();
    setIsAuthenticated(hasValidCode);
    setIsLoading(false);

    // Initialize SMS integration
    smsIntegration.processOfflineQueue();

    // Initialize cache manager with new features
    cacheManager.initializeCache().then(() => {
      console.log('Cache manager initialized with new features');
    });

    // Check if cache needs update
    if (cacheManager.needsCacheUpdate()) {
      console.log('Cache update available - new features ready');
    }

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker installed with updates');
                  // Force cache refresh for new features
                  cacheManager.forceCacheRefresh();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SW_UPDATE') {
          console.log('Service Worker update received:', event.data);
          // Handle new features notification
        }
      });
    }
  }, []);

  const handleLogin = (code: string) => {
    if (secretCodeManager.validateSecretCode(code)) {
      secretCodeManager.updateLastUsed();
      setIsAuthenticated(true);
    }
  };

  const handleCreateCode = (code: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    secretCodeManager.deleteSecretCode();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SafeLink...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showCreateCode) {
      return <CreateCodeForm onBack={() => setShowCreateCode(false)} onCodeCreated={handleCreateCode} />;
    }
    return <LoginForm onLogin={handleLogin} onCreateNew={() => setShowCreateCode(true)} />;
  }

  return (
    <AccessibilityProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 overflow-x-hidden" style={{ overflowY: 'visible' }}>
          <OfflineIndicator />
          
          {/* App Install Banner */}
          <AppInstallBanner
            onInstall={handleDownload}
            onDismiss={closeModal}
          />
          
          {/* Update Notification */}
          {isUpdateAvailable && (
            <UpdateNotification
              onUpdate={updateServiceWorker}
              onDismiss={dismissUpdate}
            />
          )}
          
          {/* Desktop Header */}
          <DesktopHeader />
          
            {/* Main content area with proper mobile spacing */}
            <main className="flex-1 lg:ml-0 min-h-screen-safe">
              <div className="w-full max-w-none">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/sms" element={<SMSInterface />} />
                  <Route path="/sms-alerts" element={<SRHRAlerts />} />
                  <Route path="/stories" element={<StorytellingPlatform />} />
                  <Route path="/clinics" element={<Clinics />} />
                  <Route path="/safe-spaces" element={<SafeSpaceLocator />} />
                  <Route path="/tracker" element={<Tracker />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/consent-game" element={<ConsentEducationGame />} />
                  <Route path="/inclusive-support" element={<InclusiveYouthSupport />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/mentorship" element={<Mentorship />} />
                  <Route path="/offline" element={<OfflineMode />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/tutorial" element={<Tutorial />} />
                  <Route path="/visual-accessibility" element={<VisualAccessibility />} />
                  <Route path="/motor-accessibility" element={<MotorAccessibility />} />
                  <Route path="/hearing-accessibility" element={<HearingAccessibility />} />
            <Route path="/cognitive-accessibility" element={<CognitiveAccessibility />} />
            <Route path="/medication-order" element={<MedicationOrder />} />
            <Route path="/secure-map" element={<SecureMap />} />
            <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
            <Route path="/dashboard" element={<DashboardAccessManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
            
            {/* Floating Download Button - Only show for authenticated users */}
            {isAuthenticated && (
              <FloatingDownloadButton
                onDownload={handleDownload}
                onClose={closeModal}
              />
            )}
            
            {/* App Download Modal */}
            <AppDownloadModal
              isOpen={showModal}
              onClose={closeModal}
              onDownload={handleDownload}
            />
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
