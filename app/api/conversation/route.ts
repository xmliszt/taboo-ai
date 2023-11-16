import { openai } from '@/lib/openai';

export async function POST(request: Request) {
  const assistantId = process.env.OPENAI_PLAYER_ASSISTANT_ID;
  if (!assistantId) {
    return new Response('Missing OPENAI_PLAYER_ASSISTANT_ID', { status: 500 });
  }
  const { message } = await request.json();
  if (!message) {
    return new Response('Missing message', { status: 400 });
  }
  // get thread_id from search params
  const { searchParams } = new URL(request.url);
  const threadID = searchParams.get('thread_id');
  if (threadID == null) {
    // Initialise a new conversation
    try {
      const newRun = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            {
              role: 'user',
              content: message,
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
  } else {
    // continue conversation
    try {
      await openai.beta.threads.messages.create(threadID, {
        role: 'user',
        content: message,
      });
      const run = await openai.beta.threads.runs.create(threadID, {
        assistant_id: assistantId,
      });
      const runID = run.id;
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
      return new Response('Error continuing thread', { status: 500 });
    }
  }
}
