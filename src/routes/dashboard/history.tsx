import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusBadge, EmptyState } from "@/components/dashboard/dashboard-ui";
import { useCutflowAuth } from "@/lib/auth-context";
import { DashboardStore, type Project } from "@/lib/dashboard-store";
import { History as HistoryIcon, Search, ArrowUpDown, Download, ArrowRight, Video } from "lucide-react";

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { user } = useCutflowAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "updated">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setProjects(store.getProjects());
  }, [store, clientId]);

  const historyProjects = projects.filter((p) => {
    // Show delivered, approved, or archived projects by default, or all if selected
    if (filter === "All") return p.status === "Delivered" || p.status === "Approved" || p.isArchived;
    if (filter === "Delivered") return p.status === "Delivered";
    if (filter === "Completed") return p.status === "Delivered" || p.status === "Approved";
    if (filter === "Archived") return Boolean(p.isArchived);
    return true;
  });

  const searched = historyProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sorted = [...searched].sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "updated") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="label text-primary font-bold">Archive & Vault</div>
            <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">Project History</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray">
              Your historical log of completed deliverables, past revisions, and archived assets.
            </p>
          </div>
        </div>

        {/* Filters, Search & Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["All", "Delivered", "Completed", "Archived"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`label text-xs px-3.5 py-1.5 rounded-xs transition-colors cursor-pointer shrink-0 border ${
                  filter === f
                    ? "bg-primary text-ink border-primary font-bold"
                    : "border-border text-gray hover:text-snow hover:bg-soft"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search & Sort Container */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray" />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-charcoal border border-border rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="h-3 w-3 text-gray" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-charcoal border border-border px-2 py-1.5 text-xs text-snow rounded-xs focus:outline-none focus:border-primary"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="updated">Recently Updated</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        {sorted.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No past projects found"
            description={
              searchQuery
                ? `No past projects matched "${searchQuery}".`
                : "Your completed and delivered video edits will appear here for long-term reference and re-download."
            }
          />
        ) : (
          <div className="border border-border bg-charcoal/60 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-ink/50 text-[0.68rem] font-mono uppercase text-gray">
                    <th className="p-4 font-semibold">Project Name</th>
                    <th className="p-4 font-semibold">Type & Format</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Delivered Date</th>
                    <th className="p-4 font-semibold">Final Version</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {sorted.map((item) => (
                    <tr key={item.id} className="hover:bg-soft/40 transition-colors">
                      <td className="p-4">
                        <Link
                          to={`/dashboard/projects/${item.id}`}
                          className="font-semibold text-snow hover:text-primary transition-colors block text-sm"
                        >
                          {item.name}
                        </Link>
                        <span className="text-[0.68rem] text-gray block mt-0.5">
                          Assigned: {item.assignedEditor.name}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-snow/90 font-medium block">{item.type}</span>
                        <span className="text-[0.68rem] font-mono text-gray">
                          {item.platform} • {item.aspectRatio}
                        </span>
                      </td>

                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="p-4 font-mono text-gray">
                        {item.dueDate || new Date(item.updatedAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        {item.finalVideoUrl ? (
                          <a
                            href={item.finalVideoUrl}
                            download
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                          >
                            <Download className="h-3 w-3" />
                            <span>v{item.revisionsCount + 1}.0-Master</span>
                          </a>
                        ) : (
                          <span className="font-mono text-gray">v{item.revisionsCount}.0</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          to={`/dashboard/projects/${item.id}`}
                          className="btn-slide btn-ghost !py-1.5 !px-3 text-[0.7rem] inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
