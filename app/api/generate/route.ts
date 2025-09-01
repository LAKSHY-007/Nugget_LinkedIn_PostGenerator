import { NextRequest, NextResponse } from 'next/server';
import { generatePosts } from '@/lib/agent';

export async function POST(request: NextRequest) {
  try {
    const { topic, tone } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const result = await generatePosts(topic, tone);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'OK', message: 'LinkedIn Lore-Smith API is healthy!' });
}