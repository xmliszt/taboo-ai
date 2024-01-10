import { Database } from '@/lib/supabase/extension/types';
import { IScore } from '@/lib/types/score.type';

export type IGame = Database['public']['Tables']['games']['Row'] & {
  is_custom_game: boolean;
} & {
  scores: IScore[];
};
