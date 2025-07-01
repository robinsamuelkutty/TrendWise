"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Eye, TrendingUp, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/lib/api/articles';

interface ArticlesListProps {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  searchQuery?: string;
  basePath?: string;
  category?: string;
}

function ViewMoreButton({ category }: { category: string }) {
  const handleViewMore = async () => {
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
      console.error('Error generating more articles:', error);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <Button onClick={handleViewMore} variant="outline" size="lg" className="px-8">
        <Plus className="h-4 w-4 mr-2" />
        View More
      </Button>
    </div>
  );
}

export function ArticlesList({ articles, totalPages, currentPage, searchQuery, basePath = '/articles', category }: ArticlesListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="text-6xl">📝</div>
          <h3 className="text-2xl font-semibold">No articles found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery 
              ? `No articles match your search for "${searchQuery}". Try different keywords.`
              : "We're working on creating amazing content for you. Check back soon!"
            }
          </p>
          {searchQuery && (
            <Button asChild variant="outline">
              <Link href="/articles">View All Articles</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {searchQuery 
            ? `Found ${articles.length} articles for "${searchQuery}"`
            : `Showing ${articles.length} articles`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
              <div className="relative overflow-hidden">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.views > 1000 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Trending
                  </Badge>
                )}
              </div>
              
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {article.excerpt}
                </p>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={article.author.avatar} alt={article.author.name} />
                      <AvatarFallback>
                        {article.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{article.author.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(article.publishedAt))} ago</span>
                    </div>
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* View More Button for Category Pages */}
      {category && (
        <ViewMoreButton category={category} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`${basePath}?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </>
            )}
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`${basePath}?page=${pageNum}${searchQuery ? `&search=${searchQuery}` : ''}`}>
                    {pageNum}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`${basePath}?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}