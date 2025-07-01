import { connectDB } from '@/lib/database/mongodb';
import { ArticleModel, formatArticle } from '@/lib/database/mongodb';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  tags: string[];
  views: number;
  likes: number;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export async function getArticles(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<{
  articles: Article[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}> {
  const { page = 1, limit = 10, search = '', category } = params;

  try {
    await connectDB();

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { 'meta.description': { $regex: search, $options: 'i' } },
        { 'meta.keywords': { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const articles = await ArticleModel.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await ArticleModel.countDocuments(query);

    // Return empty array if no articles found
    if (articles.length === 0) {
      return {
        articles: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0,
      };
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      articles: articles.map(formatArticle),
      totalPages,
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return empty array on database error
    return {
      articles: [],
      totalPages: 0,
      currentPage: page,
      totalCount: 0,
    };
  }
}



export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    await connectDB();
    const article = await ArticleModel.findOne({ slug }).lean();
    return article ? formatArticle(article) : null;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

export async function getRelatedArticles(articleId: string, tags: string[], limit = 3): Promise<Article[]> {
  try {
    await connectDB();
    const articles = await ArticleModel.find({
      _id: { $ne: articleId },
      tags: { $in: tags },
      status: 'published'
    })
    .limit(limit)
    .lean();

    return articles.map(formatArticle);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function getArticlesByCategory(category: string, limit = 10): Promise<Article[]> {
  try {
    await connectDB();
    
    const articles = await ArticleModel.find({ 
      category: category,
      status: 'published'
    })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

    return articles.map(formatArticle);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

export async function createArticle(articleData: any): Promise<Article> {
  try {
    await connectDB();
    
    const article = new ArticleModel({
      title: articleData.title,
      slug: articleData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '',
      category: articleData.category || 'general',
      meta: {
        description: articleData.metaDescription,
        keywords: articleData.tags?.join(', ') || '',
        author: 'TrendWise AI',
        robots: 'index, follow',
        openGraph: {
          title: articleData.title,
          description: articleData.metaDescription,
          image: articleData.featuredImage,
          type: 'article'
        }
      },
      media: {
        featuredImage: articleData.featuredImage,
        inlineImages: [],
        embeddedTweets: [],
        embeddedVideos: []
      },
      content: articleData.content,
      excerpt: articleData.excerpt,
      tags: articleData.tags || [],
      readTime: Math.ceil((articleData.content?.length || 0) / 200),
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      source: {
        topic: articleData.title,
        generatedBy: 'ai-workflow',
        trendingSources: []
      }
    });

    const savedArticle = await article.save();
    return formatArticle(savedArticle.toObject());
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}