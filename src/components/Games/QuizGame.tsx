import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  Star, 
  RotateCcw,
  BookOpen,
  Target,
  Clock
} from 'lucide-react';
import { offlineStorage } from '../../utils/offlineStorage';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  category: string;
  completedAt: number;
}

const QuizGame: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userStats, setUserStats] = useState<QuizResult[]>([]);

  // Sample SRHR questions
  const sampleQuestions: Question[] = [
    {
      id: '1',
      question: 'What is the most effective way to prevent sexually transmitted infections (STIs)?',
      options: [
        'Using condoms consistently and correctly',
        'Taking birth control pills',
        'Having only one partner',
        'Washing after sex'
      ],
      correctAnswer: 0,
      explanation: 'Consistent and correct use of condoms is the most effective way to prevent STIs during sexual activity.',
      category: 'STI Prevention',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'At what age can someone legally consent to sexual activity in most countries?',
      options: [
        '14 years old',
        '16 years old',
        '18 years old',
        'It varies by country and situation'
      ],
      correctAnswer: 3,
      explanation: 'The age of consent varies by country and sometimes by the age difference between partners. It\'s important to know the laws in your area.',
      category: 'Legal Rights',
      difficulty: 'medium'
    },
    {
      id: '3',
      question: 'What is emergency contraception?',
      options: [
        'A type of abortion pill',
        'A method to prevent pregnancy after unprotected sex',
        'A permanent form of birth control',
        'A treatment for STIs'
      ],
      correctAnswer: 1,
      explanation: 'Emergency contraception is used to prevent pregnancy after unprotected sex or contraceptive failure. It should be taken as soon as possible.',
      category: 'Contraception',
      difficulty: 'easy'
    },
    {
      id: '4',
      question: 'Which of the following is NOT a sign of a healthy relationship?',
      options: [
        'Mutual respect',
        'Open communication',
        'Controlling behavior',
        'Trust and support'
      ],
      correctAnswer: 2,
      explanation: 'Controlling behavior is a red flag in relationships. Healthy relationships are based on mutual respect, trust, and open communication.',
      category: 'Relationships',
      difficulty: 'easy'
    },
    {
      id: '5',
      question: 'What is the purpose of regular STI testing?',
      options: [
        'To cure existing infections',
        'To prevent all STIs',
        'To detect infections early for treatment',
        'To replace the need for protection'
      ],
      correctAnswer: 2,
      explanation: 'Regular STI testing helps detect infections early, even when there are no symptoms, allowing for timely treatment.',
      category: 'STI Prevention',
      difficulty: 'medium'
    },
    {
      id: '6',
      question: 'What does "consent" mean in sexual relationships?',
      options: [
        'Saying yes once means yes always',
        'Being drunk means you can\'t consent',
        'Active, ongoing agreement to participate',
        'Only verbal agreement counts'
      ],
      correctAnswer: 2,
      explanation: 'Consent is an active, ongoing agreement to participate in sexual activity. It can be withdrawn at any time and must be given freely.',
      category: 'Consent',
      difficulty: 'medium'
    },
    {
      id: '7',
      question: 'What is the most common symptom of many STIs?',
      options: [
        'Severe pain',
        'No symptoms at all',
        'Visible sores',
        'Fever and chills'
      ],
      correctAnswer: 1,
      explanation: 'Many STIs, including chlamydia and gonorrhea, often have no symptoms, which is why regular testing is important.',
      category: 'STI Prevention',
      difficulty: 'hard'
    },
    {
      id: '8',
      question: 'What should you do if you think you have an STI?',
      options: [
        'Wait to see if symptoms go away',
        'See a healthcare provider for testing',
        'Ask friends for advice',
        'Use over-the-counter medications'
      ],
      correctAnswer: 1,
      explanation: 'If you think you have an STI, it\'s important to see a healthcare provider for proper testing and treatment.',
      category: 'STI Prevention',
      difficulty: 'easy'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'STI Prevention', label: 'STI Prevention' },
    { value: 'Contraception', label: 'Contraception' },
    { value: 'Relationships', label: 'Relationships' },
    { value: 'Consent', label: 'Consent' },
    { value: 'Legal Rights', label: 'Legal Rights' }
  ];

  useEffect(() => {
    loadUserStats();
    setQuestions(sampleQuestions);
  }, [sampleQuestions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && !quizCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted]);

  const loadUserStats = async () => {
    try {
      const stats = await offlineStorage.getData('quiz_stats');
      if (stats) {
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Failed to load quiz stats:', error);
    }
  };

  const saveUserStats = async (result: QuizResult) => {
    try {
      const newStats = [...userStats, result];
      await offlineStorage.storeData('quiz_stats', newStats);
      setUserStats(newStats);
    } catch (error) {
      console.error('Failed to save quiz stats:', error);
    }
  };

  const startQuiz = () => {
    const filteredQuestions = selectedCategory === 'all' 
      ? sampleQuestions 
      : sampleQuestions.filter(q => q.category === selectedCategory);
    
    setQuestions(filteredQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setTimeSpent(0);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const result: QuizResult = {
        score: selectedAnswer === questions[currentQuestionIndex].correctAnswer ? score + 1 : score,
        totalQuestions: questions.length,
        correctAnswers: selectedAnswer === questions[currentQuestionIndex].correctAnswer ? score + 1 : score,
        timeSpent,
        category: selectedCategory,
        completedAt: Date.now()
      };
      
      saveUserStats(result);
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeSpent(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SRHR Knowledge Quiz</h1>
          <p className="text-gray-600">
            Test your knowledge about sexual and reproductive health and rights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Setup */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Start New Quiz</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Topic</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full input-field"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Quiz Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {selectedCategory === 'all' ? sampleQuestions.length : sampleQuestions.filter(q => q.category === selectedCategory).length} questions</li>
                  <li>• Multiple choice format</li>
                  <li>• Explanations provided</li>
                  <li>• No time limit</li>
                </ul>
              </div>

              <button
                onClick={startQuiz}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Target size={16} />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            
            {userStats.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Quizzes Taken</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{userStats.length}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Average Score</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(userStats.reduce((acc, stat) => acc + (stat.correctAnswers / stat.totalQuestions * 100), 0) / userStats.length)}%
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recent Results</h3>
                  <div className="space-y-2">
                    {userStats.slice(-3).reverse().map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{stat.category}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(stat.timeSpent)} • {new Date(stat.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(stat.correctAnswers / stat.totalQuestions * 100)}`}>
                          {Math.round(stat.correctAnswers / stat.totalQuestions * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quizzes completed yet</p>
                <p className="text-gray-400 text-sm">Start your first quiz to see your progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-600 mb-6">Great job on completing the SRHR knowledge quiz</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600">{score}</p>
              <p className="text-sm text-blue-800">Correct</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-600">{questions.length}</p>
              <p className="text-sm text-gray-800">Total</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className={`text-2xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</p>
              <p className="text-sm text-gray-800">Score</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Time Spent</span>
            </div>
            <p className="text-lg font-bold text-gray-600">{formatTime(timeSpent)}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={resetQuiz}
              className="flex-1 btn-outline flex items-center justify-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Take Another Quiz</span>
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">{formatTime(timeSpent)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty}
          </span>
          <span className="text-sm text-gray-500">{currentQuestion.category}</span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                showResult
                  ? index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : selectedAnswer === index
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                  : selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {showResult && (
                  <div className="flex-shrink-0">
                    {index === currentQuestion.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                )}
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Explanation:</h3>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
        </div>
        
        {!showResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="btn-primary flex items-center space-x-2"
          >
            <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
