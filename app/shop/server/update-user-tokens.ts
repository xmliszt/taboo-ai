import { cookies } from 'next/headers';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

import 'server-only';

export async function updateUserTokens({ tokens }: { tokens: number }) {
  // Revalidate cache.
  cookies();

  const user = await fetchUserProfile();
  if (user === null || user === undefined) throw new Error('Not logged in!');

  const supabase = createServiceRoleClient();
  const response = await supabase
    .from('users')
    .update({
      tokens: (user.tokens ?? 0) + tokens,
    })
    .eq('id', user.id)
    .select()
    .single();

  if (response.error) throw response.error.message;

  return { user: response.data };
}
