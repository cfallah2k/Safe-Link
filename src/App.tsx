import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import './styles/accessibility.css';

// Components
import OfflineIndicator from './components/OfflineIndicator';
import Navigation from './components/Layout/Navigation';
import LoginForm from './components/Auth/LoginForm';
import CreateCodeForm from './components/Auth/CreateCodeForm';
import SRHRAlerts from './components/SMS/SRHRAlerts';
import StorytellingPlatform from './components/Storytelling/StorytellingPlatform';
import SafeSpaceLocator from './components/SafeSpace/SafeSpaceLocator';
import ConsentEducationGame from './components/Games/ConsentEducationGame';
import InclusiveYouthSupport from './components/Inclusive/InclusiveYouthSupport';
import KioskInterface from './components/Kiosk/KioskInterface';
import AccessibilityDashboard from './components/Accessibility/AccessibilityDashboard';

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

// Utils
import { secretCodeManager } from './utils/secretCode';
import { smsIntegration } from './utils/smsIntegration';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid secret code
    const hasValidCode = secretCodeManager.hasValidSecretCode();
    setIsAuthenticated(hasValidCode);
    setIsLoading(false);

    // Initialize SMS integration
    smsIntegration.processOfflineQueue();

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
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
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
          <OfflineIndicator />
          
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col lg:flex-row">
            <Navigation />
            
            {/* Main content area with proper mobile spacing */}
            <main className="flex-1 lg:ml-64 min-h-screen-safe">
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
                  <Route path="/kiosk" element={<KioskInterface />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/mentorship" element={<Mentorship />} />
                  <Route path="/offline" element={<OfflineMode />} />
                  <Route path="/accessibility" element={<AccessibilityDashboard />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
          
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
