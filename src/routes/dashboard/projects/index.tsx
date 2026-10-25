import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusBadge, EmptyState } from "@/components/dashboard/dashboard-ui";
import { useHikariiAuth } from "@/lib/auth-context";
import { DashboardStore, type Project, type ProjectStatus } from "@/lib/dashboard-store";
import { Search, Plus, ArrowRight, Video } from "lucide-react";

export const Route = createFileRoute("/dashboard/projects/")({
  head: () => ({
    meta: [{ title: "My Projects — HiKARii" }],
  }),
  component: MyProjectsPage,
});

function MyProjectsPage() {
  const { user } = useHikariiAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setProjects(store.getProjects());
  }, [store, clientId]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "All") return true;
    if (filter === "Active") return p.status !== "Delivered" && !p.isArchived;
    if (filter === "Review") return p.status === "Client Review" || p.status === "Revisions Requested";
    if (filter === "Delivered") return p.status === "Delivered";
    return p.status === filter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="label text-primary font-bold">Workspace</div>
            <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">My Projects</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray">
              Manage all current and completed video edits.
            </p>
          </div>

          <Link
            to="/dashboard/projects/new"
            className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold self-start sm:self-auto shrink-0"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Start a New Project</span>
            </span>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["All", "Active", "Review", "Delivered"].map((f) => (
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray" />
            <input
              type="text"
              placeholder="Search by title, format, platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-charcoal border border-border rounded-xs text-xs text-snow placeholder:text-gray/60 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Projects List/Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={Video}
            title={searchQuery ? "No matching projects" : "No projects yet"}
            description={
              searchQuery
                ? `No projects matched "${searchQuery}". Try a different search term or clear the filter.`
                : "Start your first project and let HiKARii handle the editing."
            }
            actionLabel="Start a Project"
            actionTo="/dashboard/projects/new"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between border border-border bg-charcoal/80 p-6 rounded-sm hover:border-primary/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <StatusBadge status={project.status} />
                    <span className="label text-[0.62rem] text-gray bg-ink/60 px-2 py-0.5 rounded-xs border border-border/60">
                      {project.platform}
                    </span>
                  </div>

                  <h3 className="display text-xl text-snow font-bold group-hover:text-primary transition-colors">
                    <Link to={`/dashboard/projects/${project.id}`}>{project.name}</Link>
                  </h3>

                  <p className="mt-2 text-xs text-gray line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[0.7rem] text-gray uppercase font-mono">Progress</span>
                      <span className="text-[0.7rem] font-mono text-primary font-bold">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-ink rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-700"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-border/60 text-xs">
                    <div>
                      <div className="text-[0.65rem] text-gray uppercase font-mono">Editor</div>
                      <div className="font-medium text-snow mt-0.5">{project.assignedEditor.name}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-gray uppercase font-mono">Due Date</div>
                      <div className="font-mono text-snow/90 mt-0.5">{project.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-gray uppercase font-mono">Aspect Ratio</div>
                      <div className="font-mono text-snow/80 mt-0.5">{project.aspectRatio}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-gray uppercase font-mono">Revisions</div>
                      <div className="font-mono text-snow/80 mt-0.5">Round {project.revisionsCount}</div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between">
                  <span className="text-[0.65rem] text-gray">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/dashboard/projects/${project.id}`}
                    className="link-line label text-xs text-primary group-hover:text-snow flex items-center gap-1 font-semibold"
                  >
                    <span>View Project</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
