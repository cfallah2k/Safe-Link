import React from 'react';
import { useTranslation } from 'react-i18next';
import ClinicFinder from '../components/Clinics/ClinicFinder';
import Header from '../components/Layout/Header';

const Clinics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={t('clinics.title')} 
        subtitle={t('clinics.subtitle')}
      />
      <main className="pb-6">
        <ClinicFinder />
      </main>
    </div>
  );
};

export default Clinics;
