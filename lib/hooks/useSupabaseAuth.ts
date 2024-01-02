'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    async function checkAuth() {
      const supabaseClient = createClient();
      const userResponse = await supabaseClient.auth.getUser();
      if (!userResponse.error) {
        // If logged-in session detected, setup user and user subscription
        await setupUserAndSubscription(userResponse.data.user.id);
      } else {
        setStatus('unauthenticated');
      }
    }

    void checkAuth();
  }, []);

  async function setupUserAndSubscription(uid: string) {
    const supabaseClient = createClient();

    // fetch user in a database
    const fetchUserResponse = await supabaseClient.from('users').select().eq('id', uid).single();
    if (fetchUserResponse.error) {
      console.error(fetchUserResponse.error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
      return;
    }
    const user = fetchUserResponse.data;
    setUser(user);

    // fetch subscription plan
    const fetchUserSubscriptionResponse = await supabaseClient
      .from('subscriptions')
      .select()
      .eq('user_id', uid)
      .single();
    const userSubscription = fetchUserSubscriptionResponse.data;
    const userPlan = await fetchCustomerSubscriptions(user.email, userSubscription?.customer_id);
    if (userPlan === undefined) {
      // set free plan
      setUserPlan({
        type: 'free',
      });
      // async update user subscription plan
      supabaseClient.from('subscriptions').upsert({
        user_id: uid,
        customer_plan_type: 'free',
      });
    } else {
      setUserPlan(userPlan);
      // async update user subscription plan
      supabaseClient.from('subscriptions').upsert({
        user_id: uid,
        customer_id: userPlan.customerId,
        customer_plan_type: userPlan.type,
      });
    }

    // set authenticated and show toast
    setStatus('authenticated');
    if (user.login_times <= 1) {
      toast({
        title: 'Welcome to Taboo AI!',
      });
    } else {
      toast({
        title: `Welcome back! ${user.nickname ?? user.name}`,
      });
    }
  }

  async function login() {
    setStatus('loading');
    const supabaseClient = createClient();

    // If auth error, alert user and return
    const oauthResponse = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (oauthResponse.error) {
      console.error(oauthResponse.error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
      return;
    }
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
