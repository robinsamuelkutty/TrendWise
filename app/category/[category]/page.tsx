
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/api/articles';
import { ArticlesList } from '@/components/articles/articles-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { generateCategoryArticle } from '@/lib/services/ai-content';

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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = categories[params.category as keyof typeof categories];
  
  if (!category) {
    notFound();
  }

  const currentPage = parseInt(searchParams.page || '1');
  const { articles, totalPages, currentPage: page, totalCount } = await getArticles({
    page: currentPage,
    limit: 12,
    category: params.category,
  });

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
        
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="secondary">
            {totalCount} articles available
          </Badge>
          
          <GenerateCategoryArticleButton category={params.category} />
        </div>
      </div>

      {/* Articles List */}
      <ArticlesList 
        articles={articles} 
        totalPages={totalPages}
        currentPage={page}
        basePath={`/category/${params.category}`}
      />
    </div>
  );
}

function GenerateCategoryArticleButton({ category }: { category: string }) {
  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/articles/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generating article:', error);
    }
  };

  return (
    <Button onClick={handleGenerate} variant="outline">
      <Plus className="h-4 w-4 mr-2" />
      Generate New Article
    </Button>
  );
}
