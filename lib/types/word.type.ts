import { Database } from '@/lib/supabase/extension/types';

export type IWord = Database['public']['Tables']['words']['Row'];
