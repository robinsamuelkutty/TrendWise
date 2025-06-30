
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCommentsByArticleId, createComment, likeComment } from '@/lib/api/comments';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    const comments = await getCommentsByArticleId(articleId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { articleId, author, content, parentId } = body;
    
    if (!articleId || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the author matches the authenticated user
    if (author.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Author information does not match authenticated user' },
        { status: 403 }
      );
    }
    
    const comment = await createComment({
      articleId,
      author,
      content,
      parentId
    });
    
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action } = body;
    
    if (!commentId || action !== 'like') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
    
    const comment = await likeComment(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}
