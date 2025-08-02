import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export async function POST(request: NextRequest) {
  if (!PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: 'Perplexity API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message, articleTitle, articleContent, articleDescription } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create a context-aware prompt that leverages Perplexity's web search capabilities
    const systemPrompt = `You are a helpful AI assistant that answers questions about news articles and can access real-time information from the web when needed. 

You have access to the following article:
Title: ${articleTitle}
Description: ${articleDescription}
Content: ${articleContent || 'Content not available'}

Please provide informative, accurate responses about this article. If the user asks about information not covered in the article, you can search the web for the latest information. Keep responses concise but helpful.`;

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        return_citations: true,
        return_images: false,
        return_related_questions: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from Perplexity API');
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Perplexity API error:', error);
    
    // Fallback response if Perplexity fails
    const fallbackResponses = [
      `I'd be happy to discuss this article with you, but I'm currently experiencing technical difficulties. Please try again in a moment.`,
      `That's an interesting question about this article. Unfortunately, I'm having trouble accessing my AI capabilities right now.`,
      `I apologize, but I'm unable to process your question about this news story at the moment. Please try again later.`,
    ];

    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return NextResponse.json({ 
      response: fallbackResponse,
      fallback: true 
    });
  }
}