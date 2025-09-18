import React from 'react';
import { useTranslation } from 'react-i18next';
import MentorshipSystem from '../components/Mentorship/MentorshipSystem';
import Header from '../components/Layout/Header';

const Mentorship: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={t('mentorship.title')} 
        subtitle={t('mentorship.subtitle')}
      />
      <main className="pb-6">
        <MentorshipSystem />
      </main>
    </div>
  );
};

export default Mentorship;
