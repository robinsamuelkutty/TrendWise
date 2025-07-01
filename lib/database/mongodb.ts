import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendwise';

export async function connectDB() {
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

// Schema definition
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'general' },
  meta: {
    description: String,
    keywords: String,
    author: String,
    robots: String,
    openGraph: {
      title: String,
      description: String,
      image: String,
      type: String,
      url: String
    }
  },
  media: {
    featuredImage: String,
    inlineImages: [{
      url: String,
      alt: String,
      caption: String,
      position: Number
    }],
    embeddedTweets: [{
      id: String,
      position: Number
    }],
    embeddedVideos: [{
      url: String,
      title: String,
      position: Number
    }]
  },
  content: { type: String, required: true },
  excerpt: String,
  tags: [String],
  readTime: Number,
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  source: {
    topic: String,
    generatedBy: String,
    trendingSources: [String]
  }
});

// Fix for hot reload in Next.js dev mode
export const ArticleModel = mongoose.models.Article || mongoose.model('Article', articleSchema);

// Format output
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

// ✅ Add this to fix the Vercel export error
export const MongoDBService = {
  connectDB,
  ArticleModel,
  formatArticle
};
