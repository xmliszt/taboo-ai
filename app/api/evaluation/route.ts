import { openai } from '@/lib/openai';
import { IChat } from '@/lib/types/score.type';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const assistant_id = process.env.OPENAI_TEACHER_ASSISTANT_ID;
  if (!assistant_id) {
    return new Response('Missing OPENAI_PLAYER_ASSISTANT_ID', { status: 500 });
  }
  const { target, taboos, conversation } = (await request.json()) as {
    target: string;
    taboos: string[];
    conversation: IChat[];
  };
  if (!target || !taboos || !conversation) {
    return new Response('Missing target, taboos or conversation', {
      status: 400,
    });
  }

  try {
    const newRun = await openai.beta.threads.createAndRun({
      assistant_id: assistant_id,
      thread: {
        messages: [
          {
            role: 'user',
            content: JSON.stringify({ target, taboos, conversation }),
          },
        ],
      },
    });
    const runID = newRun.id;
    const threadID = newRun.thread_id;
    return new Response(
      JSON.stringify({
        run_id: runID,
        thread_id: threadID,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response('Error creating thread', { status: 500 });
  }
}
