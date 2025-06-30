"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/lib/api/articles';

export function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<any>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles?limit=3');
      const data = await response.json();
      
      console.log('API Response:', data);
      setDebugInfo(data);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.error || 'Unknown error'}`);
      }
      
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const testGemini = async () => {
    setTestingGemini(true);
    try {
      const response = await fetch('/api/test-openai');
      const result = await response.json();
      setGeminiStatus(result);
      console.log('Gemini test result:', result);
    } catch (error) {
      console.error('Error testing Gemini:', error);
      setGeminiStatus({ error: 'Failed to test Gemini connection' });
    } finally {
      setTestingGemini(false);
    }
  };

  const generateRandomArticles = async (count = 3) => {
    setGenerating(true);
    try {
      for (let i = 0; i < count; i++) {
        const response = await fetch('/api/articles/random', {
          method: 'POST',
        });

        const result = await response.json();
        console.log('Generated random article:', result);
      }

      // Refresh articles after generation
      await fetchArticles();
    } catch (error) {
      console.error('Error generating random articles:', error);
      setError('Failed to generate random articles');
    } finally {
      setGenerating(false);
    }
  };

  const generateSampleArticles = async () => {
    await generateRandomArticles(3);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Articles</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dive into our latest AI-generated insights on trending topics across technology, business, and innovation.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <CardHeader className="space-y-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <AlertCircle className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Error Loading Articles</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          {debugInfo && (
            <details className="text-left bg-muted p-4 rounded-lg max-w-2xl mx-auto">
              <summary className="cursor-pointer font-medium">Debug Information</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={fetchArticles}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={testGemini} variant="outline" disabled={testingGemini}>
              {testingGemini ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Gemini Connection'
              )}
            </Button>
          </div>
          {geminiStatus && (
            <div className="mt-4 p-4 bg-muted rounded-lg max-w-2xl mx-auto">
              <h4 className="font-medium mb-2">Gemini Status:</h4>
              <pre className="text-xs overflow-auto text-left">
                {JSON.stringify(geminiStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg text-muted-foreground">No articles available yet.</p>
          <p className="text-sm text-muted-foreground">Generate some sample articles using Gemini AI!</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={generateSampleArticles} 
              disabled={generating}
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Random Articles...
                </>
              ) : (
                'Generate Random Articles'
              )}
            </Button>
            <Button 
              onClick={() => generateRandomArticles(1)} 
              disabled={generating}
              variant="outline"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Single Article'
              )}
            </Button>
            <Button onClick={testGemini} variant="outline" disabled={testingGemini}>
              {testingGemini ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Gemini'
              )}
            </Button>
          </div>
          {geminiStatus && (
            <div className="mt-4 p-4 bg-muted rounded-lg max-w-2xl mx-auto">
              <h4 className="font-medium mb-2">Gemini Connection Status:</h4>
              <pre className="text-xs overflow-auto text-left">
                {JSON.stringify(geminiStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
}