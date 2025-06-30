
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Repeat2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Tweet {
  id: string;
  text: string;
  author: {
    username: string;
    name: string;
    profileImage: string;
  };
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
  };
  createdAt: string;
  url: string;
}

interface TrendingTweetsProps {
  topic?: string;
}

export function TrendingTweets({ topic = "AI technology" }: TrendingTweetsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/tweets?q=${encodeURIComponent(topic)}&limit=6`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tweets');
        }
        
        setTweets(data.tweets || []);
      } catch (error) {
        console.error('Error fetching tweets:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tweets');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [topic]);

  return (
    <section className="bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Trending Conversations</h2>
            <p className="text-lg text-muted-foreground">
              Latest discussions about {topic} on social media
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Unable to load tweets at this time.
            </p>
          </div>
        ) : tweets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tweets.map((tweet) => (
              <Card key={tweet.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={tweet.author.profileImage} alt={tweet.author.name} />
                        <AvatarFallback>
                          {tweet.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{tweet.author.name}</p>
                        <p className="text-xs text-muted-foreground">@{tweet.author.username}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatDistanceToNow(new Date(tweet.createdAt))} ago
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{tweet.text}</p>
                  
                  {/* Tweet Metrics */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{tweet.metrics.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Repeat2 className="h-3 w-3" />
                        <span>{tweet.metrics.retweets}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{tweet.metrics.replies}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => window.open(tweet.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No tweets found for this topic.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching for a different topic or check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
