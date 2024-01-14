import { NextRequest, NextResponse } from 'next/server';

import { ConversationToUpload } from '@/app/result/server/upload-game';
import { tryParseErrorAsGoogleAIError } from '@/lib/errors/google-ai-error-parser';
import { googleGeminiPro, HIGH_SAFETY_SETTINGS } from '@/lib/google-ai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompts = body.prompt as ConversationToUpload[];
  const safety = body.safety;
  if (!prompts || prompts.length === 0) {
    return new Response('Missing prompts', { status: 400 });
  }
  if (safety === 'high') {
    googleGeminiPro.safetySettings = HIGH_SAFETY_SETTINGS;
  }
  try {
    const completion = await googleGeminiPro.generateContent(prompts[0].content);
    const text = completion.response.text();
    return new Response(JSON.stringify({ response: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error.message);
    try {
      const googleAIError = tryParseErrorAsGoogleAIError(error);
      return NextResponse.json(googleAIError, { status: 500 });
    } catch (error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
