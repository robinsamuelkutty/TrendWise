"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  BarChart3, 
  Clock, 
  FileText, 
  TrendingUp,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowStats {
  totalArticles: number;
  articlesThisWeek: number;
  popularTags: string[];
  recentArticles: Array<{
    title: string;
    slug: string;
    publishedAt: string;
    views: number;
  }>;
}

interface WorkflowResult {
  success: boolean;
  articlesGenerated: number;
  errors: string[];
  generatedArticles: Array<{
    id: string;
    title: string;
    slug: string;
    topic: string;
  }>;
}

export function WorkflowDashboard() {
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<WorkflowResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/workflow');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch workflow statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    toast.info('Starting AI content generation workflow...');

    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxTopics: 3,
          wordCount: 1500,
          includeImages: true,
          includeTweets: true,
          includeVideos: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLastResult(result);
        
        if (result.success) {
          toast.success(`Successfully generated ${result.articlesGenerated} articles!`);
          fetchStats(); // Refresh stats
        } else {
          toast.error('Workflow completed with errors');
        }
      } else {
        toast.error('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Error running workflow:', error);
      toast.error('Error running workflow');
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>AI Workflow Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={runWorkflow}
              disabled={isRunning}
              className="flex items-center space-x-2"
              size="lg"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Running Workflow...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run AI Workflow</span>
                </>
              )}
            </Button>
            
            <Button 
              onClick={fetchStats}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Stats</span>
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The AI workflow will collect trending topics, generate SEO-optimized articles with embedded media, 
              and save them to the database. This process typically takes 5-10 minutes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Last Workflow Result */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>Last Workflow Result</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {lastResult.articlesGenerated}
                </div>
                <div className="text-sm text-muted-foreground">Articles Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {lastResult.generatedArticles.length}
                </div>
                <div className="text-sm text-muted-foreground">Topics Processed</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${lastResult.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {lastResult.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {lastResult.generatedArticles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Generated Articles:</h4>
                {lastResult.generatedArticles.map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium text-sm">{article.title}</div>
                      <div className="text-xs text-muted-foreground">Topic: {article.topic}</div>
                    </div>
                    <Badge variant="secondary">{article.slug}</Badge>
                  </div>
                ))}
              </div>
            )}

            {lastResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                {lastResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Articles</p>
                    <p className="text-3xl font-bold">{stats.totalArticles}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-3xl font-bold">{stats.articlesThisWeek}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Popular Tags</p>
                    <p className="text-3xl font-bold">{stats.popularTags.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.popularTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentArticles.map((article) => (
                  <div key={article.slug} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{article.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Published {new Date(article.publishedAt).toLocaleDateString()}</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/article/${article.slug}`} target="_blank">
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}