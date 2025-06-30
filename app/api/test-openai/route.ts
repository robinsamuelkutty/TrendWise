
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'OpenAI API key not found',
        hasKey: false,
        keyPreview: 'Not set'
      }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Test a simple completion
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello world' }],
      model: 'gpt-3.5-turbo',
      max_tokens: 10,
    });

    return NextResponse.json({
      success: true,
      hasKey: true,
      keyPreview: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`,
      testResponse: completion.choices[0]?.message?.content || 'No response',
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI test error:', error);
    return NextResponse.json({
      error: 'OpenAI API test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      hasKey: !!process.env.OPENAI_API_KEY,
      keyPreview: process.env.OPENAI_API_KEY 
        ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}`
        : 'Not set'
    }, { status: 500 });
  }
}
