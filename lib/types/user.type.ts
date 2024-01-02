import { Database } from '@/lib/supabase/extension/types';

export type IUser = Database['public']['Tables']['users']['Row'];
