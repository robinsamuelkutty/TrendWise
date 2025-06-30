"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data - replace with real API calls
const mockArticles = [
  {
    id: '1',
    title: 'The Future of AI in Web Development: Trends to Watch in 2025',
    slug: 'future-of-ai-web-development-2025',
    excerpt: 'Explore how artificial intelligence is revolutionizing web development and what developers need to know for the future.',
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    publishedAt: new Date('2025-01-10'),
    readTime: 8,
    tags: ['AI', 'Web Development', 'Technology'],
    trending: true,
  },
  {
    id: '2',
    title: 'Remote Work Revolution: How Companies Are Adapting in 2025',
    slug: 'remote-work-revolution-2025',
    excerpt: 'An in-depth look at how the remote work landscape continues to evolve and shape the future of business.',
    featuredImage: 'https://images.pexels.com/photos/4050312/pexels-photo-4050312.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      name: 'Marcus Johnson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    publishedAt: new Date('2025-01-09'),
    readTime: 6,
    tags: ['Remote Work', 'Business', 'Future of Work'],
    trending: false,
  },
  {
    id: '3',
    title: 'Sustainable Tech: Green Innovation Leading the Industry',
    slug: 'sustainable-tech-green-innovation-2025',
    excerpt: 'Discover how technology companies are prioritizing sustainability and creating eco-friendly solutions.',
    featuredImage: 'https://images.pexels.com/photos/9800031/pexels-photo-9800031.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      name: 'Elena Rodriguez',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    publishedAt: new Date('2025-01-08'),
    readTime: 7,
    tags: ['Sustainability', 'Technology', 'Innovation'],
    trending: true,
  },
];

export function FeaturedArticles() {
  const [articles, setArticles] = useState(mockArticles);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Articles</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dive into our latest AI-generated insights on trending topics across technology, business, and innovation.
        </p>
      </div>

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
                {article.trending && (
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
                      <span>{formatDistanceToNow(article.publishedAt)} ago</span>
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
    </section>
  );
}