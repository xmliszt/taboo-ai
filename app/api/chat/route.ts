import { NextRequest } from 'next/server';

import { googleGeminiPro } from '@/lib/google-ai';
import { IChat } from '@/lib/types/score.type';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompts = body.prompt as IChat[];
  if (!prompts || prompts.length === 0) {
    return new Response('Missing prompts', { status: 400 });
  }
  const completion = await googleGeminiPro.generateContent(prompts[0].content);
  const text = completion.response.text();
  return new Response(JSON.stringify({ response: text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
