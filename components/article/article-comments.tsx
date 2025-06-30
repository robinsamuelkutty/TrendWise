"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Heart, Send, LogIn, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Comment, getCommentsByArticle } from '@/lib/api/comments';
import { AuthGuard } from '@/components/auth/auth-guard';

interface ArticleCommentsProps {
  articleId: string;
}

function CommentForm({ articleId, onCommentAdded }: { 
  articleId: string; 
  onCommentAdded: () => void; 
}) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // In a real app, this would call the API
      // const comment = await createComment({ articleId, content: newComment });
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitComment} className="space-y-4">
      <Textarea
        placeholder="Share your thoughts..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}

function SignInPrompt() {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Sign in to join the conversation and share your thoughts.</span>
        <Button asChild size="sm" variant="outline">
          <Link href="/login">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const fetchComments = async () => {
    try {
      const fetchedComments = await getCommentsByArticle(articleId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Comment Form - Protected */}
        {session ? (
          <CommentForm articleId={articleId} onCommentAdded={fetchComments} />
        ) : (
          <SignInPrompt />
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>
                    {comment.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Heart className="h-3 w-3 mr-1" />
                      {comment.likes}
                    </Button>
                    {session && (
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}