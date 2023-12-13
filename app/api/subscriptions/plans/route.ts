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
        id: 'feature-ai-evaluation',
        title: 'GPT3 powered AI evaluation',
        description:
          'After completing a game, your performance will be evaluated by Taboo AI. AI evaluation serves as a great way to improve your English skills by pointing out your grammatical mistakes and suggesting improvements. Free plan comes with GPT3 AI model, which is not as powerful as GPT4, but still provides great evaluation results as feedbacks.',
        status: 'partial',
      },
      {
        id: 'feature-recent-games',
        title: 'View 1 most recent game in profile',
        description:
          'In your profile, you are able to see your most recent 1 game played. You can revisit the game results by clicking on the game card. PRO plan allows you to view most recent 10 game results.',
        status: 'partial',
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
        id: 'feature-game-stats',
        title: 'No access to exclusive game statistics',
        description:
          'In your profile, a game statistics section is available for PRO plan users. It provides you with insights on your performance, for example, how many games you have played, which topic you have played the most,, which topic you have the best performance, etc.',
        status: 'absent',
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
        id: 'feature-ai-evaluation',
        title: 'GPT4 powered AI evaluation',
        description:
          'After completing a game, your performance will be evaluated by Taboo AI. AI evaluation serves as a great way to improve your English skills by pointing out your grammatical mistakes and suggesting improvements. Pro plan comes with GPT4 AI model, which is by far the most powerful AI model available, and it provides the best evaluation results as feedbacks.',
        status: 'complete',
      },
      {
        id: 'feature-recent-games',
        title: 'View 10 most recent games in profile',
        description:
          'In your profile, you are able to see your most recent 10 games played. You can revisit the game results by clicking on the game card.',
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
        id: 'feature-game-stats',
        title: 'Access to exclusive game statistics',
        description:
          'In your profile, a game statistics section is available for PRO plan users. It provides you with insights on your performance, for example, how many games you have played, which topic you have played the most,, which topic you have the best performance, etc.',
        status: 'complete',
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json(plans);
}
