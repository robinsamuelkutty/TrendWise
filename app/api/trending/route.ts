import { NextRequest, NextResponse } from 'next/server';
import { twitterService } from '@/lib/services/twitter-trends';
import { generateArticleContent } from '@/lib/services/ai-content';
import { createArticle } from '@/lib/api/articles';

export async function GET() {
  try {
    console.log('Fetching trending topics from Twitter...');
    const trendingTopics = await twitterService.getTrendingTopics();
    return NextResponse.json({ topics: trendingTopics || [] });
  } catch (error) {
    console.error('Error fetching trending topics from Twitter:', error);
    console.log('Falling back to mock trending data...');
    // Return mock data if Twitter API fails
    const mockTopics = [
      {
        id: '1',
        topic: 'Artificial Intelligence in 2025',
        volume: 150000,
        tweetCount: '250K',
        category: 'Technology',
        change: '+25%',
        trendScore: 95,
        color: 'bg-green-500',
        articles: 15
      },
      {
        id: '2',
        topic: 'Remote Work Technologies',
        volume: 120000,
        tweetCount: '180K',
        category: 'Business',
        change: '+18%',
        trendScore: 87,
        color: 'bg-green-500',
        articles: 12
      },
      {
        id: '3',
        topic: 'Sustainable Energy Solutions',
        volume: 95000,
        tweetCount: '165K',
        category: 'Environment',
        change: '+30%',
        trendScore: 92,
        color: 'bg-green-500',
        articles: 9
      },
      {
        id: '4',
        topic: 'Blockchain Technology',
        volume: 88000,
        tweetCount: '140K',
        category: 'Technology',
        change: '+22%',
        trendScore: 84,
        color: 'bg-green-500',
        articles: 11
      },
      {
        id: '5',
        topic: 'Mental Health Awareness',
        volume: 75000,
        tweetCount: '128K',
        category: 'Health',
        change: '+15%',
        trendScore: 78,
        color: 'bg-blue-500',
        articles: 8
      },
      {
        id: '6',
        topic: 'Space Technology',
        volume: 65000,
        tweetCount: '115K',
        category: 'Science',
        change: '+12%',
        trendScore: 72,
        color: 'bg-blue-500',
        articles: 7
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