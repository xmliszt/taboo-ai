'use server';

import 'server-only';

import * as console from 'console';
import { cookies } from 'next/headers';
import { User } from '@supabase/gotrue-js';

import { ScoreToUpload } from '@/app/level/[id]/server/upload-game';
import { fetchCurrentAuthUser } from '@/app/profile/server/fetch-user-profile';
import { googleGeminiPro } from '@/lib/google-ai';
import { createClient } from '@/lib/utils/supabase/server';

/**
 * Generate evaluation from AI.
 */
export async function generateEvaluationFromAI(gameScore: ScoreToUpload): Promise<{
  score: number;
  reasoning: string;
  examples: string[] | null;
}> {
  let user: User | undefined = undefined;
  try {
    user = await fetchCurrentAuthUser();
  } catch (error) {
    // do nothing - user not logged in
  }

  const supabaseClient = createClient(cookies());
  // Based on user's plan, determine which model to use
  let evaluationMode: AIEvaluationMode = 'basic';
  if (user) {
    const fetchUserSubscriptionResponse = await supabaseClient
      .from('subscriptions')
      .select()
      .eq('user_id', user.id)
      .single();
    if (fetchUserSubscriptionResponse.error) throw fetchUserSubscriptionResponse.error;
    const userSubscription = fetchUserSubscriptionResponse.data;
    evaluationMode = userSubscription.customer_plan_type === 'pro' ? 'advanced' : 'basic';
  }
  console.log(`Using ${evaluationMode} mode for evaluation`);

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
  const evaluationPrompt = getEvaluationSystemMessage(
    gameScore.target_word,
    fetchTaboosResponse.data?.taboos ?? [],
    evaluationMode === 'advanced'
  );
  const systemMessage = {
    role: 'user',
    parts: evaluationPrompt,
  };
  const modelMessage = {
    role: 'model',
    parts:
      "Ok, I will be ready to evaluate the user's clue performance based on input JSON object, and output the score and reasoning in the requested JSON format. I will not mention the target word and taboo words in my suggestions and examples.",
  };
  const userMessage = JSON.stringify({
    target: gameScore.target_word,
    taboos: fetchTaboosResponse.data?.taboos ?? [],
    conversation: filteredConversation,
  });
  const chat = googleGeminiPro.startChat({
    history: [systemMessage, modelMessage],
  });
  const completion = await chat.sendMessage(userMessage);
  const responseText = completion.response.text();
  const {
    score,
    reasoning,
    examples,
  }: {
    score: number;
    reasoning: string;
    examples: string[];
  } = JSON.parse(responseText);

  if (evaluationMode === 'advanced') {
    return {
      score,
      reasoning,
      examples,
    };
  } else {
    return {
      score,
      reasoning,
      examples: null,
    };
  }
}

type AIEvaluationMode = 'basic' | 'advanced';

const getEvaluationSystemMessage = (target: string, taboos: string[], withSuggestions: boolean) => {
  return `
  You are a judge and advisor in Taboo AI game. Taboo AI game follows the rules of the traditional Game of Taboo. User engaged in a conversation with AI. Your job is to evaluate the performance of the user based on his clues. The users are English learners who are trying to improve their English skills. You will assess the messages given by the user based on the quality, descriptiveness, English correctness, and demonstration of good knowledge. Your evaluation score from 0 to 100. If user is found cheating, or try to ask for English translation in another language, you should penalise the player. You will output your reasoning about your scoring, and provide constructive feedbacks to the user how the user can improve on the grammar, word choices, sentence structure, without using any of the target word and taboo words given.
  
  ${
    withSuggestions &&
    `Generate suggestions of better hints as grammatically correct examples, with better word choices and sentence structure. Give at least three examples. Do not include any of the word in [${taboos}]`
  }
  
  Output your score and reasoning ${
    withSuggestions && 'and examples'
  } in JSON stringified format: {"score": 100, "reasoning": ""${
    withSuggestions && ', "examples": [""]'
  }}
  
  Example output with the correct format:
  {"score": 95.0, "reasoning": "The user uses a very creative way of hinting the AI into guessing the target word without saying any of the taboo words. Therefore I will give a very high score of 95 out of 100."${
    withSuggestions &&
    ', "examples": ["Which fruit falls from the tree and hits Newton on the head?", "Which fruit is red and has a stem?"]'
  }}
  
  Your output should not have any newline character or any escaping character. Keep it as a single line JSON stringified string.
  `;
};
