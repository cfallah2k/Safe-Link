import React from 'react';
import { useTranslation } from 'react-i18next';
import HealthTracker from '../components/Tracker/HealthTracker';
import Header from '../components/Layout/Header';

const Tracker: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={t('tracker.title')} 
        subtitle={t('tracker.subtitle')}
      />
      <main className="pb-6">
        <HealthTracker />
      </main>
    </div>
  );
};

export default Tracker;
