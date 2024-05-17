'use server';

import 'server-only';

import { cookies } from 'next/headers';
import OpenAI from 'openai';

import { ScoreToUpload } from '@/app/level/[id]/server/upload-game';
import { createClient } from '@/lib/utils/supabase/server';

const openai = new OpenAI();
const GPT_MODEL: OpenAI.Chat.ChatModel = 'gpt-3.5-turbo';

/**
 * Generate evaluation from AI.
 */
export async function generateEvaluationFromAI(gameScore: ScoreToUpload): Promise<{
  score: number;
  reasoning: string;
  examples: string[] | null;
}> {
  const supabaseClient = createClient(cookies());

  // Filter out conversation messages whose role is not 'user' or 'assistant'
  const filteredConversation = gameScore.conversations.filter(
    (message) => message.role === 'user' || message.role === 'assistant'
  );
  if (!gameScore.target_word || !filteredConversation)
    throw new Error('Missing target, taboos or conversation');

  // Fetch taboos for target word
  const fetchTaboosResponse = await supabaseClient
    .from('words')
    .select()
    .eq('word', gameScore.target_word)
    .maybeSingle();
  if (fetchTaboosResponse.error) throw fetchTaboosResponse.error;

  // Use json_mode for chat completion to get instruction to call function
  const systemPrompt = getEvaluationSystemMessage(fetchTaboosResponse.data?.taboos ?? []);
  const userMessage = JSON.stringify({
    target: gameScore.target_word,
    taboos: fetchTaboosResponse.data?.taboos ?? [],
    conversation: filteredConversation,
  });
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    model: GPT_MODEL,
    response_format: {
      type: 'json_object',
    },
  });

  const responseText = completion.choices.at(0)?.message.content;
  if (!responseText) throw new Error('Failed to generate evaluation response from AI');
  const responseJSON = JSON.parse(responseText);
  const {
    score,
    reasoning,
    examples,
  }: {
    score: number;
    reasoning: string;
    examples: string[];
  } = responseJSON;
  return {
    score,
    reasoning,
    examples,
  };
}

const getEvaluationSystemMessage = (taboos: string[]) => {
  return `
  You are an English linguistic expert. You are tasked to evaluate the linguistic performance of the user in the Game of Taboo. You will assess the clues given by the user and score from 0 to 100. If user is found cheating, or use direct translation in another language, you should penalise the player. 

  What is a good clue: simple and effective, creative, good grammar, smart association with other words without using the taboo words.
  
  You will be given a JSON stringified object that provides the following:
  - "target": the target word that the user is trying to describe (assistant is trying to guess)
  - "taboos": an array of words that the user is not allowed to use (assistant is allowed to say those words)
  - "conversation": an array of objects that represent the conversation between the user and the assistant.
  
  You are designed to output JSON.

  Your response is formatted as follows:
  {
    "score": {{a number from 0 to 100}},
    "reasoning": "{{your reasoning}}",
    "examples": ["{{example1}}", "{{example2}}", "{{example3}}"]
    "count": {{count of taboo words used, must be 0}}
  }

  For "reasoning", you will provide constructive feedbacks on how the user can improve on the grammar, word choices, sentence structure.

  For "examples", you will generate at least 3 suggestions of better hints as grammatically correct examples, with better word choices and sentence structure. Check the total count of any of the words from [${taboos}] and their lemmatized forms in the "examples" array and write the count in the "count" field. You must ensure that the "count" value is 0, if it is not 0, you need to rewrite the examples to ensure that the count is 0.

  Your response:
  `;
};
