import { Database } from '@/lib/supabase/extension/types';

export type ILevel = Database['public']['Tables']['levels']['Row'] & {
  is_ai_generated: boolean;
};
