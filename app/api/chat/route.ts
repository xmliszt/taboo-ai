import { NextRequest } from 'next/server';

import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const { prompt, temperature, maxToken } = await request.json();
  const completion = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo',
    temperature: temperature,
    max_tokens: maxToken,
  });
  const text = completion.choices[0].message.content;
  return new Response(JSON.stringify({ response: text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
