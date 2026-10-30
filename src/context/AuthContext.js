import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../config/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfileByUserId = async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, foundation_id, created_at, updated_at")
      .eq("id", userId)
      .single();

    setProfileLoading(false);

    if (error) {
      console.warn("No se pudo cargar el perfil:", error.message);
      setProfile(null);
      return null;
    }

    setProfile(data);
    return data;
  };

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        console.warn("No se pudo recuperar la sesión:", sessionError.message);
      }

      const currentSession = sessionData?.session ?? null;

      if (!currentSession) {
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // getSession() puede devolver una sesión local vieja si el usuario fue borrado
      // desde Supabase. getUser() valida que el usuario siga existiendo en el servidor.
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!mounted) return;

      if (userError || !userData?.user) {
        await supabase.auth.signOut({ scope: "local" });
        if (!mounted) return;
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setLoading(false);
    }

    bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncProfile() {
      const userId = session?.user?.id;

      if (!userId) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, foundation_id, created_at, updated_at")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      setProfileLoading(false);

      if (error) {
        console.warn("No se pudo cargar el perfil:", error.message);
        setProfile(null);
        return;
      }

      setProfile(data);
    }

    syncProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const refreshProfile = async () => loadProfileByUserId(session?.user?.id);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      profileLoading,
      refreshProfile,
      signOut,
    }),
    [session, profile, loading, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}
