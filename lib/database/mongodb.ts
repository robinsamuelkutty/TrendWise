
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendwise';

export async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Completely clear any cached models and connections
Object.keys(mongoose.models).forEach(key => {
  delete mongoose.models[key];
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  meta: {
    description: { type: String },
    keywords: { type: String },
    author: { type: String },
    robots: { type: String },
    openGraph: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      type: { type: String },
      url: { type: String }
    }
  },
  media: {
    featuredImage: { type: String },
    inlineImages: [{
      url: { type: String },
      alt: { type: String },
      caption: { type: String },
      position: { type: Number }
    }],
    embeddedTweets: [{
      id: { type: String },
      position: { type: Number }
    }],
    embeddedVideos: [{
      url: { type: String },
      title: { type: String },
      position: { type: Number }
    }]
  },
  content: { type: String, required: true },
  excerpt: { type: String },
  tags: [{ type: String }],
  readTime: { type: Number },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  source: {
    topic: { type: String },
    generatedBy: { type: String },
    trendingSources: [{ type: String }]
  }
});

export const ArticleModel = mongoose.model('Article', articleSchema);

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
