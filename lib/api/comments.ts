import { MongoDBService } from '@/lib/database/mongodb';
import mongoose from 'mongoose';

export interface Comment {
  id: string;
  articleId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: Comment[];
  parentId?: string;
}

const commentSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Article' },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String }
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
});

if (mongoose.models.Comment) {
  delete mongoose.models.Comment;
}

export const CommentModel = mongoose.model('Comment', commentSchema);

export function formatComment(comment: any): Comment {
  return {
    id: comment._id.toString(),
    articleId: comment.articleId.toString(),
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    likes: comment.likes || 0,
    replies: [],
    parentId: comment.parentId?.toString()
  };
}

async function runConnection() {
  const db = new MongoDBService();
  await db.connect();
}

runConnection();

export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  try {
    const comments = await CommentModel.find({ 
      articleId: new mongoose.Types.ObjectId(articleId) 
    })
    .sort({ createdAt: -1 })
    .lean();

    const commentMap = new Map<string, Comment>();
    const topLevelComments: Comment[] = [];

    comments.forEach(comment => {
      const formattedComment = formatComment(comment);
      commentMap.set(formattedComment.id, formattedComment);
      if (!formattedComment.parentId) {
        topLevelComments.push(formattedComment);
      }
    });

    comments.forEach(comment => {
      const formattedComment = formatComment(comment);
      if (formattedComment.parentId) {
        const parentComment = commentMap.get(formattedComment.parentId);
        if (parentComment) {
          parentComment.replies.push(formattedComment);
        }
      }
    });

    return topLevelComments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(commentData: {
  articleId: string;
  author: { name: string; email: string; avatar?: string };
  content: string;
  parentId?: string;
}): Promise<Comment> {
  try {
    const comment = new CommentModel({
      articleId: new mongoose.Types.ObjectId(commentData.articleId),
      author: commentData.author,
      content: commentData.content,
      parentId: commentData.parentId ? new mongoose.Types.ObjectId(commentData.parentId) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedComment = await comment.save();
    return formatComment(savedComment.toObject());
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function likeComment(commentId: string): Promise<Comment | null> {
  try {
    const comment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    return comment ? formatComment(comment.toObject()) : null;
  } catch (error) {
    console.error('Error liking comment:', error);
    return null;
  }
}
