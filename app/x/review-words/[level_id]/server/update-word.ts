'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function updateWord(word: string, taboos: string[]) {
  const supabase = createServiceRoleClient();
  const updateWordResponse = await supabase
    .from('words')
    .update({
      taboos,
    })
    .eq('word', word);
  if (updateWordResponse.error) throw updateWordResponse.error;
}

export async function updateTarget(oldTarget: string, newTarget: string) {
  const supabase = createServiceRoleClient();
  const updateTargetResponse = await supabase
    .from('words')
    .update({
      word: newTarget,
    })
    .eq('word', oldTarget);
  if (updateTargetResponse.error) throw updateTargetResponse.error;
}

export async function verifyTarget(target: string) {
  const supabase = createServiceRoleClient();
  const verifyTargetResponse = await supabase
    .from('words')
    .update({
      is_verified: true,
    })
    .eq('word', target);
  if (verifyTargetResponse.error) throw verifyTargetResponse.error;
}

export async function rejectTarget(target: string) {
  const supabase = createServiceRoleClient();
  const rejectTargetResponse = await supabase
    .from('words')
    .update({
      is_verified: false,
    })
    .eq('word', target);
  if (rejectTargetResponse.error) throw rejectTargetResponse.error;
}
