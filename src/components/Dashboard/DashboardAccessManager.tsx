import React, { useState } from 'react';
import DashboardAccess from '../../pages/DashboardAccess';
import DashboardRouter from './DashboardRouter';

const DashboardAccessManager: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);

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

  return (
    <DashboardAccess onDashboardAccess={handleDashboardAccess} />
  );
};

export default DashboardAccessManager;
