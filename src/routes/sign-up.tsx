import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { useCutflowAuth, IS_CLERK_ENABLED } from "@/lib/auth-context";
import { ShieldCheck, ArrowRight } from "lucide-react";
import logo from "@/assets/cutflow-logo.png";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const { isClerkConfigured, toggleMockSignIn, isSignedIn } = useCutflowAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@creators.co");
  const [password, setPassword] = useState("••••••••••••");

  const handleDemoSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (toggleMockSignIn && !isSignedIn) {
      toggleMockSignIn();
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-block">
          <img src={logo} alt="Cutflow" className="h-9 w-auto mx-auto" />
        </Link>
        <div className="label text-primary font-bold mt-4 tracking-wider">Client Onboarding</div>
        <h1 className="display text-2xl sm:text-3xl font-extrabold text-snow mt-1">
          Create Your Cutflow Client Account
        </h1>
        <p className="text-xs sm:text-sm text-gray mt-1">
          Connect with professional editors under our verified Halal Content Policy.
        </p>
      </div>

      <div className="w-full max-w-md relative z-10">
        {IS_CLERK_ENABLED ? (
          <div className="flex justify-center">
            <ClerkSignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/dashboard"
            />
          </div>
        ) : (
          <div className="border border-border bg-charcoal p-7 sm:p-9 rounded-sm shadow-2xl space-y-6">
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xs text-xs text-snow/90">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>
                <strong>Sandbox Mode:</strong> Sign up instantly to explore the Cutflow client portal.
              </span>
            </div>

            <form onSubmit={handleDemoSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-slide btn-primary !py-3 w-full text-xs font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Client Account & Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-border/80 text-center text-xs text-gray">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 relative z-10">
        <Link to="/" className="text-xs text-gray hover:text-snow transition-colors">
          ← Back to Cutflow Home
        </Link>
      </div>
    </div>
  );
}
