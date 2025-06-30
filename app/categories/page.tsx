import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Laptop, 
  Briefcase, 
  Brain, 
  Rocket, 
  Leaf, 
  Heart, 
  GraduationCap, 
  Gamepad2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories - TrendWise',
  description: 'Explore articles by category. Discover trending topics in technology, business, AI, startups, and more.',
  keywords: ['categories', 'topics', 'technology', 'business', 'AI', 'startups', 'innovation'],
};

const categories = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Latest developments in tech, software, and digital innovation',
    icon: Laptop,
    color: 'bg-blue-500',
    articleCount: 156,
    trending: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Business strategies, market insights, and entrepreneurship',
    icon: Briefcase,
    color: 'bg-green-500',
    articleCount: 89,
    trending: false,
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'AI breakthroughs, machine learning, and automation',
    icon: Brain,
    color: 'bg-purple-500',
    articleCount: 124,
    trending: true,
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Startup stories, funding news, and entrepreneurial insights',
    icon: Rocket,
    color: 'bg-orange-500',
    articleCount: 67,
    trending: false,
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    description: 'Green technology, climate solutions, and environmental innovation',
    icon: Leaf,
    color: 'bg-emerald-500',
    articleCount: 43,
    trending: true,
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Healthcare technology, wellness trends, and medical innovations',
    icon: Heart,
    color: 'bg-red-500',
    articleCount: 78,
    trending: false,
  },
  {
    id: 'education',
    name: 'Education',
    description: 'EdTech, learning innovations, and educational trends',
    icon: GraduationCap,
    color: 'bg-indigo-500',
    articleCount: 52,
    trending: false,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Gaming industry news, esports, and interactive entertainment',
    icon: Gamepad2,
    color: 'bg-pink-500',
    articleCount: 34,
    trending: false,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Explore Categories</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover trending topics and insights across various industries and domains. 
          Find articles that match your interests and stay updated with the latest developments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {category.trending && (
                      <Badge className="bg-red-500 hover:bg-red-600">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.articleCount} articles
                    </span>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Featured Categories Section */}
      <div className="mt-16">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold">Most Popular Categories</h2>
          <p className="text-muted-foreground">
            Explore the categories with the most engagement and trending content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories
            .filter(cat => cat.trending)
            .map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-lg ${category.color} text-white`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {category.articleCount} articles
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}