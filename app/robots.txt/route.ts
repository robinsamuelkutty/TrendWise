import { NextResponse } from 'next/server';

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trendwise.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}