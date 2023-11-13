import { openai } from '@/lib/openai';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadID = searchParams.get('thread_id');
  const runID = searchParams.get('run_id');
  if (threadID == null || runID == null) {
    return new Response('Missing thread_id or run_id', { status: 400 });
  }
  try {
    const run = await openai.beta.threads.runs.retrieve(threadID, runID);
    const status = run.status;
    const requiredActions = run.required_action;
    return new Response(
      JSON.stringify({
        status: status,
        required_actions: requiredActions,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response('Error getting status', { status: 500 });
  }
}
