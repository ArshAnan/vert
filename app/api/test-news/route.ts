import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(_request: NextRequest) {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
  
  console.log('Test endpoint called');
  console.log('NEWS_API_KEY exists:', !!NEWS_API_KEY);
  console.log('NEWS_API_KEY length:', NEWS_API_KEY ? NEWS_API_KEY.length : 0);
  
  if (!NEWS_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'NEWS_API_KEY not configured',
      message: 'Please add NEWS_API_KEY to your environment variables'
    });
  }
  
  try {
    console.log('Testing News API connection...');
    
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        category: 'general',
        country: 'us',
        page: 1,
        pageSize: 1, // Just get one article for testing
      },
    });
    
    console.log('News API test successful');
    
    return NextResponse.json({
      success: true,
      message: 'News API is working correctly',
      data: {
        status: response.status,
        totalResults: response.data.totalResults,
        articlesCount: response.data.articles?.length || 0,
        firstArticleTitle: response.data.articles?.[0]?.title || 'No articles found'
      }
    });
    
  } catch (error) {
    console.error('News API test failed:', error);
    
    if (axios.isAxiosError(error)) {
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      };
      
      console.error('Error details:', errorDetails);
      
      return NextResponse.json({
        success: false,
        error: 'News API test failed',
        details: errorDetails
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown error occurred',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 