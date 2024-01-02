import { Database } from '@/lib/supabase/extension/types';

/**
 * UserLevel type: for firestore /users/{email}/levels/{levelId} document
 */
export type IUserLevel =
  Database['public']['Functions']['get_user_played_levels_summary']['Returns'][number];
