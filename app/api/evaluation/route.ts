import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Chat } from 'openai/resources';

import { firestore } from '@/firebase/firebase-admin';
import { googleGeminiPro } from '@/lib/google-ai';
import { openai } from '@/lib/openai';
import { IChat } from '@/lib/types/score.type';

import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;

import ChatCompletionUserMessageParam = Chat.ChatCompletionUserMessageParam;

type AIEvaluationMode = 'basic' | 'advanced';

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
  let evaluationMode: AIEvaluationMode = 'basic';
  if (userEmail) {
    const userDoc = await firestore.doc(`users/${userEmail}`).get();
    evaluationMode = userDoc.data()?.customerPlanType === 'pro' ? 'advanced' : 'basic';
  }
  console.log(`Using ${evaluationMode} mode for evaluation`);

  // Filter out conversation messages whose role is not 'user' or 'assistant'
  const filteredConversation = conversation.filter(
    (message) => message.role === 'user' || message.role === 'assistant'
  );
  if (!target || !taboos || !filteredConversation) {
    return new Response('Missing target, taboos or conversation', {
      status: 400,
    });
  }

  if (evaluationMode === 'advanced') {
    try {
      // Use json_mode for chat completion to get instruction to call function
      const systemMessage: ChatCompletionSystemMessageParam = {
        role: 'system',
        content: getEvaluationSystemMessage(target, taboos),
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
        model: 'gpt-4-1106-preview',
        response_format: {
          type: 'json_object',
        },
      });
      const { score, reasoning } = JSON.parse(completion.choices[0].message.content ?? '');
      return NextResponse.json({
        score,
        reasoning,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: 'Error creating thread',
        },
        { status: 500 }
      );
    }
  } else {
    try {
      // Use json_mode for chat completion to get instruction to call function
      const systemMessage = {
        role: 'user',
        parts: getEvaluationSystemMessage(target, taboos),
      };
      const modelMessage = {
        role: 'model',
        parts:
          "Ok, I will be ready to evaluate the user's clue performance based on input JSON object, and output the score and reasoning in the requested JSON format. I will not mention the target word and taboo words in my suggestions and examples.",
      };
      const userMessage = JSON.stringify({
        target,
        taboos,
        conversation: filteredConversation,
      });
      const chat = googleGeminiPro.startChat({
        history: [systemMessage, modelMessage],
      });
      const completion = await chat.sendMessage(userMessage);
      const responseText = completion.response.text();
      const { score, reasoning } = JSON.parse(responseText);
      return NextResponse.json(
        {
          score,
          reasoning,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: 'Error processing the evaluation',
          error: error,
        },
        { status: 500 }
      );
    }
  }
}

const getEvaluationSystemMessage = (target: string, taboos: string[]) => {
  return `
  You are a judge and advisor in Taboo AI game. Taboo AI game follows the rules of the traditional Game of Taboo. User engaged in a conversation with AI. Your job is to evaluate the performance of the user based on his clues. The users are English learners who are trying to improve their English skills. You will assess the messages given by the user based on the quality, descriptiveness, English correctness, and demonstration of good knowledge. Your evaluation score from 0 to 100. If user is found cheating, or try to ask for English translation in another language, you should penalise the player by giving 0. You will output your reasoning about your scoring, and provide constructive feedbacks to the user how the user can improve on the grammar, word choices, sentence structure, without using any of the target word and taboo words given.
  
  Remember, the user is not allowed to say: ${[target, ...taboos].join(', ')}.

  You should teach the user how to create a better hint that does not use any of the taboo words: ${[
    target,
    ...taboos,
  ].join(', ')}, and is grammatically correct, with better word choices and sentence structure.
  
  Output your score and reasoning in JSON stringified format: {"score": 100, "reasoning": ""}
  
  Example output with the correct format:
  {"score": 95.0,"reasoning": "The user uses a very creative way of hinting the AI into guessing the target word without saying any of the taboo words. Therefore I will give a very high score of 95 out of 100."}
  
  Your output should not have any newline character or any escaping character. Keep it as a single line JSON stringified string.
  `;
};
