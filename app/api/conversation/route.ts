import { tryParseErrorAsGoogleAIError } from '@/lib/errors./google-ai-error-parser';
import { googleGeminiPro } from '@/lib/google-ai';
import { IChat } from '@/lib/types/score.type';
import { NextResponse } from 'next/server';

/**
 * @api {post} /api/conversation Complete a conversation
 * @apiDescription Completes a conversation with the Google Gemini Pro API.
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
    const filteredConversation = conversation.filter((message) =>
      ['user', 'assistant'].includes(message.role)
    );
    // pop the last item from chatCompletionMessages as the new user message
    const userMessage = filteredConversation.pop()?.content;
    const chatCompletionMessages = filteredConversation.map((message) => {
      return {
        role: message.role === 'user' ? 'user' : 'model',
        parts: message.content,
      };
    });
    // Add the system message as first item
    chatCompletionMessages.unshift(
      {
        role: 'user',
        parts:
          'You are a player in Taboo AI game. Taboo AI game follows the rules of the traditional Game of Taboo. You will engage in a conversation with the human player. Player will be given a word that he is not allowed to say. There are also other related words the player is not allowed to say. Player will provide you with hints. You will reply the player by trying to guess what the word is. You are allowed to say the word because you need to guess it. You will answer in fluent American English in a casual manner.',
      },
      {
        role: 'model',
        parts: "Ok, let's start the game.",
      }
    );
    const chat = googleGeminiPro.startChat({
      history: chatCompletionMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
    if (!userMessage) {
      return new Response('Missing user message', { status: 400 });
    }
    const completion = await chat.sendMessage(userMessage);
    const response = completion.response;
    const newConversation = [
      ...conversation,
      {
        role: 'assistant',
        content: response.text(),
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
    try {
      const googleAIError = tryParseErrorAsGoogleAIError(error)
      console.log(googleAIError);
      return NextResponse.json(googleAIError, { status: 500 });
    } catch (error) {
      console.error(error);
      return new Response('Error processing conversation', { status: 500 });
    }
  }
}
