# SafeLink SRHR - Technical Implementation Guide

## 🛠️ Development Setup & Installation

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- Git
- Modern web browser
- Code editor (VS Code recommended)

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/your-org/safelink-srhr.git
cd safelink-srhr

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Environment Configuration
Create `.env.local` file:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SMS_GATEWAY_URL=http://localhost:3002

# Analytics
REACT_APP_ANALYTICS_ID=your_analytics_id

# Feature Flags
REACT_APP_ENABLE_SMS=true
REACT_APP_ENABLE_USSD=true
REACT_APP_ENABLE_VOICE_COMMANDS=true

# Development
REACT_APP_DEBUG_MODE=true
REACT_APP_MOCK_SERVICES=true
```

---

## 🏗️ Architecture Deep Dive

### Component Architecture
```
App.tsx (Root)
├── AccessibilityProvider (Context)
├── Router (Navigation)
│   ├── Navigation (Sidebar)
│   ├── Routes (Page Components)
│   │   ├── Home
│   │   ├── Games (AccessibleQuizGame)
│   │   ├── Chatbot
│   │   ├── Clinics
│   │   ├── Emergency
│   │   ├── Mentorship
│   │   ├── Tracker
│   │   ├── Settings
│   │   └── Accessibility
│   └── AccessibilityButton (Floating)
└── OfflineIndicator
```

### State Management Flow
```
User Action → Component → Context → Service → Storage
     ↓
UI Update ← Component ← Context ← Service ← Storage
```

### Data Flow Architecture
```
Frontend (React)
    ↓ HTTP/WebSocket
Backend API (Node.js/Express)
    ↓ SQL/NoSQL
Database (PostgreSQL/MongoDB)
    ↓ SMS Gateway
SMS Service (Twilio/Local)
    ↓ Push Notifications
Mobile Apps (React Native)
```

---

## 🔧 Core Services Implementation

### 1. Accessibility Service
**File**: `src/services/accessibilityService.ts`

```typescript
export class AccessibilityService {
  // Font size management
  setFontSize(size: 'small' | 'medium' | 'large' | 'extra-large') {
    const sizes = { small: '16px', medium: '20px', large: '24px', 'extra-large': '32px' };
    document.documentElement.style.setProperty('--font-size', sizes[size]);
    localStorage.setItem('fontSize', size);
  }

  // High contrast mode
  toggleHighContrast() {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', isHighContrast.toString());
    return isHighContrast;
  }

  // Color blind support
  setColorBlindFilter(filter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') {
    document.body.className = document.body.className.replace(/color-blind-\w+/g, '');
    if (filter !== 'none') {
      document.body.classList.add(`color-blind-${filter}`);
    }
    localStorage.setItem('colorBlindFilter', filter);
  }

  // Screen reader announcements
  announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}
```

### 2. SMS Service Implementation
**File**: `src/services/smsService.ts`

```typescript
export class SMSService {
  private static instance: SMSService;
  private messageQueue: SMSMessage[] = [];

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  // Send SMS message
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // In production, integrate with SMS gateway
      if (process.env.REACT_APP_MOCK_SERVICES === 'true') {
        console.log(`SMS to ${phoneNumber}: ${message}`);
        return true;
      }

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message })
      });

      return response.ok;
    } catch (error) {
      console.error('SMS send failed:', error);
      return false;
    }
  }

  // Process incoming SMS
  processSMSCommand(message: string, phoneNumber: string): string {
    const command = message.trim().toUpperCase();
    
    switch (command) {
      case 'QUIZ':
        return this.startSMSQuiz(phoneNumber);
      case 'HELP':
        return this.getHelpMessage();
      case 'STATS':
        return this.getUserStats(phoneNumber);
      case 'CLINIC':
        return this.findNearbyClinics(phoneNumber);
      case 'EMERGENCY':
        return this.getEmergencyInfo();
      default:
        return 'Invalid command. Send HELP for available commands.';
    }
  }

  private startSMSQuiz(phoneNumber: string): string {
    // Initialize quiz session
    const quizSession = {
      phoneNumber,
      currentQuestion: 0,
      score: 0,
      startTime: Date.now()
    };
    
    localStorage.setItem(`quiz_${phoneNumber}`, JSON.stringify(quizSession));
    
    return 'SRHR Quiz Started! Q1: What is the most effective way to prevent HIV? A) Condoms B) Abstinence C) Both A and B. Reply with A, B, or C.';
  }

  private getHelpMessage(): string {
    return `Available commands:
QUIZ - Start health quiz
HELP - Show this help
STATS - View your progress
CLINIC - Find nearby clinics
EMERGENCY - Emergency info
STOP - Unsubscribe`;
  }
}
```

### 3. Voice Command Service
**File**: `src/services/voiceCommandService.ts`

```typescript
export class VoiceCommandService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private commands: Map<string, () => void> = new Map();

  constructor() {
    this.initializeRecognition();
    this.setupCommands();
  }

  private initializeRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        this.executeCommand(command);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }

  private setupCommands() {
    this.commands.set('start quiz', () => {
      window.location.href = '/games';
    });
    
    this.commands.set('next question', () => {
      const nextButton = document.querySelector('[data-testid="next-question"]') as HTMLButtonElement;
      nextButton?.click();
    });
    
    this.commands.set('select option a', () => {
      const optionA = document.querySelector('[data-testid="option-a"]') as HTMLButtonElement;
      optionA?.click();
    });
    
    this.commands.set('go home', () => {
      window.location.href = '/';
    });
    
    this.commands.set('open settings', () => {
      window.location.href = '/settings';
    });
    
    this.commands.set('emergency help', () => {
      window.location.href = '/emergency';
    });
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private executeCommand(command: string): void {
    for (const [key, action] of this.commands) {
      if (command.includes(key)) {
        action();
        break;
      }
    }
  }
}
```

### 4. Offline Storage Service
**File**: `src/services/offlineStorageService.ts`

```typescript
import localforage from 'localforage';

export class OfflineStorageService {
  private static instance: OfflineStorageService;
  private storage: LocalForage;

  constructor() {
    this.storage = localforage.createInstance({
      name: 'SafeLinkSRHR',
      storeName: 'app_data',
      description: 'SafeLink SRHR offline data storage'
    });
  }

  static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  // Store data offline
  async storeData(key: string, data: any): Promise<void> {
    try {
      await this.storage.setItem(key, {
        data,
        timestamp: Date.now(),
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  }

  // Retrieve data from offline storage
  async getData(key: string): Promise<any> {
    try {
      const item = await this.storage.getItem(key);
      return item ? item.data : null;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  // Cache content for offline access
  async cacheContent(contentType: string, content: any[]): Promise<void> {
    const cacheKey = `cached_${contentType}`;
    await this.storeData(cacheKey, content);
  }

  // Get cached content
  async getCachedContent(contentType: string): Promise<any[]> {
    const cacheKey = `cached_${contentType}`;
    const content = await this.getData(cacheKey);
    return content || [];
  }

  // Clear old cache
  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const keys = await this.storage.keys();
    const now = Date.now();

    for (const key of keys) {
      const item = await this.storage.getItem(key);
      if (item && (now - item.timestamp) > maxAge) {
        await this.storage.removeItem(key);
      }
    }
  }
}
```

---

## 🎨 UI Component Implementation

### 1. Accessible Button Component
**File**: `src/components/UI/AccessibleButton.tsx`

```typescript
import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ariaLabel,
  className = ''
}) => {
  const { fontSize, largeTouchTargets } = useAccessibility();

  const getSizeClasses = () => {
    const baseSize = largeTouchTargets ? 'min-h-[44px] min-w-[44px]' : '';
    
    switch (size) {
      case 'small':
        return `${baseSize} px-3 py-1.5 text-sm`;
      case 'large':
        return `${baseSize} px-6 py-4 text-lg`;
      default:
        return `${baseSize} px-4 py-2 text-base`;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      case 'extra-large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${getFontSizeClass()}
        font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AccessibleButton;
```

### 2. Accessible Form Component
**File**: `src/components/UI/AccessibleForm.tsx`

```typescript
import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface AccessibleFormProps {
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
  className?: string;
}

const AccessibleForm: React.FC<AccessibleFormProps> = ({
  onSubmit,
  children,
  className = ''
}) => {
  const { fontSize, highContrast } = useAccessibility();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const validateForm = (formData: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Add validation logic here
    // Example: Check required fields, email format, etc.
    
    return errors;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        space-y-4
        ${highContrast ? 'border-2 border-black' : 'border border-gray-300'}
        ${className}
      `}
      noValidate
    >
      {children}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-red-50 border border-red-200 rounded-md p-4"
        >
          <h3 className="text-sm font-medium text-red-800">
            Please correct the following errors:
          </h3>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default AccessibleForm;
```

---

## 🔐 Security Implementation

### 1. Input Sanitization
**File**: `src/utils/security.ts`

```typescript
import DOMPurify from 'dompurify';

export class SecurityUtils {
  // Sanitize HTML input
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input);
  }

  // Sanitize user input for display
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  // Rate limiting for API calls
  static rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Remove old requests outside the window
    const validRequests = requests.filter((time: number) => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    validRequests.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
    
    return true;
  }
}
```

### 2. Content Security Policy
**File**: `public/index.html` (add to head)

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.safelink-srhr.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

---

## 📱 PWA Implementation

### 1. Service Worker
**File**: `public/sw.js`

```javascript
const CACHE_NAME = 'safelink-srhr-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline data when connection is restored
  const offlineData = await getOfflineData();
  for (const data of offlineData) {
    await syncData(data);
  }
}
```

### 2. Web App Manifest
**File**: `public/manifest.json`

```json
{
  "short_name": "SafeLink SRHR",
  "name": "SafeLink Sexual and Reproductive Health and Rights",
  "description": "Anonymous, accessible SRHR platform for youth in Liberia",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "categories": ["health", "education", "social"],
  "lang": "en",
  "dir": "ltr"
}
```

---

## 🧪 Testing Implementation

### 1. Unit Test Example
**File**: `src/components/__tests__/AccessibleButton.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';
import AccessibleButton from '../UI/AccessibleButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AccessibilityProvider>
      {component}
    </AccessibilityProvider>
  );
};

describe('AccessibleButton', () => {
  test('renders button with correct text', () => {
    renderWithProvider(
      <AccessibleButton onClick={() => {}}>
        Test Button
      </AccessibleButton>
    );
    
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithProvider(
      <AccessibleButton onClick={handleClick}>
        Test Button
      </AccessibleButton>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies large touch targets when enabled', () => {
    renderWithProvider(
      <AccessibleButton onClick={() => {}}>
        Test Button
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
  });

  test('is disabled when disabled prop is true', () => {
    renderWithProvider(
      <AccessibleButton onClick={() => {}} disabled>
        Test Button
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### 2. Integration Test Example
**File**: `src/__tests__/QuizGame.integration.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import AccessibleQuizGame from '../components/Games/AccessibleQuizGame';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AccessibilityProvider>
        {component}
      </AccessibilityProvider>
    </BrowserRouter>
  );
};

describe('Quiz Game Integration', () => {
  test('complete quiz flow', async () => {
    renderWithProviders(<AccessibleQuizGame />);
    
    // Start quiz
    const startButton = screen.getByRole('button', { name: /start quiz/i });
    fireEvent.click(startButton);
    
    // Answer questions
    await waitFor(() => {
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
    });
    
    const optionA = screen.getByRole('button', { name: /option a/i });
    fireEvent.click(optionA);
    
    // Navigate through questions
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Complete quiz
    await waitFor(() => {
      expect(screen.getByText(/quiz completed/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 Deployment Guide

### 1. Netlify Deployment
**File**: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Environment Variables
Set in Netlify dashboard:
```
REACT_APP_API_URL=https://api.safelink-srhr.com
REACT_APP_SMS_GATEWAY_URL=https://sms.safelink-srhr.com
REACT_APP_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_ENABLE_SMS=true
REACT_APP_ENABLE_USSD=true
REACT_APP_ENABLE_VOICE_COMMANDS=true
```

### 3. Build Optimization
**File**: `package.json` (scripts section)

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx bundle-analyzer build/static/js/*.js",
    "build:production": "NODE_ENV=production npm run build",
    "preview": "serve -s build -l 3000"
  }
}
```

---

## 📊 Performance Monitoring

### 1. Performance Metrics
**File**: `src/utils/performance.ts`

```typescript
export class PerformanceMonitor {
  // Measure Core Web Vitals
  static measureWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Measure custom metrics
  static measureCustomMetric(name: string, startTime: number) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${name}: ${duration}ms`);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration)
      });
    }
  }
}
```

### 2. Error Tracking
**File**: `src/utils/errorTracking.ts`

```typescript
export class ErrorTracker {
  static init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  static logError(type: string, error: any) {
    console.error(type, error);
    
    // Send to error tracking service
    if (process.env.REACT_APP_ERROR_TRACKING_URL) {
      fetch(process.env.REACT_APP_ERROR_TRACKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          error,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.error);
    }
  }
}
```

---

## 🔧 Development Tools

### 1. VS Code Extensions
Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### 2. VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 3. Git Hooks
**File**: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run test -- --watchAll=false
npm run build
```

---

This technical implementation guide provides detailed code examples and implementation strategies for building a robust, accessible, and scalable SRHR platform. The guide covers everything from basic setup to advanced features like PWA implementation, security measures, and performance monitoring.

Each section includes practical code examples that can be directly implemented in the SafeLink SRHR application, ensuring that developers have clear guidance on how to build each feature according to best practices and accessibility standards.
