import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, Brain } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Content Generation
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Trending Insights
            </span>{' '}
            with AI
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with AI-generated articles on the latest trends in technology, 
            business, and innovation. Discover what's happening now and what's coming next.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <Link href="/articles" className="w-full sm:w-auto">
            <Button size="lg" className="px-8 py-3 text-lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              Explore Articles
            </Button>
          </Link>
          
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,000+</div>
              <div className="text-sm text-muted-foreground">Articles Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Trending Topics Daily</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Real-time Updates</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 opacity-20">
        <div className="w-72 h-72 bg-gradient-to-br from-primary to-blue-500 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-20">
        <div className="w-96 h-96 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}