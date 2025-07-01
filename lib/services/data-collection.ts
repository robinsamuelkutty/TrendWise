import googleTrends from 'google-trends-api';
import { TwitterApi } from 'twitter-api-v2';
import { createApi } from 'unsplash-js';
import youtubeSearch  from 'youtube-search-api';
import * as cheerio from 'cheerio';

export interface TrendingTopic {
  keyword: string;
  category: string;
  volume: number;
  source: 'google' | 'twitter';
  relatedKeywords: string[];
  region?: string;
}

export interface CollectedMedia {
  images: Array<{
    url: string;
    alt: string;
    source: string;
    photographer?: string;
  }>;
  tweets: Array<{
    id: string;
    text: string;
    author: string;
    url: string;
    engagement: number;
  }>;
  videos: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    duration: string;
    views: number;
  }>;
  articles: Array<{
    title: string;
    url: string;
    excerpt: string;
    source: string;
    publishedAt: string;
  }>;
}

export class DataCollectionService {
  private twitterClient: TwitterApi;
  private unsplashClient: any;

  constructor() {
    // Initialize Twitter API client
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Initialize Unsplash client
    this.unsplashClient = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY!,
    });
  }

  async fetchGoogleTrends(region = 'US', category = 'all'): Promise<TrendingTopic[]> {
    try {
      console.log('Fetching Google Trends...');
      
      const trendsData = await googleTrends.dailyTrends({
        trendDate: new Date(),
        geo: region,
      });

      const trends = JSON.parse(trendsData);
      const trendingTopics: TrendingTopic[] = [];

      trends.default.trendingSearchesDays[0].trendingSearches.forEach((trend: any) => {
        trendingTopics.push({
          keyword: trend.title.query,
          category: trend.articles[0]?.source || 'General',
          volume: parseInt(trend.formattedTraffic.replace(/[^0-9]/g, '')) || 0,
          source: 'google',
          relatedKeywords: trend.relatedQueries?.map((q: any) => q.query) || [],
          region,
        });
      });

      return trendingTopics.slice(0, 10);
    } catch (error) {
      console.error('Error fetching Google Trends:', error);
      return [];
    }
  }

  async fetchTwitterTrends(location = 1): Promise<TrendingTopic[]> {
    try {
      console.log('Fetching Twitter Trends...');
      
      const trends = await this.twitterClient.v1.trendsAvailable();
      const trendingTopics: TrendingTopic[] = [];

      // Get trending topics for specified location
      const locationTrends = await this.twitterClient.v1.trendsByPlace(location);
      
      locationTrends[0].trends.forEach((trend: any) => {
        if (trend.name.startsWith('#')) return; // Skip hashtags for now
        
        trendingTopics.push({
          keyword: trend.name,
          category: 'Social',
          volume: trend.tweet_volume || 0,
          source: 'twitter',
          relatedKeywords: [],
        });
      });

      return trendingTopics.slice(0, 10);
    } catch (error) {
      console.error('Error fetching Twitter Trends:', error);
      return [];
    }
  }

  async collectMediaForTopic(topic: string): Promise<CollectedMedia> {
    console.log(`Collecting media for topic: ${topic}`);
    
    const [images, tweets, videos, articles] = await Promise.all([
      this.collectImages(topic),
      this.collectTweets(topic),
      this.collectVideos(topic),
      this.collectArticles(topic),
    ]);

    return { images, tweets, videos, articles };
  }

  private async collectImages(topic: string) {
    try {
      const response = await this.unsplashClient.search.getPhotos({
        query: topic,
        page: 1,
        perPage: 5,
        orientation: 'landscape',
      });

      if (response.errors) {
        console.error('Unsplash API errors:', response.errors);
        return [];
      }

      return response.response?.results.map((photo: any) => ({
        url: photo.urls.regular,
        alt: photo.alt_description || topic,
        source: 'Unsplash',
        photographer: photo.user.name,
      })) || [];
    } catch (error) {
      console.error('Error collecting images:', error);
      return [];
    }
  }

  private async collectTweets(topic: string) {
    try {
      const tweets = await this.twitterClient.v2.search(topic, {
        max_results: 10,
        'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
        'user.fields': ['username', 'name'],
        expansions: ['author_id'],
      });

      return tweets.data?.data?.map((tweet: any) => {
        const author = tweets.includes?.users?.find((user: any) => user.id === tweet.author_id);
        return {
          id: tweet.id,
          text: tweet.text,
          author: author?.name || 'Unknown',
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
          engagement: tweet.public_metrics?.like_count || 0,
        };
      }) || [];
    } catch (error) {
      console.error('Error collecting tweets:', error);
      return [];
    }
  }

  private async collectVideos(topic: string) {
    try {
      const videos = await youtubeSearch.GetListByKeyword(topic, false, 5);

      return videos.items?.map((video: any) => ({
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.thumbnail.url,
        duration: video.length?.simpleText || 'Unknown',
        views: parseInt(video.viewCount?.text?.replace(/[^0-9]/g, '')) || 0,
      })) || [];
    } catch (error) {
      console.error('Error collecting videos:', error);
      return [];
    }
  }

  private async collectArticles(topic: string) {
    try {
      // Use a news API or web scraping to collect articles
      // For now, we'll return mock data
      return [
        {
          title: `Latest developments in ${topic}`,
          url: `https://example.com/article-${topic.toLowerCase().replace(/\s+/g, '-')}`,
          excerpt: `Recent insights and analysis on ${topic} trends and implications.`,
          source: 'Tech News',
          publishedAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error collecting articles:', error);
      return [];
    }
  }

  async getAllTrendingTopics(): Promise<TrendingTopic[]> {
    const [googleTrends, twitterTrends] = await Promise.all([
      this.fetchGoogleTrends(),
      this.fetchTwitterTrends(),
    ]);

    // Combine and deduplicate trends
    const allTrends = [...googleTrends, ...twitterTrends];
    const uniqueTrends = allTrends.filter((trend, index, self) => 
      index === self.findIndex(t => t.keyword.toLowerCase() === trend.keyword.toLowerCase())
    );

    // Sort by volume/engagement
    return uniqueTrends.sort((a, b) => b.volume - a.volume).slice(0, 20);
  }
}