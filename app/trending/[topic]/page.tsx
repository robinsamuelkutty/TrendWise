import { Metadata } from 'next';
import { getArticlesByCategory, getArticlesCountByCategory } from '@/lib/api/articles'; // if you want to get totalCount
import { ArticlesList } from '@/components/articles/articles-list';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TrendingTopicPageProps {
  params: {
    topic: string;
  };
}

export async function generateMetadata({ params }: TrendingTopicPageProps): Promise<Metadata> {
  const topicName = decodeURIComponent(params.topic).replace(/-/g, ' ');
  
  return {
    title: `${topicName} - Trending Articles | TrendWise`,
    description: `Discover trending articles about ${topicName}. Stay updated with the latest insights and analysis.`,
    keywords: [topicName, 'trending', 'articles', 'news', 'insights'],
  };
}

export default async function TrendingTopicPage({ params }: TrendingTopicPageProps) {
  const topicSlug = params.topic;
  const topicName = decodeURIComponent(topicSlug).replace(/-/g, ' ');

  // Pagination setup (optional real logic)
  const currentPage = 1;
  const perPage = 10;

  // Fetch articles and total count
  const articles = await getArticlesByCategory(topicSlug, currentPage, perPage);
  const totalCount = articles.length; // ← replace with await getArticlesCountByCategory(topicSlug) if available
  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="space-y-4">
            <Link href="/trending">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Trending
              </Button>
            </Link>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <Badge className="bg-red-500 hover:bg-red-600">
                  Trending
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold capitalize">
                {topicName}
              </h1>
              <p className="text-lg text-muted-foreground">
                Latest articles and insights about {topicName}
              </p>
            </div>
          </div>
        </div>

        {/* Articles */}
        <ArticlesList
          articles={articles}
          category={topicSlug}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
