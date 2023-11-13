import { openai } from '@/lib/openai';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadID = searchParams.get('thread_id');
  if (threadID == null) {
    return new Response('Missing thread_id', { status: 400 });
  }
  try {
    const messages = await openai.beta.threads.messages.list(threadID);
    return new Response(JSON.stringify(messages.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response('Error getting messages', { status: 500 });
  }
}
