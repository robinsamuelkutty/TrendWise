"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Zap, RefreshCw } from 'lucide-react';

// Mock trending topics data
const mockTrendingTopics = [
  {
    id: '1',
    topic: 'AI-Powered Code Generation',
    category: 'Technology',
    trendScore: 95,
    change: '+15%',
    articles: 12,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    topic: 'Quantum Computing Breakthroughs',
    category: 'Science',
    trendScore: 88,
    change: '+22%',
    articles: 8,
    color: 'bg-purple-500',
  },
  {
    id: '3',
    topic: 'Sustainable Energy Solutions',
    category: 'Environment',
    trendScore: 82,
    change: '+8%',
    articles: 15,
    color: 'bg-green-500',
  },
  {
    id: '4',
    topic: 'Web3 and Decentralization',
    category: 'Blockchain',
    trendScore: 76,
    change: '+5%',
    articles: 9,
    color: 'bg-orange-500',
  },
  {
    id: '5',
    topic: 'Mental Health Tech',
    category: 'Healthcare',
    trendScore: 71,
    change: '+18%',
    articles: 6,
    color: 'bg-pink-500',
  },
  {
    id: '6',
    topic: 'AR/VR in Education',
    category: 'Education',
    trendScore: 68,
    change: '+12%',
    articles: 11,
    color: 'bg-indigo-500',
  },
];

export function TrendingTopics() {
  const [topics, setTopics] = useState(mockTrendingTopics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
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