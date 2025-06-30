import { NextRequest, NextResponse } from 'next/server';
import { AIWorkflow } from '@/lib/workflow/ai-workflow';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Require authentication for workflow execution
    await requireAuth();
    
    const body = await request.json();
    const config = {
      maxTopicsPerRun: body.maxTopics || 3,
      targetWordCount: body.wordCount || 1500,
      includeImages: body.includeImages !== false,
      includeTweets: body.includeTweets !== false,
      includeVideos: body.includeVideos !== false,
      autoPublish: body.autoPublish !== false,
      regions: body.regions || ['US'],
    };

    const workflow = new AIWorkflow();
    const result = await workflow.execute(config);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const workflow = new AIWorkflow();
    const stats = await workflow.getWorkflowStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching workflow stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow stats' },
      { status: 500 }
    );
  }
}