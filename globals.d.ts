import { Database } from './lib/supabase/extension/types';

declare module '*.md';

global {
  export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  export type Level = Database['public']['Tables']['levels']['Row'];
}
