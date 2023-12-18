import { NextRequest } from 'next/server';
import { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources';

import { firestore } from '@/firebase/firebase-admin';
import { openai } from '@/lib/openai';
import { IChat } from '@/lib/types/score.type';

export async function POST(request: NextRequest) {
  const { email: userEmail, evaluation } = (await request.json()) as {
    email: string;
    evaluation: {
      target: string;
      taboos: string[];
      conversation: IChat[];
    };
  };
  const { target, taboos, conversation } = evaluation;
  // Based on user's plan, determine which model to use
  let gptModelToUse = 'gpt-3.5-turbo-1106';
  if (userEmail) {
    const userDoc = await firestore.doc(`users/${userEmail}`).get();
    gptModelToUse =
      userDoc.data()?.customerPlanType === 'pro' ? 'gpt-4-1106-preview' : 'gpt-3.5-turbo-1106';
  }
  console.log(`Using ${gptModelToUse} for evaluation`);

  // Filter out conversation messages whose role is not 'user' or 'assistant'
  const filteredConversation = conversation.filter(
    (message) => message.role === 'user' || message.role === 'assistant'
  );
  if (!target || !taboos || !filteredConversation) {
    return new Response('Missing target, taboos or conversation', {
      status: 400,
    });
  }

  try {
    // Use json_mode for chat completion to get instruction to call function
    const systemMessage: ChatCompletionSystemMessageParam = {
      role: 'system',
      content: EVALUATION_SYSTEM_MESSAGE,
    };
    const userMessage: ChatCompletionUserMessageParam = {
      role: 'user',
      content: JSON.stringify({
        target,
        taboos,
        conversation: filteredConversation,
      }),
    };
    const completion = await openai.chat.completions.create({
      messages: [systemMessage, userMessage],
      model: gptModelToUse,
      response_format: {
        type: 'json_object',
      },
    });
    const { score, reasoning } = JSON.parse(completion.choices[0].message.content ?? '');
    return new Response(
      JSON.stringify({
        score,
        reasoning,
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

const EVALUATION_SYSTEM_MESSAGE = `
You are a judge and advisor in Taboo AI game. Taboo AI game follows the rules of the traditional Game of Taboo. User engaged in a conversation with AI. Your job is to evaluate the performance of the user based on his clues. The users are English learners who are trying to improve their English skills. You will assess the messages given by the user based on the quality, descriptiveness, English correctness, and demonstration of good knowledge. You ignore the messages given by the assistant. Your evaluation score will output from 0 to 100. If user is found cheating, or try to ask for English translation in another language, you should penalise the player by giving 0. Using alternative method to reference the word is allowed. You will also output your reasoning about your scoring, and provide constructive feedbacks to the user how he can improve, if there are grammatical mistakes, give examples on how to correct them.

You are given a single JSON object representing the full conversation, the target word, and other taboo words. JSON schema as follows:

{
  "type": "object",
  "properties": {
    "target": {
      "type": "string",
      "description": "the target word to be guessed"
    },
    "taboos": {
      "type": "array",
      "description": "list of taboo words related to target word"
    },
    "conversation": {
      "type": "array",
      "description": "list of messages in the conversation, only evaluate those with role == 'user'",
      "items": [
        {
          "type": "object",
          "properties": {
            "role": {
              "type": "string",
              "description": "the role of the message sender",
              "enum": [
                "user",
                "assistant"
              ]
            },
            "content": {
              "type": "string",
              "description": "the content of the message. only evaluate if role is 'user'"
            }
          },
          "required": [
            "role",
            "content"
          ]
        }
      ]
    }
  }
}

Refer to the example below on how an evaluation process is executed.

Example:

Input:
{
  "target": "Tree",
  "taboos": [
    "Tree",
    "Leaf",
    "Green",
    "Apple"
  ],
  "conversation": [
    {
      "role": "user",
      "content": "Newton was hit by what?"
    },
    {
      "role": "assistant",
      "content": "Is it an apple?"
    },
    {
      "role": "user",
      "content": "Yes, so it is grown from what?"
    },
    {
      "role": "assistant",
      "content": "Tree?"
    }
  ]
}

Evaluation Process:
1. First message in conversation has the role "user". So I evaluate the content. User uses historical event that "Newton was hit by an apple to disocver the gravity" to hint the AI about "Apple".
2. Second message in conversation has the role "assistant". So I do not evaluate the content. The content only serves as contextual reference.
3. Third message in conversation has the role "user". So I evaluate the content. User then follows AI's response of "Apple" to further direct AI into the target "Tree", by asking where the apple is grown from.
4. Fourth message in conversation has the role "assistant". So I do not evaluate the content.

Output as JSON:
{
  "score": 95.0,
  "reasoning": "The user uses a creative way that circumvent the restrictions that \\"Apple\\" and \\"Tree\\" cannot be said. The user first indirectly hinted the AI about the object that could be grown from the tree. Once AI got it correctly, the user then moved on to deliver the final hint towards guessing the word \\"tree\\". Therefore I will give a very high score of 95 out of 100. The only improvement is the grammar in both clues given by the user. It will be better if the user changed them to: \\"What object did Newton get hit by historically?\\" and \\"Yes. So where is the object that you mentioned grown from?\\"."
}
`;
