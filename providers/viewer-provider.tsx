"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { getAnonymousId } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track";

interface ViewerContextValue {
  anonymousId: string | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  mergeAnonymousHistory: () => Promise<{ mergedCount: number; dedupedCount: number }>;
}

const ViewerContext = createContext<ViewerContextValue | null>(null);

export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [anonymousId] = useState(() => getAnonymousId());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!active) return;

      startTransition(() => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      });
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      startTransition(() => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setIsLoading(false);
      });

      if (event === "SIGNED_IN" && nextSession?.user) {
        trackEvent("login_completed", { provider: nextSession.user.app_metadata.provider ?? "unknown" });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signInWithOAuth(provider: "google" | "apple") {
    trackEvent("login_started", { provider });

    const redirectTo =
      typeof window === "undefined"
        ? undefined
        : `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) throw error;
  }

  async function signInWithMagicLink(email: string) {
    trackEvent("login_started", { provider: "magic_link" });

    const redirectTo =
      typeof window === "undefined"
        ? undefined
        : `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function mergeAnonymousHistory() {
    if (!anonymousId) {
      return { mergedCount: 0, dedupedCount: 0 };
    }

    const res = await fetch("/api/auth/merge-anonymous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anonymousId }),
    });
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.error || "Failed to merge anonymous history");
    }

    trackEvent("merge_anonymous_history", {
      mergedCount: payload.mergedCount,
      dedupedCount: payload.dedupedCount,
    });

    return payload;
  }

  return (
    <ViewerContext.Provider
      value={{
        anonymousId,
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle: () => signInWithOAuth("google"),
        signInWithApple: () => signInWithOAuth("apple"),
        signInWithMagicLink,
        signOut,
        mergeAnonymousHistory,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const context = useContext(ViewerContext);

  if (!context) {
    throw new Error("useViewer must be used within ViewerProvider");
  }

  return context;
}
