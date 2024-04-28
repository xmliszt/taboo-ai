import { Tables } from './lib/supabase/__generated__/types';

global {
  export type User = Tables<'users'>;
  export type Level = Tables<'levels'>;
  export type Word = Tables<'words'>;
}
