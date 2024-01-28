'use client';

import { useState, useTransition } from 'react';
import { AsyncReturnType } from 'type-fest';

import { generateEvaluationFromAI } from '@/app/level/[id]/server/generate-evaluation-from-ai';
import { Skeleton } from '@/components/custom/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchWord } from '@/lib/services/wordService';

export default function TestPage() {
  const [targetWord, setTargetWord] = useState<string>();
  const [userMessage, setUserMessage] = useState<string>();
  const [assistantMessage, setAssistantMessage] = useState<string>();
  const [evaluation, setEvaluation] = useState<AsyncReturnType<typeof generateEvaluationFromAI>>();
  const [taboos, setTaboos] = useState<string[]>();
  const [isPending, startTransition] = useTransition();

  return (
    <div className='flex flex-col gap-2 overflow-y-auto p-2'>
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            This playground is for you to test AI evaluation. Input the target word, one user
            message and one corresponding assistant message replying the user&apos;s message, and
            press &quot;Submit&quot;
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='flex flex-col gap-4'
            action={() => {
              startTransition(async () => {
                if (!targetWord || !userMessage || !assistantMessage) return;
                const word = await fetchWord(targetWord);
                if (word?.taboos) setTaboos(word.taboos);
                const evaluation = await generateEvaluationFromAI({
                  score_index: 0,
                  target_word: targetWord,
                  taboo_words: word?.taboos || [],
                  duration: 23,
                  highlights: [
                    {
                      start_position: 0,
                      end_position: 4,
                    },
                  ],
                  conversations: [
                    {
                      role: 'user',
                      content: userMessage,
                    },
                    {
                      role: 'assistant',
                      content: assistantMessage,
                    },
                  ],
                  ai_evaluation: {
                    ai_score: 0,
                    ai_explanation: '',
                    ai_suggestion: null,
                  },
                });
                setEvaluation(evaluation);
              });
            }}
          >
            <div className='flex flex-row items-center gap-2'>
              <Label className='w-[200px]' htmlFor='target-word'>
                Target Word
              </Label>
              <Input
                id='target-word'
                value={targetWord}
                onChange={(e) => {
                  setTargetWord(e.target.value);
                }}
              />
            </div>
            <div className='flex flex-row items-center gap-2'>
              <Label className='w-[200px]' htmlFor='user-msg'>
                User Message
              </Label>
              <Input
                id='user-msg'
                value={userMessage}
                onChange={(e) => {
                  setUserMessage(e.target.value);
                }}
              />
            </div>
            <div className='flex flex-row items-center gap-2'>
              <Label className='w-[200px]' htmlFor='ai-msg'>
                Assistant Message
              </Label>
              <Input
                id='ai-msg'
                value={assistantMessage}
                onChange={(e) => {
                  setAssistantMessage(e.target.value);
                }}
              />
            </div>
            <div className='mt-4'>
              <Button type='submit' disabled={isPending}>
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton />
          ) : (
            <div className='grid grid-cols-[100px_1fr] gap-4'>
              <Label className='w-[200px]'>Taboos</Label>
              <div>{taboos?.join(', ')}</div>
              <Label className='w-[200px]'>Score</Label>
              <div>{evaluation?.score}</div>
              <Label className='w-[200px]'>Explanation</Label>
              <div>{evaluation?.reasoning}</div>
              <Label className='w-[200px]'>Suggestions</Label>
              <ol>
                {evaluation?.examples &&
                  evaluation?.examples.map((example, idx) => (
                    <li key={idx} className='flex items-center'>
                      {idx + 1}. {example}
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
