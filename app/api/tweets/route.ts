
import { NextRequest, NextResponse } from 'next/server';
import { twitterService } from '@/lib/services/twitter-trends';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching tweets for query: ${query}`);
    const tweets = await twitterService.searchTweets(query, limit);
    
    return NextResponse.json({ 
      tweets,
      count: tweets.length,
      query 
    });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    
    // Return mock tweets if API fails
    const mockTweets = [
      {
        id: 'mock-1',
        text: `Exciting developments in ${request.nextUrl.searchParams.get('q')} are changing the game! 🚀`,
        author: {
          username: 'tech_insider',
          name: 'Tech Insider',
          profileImage: '/default-avatar.png',
        },
        metrics: {
          likes: 125,
          retweets: 34,
          replies: 12,
        },
        createdAt: new Date().toISOString(),
        url: 'https://twitter.com/tech_insider/status/mock-1',
      },
      {
        id: 'mock-2',
        text: `The future of ${request.nextUrl.searchParams.get('q')} looks incredibly promising. Here's what experts are saying...`,
        author: {
          username: 'future_trends',
          name: 'Future Trends',
          profileImage: '/default-avatar.png',
        },
        metrics: {
          likes: 89,
          retweets: 23,
          replies: 8,
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        url: 'https://twitter.com/future_trends/status/mock-2',
      }
    ];

    return NextResponse.json({ 
      tweets: mockTweets,
      count: mockTweets.length,
      query: request.nextUrl.searchParams.get('q'),
      fallback: true
    });
  }
}
