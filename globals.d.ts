import { Tables } from './lib/supabase/__generated__/types';
import { Database } from './lib/supabase/extension/types';

global {
  export type User = Tables<'users'>;
  export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  export type Level = Database['public']['Tables']['levels']['Row'];
}
