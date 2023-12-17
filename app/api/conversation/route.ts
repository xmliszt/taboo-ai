import { ChatCompletionMessageParam } from 'openai/resources';

import { openai } from '@/lib/openai';
import { IChat } from '@/lib/types/score.type';

/**
 * @api {post} /api/conversation Complete a conversation
 * @apiDescription Completes a conversation with the OpenAI API.
 * @apiParam {IChat[]} conversation The conversation to complete.
 * @apiSuccess {IChat[]} conversation The completed conversation.
 * @apiError (400) {String} Missing conversation.
 * @apiError (500) {String} Error processing conversation.
 */
export async function POST(request: Request) {
  const conversation = (await request.json()).conversation as IChat[];
  if (!conversation) {
    return new Response('Missing conversation', { status: 400 });
  }
  // Create a new chat completion with conversation supplied
  try {
    const chatCompletionMessages = conversation.map((message) => {
      return {
        role: message.role,
        content: message.content,
      };
    });
    // Add the system message as first item
    chatCompletionMessages.unshift({
      role: 'system',
      content:
        'You are a player in Taboo AI game. Taboo AI game follows the rules of the traditional Game of Taboo. You will engage in a real conversation with the human player. You will reply one message only after player tells you one message. Player will be given a word that he is not allowed to say. There are also other related words that are not allowed to say. Player will provide you with hints. You will reply the player in the conversation manner and try to guess what the word is. You are allowed to say the word because you need to guess it.',
    });
    const completion = await openai.chat.completions.create({
      messages: chatCompletionMessages as ChatCompletionMessageParam[],
      model: 'gpt-3.5-turbo',
    });
    const newConversation = [
      ...conversation,
      {
        role: completion.choices[0].message.role,
        content: completion.choices[0].message.content,
      },
    ];
    return new Response(
      JSON.stringify({
        conversation: newConversation,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response('Error processing conversation', { status: 500 });
  }
}
