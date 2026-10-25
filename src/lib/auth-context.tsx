import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ClerkProvider,
  useUser as useClerkUser,
  useClerk,
  UserButton as ClerkUserButton,
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
  UserProfile as ClerkUserProfile,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
} from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

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
  signOut: () => Promise<void>;
  isClerkConfigured: boolean;
  toggleMockSignIn?: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
  signOut: async () => {},
  isClerkConfigured: false,
});

// Demo fallback client user
const DEMO_USER: AuthUser = {
  id: "client-alex-rivera",
  firstName: "Alex",
  lastName: "Rivera",
  fullName: "Alex Rivera",
  email: "alex@creators.co",
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const rawKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_CLERK_PUBLISHABLE_KEY) ||
  "";

export const IS_CLERK_ENABLED = Boolean(
  rawKey &&
    rawKey.startsWith("pk_") &&
    !rawKey.includes("placeholder") &&
    rawKey.length > 20,
);

// Inner consumer for live Clerk
function LiveClerkBridge({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const clerk = useClerk();

  const user: AuthUser | null =
    isSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          firstName: clerkUser.firstName || "Client",
          lastName: clerkUser.lastName || "",
          fullName: clerkUser.fullName || clerkUser.firstName || "Cutflow Client",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          imageUrl: clerkUser.imageUrl,
        }
      : null;

  const value: AuthContextType = {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    user,
    signOut: async () => {
      await clerk.signOut();
    },
    isClerkConfigured: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Fallback provider for dev / sandbox mode when no Clerk key is set
function FallbackAuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cutflow_mock_auth");
    if (saved !== null) {
      setIsSignedIn(saved === "true");
    }
  }, []);

  const handleSignOut = async () => {
    setIsSignedIn(false);
    localStorage.setItem("cutflow_mock_auth", "false");
  };

  const toggleMockSignIn = () => {
    const next = !isSignedIn;
    setIsSignedIn(next);
    localStorage.setItem("cutflow_mock_auth", String(next));
  };

  const value: AuthContextType = {
    isLoaded: mounted,
    isSignedIn,
    user: isSignedIn ? DEMO_USER : null,
    signOut: handleSignOut,
    isClerkConfigured: false,
    toggleMockSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function CutflowAuthProvider({ children }: { children: ReactNode }) {
  if (IS_CLERK_ENABLED) {
    return (
      <ClerkProvider
        publishableKey={rawKey}
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#FF5A00",
            colorBackground: "#151515",
            colorInputBackground: "#0A0A0A",
            colorInputText: "#FFFFFF",
            colorText: "#FFFFFF",
            colorTextSecondary: "#A1A1A1",
            borderRadius: "0.25rem",
          },
          elements: {
            card: "border border-border bg-charcoal shadow-2xl",
            navbarButton: "hover:text-primary",
            formButtonPrimary: "bg-primary text-ink font-semibold hover:opacity-90",
            footerActionLink: "text-primary hover:underline",
          },
        }}
      >
        <LiveClerkBridge>{children}</LiveClerkBridge>
      </ClerkProvider>
    );
  }

  return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
}

export function useCutflowAuth() {
  return useContext(AuthContext);
}

// Re-export standard Clerk widgets or fallback equivalents
export function UserButton({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const auth = useCutflowAuth();

  if (auth.isClerkConfigured) {
    return <ClerkUserButton afterSignOutUrl={afterSignOutUrl} />;
  }

  if (!auth.isSignedIn || !auth.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={auth.user.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
        alt={auth.user.fullName}
        className="h-8 w-8 rounded-full border border-primary/50 object-cover"
      />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useCutflowAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-snow">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent rounded-full" />
          <span className="label text-gray">Authenticating Cutflow Portal...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // If not signed in, redirect to /sign-in
    if (typeof window !== "undefined") {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`;
    }
    return null;
  }

  return <>{children}</>;
}
