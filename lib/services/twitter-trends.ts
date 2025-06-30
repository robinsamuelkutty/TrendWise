
export interface TwitterTrend {
  id: string;
  topic: string;
  volume: number;
  tweetCount: string;
  category: string;
  change: string;
  trendScore: number;
  color: string;
  articles: number;
}

export interface TweetData {
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

// Twitter API v2 client
class TwitterService {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    if (!this.bearerToken) {
      throw new Error('Twitter Bearer Token not configured');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Twitter API error: ${response.status} - ${response.statusText}`);
      throw new Error(`Twitter API request failed: ${response.status}`);
    }

    return response.json();
  }

  async getTrendingTopics(woeid: string = '1'): Promise<TwitterTrend[]> {
    try {
      // Since Twitter API v2 doesn't have direct trends endpoint for free tier,
      // we'll simulate trending topics based on recent popular tweets
      const searchTerms = [
        'AI technology',
        'blockchain',
        'cryptocurrency',
        'web3',
        'machine learning',
        'climate change',
        'renewable energy',
        'space exploration',
        'quantum computing',
        'virtual reality'
      ];

      const trends: TwitterTrend[] = [];

      for (let i = 0; i < Math.min(6, searchTerms.length); i++) {
        const term = searchTerms[i];
        try {
          const searchData = await this.searchTweets(term, 10);
          
          trends.push({
            id: `trend-${i + 1}`,
            topic: term.charAt(0).toUpperCase() + term.slice(1),
            volume: Math.floor(Math.random() * 50000) + 10000,
            tweetCount: `${Math.floor(Math.random() * 100) + 50}K`,
            category: this.getCategoryForTopic(term),
            change: `+${Math.floor(Math.random() * 30) + 5}%`,
            trendScore: Math.floor(Math.random() * 40) + 60,
            color: this.getColorForScore(Math.floor(Math.random() * 40) + 60),
            articles: searchData.length,
          });
        } catch (error) {
          console.error(`Error fetching data for ${term}:`, error);
        }
      }

      return trends;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return this.getMockTrends();
    }
  }

  async searchTweets(query: string, maxResults: number = 10): Promise<TweetData[]> {
    try {
      const data = await this.makeRequest('/tweets/search/recent', {
        query: `${query} -is:retweet lang:en`,
        'max_results': maxResults.toString(),
        'tweet.fields': 'created_at,public_metrics,author_id',
        'user.fields': 'username,name,profile_image_url',
        'expansions': 'author_id',
      });

      const tweets: TweetData[] = [];
      
      if (data.data && data.includes?.users) {
        const users = data.includes.users.reduce((acc: any, user: any) => {
          acc[user.id] = user;
          return acc;
        }, {});

        for (const tweet of data.data) {
          const author = users[tweet.author_id];
          
          tweets.push({
            id: tweet.id,
            text: tweet.text,
            author: {
              username: author?.username || 'unknown',
              name: author?.name || 'Unknown User',
              profileImage: author?.profile_image_url || '/default-avatar.png',
            },
            metrics: {
              likes: tweet.public_metrics?.like_count || 0,
              retweets: tweet.public_metrics?.retweet_count || 0,
              replies: tweet.public_metrics?.reply_count || 0,
            },
            createdAt: tweet.created_at,
            url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
          });
        }
      }

      return tweets;
    } catch (error) {
      console.error('Error searching tweets:', error);
      return [];
    }
  }

  private getCategoryForTopic(topic: string): string {
    const categories: Record<string, string> = {
      'ai technology': 'Technology',
      'blockchain': 'Technology',
      'cryptocurrency': 'Finance',
      'web3': 'Technology',
      'machine learning': 'Technology',
      'climate change': 'Environment',
      'renewable energy': 'Environment',
      'space exploration': 'Science',
      'quantum computing': 'Technology',
      'virtual reality': 'Technology',
    };
    
    return categories[topic.toLowerCase()] || 'General';
  }

  private getColorForScore(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  private getMockTrends(): TwitterTrend[] {
    return [
      {
        id: 'mock-1',
        topic: 'AI Technology',
        volume: 45000,
        tweetCount: '120K',
        category: 'Technology',
        change: '+25%',
        trendScore: 95,
        color: 'bg-green-500',
        articles: 15,
      },
      {
        id: 'mock-2',
        topic: 'Climate Change',
        volume: 38000,
        tweetCount: '95K',
        category: 'Environment',
        change: '+18%',
        trendScore: 87,
        color: 'bg-green-500',
        articles: 12,
      },
      {
        id: 'mock-3',
        topic: 'Cryptocurrency',
        volume: 32000,
        tweetCount: '78K',
        category: 'Finance',
        change: '+12%',
        trendScore: 76,
        color: 'bg-blue-500',
        articles: 9,
      },
      {
        id: 'mock-4',
        topic: 'Space Exploration',
        volume: 28000,
        tweetCount: '65K',
        category: 'Science',
        change: '+22%',
        trendScore: 84,
        color: 'bg-green-500',
        articles: 8,
      },
      {
        id: 'mock-5',
        topic: 'Renewable Energy',
        volume: 25000,
        tweetCount: '58K',
        category: 'Environment',
        change: '+15%',
        trendScore: 72,
        color: 'bg-blue-500',
        articles: 11,
      },
      {
        id: 'mock-6',
        topic: 'Virtual Reality',
        volume: 22000,
        tweetCount: '52K',
        category: 'Technology',
        change: '+8%',
        trendScore: 68,
        color: 'bg-blue-500',
        articles: 7,
      },
    ];
  }
}

export const twitterService = new TwitterService();
