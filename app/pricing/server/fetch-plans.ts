'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetch available Taboo AI plans.
 */
export async function fetchPlans() {
  const supabaseClient = createClient(cookies());
  const fetchPlansResponse = await supabaseClient.from('plans').select('*,plan_features(*)');
  if (fetchPlansResponse.error) throw fetchPlansResponse.error;
  return fetchPlansResponse.data;
}

export type Plan = AsyncReturnType<typeof fetchPlans>[number];
