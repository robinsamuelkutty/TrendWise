"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Zap, RefreshCw } from 'lucide-react';

export function TrendingTopics() {
  const [topics, setTopics] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const response = await fetch('/api/trending');
        const data = await response.json();
        setTopics(data.topics || []);
      } catch (error) {
        console.error('Error fetching trending topics:', error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/trending');
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error('Error refreshing trending topics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Trending Topics</h2>
            <p className="text-lg text-muted-foreground">
              Real-time insights into what's capturing global attention
            </p>
          </div>

          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <Card key={topic.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary">{topic.category}</Badge>
                      <CardTitle className="text-lg leading-tight">{topic.topic}</CardTitle>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">{topic.change}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Trend Score Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Trend Score</span>
                      <span className="font-medium">{topic.trendScore}/100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${topic.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${topic.trendScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {topic.articles} articles
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs h-8 px-3">
                      <Zap className="mr-1 h-3 w-3" />
                      Generate Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No trending topics available yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for trending content!</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Trending Topics
          </Button>
        </div>
      </div>
    </section>
  );
}