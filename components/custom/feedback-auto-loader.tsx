'use client';

import { useAskForFeedback } from '@/components/ask-for-feedback-provider';

export function FeedbackAutoLoader() {
  useAskForFeedback();
  return null;
}
