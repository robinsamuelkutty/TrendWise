import { Metadata } from 'next';
import { getArticles } from '@/lib/api/articles';
import { ArticlesList } from '@/components/articles/articles-list';
import { SearchBar } from '@/components/articles/search-bar';

export const metadata: Metadata = {
  title: 'Articles - TrendWise',
  description: 'Browse all articles on trending topics in technology, business, and innovation.',
  keywords: ['articles', 'blog', 'trends', 'technology', 'business', 'innovation'],
};

interface ArticlesPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  
  const articlesData = await getArticles({ page, limit: 12, search });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">All Articles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of AI-generated insights on trending topics across technology, business, and innovation.
          </p>
        </div>
        
        <SearchBar initialSearch={search} />
        
        <ArticlesList 
          articles={articlesData.articles}
          totalPages={articlesData.totalPages}
          currentPage={page}
          searchQuery={search}
        />
      </div>
    </div>
  );
}