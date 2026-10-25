import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useHikariiAuth } from "@/lib/auth-context";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/layout";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [{ title: "Sign In — HiKARii" }],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { signIn } = useHikariiAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    signIn({ email: email.trim() });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-block">
          <Logo className="h-9 w-auto mx-auto" />
        </Link>
        <div className="label text-primary font-bold mt-4 tracking-wider">Client Portal Access</div>
        <h1 className="display text-2xl sm:text-3xl font-extrabold text-snow mt-1">
          Sign In to Your Workspace
        </h1>
        <p className="text-xs sm:text-sm text-gray mt-1">
          Review edits, leave timestamped feedback, and download master renders.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="border border-border bg-charcoal p-7 sm:p-9 rounded-sm shadow-2xl space-y-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-snow mb-1.5">Client Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-snow">Password</label>
                <span className="text-[0.65rem] text-primary cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-slide btn-primary !py-3 w-full text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              <span>Enter HiKARii Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="pt-4 border-t border-border/80 text-center text-xs text-gray">
            Don't have an account yet?{" "}
            <Link to="/sign-up" className="text-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Return Link */}
      <div className="mt-8 relative z-10">
        <Link to="/" className="text-xs text-gray hover:text-snow transition-colors">
          ← Back to HiKARii Home
        </Link>
      </div>
    </div>
  );
}
