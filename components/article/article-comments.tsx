
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, User, Lock, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/lib/api/comments';

interface ArticleCommentsProps {
  articleId: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
}

function CommentItem({ comment, onReply, onLike }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>
            {comment.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <Badge variant="secondary" className="text-xs">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              className="text-xs h-8"
            >
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowReplyForm(!showReplyForm);
                onReply(comment.id);
              }}
              className="text-xs h-8"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
          
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="ml-4 border-l-2 border-muted pl-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated' && session?.user;
  const isLoading = status === 'loading';

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?articleId=${articleId}`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          author: {
            name: session.user.name || 'Anonymous',
            email: session.user.email || '',
            avatar: session.user.image
          },
          content: newComment,
          parentId: replyToId
        }),
      });

      if (response.ok) {
        setNewComment('');
        setReplyToId(null);
        await fetchComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          action: 'like'
        }),
      });

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyToId(replyToId === parentId ? null : parentId);
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback>
                  {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                Commenting as {session.user.name || 'Anonymous'}
              </span>
            </div>
            
            <Textarea
              placeholder={replyToId ? "Write your reply..." : "Share your thoughts..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              required
            />
            
            <div className="flex items-center justify-between">
              {replyToId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReplyToId(null)}
                >
                  Cancel Reply
                </Button>
              )}
              
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? (
                  'Posting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {replyToId ? 'Post Reply' : 'Post Comment'}
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Lock className="h-6 w-6" />
              <span className="text-lg font-medium">Sign in to join the conversation</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You need to be logged in to post comments and interact with other readers.
            </p>
            <Link href="/login">
              <Button className="mt-4">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Comment
              </Button>
            </Link>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onLike={handleLike}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
