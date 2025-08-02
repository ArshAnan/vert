'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, User } from 'lucide-react';
import { NewsArticle as NewsArticleType } from '@/types/news';

interface NewsArticleProps {
  article: NewsArticleType;
  isActive: boolean;
}

export default function NewsArticle({ article, isActive }: NewsArticleProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">
      {/* Background image with overlay */}
      {article.urlToImage && (
        <div className="absolute inset-0">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover opacity-30"
            priority={isActive}
            unoptimized
            onError={(e) => {
              // Hide the image container if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-20">
        {/* Source and time */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            {article.source.name}
          </span>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 leading-tight">
          {article.title}
        </h2>

        {/* Description */}
        {article.description && (
          <p className="text-gray-200 mb-4 text-base leading-relaxed line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
            <User size={14} />
            <span>By {article.author}</span>
          </div>
        )}

        {/* Read more button */}
        <button
          onClick={() => window.open(article.url, '_blank')}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full self-start hover:bg-white/30 transition-colors"
        >
          <ExternalLink size={16} />
          Read Full Article
        </button>
      </div>
    </div>
  );
}