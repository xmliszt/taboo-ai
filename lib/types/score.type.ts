import { Database } from '@/lib/supabase/extension/types';

export type IScore = PartialBy<
  Database['public']['Tables']['game_scores']['Row'],
  'id' | 'game_id'
> & {
  taboos: string[];
  conversation: IScoreConversation[];
  highlights: IHighlight[];
  ai_evaluation: IAIEvaluation | null | undefined;
};

export type IAIEvaluation = PartialBy<
  Database['public']['Tables']['game_ai_evaluations']['Row'],
  'score_id'
>;

export type IScoreConversation = PartialBy<
  Database['public']['Tables']['game_score_conversations']['Row'],
  'id' | 'score_id'
>;

export type IHighlight = PartialBy<
  Database['public']['Tables']['game_score_highlights']['Row'],
  'id' | 'score_id'
>;
