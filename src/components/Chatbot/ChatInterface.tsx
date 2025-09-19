import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Shield, Loader2 } from 'lucide-react';
import { offlineStorage } from '../../utils/offlineStorage';
import { useOffline } from '../../hooks/useOffline';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  suggestions?: string[];
}

interface ChatInterfaceProps {
  onBack?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const { isOnline } = useOffline();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Common questions for quick access
  const commonQuestions = useMemo(() => [
    "What is contraception?",
    "How do I know if I have an STI?",
    "What are my reproductive rights?",
    "How can I stay safe during sex?",
    "What should I do if I'm pregnant?",
    "How do I talk to my partner about protection?"
  ], []);

  // Offline responses for common questions
  const offlineResponses: { [key: string]: string } = {
    "contraception": "Contraception (birth control) helps prevent pregnancy. There are many types including condoms, pills, IUDs, and implants. Each has different effectiveness rates and side effects. Would you like to know about specific types?",
    "sti": "STIs (Sexually Transmitted Infections) can have symptoms like unusual discharge, pain, or sores. However, many STIs show no symptoms. Regular testing is important. If you're concerned, visit a health clinic for testing.",
    "rights": "You have the right to make decisions about your body, relationships, and reproductive health. This includes the right to say no, access healthcare, and receive accurate information. No one can force you into anything you don't want.",
    "safe sex": "Safe sex includes using condoms, getting tested regularly, talking openly with partners, and respecting boundaries. Communication is key to staying safe and healthy.",
    "pregnancy": "If you think you might be pregnant, take a pregnancy test and see a healthcare provider. They can confirm the pregnancy and discuss your options, which may include continuing the pregnancy, adoption, or termination.",
    "partner": "Talking about protection with your partner is important for your health. Be honest about your concerns and needs. A good partner will respect your boundaries and health."
  };

  useEffect(() => {
    // Load previous messages from offline storage
    loadPreviousMessages();
    
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hello! I'm your anonymous SRHR assistant. I'm here to provide accurate, non-judgmental information about sexual and reproductive health. What would you like to know?",
        isUser: false,
        timestamp: Date.now(),
        suggestions: commonQuestions.slice(0, 3)
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, commonQuestions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPreviousMessages = async () => {
    try {
      const chatHistory = await offlineStorage.getData('chat_history');
      if (chatHistory && chatHistory.messages) {
        setMessages(chatHistory.messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await offlineStorage.storeData('chat_history', { messages: newMessages });
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOfflineResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for keywords and return appropriate response
    if (lowerQuestion.includes('contraception') || lowerQuestion.includes('birth control')) {
      return offlineResponses.contraception;
    } else if (lowerQuestion.includes('sti') || lowerQuestion.includes('std') || lowerQuestion.includes('infection')) {
      return offlineResponses.sti;
    } else if (lowerQuestion.includes('right') || lowerQuestion.includes('choice')) {
      return offlineResponses.rights;
    } else if (lowerQuestion.includes('safe') || lowerQuestion.includes('protection') || lowerQuestion.includes('condom')) {
      return offlineResponses['safe sex'];
    } else if (lowerQuestion.includes('pregnant') || lowerQuestion.includes('pregnancy')) {
      return offlineResponses.pregnancy;
    } else if (lowerQuestion.includes('partner') || lowerQuestion.includes('talk') || lowerQuestion.includes('communication')) {
      return offlineResponses.partner;
    } else {
      return "I understand you're asking about an important topic. While I have some general information available offline, for the most accurate and up-to-date information, I'd recommend visiting a health clinic or speaking with a healthcare provider. Is there anything specific I can help you with from my available knowledge?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      let botResponse: string;
      
      if (isOnline) {
        // In a real app, this would call an API
        // For now, we'll use offline responses
        botResponse = getOfflineResponse(inputText);
      } else {
        botResponse = getOfflineResponse(inputText);
      }

      // Add a small delay to simulate thinking
      await new Promise(resolve => setTimeout(resolve, 1000));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: Date.now(),
        suggestions: commonQuestions.slice(0, 2)
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);

    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again or visit a health clinic for immediate assistance.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen-safe bg-gray-50 overflow-hidden">
      {/* Header - Enhanced for mobile */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 flex-shrink-0" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-primary-100 rounded-xl flex-shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">SRHR Assistant</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {isOnline ? 'Online' : 'Offline'} • Anonymous
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm text-green-600 font-medium hidden sm:inline">Secure</span>
          </div>
        </div>
      </div>

      {/* Messages - Enhanced mobile scrolling */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 smooth-scroll">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${message.isUser ? 'bg-primary-600' : 'bg-gray-200'}`}>
                {message.isUser ? (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                )}
              </div>
              <div className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 ${message.isUser ? 'bg-primary-600 text-white' : 'bg-white text-gray-900 shadow-sm border border-gray-100'}`}>
                <p className="text-sm sm:text-base leading-relaxed break-words">{message.text}</p>
                {message.suggestions && (
                  <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg text-gray-700 transition-colors touch-manipulation"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 rounded-full bg-gray-200 flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div className="bg-white rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Enhanced mobile input */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex space-x-2 sm:space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about sexual and reproductive health..."
            className="flex-1 input-field text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed p-3 sm:p-4"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* Common questions - Enhanced mobile layout */}
        <div className="mt-3 sm:mt-4">
          <p className="text-xs text-gray-500 mb-2 sm:mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {commonQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full text-gray-700 transition-colors touch-manipulation"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
