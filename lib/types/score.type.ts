import { Database } from '@/lib/supabase/extension/types';

export type IScore = Database['public']['Tables']['game_scores']['Row'] & {
  taboos: string[];
  conversation: IScoreConversation[];
  highlights: IHighlight[];
  ai_evaluation: IAIEvaluation;
};

export type IAIEvaluation = Database['public']['Tables']['game_ai_evaluations']['Row'];

export type IScoreConversation = Database['public']['Tables']['game_score_conversations']['Row'];

export type IHighlight = Database['public']['Tables']['game_score_highlights']['Row'];
