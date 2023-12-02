import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { NextResponse } from 'next/server';

export const plans: ISubscriptionPlan[] = [
  {
    type: 'free',
    priceId: undefined,
    name: 'Free Plan',
    pricePerMonth: 0,
    trialsDays: 0,
    tier: 1,
    features: [
      {
        id: 'feature-access-to-public-topics',
        title: 'Unlimited access to public topics',
        description:
          'In "Choose A Topic" page, you will be able to access all public topics available.',
        status: 'complete',
      },
      {
        id: 'feature-access-to-curated-topics',
        title: 'No access to curated topics',
        description:
          'Curated topics are organized and structured by Taboo AI, which are more effective for learning English from well-rounded aspects',
        status: 'absent',
      },
      {
        id: 'feature-ai-mode',
        title: 'No access to AI Mode',
        description:
          'In "Choose A Topic" page, if you cannot find the topics you are looking for, you can use "AI Mode", which will automatically generate a custom game of taboo based on the topic you entered.',
        status: 'absent',
      },
      {
        id: 'feature-ai-evaluation',
        title: 'GPT3 powered AI evaluation',
        description:
          'After completing a game, your performance will be evaluated by Taboo AI. AI evaluation serves as a great way to improve your English skills by pointing out your grammatical mistakes and suggesting improvements. Free plan comes with GPT3 AI model, which is not as powerful as GPT4, but still provides great evaluation results as feedbacks.',
        status: 'partial',
      },
      {
        id: 'feature-flashcard',
        title: '1 x flashcard deck creation',
        description:
          'You can create 1 flashcard deck. Flashcard deck is a great way to manage interesting words you encounter during the games. You can start a custom game from a flashcard deck, revise the words you have learned.',
        status: 'partial',
      },
    ],
  },
  {
    type: 'pro',
    priceId: process.env.STRIPE_SUBSCRIPTION_PRO_PLAN_PRICE_ID,
    name: 'Pro Plan',
    pricePerMonth: 10,
    trialsDays: 14,
    tier: 2,
    features: [
      {
        id: 'feature-access-to-public-topics',
        title: 'Unlimited access to public topics',
        description:
          'In "Choose A Topic" page, you will be able to access all public topics available. However, you will not be able to access topics curated by Taboo AI, which are more organized and structured.',
        status: 'complete',
      },
      {
        id: 'feature-access-to-curated-topics',
        title: 'Unlimited access to curated topics',
        description:
          'Curated topics are organized and structured by Taboo AI, which are more effective for learning English from well-rounded aspects',
        status: 'complete',
      },
      {
        id: 'feature-ai-mode',
        title: 'Access to AI Mode',
        description:
          'In "Choose A Topic" page, if you cannot find the topics you are looking for, you can use "AI Mode", which will automatically generate a custom game of taboo based on the topic you entered.',
        status: 'complete',
      },
      {
        id: 'feature-ai-evaluation',
        title: 'GPT4 powered AI evaluation',
        description:
          'After completing a game, your performance will be evaluated by Taboo AI. AI evaluation serves as a great way to improve your English skills by pointing out your grammatical mistakes and suggesting improvements. Pro plan comes with GPT4 AI model, which is by far the most powerful AI model available, and it provides the best evaluation results as feedbacks.',
        status: 'complete',
      },
      {
        id: 'feature-flashcard',
        title: 'Unlimited flashcard deck creation',
        description:
          'You can create unlimited number of flashcard decks. Flashcard deck is a great way to manage interesting words you encounter during the games. You can start a custom game from a flashcard deck, revise the words you have learned.',
        status: 'complete',
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json(plans);
}
