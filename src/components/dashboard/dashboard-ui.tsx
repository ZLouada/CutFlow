import React, { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { ProjectStatus, TaskPriority, TaskStatus } from "@/lib/dashboard-store";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    "Brief Received": "bg-blue-500/15 text-blue-300 border-blue-500/30",
    "Files Uploaded": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    "Editor Assigned": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    Editing: "bg-primary/20 text-primary border-primary/40",
    "Internal Review": "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    "Client Review": "bg-amber-500/25 text-amber-200 border-amber-500/50 shadow-xs animate-pulse",
    "Revisions Requested": "bg-orange-600/20 text-orange-300 border-orange-600/40",
    Approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    Delivered: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[0.68rem] font-mono uppercase tracking-wider border font-medium ${
        styles[status] || "bg-soft text-snow border-border"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    "To Do": "bg-soft text-snow/70 border-border",
    "In Progress": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Waiting for Client": "bg-primary/20 text-primary border-primary/40 font-bold",
    Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[0.65rem] font-mono uppercase tracking-wide border ${
        styles[status] || "bg-soft text-snow border-border"
      }`}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const colors: Record<TaskPriority, string> = {
    Low: "text-gray border-border bg-ink/40",
    Medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    High: "text-rose-400 border-rose-500/40 bg-rose-500/10 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[0.62rem] font-mono uppercase rounded-xs border ${
        colors[priority]
      }`}
    >
      {priority}
    </span>
  );
}

export function StatCard({
  label,
  value,
  subtext,
  highlight = false,
}: {
  label: string;
  value: number | string;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 border rounded-sm flex flex-col justify-between transition-all ${
        highlight
          ? "border-primary/60 bg-charcoal text-snow shadow-sm"
          : "border-border bg-charcoal/70 text-snow hover:border-border/90"
      }`}
    >
      <div className="label text-xs text-gray uppercase tracking-wider">{label}</div>
      <div className="display mt-4 text-4xl sm:text-5xl font-extrabold text-snow tracking-tight">
        {value}
      </div>
      {subtext && <div className="mt-2 text-xs text-snow/60">{subtext}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  icon: Icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border border-dashed bg-charcoal/30 rounded-sm">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-soft flex items-center justify-center text-primary mb-4 border border-border">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="display text-xl sm:text-2xl text-snow font-bold">{title}</h3>
      <p className="mt-2 text-sm text-gray max-w-md">{description}</p>
      {(actionLabel && (actionTo || onAction)) && (
        <div className="mt-6">
          {actionTo ? (
            <Link to={actionTo} className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold">
              <span>{actionLabel}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold cursor-pointer"
            >
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
