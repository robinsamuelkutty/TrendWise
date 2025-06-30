import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/lib/api/articles';

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">Related Articles</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`}>
            <div className="group space-y-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-full h-32 object-cover rounded-md group-hover:opacity-90 transition-opacity"
              />
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{article.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}