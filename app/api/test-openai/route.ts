
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'Gemini API key not found',
        hasKey: false,
        keyPreview: 'Not set'
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Test a simple generation
    const result = await model.generateContent("Say hello world");
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      hasKey: true,
      keyPreview: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`,
      testResponse: text || 'No response',
      model: 'gemini-pro'
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json({
      error: 'Gemini API test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      hasKey: !!process.env.GEMINI_API_KEY,
      keyPreview: process.env.GEMINI_API_KEY 
        ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}`
        : 'Not set'
    }, { status: 500 });
  }
}
