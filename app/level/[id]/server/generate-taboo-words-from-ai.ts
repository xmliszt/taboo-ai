'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { isString, toLower, trim } from 'lodash';
import OpenAI from 'openai';

const openai = new OpenAI();

/**
 * Ask AI to generate taboo words for a given topic.
 */
export async function generateTabooWordsFromAI(targetWord: string, topic?: string) {
  cookies(); // opt-out for caching
  console.log(`Generating taboo words for ${targetWord} in ${topic}. Topic is omitted currently.`);
  const target = toLower(trim(targetWord));
  const systemPrompt = `
  You are tasked to generate 5-8 words related to a given target word in a given topic by user, in American English. Avoid plural and duplicates. You only respond in JSON format. Output your response in the following format:
  { "words": ["word1", "word2", ...] }
  `;
  const userPrompt = JSON.stringify({
    target,
    topic,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: {
      type: 'json_object',
    },
  });
  const responseText = completion.choices.at(0)?.message.content;
  if (!responseText) throw new Error('Failed to generate taboo words from AI');
  const resopnseJSON = JSON.parse(responseText);
  if (!resopnseJSON.words) throw new Error('Unparsable format from AI response');
  const words = resopnseJSON.words;
  if (!Array.isArray(words)) throw new Error('Invalid format from AI response');
  if (!words.every(isString)) throw new Error('Invalid format from AI response');

  return {
    word: target,
    taboos: words,
    is_verified: false,
    updated_at: new Date().toISOString(),
    created_by: null,
  };
}
