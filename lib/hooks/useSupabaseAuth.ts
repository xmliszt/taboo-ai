'use client';

import { useState } from 'react';

import { AuthStatus } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/utils/supabase/client';

import { fetchCustomerSubscriptions } from '../services/subscriptionService';
import { IUserSubscriptionPlan } from '../types/subscription-plan.type';
import { IUser } from '../types/user.type';

export function useSupabaseAuth() {
  const { toast } = useToast();
  const [user, setUser] = useState<IUser>();
  const [userPlan, setUserPlan] = useState<IUserSubscriptionPlan>();
  const [status, setStatus] = useState<AuthStatus>('loading');

  async function login() {
    setStatus('loading');
    const supabaseClient = createClient();

    // If auth error, alert user and return
    const oauthResponse = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: '/api/auth/callback',
      },
    });
    if (oauthResponse.error) {
      console.error(oauthResponse.error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
      return;
    }

    // Get the current auth user object
    const authUserResponse = await supabaseClient.auth.getUser();
    if (authUserResponse.error) {
      console.error(authUserResponse.error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
      return;
    }

    // If auth success, fetch user and update state
    const fetchUserResponse = await supabaseClient
      .from('users')
      .select()
      .eq('id', authUserResponse.data.user.id)
      .single();
    if (fetchUserResponse.error) {
      console.error(fetchUserResponse.error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
      return;
    }

    // fetch subscription plan
    const user = fetchUserResponse.data;
    const fetchUserSubscriptionResponse = await supabaseClient
      .from('subscriptions')
      .select()
      .eq('user_id', fetchUserResponse.data.id)
      .single();
    if (fetchUserSubscriptionResponse.error) {
      console.error(fetchUserSubscriptionResponse.error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
      return;
    }
    const userSubscription = fetchUserSubscriptionResponse.data;
    const userPlan = await fetchCustomerSubscriptions(user.email, userSubscription.customer_id);
    if (userPlan === undefined) {
      // set free plan
      setUserPlan({
        type: 'free',
      });
    } else {
      setUserPlan(userPlan);
    }

    // auth success, set user, set user subscription plan
    setUser(fetchUserResponse.data);
    setStatus('authenticated');
  }

  async function logout() {
    const supabaseClient = createClient();
    setStatus('loading');
    try {
      await supabaseClient.auth.signOut();
      toast({ title: 'You are logged out.' });
    } catch (error) {
      console.error(error);
    } finally {
      setStatus('unauthenticated');
    }
  }

  const refreshUserSubscriptionPlan = async () => {
    if (user) {
      const supabaseClient = createClient();
      const fetchUserSubscriptionResponse = await supabaseClient
        .from('subscriptions')
        .select()
        .eq('user_id', user.id)
        .single();
      if (fetchUserSubscriptionResponse.error) {
        // Failed to refresh user subscription plan throw error
        console.error(fetchUserSubscriptionResponse.error);
        throw fetchUserSubscriptionResponse.error;
      }
      const userPlan = await fetchCustomerSubscriptions(
        user.email,
        fetchUserSubscriptionResponse.data.customer_id
      );
      if (userPlan === undefined) {
        // set free plan
        setUserPlan({
          type: 'free',
        });
      } else {
        setUserPlan(userPlan);
      }
    } else {
      setUser(undefined);
      setUserPlan(undefined);
    }
  };

  return {
    user,
    userPlan,
    status,
    setStatus,
    login,
    logout,
    refreshUserSubscriptionPlan,
  };
}
