import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl?: string;
};

type AuthContextType = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AuthUser | null;
  signIn: (userData: { email: string; fullName?: string }) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
  signIn: () => {},
  signOut: async () => {},
});

const STORAGE_KEY = "hikarii_auth_user";
const LEGACY_STORAGE_KEY = "cutflow_auth_user";

export function HikariiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const signIn = (userData: { email: string; fullName?: string }) => {
    const emailParts = userData.email.split("@")[0] || "Client";
    const nameToUse = userData.fullName?.trim() || emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
    const names = nameToUse.split(" ");
    const firstName = names[0] || "Client";
    const lastName = names.slice(1).join(" ") || "";

    const newUser: AuthUser = {
      id: `client-${Date.now()}`,
      firstName,
      lastName,
      fullName: nameToUse,
      email: userData.email,
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const signOut = async () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const value: AuthContextType = {
    isLoaded,
    isSignedIn: Boolean(user),
    user,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const CutflowAuthProvider = HikariiAuthProvider;

export function useHikariiAuth() {
  return useContext(AuthContext);
}

export const useCutflowAuth = useHikariiAuth;

export function UserButton() {
  const { user } = useHikariiAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 text-primary font-bold flex items-center justify-center text-xs">
        {user.firstName?.charAt(0) || "C"}
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useHikariiAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-snow">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent rounded-full" />
          <span className="label text-gray text-xs">Loading HiKARii Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    if (typeof window !== "undefined") {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`;
    }
    return null;
  }

  return <>{children}</>;
}
