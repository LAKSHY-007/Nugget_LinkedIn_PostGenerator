import { NextRequest, NextResponse } from 'next/server';
import { generatePosts } from '@/lib/agent';

interface RequestBody {
  topic: string;
  tone?: string;
}



export async function POST(request: NextRequest) {
  try {
    const { topic, tone } = await request.json() as RequestBody;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const result = await generatePosts(topic, tone);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'OK', message: 'FORGEAI API is healthy!' });
}