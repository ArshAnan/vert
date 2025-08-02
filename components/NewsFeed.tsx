'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import NewsArticle from './NewsArticle';
import Chat from './Chat';
import { NewsArticle as NewsArticleType } from '@/types/news';
import { ChevronUp, ChevronDown, RefreshCw, MessageCircle, X } from 'lucide-react';

interface NewsFeedProps {
  initialArticles: NewsArticleType[];
}

export default function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticleType[]>(initialArticles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true); // Add chat visibility state
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const currentArticle = articles[currentIndex];

  const scrollToArticle = useCallback((index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToArticle(newIndex);
    }
  }, [currentIndex, scrollToArticle]);

  const handleNext = useCallback(() => {
    if (currentIndex < articles.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToArticle(newIndex);
    }
  }, [currentIndex, articles.length, scrollToArticle]);

  const loadMoreArticles = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setArticles(prev => [...prev, ...data.articles]);
      }
    } catch (error) {
      console.error('Failed to load more articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const newIndex = Math.round(scrollTop / window.innerHeight);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }

    // Load more articles when near the end
    if (newIndex >= articles.length - 2) {
      loadMoreArticles();
    }
  }, [currentIndex, articles.length, loadMoreArticles]);

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;

    const distance = touchStartY.current - touchEndY.current;
    const isSignificantSwipe = Math.abs(distance) > 50;

    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swipe up - next article
        handleNext();
      } else {
        // Swipe down - previous article
        handlePrevious();
      }
    }

    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle navigation keys if user is typing in an input field
      const activeElement = document.activeElement as HTMLElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );

      if (isTyping) {
        return; // Allow normal typing behavior
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          setIsChatOpen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Throttled scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', throttledHandleScroll);
      return () => container.removeEventListener('scroll', throttledHandleScroll);
    }
  }, [handleScroll]);

  if (!articles.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading news articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden flex flex-col lg:flex-row">
      {/* Left half - News feed */}
      <div className={`relative transition-all duration-300 ease-in-out ${
        isChatOpen ? 'w-full lg:w-1/2' : 'w-full'
      } h-1/2 lg:h-full`}>
        {/* Main feed container */}
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {articles.map((article, index) => (
            <div key={`${article.url}-${index}`} className="snap-start">
              <NewsArticle
                article={article}
                isActive={index === currentIndex}
              />
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="h-screen flex items-center justify-center bg-black text-white">
              <RefreshCw className="animate-spin" size={32} />
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= articles.length - 1}
            className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Article counter */}
        <div className="absolute top-4 right-4 z-40 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {articles.length}
        </div>

        {/* Chat toggle button - only show when chat is closed */}
        {!isChatOpen && (
          <div className="absolute bottom-4 right-4 z-40">
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Open Chat (C)"
            >
              <MessageCircle size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Right half - Chat interface */}
      <div className={`transition-all duration-300 ease-in-out ${
        isChatOpen 
          ? 'w-full lg:w-1/2 h-1/2 lg:h-full opacity-100' 
          : 'w-0 h-0 lg:h-full opacity-0 overflow-hidden'
      } bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-700`}>
        {currentArticle && (
          <div className="relative h-full">
            {/* Chat close button */}
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
              title="Close Chat (C)"
            >
              <X size={16} />
            </button>
            
            <Chat
              articleTitle={currentArticle.title}
              articleContent={currentArticle.content || currentArticle.description || ''}
              articleKey={currentArticle.url} // Use URL as unique key to reset chat
            />
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}