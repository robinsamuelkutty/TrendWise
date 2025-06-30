
import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/api/articles';
import { generateArticleContent } from '@/lib/services/ai-content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({
        articles: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0,
        searchQuery: query,
        hasAIResults: false
      });
    }

    // First, search existing articles
    const existingResults = await getArticles({ page, limit, search: query });

    // If we have enough existing results, return them
    if (existingResults.articles.length >= 3) {
      return NextResponse.json({
        ...existingResults,
        searchQuery: query,
        hasAIResults: false
      });
    }

    // If we don't have enough existing articles, generate new ones using AI
    try {
      console.log(`Generating AI content for search query: "${query}"`);
      
      // Generate an article based on the search query
      const aiContent = await generateArticleContent(query);
      const newArticle = await createArticle(aiContent);
      
      // Combine existing results with the new AI-generated article
      const combinedArticles = [newArticle, ...existingResults.articles];
      
      return NextResponse.json({
        articles: combinedArticles.slice(0, limit),
        totalPages: Math.ceil(combinedArticles.length / limit),
        currentPage: page,
        totalCount: combinedArticles.length,
        searchQuery: query,
        hasAIResults: true,
        aiGenerated: 1
      });
      
    } catch (aiError) {
      console.error('Error generating AI content for search:', aiError);
      
      // If AI generation fails, return existing results
      return NextResponse.json({
        ...existingResults,
        searchQuery: query,
        hasAIResults: false,
        error: 'AI content generation failed, showing existing results'
      });
    }

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
