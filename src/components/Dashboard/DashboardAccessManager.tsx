import React, { useState, useEffect } from 'react';
import DashboardAccess from '../../pages/DashboardAccess';
import DashboardRouter from './DashboardRouter';
import PortalLogin from '../../pages/PortalLogin';

const DashboardAccessManager: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [showPortalLogin, setShowPortalLogin] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    // Check if role is provided in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    
    if (role) {
      setCurrentRole(role);
      setShowPortalLogin(true);
    }
  }, []);

  const handleDashboardAccess = (role: string, data: any) => {
    setUserRole(role);
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setUserData(null);
  };

  if (isAuthenticated) {
    return (
      <DashboardRouter 
        role={userRole} 
        userData={userData} 
        onLogout={handleLogout} 
      />
    );
  }

  if (showPortalLogin && currentRole) {
    return (
      <PortalLogin
        role={currentRole}
        onLoginSuccess={handleDashboardAccess}
        onBack={() => {
          setShowPortalLogin(false);
          setCurrentRole('');
          // Clear URL parameters
          window.history.replaceState({}, document.title, '/dashboard');
        }}
      />
    );
  }

  return (
    <DashboardAccess onDashboardAccess={handleDashboardAccess} />
  );
};

export default DashboardAccessManager;
