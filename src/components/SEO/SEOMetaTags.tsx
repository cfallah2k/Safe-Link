import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title = 'SafeLink - Anonymous SRHR Platform for Youth',
  description = 'Anonymous, inclusive, and scalable Sexual and Reproductive Health and Rights platform for youth. Get safe access to SRHR information, education, and support in Liberia and West Africa.',
  keywords = [
    'SRHR', 'sexual health', 'reproductive health', 'youth', 'Liberia', 'West Africa',
    'anonymous', 'safe space', 'health education', 'emergency support', 'QR code verification',
    'mobile health', 'PWA', 'offline access', 'privacy', 'confidential', 'safe link'
  ],
  image = 'https://safelink.netlify.app/logo512.png',
  url = 'https://safelink.netlify.app',
  type = 'website',
  author = 'SafeLink Team',
  publishedTime,
  modifiedTime,
  section = 'Health & Wellness',
  tags = ['SRHR', 'Youth Health', 'Mobile Health', 'Emergency Support']
}) => {
  const fullTitle = title.includes('SafeLink') ? title : `${title} | SafeLink`;
  const fullUrl = url.startsWith('http') ? url : `https://safelink.netlify.app${url}`;
  const fullImage = image.startsWith('http') ? image : `https://safelink.netlify.app${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="target" content="all" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SafeLink" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_FR" />
      <meta property="og:locale:alternate" content="es_ES" />
      
      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@SafeLink" />
      <meta name="twitter:creator" content="@SafeLink" />

      {/* Mobile and PWA Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SafeLink" />
      <meta name="application-name" content="SafeLink" />
      <meta name="msapplication-TileColor" content="#10B981" />
      <meta name="msapplication-TileImage" content="/logo192.png" />
      <meta name="theme-color" content="#10B981" />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/logo192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/logo512.png" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SafeLink",
          "alternateName": "Safe-Linkz",
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Organization",
            "name": "SafeLink Team",
            "url": "https://safelink.netlify.app"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SafeLink",
            "url": "https://safelink.netlify.app"
          },
          "datePublished": publishedTime || "2024-12-19",
          "dateModified": modifiedTime || "2024-12-19",
          "inLanguage": "en",
          "isAccessibleForFree": true,
          "featureList": [
            "Anonymous SRHR Chatbot",
            "Emergency Support",
            "QR Code Verification",
            "Offline Access",
            "Mobile App Download",
            "Health Tracking",
            "Clinic Finder",
            "Educational Games"
          ],
          "screenshot": fullImage,
          "softwareVersion": "2.0",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "permissions": "Camera access for QR scanning, Location access for emergency services",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150",
            "bestRating": "5",
            "worstRating": "1"
          }
        })}
      </script>

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="LR" />
      <meta name="geo.placename" content="Liberia" />
      <meta name="geo.position" content="6.4281;-9.4295" />
      <meta name="ICBM" content="6.4281, -9.4295" />
      
      {/* Health and Medical Keywords */}
      <meta name="subject" content="Sexual and Reproductive Health and Rights" />
      <meta name="classification" content="Health & Wellness" />
      <meta name="category" content="Medical, Health, Education" />
      
      {/* Security and Privacy */}
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Helmet>
  );
};

export default SEOMetaTags;
