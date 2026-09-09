import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ensureUserProfile } from '../services/supabaseService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOfflineMode = !supabase;

  // Carrega/cria o profile de um usuário (funciona para e-mail/senha e Google OAuth)
  const loadProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setProfile(null);
      return;
    }
    setUser(authUser);
    const userProfile = await ensureUserProfile(authUser);
    setProfile(userProfile);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Checa sessão existente ao montar (ex: retorno de redirect OAuth)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await loadProfile(session?.user ?? null);
      setLoading(false);
    });

    // Ouve todas as mudanças de auth: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await loadProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, isOfflineMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
