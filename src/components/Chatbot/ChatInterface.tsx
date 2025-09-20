import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Shield, MessageCircle, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col h-screen-safe bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Modern Header with gradient */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-4 sm:px-6 flex-shrink-0 shadow-lg" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">SRHR Assistant</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <p className="text-sm text-white/80 truncate">
                  {isOnline ? 'Online' : 'Offline'} • Anonymous & Secure
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Modern chat bubbles */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 smooth-scroll">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[90%] sm:max-w-md lg:max-w-lg ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`p-3 rounded-2xl flex-shrink-0 shadow-lg ${message.isUser 
                ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {message.isUser ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              {/* Message bubble */}
              <div className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
                message.isUser 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                  : 'bg-white/90 text-gray-900 border border-gray-200/50'
              }`}>
                <p className="text-sm sm:text-base leading-relaxed break-words">{message.text}</p>
                
                {/* Suggestions with modern design */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`block w-full text-left text-xs sm:text-sm px-3 py-2 rounded-xl transition-all duration-200 touch-manipulation ${
                          message.isUser
                            ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                            : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-700 border border-gray-200'
                        }`}
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
            <div className="flex space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4 sm:p-6 flex-shrink-0 shadow-lg" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        {/* Quick questions with modern design */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <p className="text-sm font-medium text-gray-600">Quick questions:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {commonQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="text-xs sm:text-sm px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 active:scale-95 rounded-full text-gray-700 transition-all duration-200 touch-manipulation border border-gray-200/50 shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input field with modern design */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about sexual and reproductive health..."
              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <MessageCircle className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all duration-200 active:scale-95"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
