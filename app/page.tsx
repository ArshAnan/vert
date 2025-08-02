import NewsFeed from '@/components/NewsFeed';
import { NewsArticle } from '@/types/news';

async function getInitialNews(): Promise<NewsArticle[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/news?pageSize=5`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.articles || [];
  } catch (error) {
    console.error('Failed to fetch initial news:', error);
    
    // Return fallback articles if API fails
    return [
      {
        title: "Welcome to Vert News",
        description: "Your TikTok-style news experience starts here. Scroll through the latest headlines and ask questions about any article.",
        content: "This is a demo news app that provides a TikTok-like experience for consuming news content.",
        url: "https://example.com",
        urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        publishedAt: new Date().toISOString(),
        source: {
          id: "vert-news",
          name: "Vert News"
        },
        author: "Vert Team"
      }
    ];
  }
}

export default async function Home() {
  const initialArticles = await getInitialNews();

  return <NewsFeed initialArticles={initialArticles} />;
}
