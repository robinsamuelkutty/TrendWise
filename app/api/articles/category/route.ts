
import { NextRequest, NextResponse } from 'next/server';
import { generateCategoryArticle } from '@/lib/services/ai-content';
import { createArticle } from '@/lib/api/articles';

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json();
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    console.log('Generating category-specific article for:', category);
    
    // Generate category-specific article content
    const articleData = await generateCategoryArticle(category);
    
    // Add category to the article data
    const articleWithCategory = {
      ...articleData,
      category: category,
    };
    
    // Create the article in the database
    const savedArticle = await createArticle(articleWithCategory);
    
    return NextResponse.json({
      success: true,
      article: savedArticle,
      message: `${category} article generated successfully`
    });
    
  } catch (error) {
    console.error('Error generating category article:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate category article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
