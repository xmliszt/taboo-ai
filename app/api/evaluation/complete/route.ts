import { openai } from '@/lib/openai';
import { NextRequest } from 'next/server';

type Output = {
  call_id: string;
  output: string;
};

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadID = searchParams.get('thread_id');
  const runID = searchParams.get('run_id');
  if (threadID == null || runID == null) {
    return new Response('Missing thread_id or run_id', { status: 400 });
  }
  const { outputs } = (await request.json()) as { outputs: Output[] };
  if (!outputs) {
    return new Response('Missing outputs', { status: 400 });
  }
  try {
    await openai.beta.threads.runs.submitToolOutputs(threadID, runID, {
      tool_outputs: outputs.map((output) => {
        return {
          tool_call_id: output.call_id,
          output: output.output,
        };
      }),
    });
    return new Response('Outputs submitted successfully', {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response('Error submitting outputs', { status: 500 });
  }
}
