import { Database } from '@/lib/supabase/extension/types';
import { IScore } from '@/lib/types/score.type';

export type IGame = PartialBy<Database['public']['Tables']['games']['Row'], 'id' | 'user_id'> & {
  is_custom_game: boolean;
} & {
  scores: IScore[];
};
