import { useCallback, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserProfile = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

const getRedirectUrl = () => window.location.origin;

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!supabase || !nextUser) {
      setProfile(null);
      return null;
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, username, display_name, avatar_url, created_at, updated_at')
      .eq('user_id', nextUser.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setProfile(null);
      return null;
    }

    if (data) {
      setProfile(data as UserProfile);
      return data as UserProfile;
    }

    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: nextUser.id,
        display_name: nextUser.user_metadata?.full_name ?? '',
        avatar_url: nextUser.user_metadata?.avatar_url ?? '',
      })
      .select('id, user_id, username, display_name, avatar_url, created_at, updated_at')
      .single();

    if (insertError) {
      setError(insertError.message);
      setProfile(null);
      return null;
    }

    setProfile(insertedProfile as UserProfile);
    return insertedProfile as UserProfile;
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function initializeAuth() {
      setIsLoading(true);
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (sessionError) {
        setError(sessionError.message);
      }

      const nextSession = data.session;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      await loadProfile(nextSession?.user ?? null);

      if (isMounted) setIsLoading(false);
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      loadProfile(nextSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });
    if (signInError) setError(signInError.message);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) return;
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) return;
    setError(null);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });
    if (signUpError) throw signUpError;
  };

  const signOut = async () => {
    if (!supabase) return;
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const saveProfile = async (values: { username: string; displayName: string; avatarUrl: string }) => {
    if (!supabase || !user) return;

    const username = values.username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
      throw new Error('Kullanıcı adı 3-24 karakter olmalı; küçük harf, sayı ve alt çizgi kullanabilirsiniz.');
    }

    const { data, error: updateError } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          username,
          display_name: values.displayName.trim(),
          avatar_url: values.avatarUrl.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      .select('id, user_id, username, display_name, avatar_url, created_at, updated_at')
      .single();

    if (updateError) {
      if (updateError.code === '23505') {
        throw new Error('Bu kullanıcı adı alınmış.');
      }
      throw updateError;
    }
    setProfile(data as UserProfile);
  };

  return {
    session,
    user,
    profile,
    isLoading,
    error,
    isConfigured: Boolean(supabase),
    needsProfileSetup: Boolean(user && profile && !profile.username),
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    saveProfile,
    refreshProfile: () => loadProfile(user),
  };
}
