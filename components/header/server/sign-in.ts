import { createClient } from '@/lib/utils/supabase/client';

export async function signIn() {
  const supabaseClient = createClient();

  const oauthResponse = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });

  if (oauthResponse.error) console.error(oauthResponse.error);
}
