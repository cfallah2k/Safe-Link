import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';
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
    "How do I talk to my partner about protection?",
    "What is consent?",
    "How do I know if I'm ready for sex?",
    "What are the signs of a healthy relationship?",
    "How do I deal with peer pressure?",
    "What is menstruation?",
    "How do I track my menstrual cycle?",
    "What are the different types of contraception?",
    "How effective are condoms?",
    "What should I do if a condom breaks?",
    "How do I get tested for STIs?",
    "What is HIV and how is it transmitted?",
    "How can I prevent HIV?",
    "What is emergency contraception?",
    "How do I know if I have a healthy body?",
    "What is body image and self-esteem?",
    "How do I handle sexual harassment?",
    "What should I do if I'm being pressured?",
    "How do I talk to my parents about sex?",
    "What is gender identity?",
    "How do I support LGBTQ+ friends?",
    "What is sexual orientation?",
    "How do I know if I'm in love?",
    "What is a healthy relationship?",
    "How do I break up safely?",
    "What is domestic violence?",
    "How do I get help if I'm in danger?",
    "What is mental health?",
    "How do I deal with stress and anxiety?",
    "What is depression?",
    "How do I support a friend in crisis?",
    "What is self-care?",
    "How do I build confidence?",
    "What is peer pressure?",
    "How do I say no?",
    "What is cyberbullying?",
    "How do I stay safe online?",
    "What is sexting?",
    "How do I protect my privacy?",
    "What is pornography?",
    "How does it affect relationships?",
    "What is addiction?",
    "How do I get help for addiction?",
    "What is trauma?",
    "How do I heal from trauma?",
    "What is therapy?",
    "How do I find a therapist?",
    "What is self-harm?",
    "How do I get help for self-harm?",
    "What is suicide prevention?",
    "How do I help someone who's suicidal?"
  ], []);

  // Offline responses for common questions
  const offlineResponses: { [key: string]: string } = {
    "contraception": "Contraception (birth control) helps prevent pregnancy. There are many types including condoms, pills, IUDs, and implants. Each has different effectiveness rates and side effects. Would you like to know about specific types?",
    "sti": "STIs (Sexually Transmitted Infections) can have symptoms like unusual discharge, pain, or sores. However, many STIs show no symptoms. Regular testing is important. If you're concerned, visit a health clinic for testing.",
    "rights": "You have the right to make decisions about your body, relationships, and reproductive health. This includes the right to say no, access healthcare, and receive accurate information. No one can force you into anything you don't want.",
    "safe sex": "Safe sex includes using condoms, getting tested regularly, talking openly with partners, and respecting boundaries. Communication is key to staying safe and healthy.",
    "pregnancy": "If you think you might be pregnant, take a pregnancy test and see a healthcare provider. They can confirm the pregnancy and discuss your options, which may include continuing the pregnancy, adoption, or termination.",
    "partner": "Talking about protection with your partner is important for your health. Be honest about your concerns and needs. A good partner will respect your boundaries and health.",
    "consent": "Consent is clear, enthusiastic agreement to sexual activity. It must be given freely, can be withdrawn at any time, and must be given by someone who is capable of making that decision. Consent is never assumed and must be ongoing.",
    "ready for sex": "Being ready for sex means you feel comfortable, have accurate information, can communicate with your partner, understand consent, and are prepared for the emotional and physical aspects. There's no specific age - it's about maturity and readiness.",
    "healthy relationship": "A healthy relationship is based on respect, trust, communication, and equality. Both partners should feel safe, supported, and valued. You should be able to express your needs and boundaries without fear.",
    "peer pressure": "Peer pressure is when friends or others try to influence your decisions. It's okay to say no to things that don't feel right for you. True friends will respect your boundaries and support your choices.",
    "menstruation": "Menstruation is the monthly shedding of the uterine lining. It's a normal part of the menstrual cycle and typically lasts 3-7 days. It's important to track your cycle and talk to a healthcare provider about any concerns.",
    "track cycle": "You can track your menstrual cycle by noting the first day of your period each month. A typical cycle is 21-35 days. You can use apps, calendars, or journals to track symptoms, mood, and flow.",
    "types contraception": "Contraception types include: barrier methods (condoms, diaphragms), hormonal methods (pills, patches, rings, implants, IUDs), and permanent methods (tubal ligation, vasectomy). Each has different effectiveness and side effects.",
    "condom effectiveness": "Condoms are 98% effective when used correctly every time. They also protect against STIs. It's important to use them from start to finish and check the expiration date.",
    "condom breaks": "If a condom breaks, stop immediately, check for damage, and use emergency contraception if needed. Get tested for STIs and consider using a backup method of contraception.",
    "sti testing": "STI testing is available at health clinics, some pharmacies, and through healthcare providers. Many tests are quick and painless. Regular testing is important for your health and your partner's health.",
    "hiv": "HIV is a virus that attacks the immune system. It's transmitted through blood, semen, vaginal fluids, and breast milk. It cannot be transmitted through casual contact like hugging or sharing food.",
    "prevent hiv": "You can prevent HIV by using condoms consistently, getting tested regularly, not sharing needles, and considering PrEP (pre-exposure prophylaxis) if you're at high risk.",
    "emergency contraception": "Emergency contraception (morning-after pill) can prevent pregnancy if taken within 72 hours of unprotected sex. It's available at pharmacies and health clinics without a prescription in many places.",
    "healthy body": "A healthy body comes in all shapes and sizes. Focus on eating nutritious foods, staying active, getting enough sleep, and taking care of your mental health. Your worth isn't determined by your appearance.",
    "body image": "Body image is how you see and feel about your body. It's normal to have ups and downs. Focus on what your body can do rather than how it looks. Seek support if negative body image affects your daily life.",
    "sexual harassment": "Sexual harassment is unwanted sexual behavior that makes you feel uncomfortable, scared, or intimidated. It can be verbal, physical, or online. You have the right to report it and get help.",
    "being pressured": "If you're being pressured into sexual activity, it's important to trust your instincts. You have the right to say no at any time. Seek support from trusted adults, friends, or helplines.",
    "talk parents": "Talking to parents about sex can be awkward, but they often want to help. Choose a good time, be honest about your questions, and remember they were young once too. If it's too difficult, talk to another trusted adult.",
    "gender identity": "Gender identity is your internal sense of being male, female, both, neither, or something else. It's separate from biological sex and can be fluid. Everyone deserves respect for their identity.",
    "lgbtq support": "Supporting LGBTQ+ friends means listening without judgment, using their preferred pronouns, standing up against discrimination, and being an ally. Everyone deserves love and acceptance.",
    "sexual orientation": "Sexual orientation is who you're attracted to romantically or sexually. It can be heterosexual, homosexual, bisexual, pansexual, asexual, or other identities. All orientations are valid and normal.",
    "in love": "Love is a complex emotion that involves care, respect, and wanting the best for someone. It's different from infatuation or lust. Take time to understand your feelings and don't rush into decisions.",
    "break up safely": "Breaking up safely means being honest but kind, doing it in person if possible, having a support system, and taking time to heal. It's okay to end relationships that aren't healthy for you.",
    "domestic violence": "Domestic violence is any pattern of abusive behavior in a relationship. It can be physical, emotional, sexual, or financial. If you're in danger, reach out to helplines, trusted adults, or emergency services.",
    "get help danger": "If you're in immediate danger, call emergency services. For ongoing support, contact domestic violence hotlines, trusted adults, or support groups. Your safety is the most important thing.",
    "mental health": "Mental health is your emotional, psychological, and social well-being. It affects how you think, feel, and act. Taking care of your mental health is just as important as physical health.",
    "stress anxiety": "Stress and anxiety are normal responses to challenges. Healthy coping includes exercise, deep breathing, talking to someone, and taking breaks. If it's overwhelming, consider talking to a counselor.",
    "depression": "Depression is more than feeling sad - it's a persistent feeling of hopelessness, loss of interest, and other symptoms that affect daily life. It's treatable, and seeking help is a sign of strength.",
    "support friend crisis": "Supporting a friend in crisis means listening without judgment, encouraging them to seek professional help, staying connected, and taking care of yourself too. Don't try to fix everything alone.",
    "self care": "Self-care is taking care of your physical, mental, and emotional needs. It includes getting enough sleep, eating well, exercising, spending time with loved ones, and doing things you enjoy.",
    "build confidence": "Building confidence takes time and practice. Focus on your strengths, set realistic goals, challenge negative self-talk, and surround yourself with supportive people. Remember, everyone has insecurities.",
    "say no": "Saying no is a skill that protects your boundaries and well-being. Be clear, firm, and don't feel guilty. Practice with small things first. You don't owe anyone an explanation for your 'no.'",
    "cyberbullying": "Cyberbullying is harassment or bullying that happens online. It can include spreading rumors, sharing embarrassing photos, or sending threatening messages. Block the person and report the behavior.",
    "stay safe online": "Stay safe online by using strong passwords, being careful about what you share, not meeting strangers alone, and trusting your instincts. Remember, once something is online, it's hard to take back.",
    "sexting": "Sexting is sending sexual messages or images. It can have serious consequences including legal issues, emotional harm, and privacy violations. Think carefully before sending anything you wouldn't want others to see.",
    "protect privacy": "Protect your privacy by being careful about what you share online, using privacy settings, not sharing passwords, and being cautious about who you trust with personal information.",
    "pornography": "Pornography is adult content that may not reflect real relationships or healthy sexuality. It can create unrealistic expectations. Real relationships involve communication, consent, and emotional connection.",
    "affects relationships": "Pornography can affect relationships by creating unrealistic expectations, reducing intimacy, or causing comparison issues. Open communication with your partner about boundaries and expectations is important.",
    "addiction": "Addiction is a compulsive need for something despite negative consequences. It can affect relationships, work, and health. Recovery is possible with support, treatment, and determination.",
    "help addiction": "Getting help for addiction starts with recognizing the problem and reaching out. Support groups, counseling, and treatment programs are available. Recovery is a journey that requires support and commitment.",
    "trauma": "Trauma is a response to a deeply distressing or disturbing event. It can affect your mental health, relationships, and daily life. Healing is possible with time, support, and professional help.",
    "heal trauma": "Healing from trauma takes time and often requires professional help. Self-care, support from loved ones, therapy, and sometimes medication can help. Be patient and kind to yourself.",
    "therapy": "Therapy is talking to a trained professional about your thoughts, feelings, and experiences. It can help with mental health, relationships, trauma, and personal growth. There's no shame in seeking help.",
    "find therapist": "Finding a therapist involves asking for referrals, checking credentials, considering your needs, and finding someone you feel comfortable with. Many therapists offer sliding scale fees.",
    "self harm": "Self-harm is intentionally hurting yourself as a way to cope with emotional pain. It's a sign that you need help. There are healthier ways to cope, and support is available.",
    "help self harm": "If you're self-harming, reach out to a trusted adult, counselor, or helpline. You're not alone, and there are people who want to help. Recovery is possible with support and treatment.",
    "suicide prevention": "Suicide prevention involves recognizing warning signs, listening without judgment, asking directly about suicidal thoughts, and connecting people to professional help. Your support can save a life.",
    "help suicidal": "If someone is suicidal, take it seriously, listen without judgment, ask directly about their thoughts, stay with them, and connect them to professional help immediately. Don't keep it a secret."
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
    } else if (lowerQuestion.includes('consent')) {
      return offlineResponses.consent;
    } else if (lowerQuestion.includes('ready') && lowerQuestion.includes('sex')) {
      return offlineResponses['ready for sex'];
    } else if (lowerQuestion.includes('healthy') && lowerQuestion.includes('relationship')) {
      return offlineResponses['healthy relationship'];
    } else if (lowerQuestion.includes('peer pressure')) {
      return offlineResponses['peer pressure'];
    } else if (lowerQuestion.includes('menstruation') || lowerQuestion.includes('period')) {
      return offlineResponses.menstruation;
    } else if (lowerQuestion.includes('track') && lowerQuestion.includes('cycle')) {
      return offlineResponses['track cycle'];
    } else if (lowerQuestion.includes('types') && lowerQuestion.includes('contraception')) {
      return offlineResponses['types contraception'];
    } else if (lowerQuestion.includes('effective') && lowerQuestion.includes('condom')) {
      return offlineResponses['condom effectiveness'];
    } else if (lowerQuestion.includes('condom') && lowerQuestion.includes('break')) {
      return offlineResponses['condom breaks'];
    } else if (lowerQuestion.includes('test') && (lowerQuestion.includes('sti') || lowerQuestion.includes('std'))) {
      return offlineResponses['sti testing'];
    } else if (lowerQuestion.includes('hiv')) {
      return offlineResponses.hiv;
    } else if (lowerQuestion.includes('prevent') && lowerQuestion.includes('hiv')) {
      return offlineResponses['prevent hiv'];
    } else if (lowerQuestion.includes('emergency contraception') || lowerQuestion.includes('morning after')) {
      return offlineResponses['emergency contraception'];
    } else if (lowerQuestion.includes('healthy body')) {
      return offlineResponses['healthy body'];
    } else if (lowerQuestion.includes('body image') || lowerQuestion.includes('self esteem')) {
      return offlineResponses['body image'];
    } else if (lowerQuestion.includes('sexual harassment')) {
      return offlineResponses['sexual harassment'];
    } else if (lowerQuestion.includes('pressured') || lowerQuestion.includes('pressure')) {
      return offlineResponses['being pressured'];
    } else if (lowerQuestion.includes('parents') && lowerQuestion.includes('sex')) {
      return offlineResponses['talk parents'];
    } else if (lowerQuestion.includes('gender identity')) {
      return offlineResponses['gender identity'];
    } else if (lowerQuestion.includes('lgbtq') || lowerQuestion.includes('lgbt')) {
      return offlineResponses['lgbtq support'];
    } else if (lowerQuestion.includes('sexual orientation')) {
      return offlineResponses['sexual orientation'];
    } else if (lowerQuestion.includes('love') || lowerQuestion.includes('in love')) {
      return offlineResponses['in love'];
    } else if (lowerQuestion.includes('break up') || lowerQuestion.includes('breakup')) {
      return offlineResponses['break up safely'];
    } else if (lowerQuestion.includes('domestic violence')) {
      return offlineResponses['domestic violence'];
    } else if (lowerQuestion.includes('danger') || lowerQuestion.includes('help')) {
      return offlineResponses['get help danger'];
    } else if (lowerQuestion.includes('mental health')) {
      return offlineResponses['mental health'];
    } else if (lowerQuestion.includes('stress') || lowerQuestion.includes('anxiety')) {
      return offlineResponses['stress anxiety'];
    } else if (lowerQuestion.includes('depression')) {
      return offlineResponses.depression;
    } else if (lowerQuestion.includes('support') && lowerQuestion.includes('friend')) {
      return offlineResponses['support friend crisis'];
    } else if (lowerQuestion.includes('self care')) {
      return offlineResponses['self care'];
    } else if (lowerQuestion.includes('confidence')) {
      return offlineResponses['build confidence'];
    } else if (lowerQuestion.includes('say no') || lowerQuestion.includes('saying no')) {
      return offlineResponses['say no'];
    } else if (lowerQuestion.includes('cyberbullying')) {
      return offlineResponses.cyberbullying;
    } else if (lowerQuestion.includes('safe online') || lowerQuestion.includes('online safety')) {
      return offlineResponses['stay safe online'];
    } else if (lowerQuestion.includes('sexting')) {
      return offlineResponses.sexting;
    } else if (lowerQuestion.includes('privacy')) {
      return offlineResponses['protect privacy'];
    } else if (lowerQuestion.includes('pornography') || lowerQuestion.includes('porn')) {
      return offlineResponses.pornography;
    } else if (lowerQuestion.includes('affects relationship')) {
      return offlineResponses['affects relationships'];
    } else if (lowerQuestion.includes('addiction')) {
      return offlineResponses.addiction;
    } else if (lowerQuestion.includes('help addiction')) {
      return offlineResponses['help addiction'];
    } else if (lowerQuestion.includes('trauma')) {
      return offlineResponses.trauma;
    } else if (lowerQuestion.includes('heal trauma')) {
      return offlineResponses['heal trauma'];
    } else if (lowerQuestion.includes('therapy')) {
      return offlineResponses.therapy;
    } else if (lowerQuestion.includes('find therapist')) {
      return offlineResponses['find therapist'];
    } else if (lowerQuestion.includes('self harm')) {
      return offlineResponses['self harm'];
    } else if (lowerQuestion.includes('help self harm')) {
      return offlineResponses['help self harm'];
    } else if (lowerQuestion.includes('suicide prevention')) {
      return offlineResponses['suicide prevention'];
    } else if (lowerQuestion.includes('suicidal')) {
      return offlineResponses['help suicidal'];
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
