import { NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompts = body.prompt as IChat[];
  if (!prompts || prompts.length === 0) {
    return new Response('Missing prompts', { status: 400 });
  }
  try {
    const completion = await googleGeminiPro.generateContent(prompts[0].content);
    const text = completion.response.text();
    return new Response(JSON.stringify({ response: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    try {
      const googleAIError = tryParseErrorAsGoogleAIError(error)
      console.log(googleAIError);
      return NextResponse.json(googleAIError, { status: 500 });
    } catch (error) {
      console.error(error);
      return new Response(error.message, { status: 500 });
    }
  }
}
