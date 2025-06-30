import { Hero } from '@/components/sections/hero';
import { FeaturedArticles } from '@/components/sections/featured-articles';
import { TrendingTopics } from '@/components/sections/trending-topics';
import { Newsletter } from '@/components/sections/newsletter';

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <FeaturedArticles />
      <TrendingTopics />
      <Newsletter />
    </div>
  );
}