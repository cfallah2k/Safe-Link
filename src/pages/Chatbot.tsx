import React from 'react';
import { useTranslation } from 'react-i18next';
import ChatInterface from '../components/Chatbot/ChatInterface';

const Chatbot: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex flex-col">
      <Header 
        title={t('chatbot.title')} 
        subtitle={t('chatbot.subtitle')}
        showPrivacy={false}
      />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chatbot;
