import { Metadata } from 'next';
import { TrendingTopics } from '@/components/sections/trending-topics';

export const metadata: Metadata = {
  title: 'Trending Topics - TrendWise',
  description: 'Discover the latest trending topics and generate AI-powered articles from real-time insights.',
  keywords: ['trending', 'topics', 'AI', 'content generation', 'real-time'],
};

export default function TrendingPage() {
  return (
    <div className="min-h-screen">
      <TrendingTopics />
    </div>
  );
}