import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Video,
  CheckSquare,
  Clock,
  FolderOpen,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Plus,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Logo } from "@/components/site/layout";
import { useCutflowAuth, ProtectedRoute, UserButton } from "@/lib/auth-context";
import { DashboardStore, type NotificationItem } from "@/lib/dashboard-store";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/projects", label: "My Projects", icon: Video },
  { to: "/dashboard/tasks", label: "Tasks", icon: CheckSquare, badgeKey: "tasks" },
  { to: "/dashboard/history", label: "History", icon: Clock },
  { to: "/dashboard/files", label: "Files", icon: FolderOpen },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, signOut, isClerkConfigured, toggleMockSignIn } = useCutflowAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);

  const clientId = user?.id || "client-default";
  const store = new DashboardStore(clientId);

  useEffect(() => {
    setNotifications(store.getNotifications());
    const tasks = store.getTasks().filter((t) => t.status !== "Completed");
    setPendingTasksCount(tasks.length);
  }, [currentPath, user?.id]);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead();
    setNotifications(store.getNotifications());
  };

  const handleNotifClick = (id: string) => {
    store.markNotificationRead(id);
    setNotifications(store.getNotifications());
    setNotifOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-ink text-snow flex flex-col lg:flex-row antialiased">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 xl:w-72 flex-col justify-between border-r border-border bg-charcoal/90 backdrop-blur-md sticky top-0 h-screen z-40 select-none">
          <div>
            {/* Header branding */}
            <div className="p-6 border-b border-border/80 flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <Logo className="h-7 w-auto" />
                <span className="label text-[0.6rem] bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.5 rounded-xs ml-1">
                  PORTAL
                </span>
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              <div className="label px-3 py-2 text-[0.65rem] text-gray uppercase tracking-wider font-semibold">
                Client Workspace
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.to === "/dashboard"
                    ? currentPath === "/dashboard"
                    : currentPath.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-ink font-semibold shadow-xs"
                        : "text-snow/75 hover:text-snow hover:bg-soft/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-ink" : "text-gray"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badgeKey === "tasks" && pendingTasksCount > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                          isActive ? "bg-ink text-snow" : "bg-primary text-ink"
                        }`}
                      >
                        {pendingTasksCount}
                      </span>
                    )}

                    {item.badgeKey === "messages" && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive ? "bg-ink" : "bg-primary animate-pulse"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & actions in sidebar footer */}
          <div className="p-4 border-t border-border/80 bg-ink/40">
            {/* Public website link */}
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 text-xs text-gray hover:text-snow hover:bg-soft/50 rounded-sm mb-3 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Cutflow Website</span>
              </span>
              <span className="label text-[0.6rem] text-gray">Public</span>
            </Link>

            {/* User profile block */}
            <div className="flex items-center justify-between p-2 rounded-sm bg-soft/50 border border-border/60">
              <div className="flex items-center gap-3 min-w-0">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="h-9 w-9 rounded-full border border-primary/40 object-cover shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary text-ink font-bold flex items-center justify-center shrink-0">
                    {user?.firstName?.[0] || "C"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-snow truncate">{user?.fullName || "Client"}</div>
                  <div className="text-[0.68rem] text-gray truncate">{user?.email || "Signed In"}</div>
                </div>
              </div>

              {isClerkConfigured ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-1.5 text-gray hover:text-destructive transition-colors rounded-sm hover:bg-ink cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>

            {!isClerkConfigured && (
              <div className="mt-2 text-[0.65rem] text-gray/80 px-1 flex items-center justify-between">
                <span>Demo Client Mode</span>
                <button
                  type="button"
                  onClick={toggleMockSignIn}
                  className="underline hover:text-primary cursor-pointer"
                >
                  Switch User
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MOBILE TOP BAR */}
        <header className="lg:hidden flex items-center justify-between border-b border-border bg-charcoal px-4 py-3.5 sticky top-0 z-50">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo className="h-6 w-auto" />
            <span className="label text-[0.55rem] bg-primary/20 text-primary px-1.5 py-0.5 rounded-xs">
              PORTAL
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/projects/new"
              className="p-1.5 bg-primary text-ink rounded-sm font-semibold hover:opacity-90"
              title="Start Project"
            >
              <Plus className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray hover:text-snow"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* MOBILE SLIDE-OUT MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-ink/95 pt-16 p-6 overflow-y-auto flex flex-col justify-between">
            <nav className="space-y-1">
              <div className="label px-3 py-2 text-xs text-gray uppercase">Navigation</div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.to === "/dashboard"
                    ? currentPath === "/dashboard"
                    : currentPath.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-sm text-base ${
                      isActive
                        ? "bg-primary text-ink font-semibold"
                        : "text-snow/80 hover:bg-soft"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeKey === "tasks" && pendingTasksCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-ink font-bold">
                        {pendingTasksCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-border mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-ink font-bold flex items-center justify-center">
                    {user?.firstName?.[0] || "C"}
                  </div>
                  <div>
                    <div className="font-semibold text-snow">{user?.fullName}</div>
                    <div className="text-xs text-gray">{user?.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="label text-destructive flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 text-xs text-gray border border-border hover:text-snow"
              >
                Back to Cutflow Website →
              </Link>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar for Desktop */}
          <div className="hidden lg:flex items-center justify-between border-b border-border bg-charcoal/40 px-8 py-3.5 backdrop-blur-md sticky top-0 z-30">
            {/* Breadcrumb / Title indication */}
            <div className="flex items-center gap-2 text-xs text-gray">
              <Link to="/dashboard" className="hover:text-snow">Dashboard</Link>
              {currentPath !== "/dashboard" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-border" />
                  <span className="text-snow capitalize">
                    {currentPath.replace("/dashboard/", "").replace("-", " ")}
                  </span>
                </>
              )}
            </div>

            {/* Quick Actions & Notification Bell */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard/projects/new"
                className="btn-slide btn-primary !py-2 !px-4 text-xs font-semibold"
              >
                <span>+ Start a New Project</span>
              </Link>

              {/* Notification Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-sm text-gray hover:text-snow hover:bg-soft transition-colors cursor-pointer"
                  aria-label="View notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-sm border border-border bg-charcoal shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="label text-snow font-bold">Notifications</span>
                        {unreadNotifsCount > 0 && (
                          <span className="label text-[0.6rem] bg-primary text-ink px-1.5 py-0.2 rounded-xs">
                            {unreadNotifsCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[0.65rem] text-primary hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-gray py-4 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link}
                            onClick={() => handleNotifClick(n.id)}
                            className={`block p-2.5 rounded-sm text-xs transition-colors ${
                              n.read
                                ? "bg-ink/40 text-gray hover:bg-soft/50"
                                : "bg-soft text-snow border-l-2 border-primary hover:bg-soft/80"
                            }`}
                          >
                            <div className="font-semibold text-snow">{n.title}</div>
                            <div className="text-[0.7rem] text-gray mt-0.5">{n.description}</div>
                            <div className="text-[0.65rem] text-gray/60 mt-1">{n.timestamp}</div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Outlet for Dashboard Pages */}
          <main className="flex-1 p-5 sm:p-8 xl:p-10 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
