import { MergeDeep } from 'type-fest';

import { Database as DatabaseGenerated } from '../__generated__/types';

export type { Json } from '../__generated__/types';

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        v_level_with_best_score_and_top_scorers: {
          Row: {
            best_score: number;
            level_id: string;
            top_scorer_names: string[];
            top_scorer_ids: string[];
          };
        };
        v_levels_with_created_by_and_ranks: {
          Row: {
            best_score: number | null;
            created_by: string | null;
            created_at: string;
            difficulty: number;
            id: string;
            is_new: boolean;
            name: string;
            popularity: number;
            top_scorer_names: string[] | null;
            top_scorer_ids: string[] | null;
            words: string[];
          };
        };
        v_user_played_level_game_with_scores_and_completed_times: {
          Row: {
            completed_times: number;
            game_id: string;
            is_best_score: boolean;
            level_difficulty: number;
            level_id: string;
            level_name: string;
            total_score: number;
            user_email: string;
            user_id: string;
            game_finished_at: string;
            total_time_taken: number;
          };
        };
        v_game_level_info: {
          Row: {
            game_id: string;
            level_difficulty: number;
            level_id: string;
            level_name: string;
            total_score: number;
            total_time_taken: number;
          };
        };
        v_score_with_ai_evaluations: {
          Row: {
            ai_explanation: string;
            ai_score: number;
            ai_suggestion: string[] | null;
            conversations: {
              role: string;
              content: string;
            }[];
            duration: number;
            game_id: string;
            highlights: {
              start_position: number;
              end_position: number;
            }[];
            score_id: string;
            score_index: number;
            target_word: string;
            taboo_words: string[];
          };
        };
      };
    };
  }
>;
