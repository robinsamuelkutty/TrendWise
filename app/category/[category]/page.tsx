
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticles, createArticle } from '@/lib/api/articles';
import { ArticlesList } from '@/components/articles/articles-list';
import { Badge } from '@/components/ui/badge';
import { GenerateCategoryArticleButton } from '@/components/category/generate-article-button';
import { generateCategoryArticle } from '@/lib/services/ai-content';
import { Suspense } from 'react';

const categories = {
  technology: {
    name: 'Technology',
    description: 'Latest developments in tech, software, and digital innovation',
    color: 'bg-blue-500',
  },
  business: {
    name: 'Business',
    description: 'Business strategies, market insights, and entrepreneurship',
    color: 'bg-green-500',
  },
  ai: {
    name: 'Artificial Intelligence',
    description: 'AI breakthroughs, machine learning, and automation',
    color: 'bg-purple-500',
  },
  startup: {
    name: 'Startup',
    description: 'Startup stories, funding news, and entrepreneurial insights',
    color: 'bg-orange-500',
  },
  sustainability: {
    name: 'Sustainability',
    description: 'Green technology, climate solutions, and environmental innovation',
    color: 'bg-emerald-500',
  },
  health: {
    name: 'Health & Wellness',
    description: 'Healthcare technology, wellness trends, and medical innovations',
    color: 'bg-red-500',
  },
  education: {
    name: 'Education',
    description: 'EdTech, learning innovations, and educational trends',
    color: 'bg-indigo-500',
  },
  gaming: {
    name: 'Gaming',
    description: 'Gaming industry news, esports, and interactive entertainment',
    color: 'bg-pink-500',
  },
};

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = categories[params.category as keyof typeof categories];

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Articles - TrendWise`,
    description: `Explore the latest articles in ${category.name}. ${category.description}`,
    keywords: [category.name.toLowerCase(), 'articles', 'trends', 'insights'],
  };
}

async function CategoryContent({ category, currentPage }: { category: string; currentPage: number }) {
  let { articles, totalPages, currentPage: page, totalCount } = await getArticles({
    page: currentPage,
    limit: 12,
    category: category,
  });

  // If no articles exist for this category and it's the first page, generate some automatically
  if (articles.length === 0 && currentPage === 1) {
    try {
      console.log(`No articles found for category ${category}, generating automatically...`);
      
      // Generate 3 articles for this category directly
      const generatePromises = [];
      for (let i = 0; i < 3; i++) {
        const generatePromise = generateCategoryArticle(category).then(async (articleData) => {
          const articleWithCategory = {
            ...articleData,
            category: category,
          };
          return await createArticle(articleWithCategory);
        });
        generatePromises.push(generatePromise);
      }
      
      await Promise.all(generatePromises);
      
      // Fetch articles again after generation
      const updatedResult = await getArticles({
        page: currentPage,
        limit: 12,
        category: category,
      });
      
      articles = updatedResult.articles;
      totalPages = updatedResult.totalPages;
      totalCount = updatedResult.totalCount;
      
    } catch (error) {
      console.error('Error auto-generating articles for category:', error);
      // Continue with empty articles if generation fails
    }
  }

  return (
    <ArticlesList 
      articles={articles} 
      totalPages={totalPages}
      currentPage={page}
      basePath={`/category/${category}`}
      category={category}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = categories[params.category as keyof typeof categories];

  if (!category) {
    notFound();
  }

  const currentPage = parseInt(searchParams.page || '1');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="text-center space-y-6 mb-12">
        <div className="flex items-center justify-center space-x-4">
          <div className={`p-4 rounded-lg ${category.color} text-white`}>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {category.name}
            </h1>
          </div>
        </div>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {category.description}
        </p>

        
      </div>

      {/* Articles List with Loading State */}
      <Suspense fallback={<LoadingSkeleton />}>
        <CategoryContent category={params.category} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
