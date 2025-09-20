import React from 'react';
import { useTranslation } from 'react-i18next';
import AccessibleQuizGame from '../components/Games/AccessibleQuizGame';

const Games: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-6">
        <AccessibleQuizGame />
      </main>
    </div>
  );
};

export default Games;
