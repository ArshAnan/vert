import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { NewsApiResponse } from '@/types/news';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: NextRequest) {
  console.log('News API route called');
  console.log('NEWS_API_KEY exists:', !!NEWS_API_KEY);
  
  if (!NEWS_API_KEY) {
    console.log('News API key not configured, returning mock data');
    // Return mock data instead of error when API key is missing
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
      },
      {
        title: "Breaking News: AI Developments",
        description: "Recent breakthroughs in artificial intelligence and machine learning technologies.",
        content: "Artificial intelligence continues to advance rapidly with new developments...",
        url: "https://example.com",
        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        source: {
          id: "ai-news",
          name: "AI News Daily"
        },
        author: "AI Reporter"
      },
      {
        title: "Climate Change Summit Results",
        description: "Global leaders reach new agreements on climate action and sustainability goals.",
        content: "The international climate summit concluded with significant commitments...",
        url: "https://example.com",
        urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        source: {
          id: "climate-news",
          name: "Environmental Times"
        },
        author: "Climate Correspondent"
      }
    ];

    return NextResponse.json({
      status: 'ok',
      totalResults: mockArticles.length,
      articles: mockArticles,
    });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const country = searchParams.get('country') || 'us';

  try {
    console.log('Making request to News API with params:', { category, country, page, pageSize });
    
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        category,
        country,
        page,
        pageSize,
      },
    });

    console.log('News API response status:', response.status);
    console.log('News API response data length:', response.data?.articles?.length || 0);
    
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
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Return detailed error information for debugging
      return NextResponse.json({
        error: 'News API request failed',
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.response?.data?.message || error.message
        }
      }, { status: 500 });
    }
    
    // Return a simple error response if the API call fails
    return NextResponse.json(
      { error: 'Failed to fetch news from external API' },
      { status: 500 }
    );
  }
}