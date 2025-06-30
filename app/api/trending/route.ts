import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingTopics } from '@/lib/services/trending';
import { generateArticleContent } from '@/lib/services/ai-content';
import { createArticle } from '@/lib/api/articles';

export async function GET() {
  try {
    const trendingTopics = await fetchTrendingTopics();
    return NextResponse.json({ topics: trendingTopics || [] });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    // Return mock data if API fails
    const mockTopics = [
      {
        id: '1',
        topic: 'Artificial Intelligence in 2025',
        searchVolume: 150000,
        growth: '+25%',
        category: 'Technology',
        relatedQueries: ['AI trends', 'machine learning 2025', 'AI applications']
      },
      {
        id: '2',
        topic: 'Remote Work Technologies',
        searchVolume: 120000,
        growth: '+18%',
        category: 'Business',
        relatedQueries: ['remote work tools', 'hybrid work', 'collaboration software']
      },
      {
        id: '3',
        topic: 'Sustainable Energy Solutions',
        searchVolume: 95000,
        growth: '+30%',
        category: 'Environment',
        relatedQueries: ['renewable energy', 'solar power', 'green technology']
      }
    ];
    return NextResponse.json({ topics: mockTopics });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }
    
    // Generate AI content for the trending topic
    const articleData = await generateArticleContent(topic);
    
    // Create the article in the database
    const article = await createArticle(articleData);
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error generating article from trending topic:', error);
    return NextResponse.json(
      { error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}