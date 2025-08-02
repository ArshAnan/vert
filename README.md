# Vert - News App with AI Chat

A modern news application built with Next.js that features real-time news feeds and AI-powered chat functionality using Perplexity's Sonar API for web-enabled conversations.

## Features

- **Real-time News Feed**: Get the latest news from various categories
- **AI Chat with Web Search**: Ask questions about news articles and get real-time information from the web
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Web-Enabled AI**: Powered by Perplexity's Sonar API for access to current information

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Perplexity Sonar API (with web search capabilities)
- **News**: NewsAPI.org
- **Icons**: Lucide React

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vert
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```

4. **Get API Keys**
   - **Perplexity API**: Sign up at [Perplexity AI](https://www.perplexity.ai/) and get your API key
   - **News API**: Sign up at [NewsAPI.org](https://newsapi.org/) and get your API key

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Configuration

### Perplexity Sonar API
The app uses Perplexity's `sonar-medium-online` model which provides:
- Real-time web search capabilities
- Access to current information
- Enhanced context awareness for news discussions

### News API
Fetches real-time news from various sources and categories.

## Usage

1. **Browse News**: Scroll through the latest news articles
2. **Chat with AI**: Click on any article to start a conversation
3. **Ask Questions**: The AI can answer questions about the article and provide additional real-time information from the web

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PERPLEXITY_API_KEY` | Your Perplexity AI API key | Yes |
| `NEWS_API_KEY` | Your NewsAPI.org API key | Yes |

## Deployment

### Vercel Deployment

1. **Push your code to GitHub**
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository
3. **Configure Environment Variables**: In your Vercel project settings, add the following environment variables:
   - `PERPLEXITY_API_KEY`: Your Perplexity AI API key
   - `NEWS_API_KEY`: Your NewsAPI.org API key
4. **Deploy**: Vercel will automatically deploy your app

### Important Notes

- **Without API Keys**: If you don't configure the API keys, the app will show sample news articles instead of real news
- **Chat Functionality**: The chat feature requires the `PERPLEXITY_API_KEY` to work properly
- **Real News**: To get real news articles, you must configure the `NEWS_API_KEY`

## License

MIT