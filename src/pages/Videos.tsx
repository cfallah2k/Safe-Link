import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Clock, 
  Eye, 
  Heart, 
  Shield, 
  BookOpen, 
  Users, 
  Star,
  Search,
  Filter,
  Download,
  Wifi,
  WifiOff
} from 'lucide-react';
import Header from '../components/Layout/Header';
import { useOffline } from '../hooks/useOffline';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  views: number;
  rating: number;
  isDownloaded: boolean;
  isOfflineAvailable: boolean;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const Videos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [downloadedVideos, setDownloadedVideos] = useState<string[]>([]);
  const { isOnline } = useOffline();

  // Comprehensive SRHR video content
  const videos: Video[] = useMemo(() => [
    // STI Prevention Videos
    {
      id: 'sti_1',
      title: 'Understanding STIs: Prevention and Protection',
      description: 'Learn about common sexually transmitted infections, how they spread, and effective prevention methods.',
      duration: '8:45',
      category: 'STI Prevention',
      thumbnail: '/api/placeholder/300/200',
      views: 15420,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['STI', 'prevention', 'protection', 'health'],
      difficulty: 'beginner'
    },
    {
      id: 'sti_2',
      title: 'HIV/AIDS: Facts, Myths, and Modern Treatment',
      description: 'Comprehensive guide to HIV/AIDS, including transmission, prevention, testing, and current treatment options.',
      duration: '12:30',
      category: 'STI Prevention',
      thumbnail: '/api/placeholder/300/200',
      views: 8930,
      rating: 4.9,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['HIV', 'AIDS', 'treatment', 'prevention'],
      difficulty: 'intermediate'
    },
    {
      id: 'sti_3',
      title: 'HPV and Cervical Cancer Prevention',
      description: 'Understanding HPV, the HPV vaccine, and cervical cancer screening for women\'s health.',
      duration: '10:15',
      category: 'STI Prevention',
      thumbnail: '/api/placeholder/300/200',
      views: 12350,
      rating: 4.7,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['HPV', 'cervical cancer', 'vaccine', 'women\'s health'],
      difficulty: 'intermediate'
    },

    // Contraception Videos
    {
      id: 'contra_1',
      title: 'Birth Control Methods: A Complete Guide',
      description: 'Overview of all contraceptive methods, their effectiveness, and how to choose the right one for you.',
      duration: '15:20',
      category: 'Contraception',
      thumbnail: '/api/placeholder/300/200',
      views: 18750,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['contraception', 'birth control', 'family planning'],
      difficulty: 'beginner'
    },
    {
      id: 'contra_2',
      title: 'Emergency Contraception: When and How to Use',
      description: 'Everything you need to know about emergency contraception, including timing and effectiveness.',
      duration: '6:30',
      category: 'Contraception',
      thumbnail: '/api/placeholder/300/200',
      views: 9650,
      rating: 4.6,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['emergency contraception', 'morning after pill', 'unprotected sex'],
      difficulty: 'beginner'
    },
    {
      id: 'contra_3',
      title: 'IUDs and Implants: Long-term Contraception',
      description: 'Detailed information about intrauterine devices and contraceptive implants for long-term protection.',
      duration: '11:45',
      category: 'Contraception',
      thumbnail: '/api/placeholder/300/200',
      views: 11200,
      rating: 4.7,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['IUD', 'implant', 'long-term contraception'],
      difficulty: 'intermediate'
    },

    // Reproductive Health Videos
    {
      id: 'repro_1',
      title: 'Understanding Your Menstrual Cycle',
      description: 'Learn about the menstrual cycle, ovulation, and how to track your fertility naturally.',
      duration: '9:15',
      category: 'Reproductive Health',
      thumbnail: '/api/placeholder/300/200',
      views: 22300,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['menstrual cycle', 'ovulation', 'fertility', 'periods'],
      difficulty: 'beginner'
    },
    {
      id: 'repro_2',
      title: 'Pregnancy: What to Expect in Each Trimester',
      description: 'Comprehensive guide to pregnancy, including physical changes, prenatal care, and preparation for birth.',
      duration: '18:30',
      category: 'Reproductive Health',
      thumbnail: '/api/placeholder/300/200',
      views: 15680,
      rating: 4.9,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['pregnancy', 'prenatal care', 'trimester', 'birth preparation'],
      difficulty: 'intermediate'
    },
    {
      id: 'repro_3',
      title: 'Menopause: Understanding the Transition',
      description: 'Information about menopause, symptoms, treatment options, and maintaining health during this life stage.',
      duration: '13:20',
      category: 'Reproductive Health',
      thumbnail: '/api/placeholder/300/200',
      views: 8750,
      rating: 4.6,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['menopause', 'hormones', 'women\'s health', 'aging'],
      difficulty: 'intermediate'
    },

    // Mental Health and Relationships Videos
    {
      id: 'mental_1',
      title: 'Healthy Relationships: Communication and Boundaries',
      description: 'Learn about building healthy relationships, effective communication, and setting personal boundaries.',
      duration: '14:45',
      category: 'Mental Health',
      thumbnail: '/api/placeholder/300/200',
      views: 19800,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['relationships', 'communication', 'boundaries', 'mental health'],
      difficulty: 'beginner'
    },
    {
      id: 'mental_2',
      title: 'Consent: Understanding and Practicing',
      description: 'Comprehensive guide to sexual consent, including enthusiastic consent and recognizing coercion.',
      duration: '12:15',
      category: 'Mental Health',
      thumbnail: '/api/placeholder/300/200',
      views: 16750,
      rating: 4.9,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['consent', 'sexual health', 'relationships', 'safety'],
      difficulty: 'beginner'
    },
    {
      id: 'mental_3',
      title: 'Body Image and Self-Esteem',
      description: 'Building positive body image and self-esteem for better mental health and sexual confidence.',
      duration: '10:30',
      category: 'Mental Health',
      thumbnail: '/api/placeholder/300/200',
      views: 13400,
      rating: 4.7,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['body image', 'self-esteem', 'mental health', 'confidence'],
      difficulty: 'beginner'
    },

    // Gender and Sexuality Videos
    {
      id: 'gender_1',
      title: 'Understanding Gender Identity and Expression',
      description: 'Learn about gender identity, gender expression, and supporting transgender and non-binary individuals.',
      duration: '16:20',
      category: 'Gender & Sexuality',
      thumbnail: '/api/placeholder/300/200',
      views: 12800,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['gender identity', 'transgender', 'non-binary', 'LGBTQ+'],
      difficulty: 'intermediate'
    },
    {
      id: 'gender_2',
      title: 'Sexual Orientation: Understanding Diversity',
      description: 'Exploring different sexual orientations and creating inclusive, supportive environments.',
      duration: '11:45',
      category: 'Gender & Sexuality',
      thumbnail: '/api/placeholder/300/200',
      views: 15200,
      rating: 4.7,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['sexual orientation', 'LGBTQ+', 'diversity', 'inclusion'],
      difficulty: 'beginner'
    },

    // Legal Rights and Advocacy Videos
    {
      id: 'legal_1',
      title: 'Your Reproductive Rights: Know Your Rights',
      description: 'Understanding reproductive rights, healthcare access, and legal protections for sexual health.',
      duration: '13:30',
      category: 'Legal Rights',
      thumbnail: '/api/placeholder/300/200',
      views: 9650,
      rating: 4.6,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['reproductive rights', 'legal rights', 'healthcare access'],
      difficulty: 'intermediate'
    },
    {
      id: 'legal_2',
      title: 'Sexual Harassment and Violence: Prevention and Support',
      description: 'Recognizing sexual harassment and violence, prevention strategies, and where to get help.',
      duration: '15:45',
      category: 'Legal Rights',
      thumbnail: '/api/placeholder/300/200',
      views: 11200,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['sexual harassment', 'violence prevention', 'support', 'safety'],
      difficulty: 'intermediate'
    },

    // Youth-Specific Videos
    {
      id: 'youth_1',
      title: 'Teen Sexual Health: What You Need to Know',
      description: 'Age-appropriate information about sexual health, relationships, and making informed decisions.',
      duration: '12:00',
      category: 'Youth Education',
      thumbnail: '/api/placeholder/300/200',
      views: 18750,
      rating: 4.8,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['teen health', 'sexual education', 'youth', 'decision making'],
      difficulty: 'beginner'
    },
    {
      id: 'youth_2',
      title: 'Peer Pressure and Sexual Decisions',
      description: 'How to handle peer pressure and make confident decisions about your sexual health and relationships.',
      duration: '9:30',
      category: 'Youth Education',
      thumbnail: '/api/placeholder/300/200',
      views: 14300,
      rating: 4.7,
      isDownloaded: false,
      isOfflineAvailable: true,
      tags: ['peer pressure', 'decision making', 'youth', 'confidence'],
      difficulty: 'beginner'
    }
  ], []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'STI Prevention', label: 'STI Prevention' },
    { value: 'Contraception', label: 'Contraception' },
    { value: 'Reproductive Health', label: 'Reproductive Health' },
    { value: 'Mental Health', label: 'Mental Health' },
    { value: 'Gender & Sexuality', label: 'Gender & Sexuality' },
    { value: 'Legal Rights', label: 'Legal Rights' },
    { value: 'Youth Education', label: 'Youth Education' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleDownload = (videoId: string) => {
    setDownloadedVideos(prev => [...prev, videoId]);
    // In a real app, this would trigger actual video download
  };

  const handlePlay = (video: Video) => {
    // In a real app, this would open the video player
    console.log('Playing video:', video.title);
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'STI Prevention':
        return Shield;
      case 'Contraception':
        return Heart;
      case 'Reproductive Health':
        return BookOpen;
      case 'Mental Health':
        return Users;
      case 'Gender & Sexuality':
        return Users;
      case 'Legal Rights':
        return Shield;
      case 'Youth Education':
        return BookOpen;
      default:
        return Play;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Educational Videos" 
        subtitle="Learn about SRHR through expert videos"
      />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="card mb-6 sm:mb-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search videos, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 text-sm sm:text-base"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field text-sm sm:text-base"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="input-field text-sm sm:text-base"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Offline Status */}
                <div className="flex items-end">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg w-full">
                    {isOnline ? (
                      <Wifi className="w-5 h-5 text-green-500" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {isOnline ? 'Online' : 'Offline Mode'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Showing {filteredVideos.length} of {videos.length} videos
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video) => {
              const CategoryIcon = getCategoryIcon(video.category);
              const isDownloaded = downloadedVideos.includes(video.id);
              
              return (
                <div key={video.id} className="card group hover:shadow-xl transition-all duration-300">
                  {/* Video Thumbnail */}
                  <div className="relative mb-4">
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CategoryIcon className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Video Thumbnail</p>
                      </div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <button
                      onClick={() => handlePlay(video)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Play className="w-6 h-6 text-primary-600 ml-1" />
                      </div>
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>

                    {/* Offline Badge */}
                    {video.isOfflineAvailable && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Offline
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="space-y-3">
                    {/* Title and Category */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="w-4 h-4 text-primary-600" />
                        <span className="text-xs text-gray-500">{video.category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(video.difficulty)}`}>
                          {video.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatViews(video.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{video.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{video.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handlePlay(video)}
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Watch</span>
                      </button>
                      
                      {video.isOfflineAvailable && (
                        <button
                          onClick={() => handleDownload(video.id)}
                          disabled={isDownloaded}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDownloaded
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No videos found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Offline Notice */}
          {!isOnline && (
            <div className="mt-6 sm:mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <WifiOff className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">Offline Mode</h4>
                  <p className="text-yellow-800 text-xs sm:text-sm mb-3 leading-relaxed">
                    You're currently offline. Only downloaded videos and offline-available content can be accessed.
                    Download videos when online to watch them later.
                  </p>
                  <div className="text-yellow-700 text-xs sm:text-sm">
                    <p>• Downloaded videos: {downloadedVideos.length}</p>
                    <p>• Offline-available videos: {videos.filter(v => v.isOfflineAvailable).length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Videos;
