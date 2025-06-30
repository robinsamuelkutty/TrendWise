
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Search, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SearchBar } from '@/components/articles/search-bar';
import { Article } from '@/lib/api/articles';

interface SearchResults {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  searchQuery: string;
  hasAIResults: boolean;
  aiGenerated?: number;
  error?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Articles</h1>
          <SearchBar initialSearch={query} />
        </div>

        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Searching and generating relevant content...</p>
            <p className="text-sm text-muted-foreground">Using AI to find the best results for you</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-2 text-red-500 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Search Error</h3>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              onClick={() => performSearch(query)} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {results && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Search Results for "{results.searchQuery}"
                </h2>
                <p className="text-sm text-muted-foreground">
                  Found {results.totalCount} {results.totalCount === 1 ? 'article' : 'articles'}
                  {results.hasAIResults && results.aiGenerated && (
                    <span className="ml-2 inline-flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                      {results.aiGenerated} AI-generated
                    </span>
                  )}
                </p>
              </div>
            </div>

            {results.hasAIResults && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">AI-Enhanced Results</h3>
                </div>
                <p className="text-sm text-yellow-700">
                  We've generated fresh content using AI to provide you with the most relevant and up-to-date information about your search topic.
                </p>
              </div>
            )}

            {results.articles.length > 0 ? (
              <div className="grid gap-6">
                {results.articles.map((article, index) => (
                  <Link key={article.id} href={`/article/${article.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <img 
                            src={article.featuredImage} 
                            alt={article.title}
                            className="w-full h-48 md:h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="md:col-span-3">
                          <CardHeader className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {index === 0 && results.hasAIResults && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
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
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse our categories.
                </p>
              </div>
            )}
          </div>
        )}

        {!results && !loading && query && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Ready to search</h3>
            <p className="text-muted-foreground">
              Enter your search terms above to find relevant articles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
