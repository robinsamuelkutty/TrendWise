// Mock database - replace with actual database calls
const mockComments = [
  {
    id: '1',
    articleId: '1',
    userId: '1',
    content: 'Great article! I especially found the section on AI-powered code generation fascinating.',
    author: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    createdAt: '2025-01-10T12:30:00Z',
    updatedAt: '2025-01-10T12:30:00Z',
    likes: 5,
    replies: [],
  },
];

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: Comment[];
}

export interface CreateCommentData {
  articleId: string;
  userId: string;
  content: string;
}

export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockComments.filter(comment => comment.articleId === articleId);
}

export async function createComment(data: CreateCommentData): Promise<Comment> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newComment: Comment = {
    id: Date.now().toString(),
    ...data,
    author: {
      name: 'Anonymous User', // This would come from user session
      avatar: '/default-avatar.png',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    replies: [],
  };
  
  mockComments.push(newComment);
  return newComment;
}