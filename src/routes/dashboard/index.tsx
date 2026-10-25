import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard, StatusBadge, PriorityBadge } from "@/components/dashboard/dashboard-ui";
import { useCutflowAuth } from "@/lib/auth-context";
import { DashboardStore, type Project, type Task } from "@/lib/dashboard-store";
import { ArrowRight, Clock, Video, UserCheck, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { user } = useCutflowAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setProjects(store.getProjects());
    setTasks(store.getTasks());
  }, [store, clientId]);

  const activeProjects = projects.filter((p) => p.status !== "Delivered" && !p.isArchived);
  const inProgressProjects = projects.filter(
    (p) => p.status === "Editing" || p.status === "Editor Assigned" || p.status === "Internal Review",
  );
  const awaitingReviewProjects = projects.filter(
    (p) => p.status === "Client Review" || p.status === "Revisions Requested",
  );
  const completedProjects = projects.filter((p) => p.status === "Delivered");

  const pendingTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 4);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-8">
          <div>
            <div className="label text-primary font-bold">Client Dashboard</div>
            <h1 className="display mt-1 text-3xl sm:text-5xl text-snow font-extrabold tracking-tight">
              Welcome back, {user?.firstName || "Creator"}
            </h1>
            <p className="mt-2 text-sm text-gray">Here's what's happening with your projects.</p>
          </div>

          <Link
            to="/dashboard/projects/new"
            className="btn-slide btn-primary !py-3 !px-6 text-xs font-semibold self-start sm:self-auto shrink-0"
          >
            <span>+ Start a New Project</span>
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Dynamic Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Active Projects"
            value={activeProjects.length}
            subtext="In production pipeline"
            highlight={true}
          />
          <StatCard
            label="Videos In Progress"
            value={inProgressProjects.length}
            subtext="Currently being cut & graded"
          />
          <StatCard
            label="Awaiting Your Review"
            value={awaitingReviewProjects.length}
            subtext="Action required by you"
            highlight={awaitingReviewProjects.length > 0}
          />
          <StatCard
            label="Completed"
            value={completedProjects.length}
            subtext="Master files delivered"
          />
        </div>

        {/* Active Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="display text-2xl text-snow font-bold">Active Projects</h2>
              <p className="text-xs text-gray mt-1">Live edits progressing through post-production</p>
            </div>
            <Link
              to="/dashboard/projects"
              className="link-line text-xs label text-primary hover:text-snow flex items-center gap-1.5"
            >
              <span>View all projects</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-10 border border-border border-dashed bg-charcoal/40 text-center rounded-sm">
              <p className="text-sm text-gray">No active projects currently in production.</p>
              <Link
                to="/dashboard/projects/new"
                className="btn-slide btn-primary !py-2 !px-4 text-xs mt-4 inline-flex"
              >
                <span>Start a Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col justify-between border border-border bg-charcoal/80 p-6 rounded-sm hover:border-primary/50 transition-all group"
                >
                  <div>
                    {/* Status & Platform Row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <StatusBadge status={project.status} />
                      <span className="label text-[0.62rem] text-gray bg-ink/60 px-2 py-0.5 rounded-xs border border-border/60">
                        {project.platform}
                      </span>
                    </div>

                    {/* Project Name */}
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
                        <div className="text-[0.65rem] text-gray uppercase font-mono">Assigned Editor</div>
                        <div className="font-medium text-snow mt-0.5 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          {project.assignedEditor.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-[0.65rem] text-gray uppercase font-mono">Due Date</div>
                        <div className="font-mono text-snow/90 mt-0.5">{project.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-[0.65rem] text-gray uppercase font-mono">Video Type</div>
                        <div className="font-medium text-snow/80 mt-0.5">{project.type}</div>
                      </div>
                      <div>
                        <div className="text-[0.65rem] text-gray uppercase font-mono">Revisions</div>
                        <div className="font-mono text-snow/80 mt-0.5">Round {project.revisionsCount}</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between">
                    <span className="text-[0.65rem] text-gray">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/dashboard/projects/${project.id}`}
                      className="link-line label text-xs text-primary group-hover:text-snow flex items-center gap-1"
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

        {/* Tasks Requiring Attention & Quick Overview */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Action Tasks (2 cols) */}
          <div className="lg:col-span-2 border border-border bg-charcoal/60 p-6 rounded-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="display text-lg text-snow font-bold">Tasks Requiring Attention</h3>
              </div>
              <Link to="/dashboard/tasks" className="text-xs label text-primary hover:underline">
                View all tasks ({tasks.length})
              </Link>
            </div>

            <div className="mt-4 divide-y divide-border/60">
              {pendingTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray">
                  You're all caught up! No pending client tasks.
                </div>
              ) : (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-soft/30 px-2 rounded-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={task.priority} />
                        <span className="text-xs font-semibold text-snow group-hover:text-primary transition-colors">
                          {task.title}
                        </span>
                      </div>
                      <p className="text-[0.75rem] text-gray mt-1 truncate">{task.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-[0.68rem] text-gray/80">
                        <span>Project: <strong className="text-snow/70">{task.projectName}</strong></span>
                        <span>•</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>

                    <Link
                      to={task.actionUrl || "/dashboard/tasks"}
                      className="btn-slide btn-ghost !py-1.5 !px-3 text-[0.7rem] self-start sm:self-auto shrink-0"
                    >
                      <span>{task.actionLabel || "Action"}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Agency Standards & Quick Contact (1 col) */}
          <div className="border border-border bg-charcoal/60 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider label">
                <AlertCircle className="h-4 w-4" />
                <span>Production Standard</span>
              </div>
              <h3 className="display text-lg text-snow font-bold mt-2">Cutflow Halal Guarantee</h3>
              <p className="mt-3 text-xs text-gray leading-relaxed">
                All projects are edited under our verified Halal Content Policy: 100% music-free cinematic sound design, zero indecent imagery, and strict copyright licensing.
              </p>

              <div className="mt-5 space-y-2 text-xs text-snow/80">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Foley, Voice-over & Ambient Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Two Revision Rounds Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Master Renders in 16:9, 9:16 & 1:1</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/80">
              <Link
                to="/dashboard/messages"
                className="block text-center w-full py-2.5 text-xs font-medium border border-border text-snow hover:border-primary hover:text-primary transition-colors"
              >
                Message Cutflow Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
