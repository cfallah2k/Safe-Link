import React from 'react';
import { useTranslation } from 'react-i18next';
import QuizGame from '../components/Games/QuizGame';
import Header from '../components/Layout/Header';

const Games: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={t('games.title')} 
        subtitle={t('games.subtitle')}
      />
      <main className="pb-6">
        <QuizGame />
      </main>
    </div>
  );
};

export default Games;
