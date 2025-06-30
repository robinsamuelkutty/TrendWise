import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingTopics } from '@/lib/services/trending';
import { generateArticleContent } from '@/lib/services/ai-content';
import { createArticle } from '@/lib/api/articles';

export async function GET() {
  try {
    const trendingTopics = await fetchTrendingTopics();
    return NextResponse.json(trendingTopics);
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    );
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