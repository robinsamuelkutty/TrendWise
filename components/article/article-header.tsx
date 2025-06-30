import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/lib/api/articles';

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={article.featuredImage} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {article.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-white/30">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback className="bg-white/20 text-white">
                      {article.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-white">
                    <div className="font-medium">{article.author.name}</div>
                    <div className="text-sm text-white/80">
                      {article.author.bio}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-white/80 text-sm">
                  <div className="flex items-center space-x-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(article.publishedAt))} ago</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-background rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                {article.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <p className="text-muted-foreground text-sm">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}