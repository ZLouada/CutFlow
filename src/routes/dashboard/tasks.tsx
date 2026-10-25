import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TaskStatusBadge, PriorityBadge, EmptyState } from "@/components/dashboard/dashboard-ui";
import { useHikariiAuth } from "@/lib/auth-context";
import { DashboardStore, type Task, type TaskStatus, type TaskPriority } from "@/lib/dashboard-store";
import { CheckSquare, ArrowUpDown, Filter, CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/tasks")({
  head: () => ({
    meta: [{ title: "Tasks — HiKARii" }],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { user } = useHikariiAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("dueDate");

  const refreshTasks = () => {
    setTasks(store.getTasks());
  };

  useEffect(() => {
    refreshTasks();
  }, [store, clientId]);

  const handleToggleTask = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === "Completed" ? "To Do" : "Completed";
    store.updateTaskStatus(taskId, nextStatus);
    refreshTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const pMap: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const filterOptions: { label: string; value: string; count: number }[] = [
    { label: "All Tasks", value: "All", count: tasks.length },
    { label: "Waiting for You", value: "Waiting for Client", count: tasks.filter((t) => t.status === "Waiting for Client").length },
    { label: "To Do", value: "To Do", count: tasks.filter((t) => t.status === "To Do").length },
    { label: "In Progress", value: "In Progress", count: tasks.filter((t) => t.status === "In Progress").length },
    { label: "Completed", value: "Completed", count: tasks.filter((t) => t.status === "Completed").length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="label text-primary font-bold">Action Items</div>
            <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">Tasks & Approvals</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray">
              Items requiring your input, review, or asset delivery to keep post-production moving fast.
            </p>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value)}
                className={`label text-xs px-3.5 py-1.5 rounded-xs transition-colors shrink-0 border cursor-pointer ${
                  filter === opt.value
                    ? "bg-primary text-ink border-primary font-bold"
                    : "border-border text-gray hover:text-snow hover:bg-soft"
                }`}
              >
                <span>{opt.label}</span>
                <span className="ml-1.5 opacity-70 font-mono text-[0.68rem]">({opt.count})</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray" />
            <span className="text-[0.7rem] font-mono uppercase text-gray">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-charcoal border border-border px-2.5 py-1 text-xs text-snow rounded-xs focus:outline-none focus:border-primary"
            >
              <option value="dueDate">Due Date (Urgent first)</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="createdAt">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        {sortedTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks in this view"
            description="All clear! There are no pending action items matching the selected filter."
          />
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const isDone = task.status === "Completed";
              return (
                <div
                  key={task.id}
                  className={`border border-border p-4 sm:p-5 rounded-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone ? "bg-ink/40 opacity-70" : "bg-charcoal/80 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className="mt-0.5 text-gray hover:text-primary transition-colors cursor-pointer shrink-0"
                      title={isDone ? "Mark incomplete" : "Mark as completed"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 hover:text-primary" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <TaskStatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[0.7rem] font-mono text-gray">
                          Project: <strong className="text-snow/80">{task.projectName}</strong>
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-semibold transition-colors ${
                          isDone ? "line-through text-gray" : "text-snow"
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="text-xs text-gray mt-1 leading-relaxed">{task.description}</p>

                      <div className="flex items-center gap-4 mt-2.5 text-[0.68rem] text-gray/80 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task CTA Action */}
                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className="text-[0.7rem] font-mono text-gray hover:text-snow underline cursor-pointer"
                    >
                      {isDone ? "Reopen" : "Mark Done"}
                    </button>

                    {task.actionUrl && (
                      <Link
                        to={task.actionUrl}
                        className="btn-slide btn-primary !py-1.5 !px-3.5 text-xs font-semibold flex items-center gap-1"
                      >
                        <span>{task.actionLabel || "Open Action"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
