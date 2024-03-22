'use client';

import { useEffect, useState, useTransition } from 'react';

import { fetchLevel } from '@/app/level/[id]/server/fetch-level';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

import { LevelCard } from '../../level-card';

export function QuickAccessLevelCard(props: { levelId: string; author: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [level, setLevel] = useState<
    Level & {
      is_ai_generated: boolean;
      best_score: number | null;
      top_scorer_ids: string[];
      top_scorer_names: string[];
    }
  >();

  useEffect(() => {
    startTransition(async () => {
      const level = await fetchLevel(props.levelId);
      setLevel({
        ...level,
        created_by: props.author,
        is_ai_generated: false,
        best_score: null,
        top_scorer_ids: [],
        top_scorer_names: [],
      });
    });
  }, []);

  return isPending ? (
    <div className='h-48 w-48 animate-pulse bg-gray-200' />
  ) : (
    <LevelCard
      level={level}
      beforeGoToLevel={() => {
        EventManager.fireEvent(CustomEventKey.CLOSE_FEATURE_POPUP);
      }}
    />
  );
}
