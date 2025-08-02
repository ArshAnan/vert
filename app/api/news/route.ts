import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { NewsApiResponse } from '@/types/news';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: NextRequest) {
  if (!NEWS_API_KEY) {
    return NextResponse.json(
      { error: 'News API key not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const country = searchParams.get('country') || 'us';

  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        category,
        country,
        page,
        pageSize,
      },
    });

    const data: NewsApiResponse = response.data;

    // Filter out articles with null/missing images or content
    const filteredArticles = data.articles.filter(article => 
      article.urlToImage && 
      article.title && 
      article.description &&
      article.title !== '[Removed]' &&
      article.description !== '[Removed]'
    );

    return NextResponse.json({
      ...data,
      articles: filteredArticles,
    });

  } catch (error) {
    console.error('News API error:', error);
    
    // Return mock data if API fails
    const mockArticles = [
      {
        title: "Sample News Article Title",
        description: "This is a sample news article description. In a real app, this would be fetched from NewsAPI.",
        content: "Sample content for the news article. This would normally contain the full article text.",
        url: "https://example.com",
        urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        publishedAt: new Date().toISOString(),
        source: {
          id: "sample-source",
          name: "Sample News Source"
        },
        author: "Sample Author"
      },
      {
        title: "Another Sample Article",
        description: "This is another sample article to demonstrate the scrolling functionality.",
        content: "More sample content for demonstration purposes.",
        url: "https://example.com",
        urlToImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        source: {
          id: "sample-source-2",
          name: "Another News Source"
        },
        author: "Another Author"
      },
      {
        title: "Technology News Update",
        description: "Latest developments in technology and innovation around the world.",
        content: "Technology continues to evolve at a rapid pace...",
        url: "https://example.com",
        urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        source: {
          id: "tech-source",
          name: "Tech News"
        },
        author: "Tech Reporter"
      }
    ];

    return NextResponse.json({
      status: 'ok',
      totalResults: mockArticles.length,
      articles: mockArticles,
    });
  }
}