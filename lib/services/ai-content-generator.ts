import OpenAI from 'openai';
import { CollectedMedia } from './data-collection';

export interface GeneratedArticle {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  openGraphTags: {
    title: string;
    description: string;
    image: string;
    type: string;
    url?: string;
  };
  metaTags: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    robots: string;
  };
  embeddedMedia: {
    featuredImage: string;
    inlineImages: Array<{
      url: string;
      alt: string;
      caption: string;
      position: number;
    }>;
    embeddedTweets: Array<{
      id: string;
      position: number;
    }>;
    embeddedVideos: Array<{
      url: string;
      title: string;
      position: number;
    }>;
  };
}

export class AIContentGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async generateArticle(
    topic: string, 
    media: CollectedMedia,
    targetWordCount = 1500
  ): Promise<GeneratedArticle> {
    console.log(`Generating article for topic: ${topic}`);

    try {
      // Generate the main content structure
      const contentPrompt = this.buildContentPrompt(topic, media, targetWordCount);
      const contentResponse = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert content writer specializing in SEO-optimized articles. 
            Create engaging, informative, and well-structured content that ranks well in search engines.
            Always use proper HTML structure with semantic headings (H1, H2, H3).
            Include natural keyword placement and maintain readability.`
          },
          {
            role: 'user',
            content: contentPrompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const content = contentResponse.choices[0]?.message?.content || '';

      // Generate SEO metadata
      const metaPrompt = this.buildMetaPrompt(topic, content);
      const metaResponse = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate optimized meta tags and descriptions for maximum search visibility.'
          },
          {
            role: 'user',
            content: metaPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.5,
      });

      const metaData = this.parseMetaResponse(metaResponse.choices[0]?.message?.content || '');

      // Generate article structure with embedded media
      const article = this.structureArticle(topic, content, media, metaData);

      return article;
    } catch (error) {
      console.error('Error generating article:', error);
      throw new Error('Failed to generate article content');
    }
  }

  private buildContentPrompt(topic: string, media: CollectedMedia, wordCount: number): string {
    const relatedArticles = media.articles.map(a => `- ${a.title}: ${a.excerpt}`).join('\n');
    const tweetInsights = media.tweets.map(t => `- ${t.text} (by ${t.author})`).join('\n');

    return `
Write a comprehensive, SEO-optimized article about "${topic}" with approximately ${wordCount} words.

Context from related sources:
${relatedArticles}

Social media insights:
${tweetInsights}

Requirements:
1. Start with an engaging H1 title
2. Use proper heading hierarchy (H2, H3)
3. Include an introduction that hooks the reader
4. Provide valuable, actionable insights
5. Use bullet points and numbered lists where appropriate
6. Include a strong conclusion
7. Write in a conversational yet professional tone
8. Optimize for SEO without keyword stuffing
9. Include [IMAGE_PLACEHOLDER_X] markers where images should be inserted
10. Include [TWEET_PLACEHOLDER_X] markers where tweets should be embedded
11. Include [VIDEO_PLACEHOLDER_X] markers where videos should be embedded

Structure the article with proper HTML tags and make it engaging for readers while being informative and authoritative.
`;
  }

  private buildMetaPrompt(topic: string, content: string): string {
    return `
Based on this article about "${topic}", generate SEO metadata:

Article content preview: ${content.substring(0, 500)}...

Generate:
1. SEO-optimized title (50-60 characters)
2. Meta description (150-160 characters)
3. Keywords (comma-separated, 5-10 relevant keywords)
4. URL slug (SEO-friendly)
5. Excerpt (2-3 sentences summarizing the article)

Format as JSON with keys: title, metaDescription, keywords, slug, excerpt
`;
  }

  private parseMetaResponse(response: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing meta response:', error);
    }

    // Fallback to manual parsing
    return {
      title: `Understanding ${response.split('\n')[0] || 'Topic'}: A Comprehensive Guide`,
      metaDescription: `Explore the latest insights and trends in ${response.split('\n')[0] || 'this topic'}.`,
      keywords: 'trends, technology, innovation, insights, analysis',
      slug: response.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      excerpt: `Discover key insights and analysis about ${response.split('\n')[0] || 'this trending topic'}.`
    };
  }

  private structureArticle(
    topic: string, 
    content: string, 
    media: CollectedMedia, 
    metaData: any
  ): GeneratedArticle {
    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Select featured image
    const featuredImage = media.images[0]?.url || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg';

    // Embed media in content
    let processedContent = content;
    
    // Replace image placeholders
    media.images.forEach((image, index) => {
      const placeholder = `[IMAGE_PLACEHOLDER_${index + 1}]`;
      const imageHtml = `
        <figure class="my-8">
          <img src="${image.url}" alt="${image.alt}" class="w-full rounded-lg shadow-lg" />
          <figcaption class="text-sm text-gray-600 mt-2 text-center">
            ${image.alt}${image.photographer ? ` - Photo by ${image.photographer}` : ''}
          </figcaption>
        </figure>
      `;
      processedContent = processedContent.replace(placeholder, imageHtml);
    });

    // Replace tweet placeholders
    media.tweets.forEach((tweet, index) => {
      const placeholder = `[TWEET_PLACEHOLDER_${index + 1}]`;
      const tweetHtml = `
        <blockquote class="twitter-tweet my-8 p-4 border-l-4 border-blue-500 bg-gray-50 rounded">
          <p class="text-gray-800">${tweet.text}</p>
          <cite class="text-sm text-gray-600">— ${tweet.author}</cite>
          <a href="${tweet.url}" target="_blank" class="text-blue-500 text-sm">View on Twitter</a>
        </blockquote>
      `;
      processedContent = processedContent.replace(placeholder, tweetHtml);
    });

    // Replace video placeholders
    media.videos.forEach((video, index) => {
      const placeholder = `[VIDEO_PLACEHOLDER_${index + 1}]`;
      const videoHtml = `
        <div class="my-8">
          <div class="aspect-w-16 aspect-h-9">
            <iframe 
              src="${video.url.replace('watch?v=', 'embed/')}" 
              title="${video.title}"
              frameborder="0" 
              allowfullscreen
              class="w-full h-64 rounded-lg"
            ></iframe>
          </div>
          <p class="text-sm text-gray-600 mt-2">${video.title}</p>
        </div>
      `;
      processedContent = processedContent.replace(placeholder, videoHtml);
    });

    // Generate tags from topic and content
    const tags = this.generateTags(topic, processedContent);

    return {
      title: metaData.title || `${topic}: Complete Guide and Analysis`,
      slug: metaData.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      metaDescription: metaData.metaDescription || `Comprehensive analysis of ${topic} with latest insights and trends.`,
      content: processedContent,
      excerpt: metaData.excerpt || `Explore the latest developments in ${topic} with expert analysis and insights.`,
      tags,
      readTime,
      openGraphTags: {
        title: metaData.title || `${topic}: Complete Guide`,
        description: metaData.metaDescription || `Comprehensive analysis of ${topic}`,
        image: featuredImage,
        type: 'article',
      },
      metaTags: {
        title: metaData.title || `${topic}: Complete Guide`,
        description: metaData.metaDescription || `Comprehensive analysis of ${topic}`,
        keywords: metaData.keywords || `${topic}, trends, analysis, insights`,
        author: 'TrendWise AI',
        robots: 'index, follow',
      },
      embeddedMedia: {
        featuredImage,
        inlineImages: media.images.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          caption: img.photographer ? `Photo by ${img.photographer}` : '',
          position: index + 1,
        })),
        embeddedTweets: media.tweets.map((tweet, index) => ({
          id: tweet.id,
          position: index + 1,
        })),
        embeddedVideos: media.videos.map((video, index) => ({
          url: video.url,
          title: video.title,
          position: index + 1,
        })),
      },
    };
  }

  private generateTags(topic: string, content: string): string[] {
    const topicWords = topic.split(' ').filter(word => word.length > 3);
    const commonTags = ['Technology', 'Innovation', 'Trends', 'Analysis', 'Insights'];
    
    // Extract potential tags from content (simple approach)
    const contentWords = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordFreq: { [key: string]: number } = {};
    
    contentWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const frequentWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    return [...topicWords, ...commonTags, ...frequentWords]
      .filter((tag, index, self) => self.indexOf(tag) === index)
      .slice(0, 8);
  }
}