
import { NextRequest, NextResponse } from 'next/server';
import { generateArticleContent } from '@/lib/services/ai-content';
import { createArticle } from '@/lib/api/articles';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('Generating article for topic:', topic);
    
    // Generate article content using OpenAI
    const articleData = await generateArticleContent(topic);
    
    if (!articleData) {
      return NextResponse.json(
        { error: 'Failed to generate article content' },
        { status: 500 }
      );
    }

    // Save to database
    const savedArticle = await createArticle(articleData);
    
    return NextResponse.json({
      success: true,
      article: savedArticle,
      message: 'Article generated successfully'
    });
    
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
