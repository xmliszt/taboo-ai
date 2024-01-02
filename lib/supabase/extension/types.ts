import { MergeDeep } from 'type-fest';

import { Database as DatabaseGenerated } from '../__generated__/types';

export type { Json } from '../__generated__/types';

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        level_top_scorer_stats: {
          Row: {
            level_id: string;
            player_ids: string[];
            total_score: number;
          };
        };
      };
    };
  }
>;
