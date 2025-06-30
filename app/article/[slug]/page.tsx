import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArticleHeader } from '@/components/article/article-header';
import { ArticleContent } from '@/components/article/article-content';
import { ArticleComments } from '@/components/article/article-comments';
import { RelatedArticles } from '@/components/article/related-articles';
import { getArticleBySlug, getRelatedArticles } from '@/lib/api/articles';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.id, article.tags);

  return (
    <div className="min-h-screen">
      <ArticleHeader article={article} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ArticleContent article={article} />
              <ArticleComments articleId={article.id} />
            </div>
            
            <div className="lg:col-span-1">
              <RelatedArticles articles={relatedArticles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}