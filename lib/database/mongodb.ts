import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendwise';

export class MongoDBService {
  async connect() {
    try {
      if (mongoose.connections[0].readyState) return true;
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB connected successfully');
      return true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting MongoDB:', error);
    }
  }

  async saveArticle(article: any, topic: string, sources: string[]) {
    const newDoc = new ArticleModel({
      ...article,
      slug: article.slug,
      source: {
        topic,
        generatedBy: 'ai',
        trendingSources: sources
      },
      publishedAt: new Date()
    });

    const saved = await newDoc.save();
    return saved._id.toString();
  }

  async getArticleBySlug(slug: string) {
    return ArticleModel.findOne({ slug });
  }

  async getArticles(page = 1, limit = 10, filter = {}) {
    const articles = await ArticleModel.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ArticleModel.countDocuments(filter);

    return {
      articles,
      total
    };
  }

  async getRecentArticles(limit = 10) {
    return ArticleModel.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit);
  }
}
export function formatArticle(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    featuredImage: doc.media?.featuredImage || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: {
      id: 'ai-author',
      name: 'TrendWise AI',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100',
      bio: 'AI-powered content creator'
    },
    publishedAt: doc.publishedAt?.toISOString() || doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
    readTime: doc.readTime || 5,
    tags: doc.tags || [],
    views: doc.views || 0,
    likes: doc.likes || 0
  };
}

// Schema and model setup (same as before)
const articleSchema = new mongoose.Schema({ /* ...same as yours... */ });

export const ArticleModel = mongoose.models.Article || mongoose.model('Article', articleSchema);
