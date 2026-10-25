import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useCutflowAuth, UserButton } from "@/lib/auth-context";
import {
  User,
  Bell,
  Shield,
  LogOut,
  Save,
  CheckCircle2,
  Globe,
  Sliders,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useCutflowAuth();

  const [channelName, setChannelName] = useState("");
  const [website, setWebsite] = useState("");
  const [timezone, setTimezone] = useState("America/New_York (UTC-5)");

  // Notification toggles
  const [notifyOnFirstCut, setNotifyOnFirstCut] = useState(true);
  const [notifyOnTaskAssigned, setNotifyOnTaskAssigned] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="label text-primary font-bold">Preferences & Profile</div>
            <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">Settings</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray">
              Manage your client profile, notification triggers, and authentication credentials.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="border border-emerald-500/40 bg-emerald-500/10 p-3.5 rounded-xs flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings and notification preferences updated successfully!</span>
          </div>
        )}

        {/* Client Profile Section */}
        <div className="border border-border bg-charcoal/80 p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h2 className="display text-lg text-snow font-bold">Client Profile</h2>
            </div>
            <span className="text-xs font-mono text-gray">
              Active Client Workspace
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="h-16 w-16 rounded-full border-2 border-primary/60 bg-primary/20 text-primary font-bold flex items-center justify-center text-xl shrink-0">
              {user?.firstName?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="text-base font-bold text-snow">{user?.fullName || "Client"}</h3>
              <p className="text-xs text-gray font-mono mt-0.5">{user?.email || "client@cutflow.agency"}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="label text-[0.65rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-xs">
                  Active Client
                </span>
                <span className="text-[0.68rem] text-gray font-mono">ID: {user?.id}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4 pt-4 border-t border-border/80">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Brand / Channel / Company Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Primary Website / Channel URL
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Production Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                >
                  <option value="America/New_York (UTC-5)">Eastern Time (US & Canada) — America/New_York</option>
                  <option value="America/Chicago (UTC-6)">Central Time (US & Canada) — America/Chicago</option>
                  <option value="America/Los_Angeles (UTC-8)">Pacific Time (US & Canada) — America/Los_Angeles</option>
                  <option value="Europe/London (UTC+0)">London / GMT — Europe/London</option>
                  <option value="Europe/Paris (UTC+1)">Paris / Berlin — Europe/Paris</option>
                  <option value="Asia/Dubai (UTC+4)">Gulf Standard Time — Asia/Dubai</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-slide btn-primary !py-2 !px-5 text-xs font-semibold flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile Info</span>
              </button>
            </div>
          </form>
        </div>

        {/* Notifications & Alert Settings */}
        <div className="border border-border bg-charcoal/80 p-6 sm:p-8 rounded-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/80 pb-4">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="display text-lg text-snow font-bold">Email & Production Alerts</h2>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-ink/50 border border-border rounded-xs cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-snow block">First Cut Ready for Review</span>
                <span className="text-[0.68rem] text-gray block mt-0.5">
                  Receive an instant email alert when an editor delivers a preview cut for feedback.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnFirstCut}
                onChange={(e) => setNotifyOnFirstCut(e.target.checked)}
                className="h-4 w-4 rounded-xs border-border bg-ink text-primary accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-ink/50 border border-border rounded-xs cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-snow block">Action Items & Tasks</span>
                <span className="text-[0.68rem] text-gray block mt-0.5">
                  Get notified when missing footage or brief clarification is required from you.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnTaskAssigned}
                onChange={(e) => setNotifyOnTaskAssigned(e.target.checked)}
                className="h-4 w-4 rounded-xs border-border bg-ink text-primary accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-ink/50 border border-border rounded-xs cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-snow block">Weekly Production Summary</span>
                <span className="text-[0.68rem] text-gray block mt-0.5">
                  A Monday morning digest of videos in pipeline, approved drafts, and remaining monthly quota.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyDailyDigest}
                onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                className="h-4 w-4 rounded-xs border-border bg-ink text-primary accent-primary"
              />
            </label>
          </div>
        </div>

        {/* Security & Sign Out Section */}
        <div className="border border-border bg-charcoal/80 p-6 sm:p-8 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h2 className="display text-lg text-snow font-bold">Session & Security</h2>
            </div>
          </div>

          <p className="text-xs text-gray leading-relaxed">
            Your login is authenticated with secure local session protocols. When working on shared devices, always sign out to protect confidential video assets and pre-release cuts.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-snow font-medium">Terminate Active Session:</span>
            <button
              onClick={() => {
                signOut().then(() => {
                  window.location.href = "/";
                });
              }}
              className="btn-slide btn-ghost !py-2 !px-4 text-xs text-rose-400 border-rose-500/30 hover:border-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out of Cutflow</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
