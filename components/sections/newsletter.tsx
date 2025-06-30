"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-background to-blue-500/5 border-2">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Mail className="h-16 w-16 text-primary" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Stay Ahead of the Trends
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the latest AI-generated insights and trending topics delivered to your inbox. 
              Be the first to know what's shaping the future.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Successfully subscribed!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Weekly digest of trending topics</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-generated insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No spam, unsubscribe anytime</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}