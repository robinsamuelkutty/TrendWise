"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  MoreHorizontal,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { WorkflowDashboard } from './workflow-dashboard';

export function AdminDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    toast.info('Generating content from trending topics...');

    // Simulate content generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Successfully generated 3 new articles!');
    }, 3000);
  };

  const stats = [
    {
      title: 'Total Articles',
      value: '1,247',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Monthly Views',
      value: '45.2K',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: '2,891',
      change: '+7%',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Trending Topics',
      value: '23',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  const recentArticles = [
    {
      id: '1',
      title: 'The Future of AI in Web Development',
      status: 'published',
      views: 1205,
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Remote Work Revolution in 2025',
      status: 'draft',
      views: 0,
      createdAt: '4 hours ago',
    },
    {
      id: '3',
      title: 'Sustainable Tech Innovation',
      status: 'published',
      views: 892,
      createdAt: '6 hours ago',
    },
  ];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">AI Workflow</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating Content...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate from Trending Topics</span>
                </>
              )}
            </Button>

            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Manual Article
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center space-x-1 text-sm text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{article.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Created {article.createdAt}</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={article.status === 'published' ? 'default' : 'secondary'}
                      >
                        {article.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <WorkflowDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Workflow Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {process.env.OPENAI_API_KEY ? '••••••••••••••••' : 'Not configured'}
                    </div>
                    <Badge variant={process.env.OPENAI_API_KEY ? 'default' : 'destructive'}>
                      {process.env.OPENAI_API_KEY ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">MongoDB Connection</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {process.env.MONGODB_URI ? 'Connected' : 'Not configured'}
                    </div>
                    <Badge variant={process.env.MONGODB_URI ? 'default' : 'destructive'}>
                      {process.env.MONGODB_URI ? 'Connected' : 'Missing'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter API</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {process.env.TWITTER_API_KEY ? 'Configured' : 'Not configured'}
                    </div>
                    <Badge variant={process.env.TWITTER_API_KEY ? 'default' : 'destructive'}>
                      {process.env.TWITTER_API_KEY ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Unsplash API</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {process.env.UNSPLASH_ACCESS_KEY ? 'Configured' : 'Not configured'}
                    </div>
                    <Badge variant={process.env.UNSPLASH_ACCESS_KEY ? 'default' : 'destructive'}>
                      {process.env.UNSPLASH_ACCESS_KEY ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rebuild Indexes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}