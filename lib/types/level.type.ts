import { Database } from '@/lib/supabase/extension/types';

export type LevelToUpload = Database['public']['Tables']['levels']['Row'] & {
  is_ai_generated: boolean;
};
