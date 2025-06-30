// Mock database - replace with actual database calls
const mockArticles = [
  {
    id: '1',
    title: 'The Future of AI in Web Development: Trends to Watch in 2025',
    slug: 'future-of-ai-web-development-2025',
    excerpt: 'Explore how artificial intelligence is revolutionizing web development and what developers need to know for the future.',
    content: `
      <h1>The Future of AI in Web Development: Trends to Watch in 2025</h1>
      
      <p>Artificial Intelligence is rapidly transforming the landscape of web development, creating new possibilities and reshaping how we build digital experiences. As we move through 2025, several key trends are emerging that every developer should be aware of.</p>
      
      <h2>AI-Powered Code Generation</h2>
      <p>Tools like GitHub Copilot and ChatGPT are already changing how developers write code. In 2025, we're seeing even more sophisticated AI assistants that can generate entire components, debug complex issues, and suggest architectural improvements.</p>
      
      <h2>Intelligent User Interfaces</h2>
      <p>AI is enabling the creation of more intuitive and responsive user interfaces. From predictive text inputs to adaptive layouts that change based on user behavior, the web is becoming smarter and more personalized.</p>
      
      <h2>Automated Testing and Quality Assurance</h2>
      <p>Machine learning algorithms are now capable of writing and executing comprehensive test suites, identifying edge cases that human testers might miss, and continuously monitoring application performance.</p>
      
      <h2>The Road Ahead</h2>
      <p>As AI continues to evolve, web developers must adapt and learn to work alongside these powerful tools. The future belongs to those who can effectively combine human creativity with artificial intelligence capabilities.</p>
    `,
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
      bio: 'Senior Full-Stack Developer with 8+ years of experience in AI and web technologies.',
    },
    publishedAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
    readTime: 8,
    tags: ['AI', 'Web Development', 'Technology', 'Future'],
    views: 1205,
    likes: 89,
  },
  // Add more mock articles as needed
];

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

export async function getArticles(params: GetArticlesParams = {}): Promise<ArticlesResponse> {
  const { page = 1, limit = 10, search = '' } = params;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filteredArticles = mockArticles;
  
  // Filter by search query
  if (search) {
    filteredArticles = mockArticles.filter(article => 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  const total = filteredArticles.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const articles = filteredArticles.slice(startIndex, endIndex);
  
  return {
    articles,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const article = mockArticles.find(article => article.slug === slug);
  return article || null;
}

export async function getRelatedArticles(articleId: string, tags: string[], limit = 3): Promise<Article[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const relatedArticles = mockArticles
    .filter(article => 
      article.id !== articleId && 
      article.tags.some(tag => tags.includes(tag))
    )
    .slice(0, limit);
  
  return relatedArticles;
}

export async function createArticle(articleData: Partial<Article>): Promise<Article> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newArticle: Article = {
    id: Date.now().toString(),
    slug: articleData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '',
    author: {
      id: '1',
      name: 'AI Content Generator',
      avatar: '/ai-avatar.png',
      bio: 'AI-powered content generation system',
    },
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    readTime: Math.ceil((articleData.content?.length || 0) / 200), // Rough estimate
    ...articleData,
  } as Article;
  
  mockArticles.unshift(newArticle);
  return newArticle;
}