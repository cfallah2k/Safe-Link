import React from 'react';
import { useTranslation } from 'react-i18next';
import EmergencyPanel from '../components/Emergency/EmergencyPanel';

const Emergency: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={t('emergency.title')} 
        subtitle={t('emergency.subtitle')}
      />
      <main className="pb-6">
        <EmergencyPanel />
      </main>
    </div>
  );
};

export default Emergency;
