
import { NextRequest, NextResponse } from 'next/server';
import { generateRandomTopic, generateArticleContent } from '@/lib/services/ai-content';
import { createArticle } from '@/lib/api/articles';

export async function POST() {
  try {
    const randomTopic = generateRandomTopic();
    
    console.log('Generating random article for topic:', randomTopic);
    
    const articleData = await generateArticleContent(randomTopic);
    const article = await createArticle(articleData);
    
    return NextResponse.json({ 
      success: true, 
      article,
      topic: randomTopic 
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating random article:', error);
    return NextResponse.json(
      { error: 'Failed to generate random article' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const randomTopic = generateRandomTopic();
    return NextResponse.json({ topic: randomTopic });
  } catch (error) {
    console.error('Error getting random topic:', error);
    return NextResponse.json(
      { error: 'Failed to get random topic' },
      { status: 500 }
    );
  }
}
