import { MongoClient, Db, Collection } from 'mongodb';
import { GeneratedArticle } from '../services/ai-content-generator';

export interface ArticleDocument {
  _id?: string;
  title: string;
  slug: string;
  meta: {
    description: string;
    keywords: string;
    author: string;
    robots: string;
    openGraph: {
      title: string;
      description: string;
      image: string;
      type: string;
      url?: string;
    };
  };
  media: {
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
  content: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  source: {
    topic: string;
    generatedBy: 'ai-workflow';
    trendingSources: string[];
  };
}

export class MongoDBService {
  private client: MongoClient;
  private db: Db | null = null;
  private articlesCollection: Collection<ArticleDocument> | null = null;

  constructor() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendwise';
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db('trendwise');
      this.articlesCollection = this.db.collection<ArticleDocument>('articles');
      
      // Create indexes for better performance
      await this.createIndexes();
      
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  private async createIndexes(): Promise<void> {
    if (!this.articlesCollection) return;

    try {
      // Create indexes for common queries
      await this.articlesCollection.createIndex({ slug: 1 }, { unique: true });
      await this.articlesCollection.createIndex({ status: 1 });
      await this.articlesCollection.createIndex({ publishedAt: -1 });
      await this.articlesCollection.createIndex({ tags: 1 });
      await this.articlesCollection.createIndex({ 'source.topic': 1 });
      await this.articlesCollection.createIndex({ createdAt: -1 });
      
      // Text index for search functionality
      await this.articlesCollection.createIndex({
        title: 'text',
        content: 'text',
        excerpt: 'text',
        tags: 'text'
      });

      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }

  async saveArticle(
    generatedArticle: GeneratedArticle, 
    topic: string,
    trendingSources: string[] = []
  ): Promise<string> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    try {
      const articleDocument: ArticleDocument = {
        title: generatedArticle.title,
        slug: generatedArticle.slug,
        meta: {
          description: generatedArticle.metaDescription,
          keywords: generatedArticle.metaTags.keywords,
          author: generatedArticle.metaTags.author,
          robots: generatedArticle.metaTags.robots,
          openGraph: generatedArticle.openGraphTags,
        },
        media: generatedArticle.embeddedMedia,
        content: generatedArticle.content,
        excerpt: generatedArticle.excerpt,
        tags: generatedArticle.tags,
        readTime: generatedArticle.readTime,
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        source: {
          topic,
          generatedBy: 'ai-workflow',
          trendingSources,
        },
      };

      const result = await this.articlesCollection.insertOne(articleDocument);
      console.log(`Article saved with ID: ${result.insertedId}`);
      
      return result.insertedId.toString();
    } catch (error) {
      console.error('Error saving article:', error);
      throw error;
    }
  }

  async getArticleBySlug(slug: string): Promise<ArticleDocument | null> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    return await this.articlesCollection.findOne({ slug, status: 'published' });
  }

  async getArticles(
    page = 1, 
    limit = 10, 
    filters: {
      status?: string;
      tags?: string[];
      search?: string;
    } = {}
  ): Promise<{
    articles: ArticleDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    const query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const total = await this.articlesCollection.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const articles = await this.articlesCollection
      .find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      articles,
      total,
      page,
      totalPages,
    };
  }

  async updateArticleViews(slug: string): Promise<void> {
    if (!this.articlesCollection) return;

    await this.articlesCollection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    );
  }

  async getPopularArticles(limit = 10): Promise<ArticleDocument[]> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    return await this.articlesCollection
      .find({ status: 'published' })
      .sort({ views: -1, likes: -1 })
      .limit(limit)
      .toArray();
  }

  async getArticlesByTag(tag: string, limit = 10): Promise<ArticleDocument[]> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    return await this.articlesCollection
      .find({ 
        tags: tag, 
        status: 'published' 
      })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  }

  async getRecentArticles(limit = 10): Promise<ArticleDocument[]> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    return await this.articlesCollection
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  }

  async deleteArticle(slug: string): Promise<boolean> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    const result = await this.articlesCollection.deleteOne({ slug });
    return result.deletedCount > 0;
  }

  async updateArticleStatus(slug: string, status: 'draft' | 'published' | 'archived'): Promise<boolean> {
    if (!this.articlesCollection) {
      throw new Error('Database not connected');
    }

    const result = await this.articlesCollection.updateOne(
      { slug },
      { 
        $set: { 
          status, 
          updatedAt: new Date(),
          ...(status === 'published' && { publishedAt: new Date() })
        } 
      }
    );

    return result.modifiedCount > 0;
  }
}