import { describe, expect, it, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { DashboardStore } from "@/lib/dashboard-store";

describe("Dashboard Routes and Store", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches all dashboard routes properly", () => {
    const routesToTest = [
      "/dashboard",
      "/dashboard/projects",
      "/dashboard/projects/new",
      "/dashboard/tasks",
      "/dashboard/history",
      "/dashboard/files",
      "/dashboard/messages",
      "/dashboard/billing",
      "/dashboard/settings",
      "/sign-in",
      "/sign-up",
    ];

    for (const path of routesToTest) {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe("__root__");
    }
  });

  describe("DashboardStore", () => {
    let store: DashboardStore;

    beforeEach(() => {
      localStorage.clear();
      store = new DashboardStore("test-client");
    });

    it("initializes with seed data", () => {
      const projects = store.getProjects();
      expect(projects.length).toBeGreaterThanOrEqual(3);

      const tasks = store.getTasks();
      expect(tasks.length).toBeGreaterThanOrEqual(4);

      const files = store.getFiles();
      expect(files.length).toBeGreaterThanOrEqual(3);

      const invoices = store.getInvoices();
      expect(invoices.length).toBeGreaterThanOrEqual(3);
    });

    it("can create a new project and initial task", () => {
      const newProj = store.addProject({
        name: "Test Podcast Episode 10",
        type: "Podcast",
        platform: "YouTube",
        aspectRatio: "16:9",
        duration: "45 mins",
        editingStyle: "Clean cuts, multicam sync",
        description: "Intake description for podcast",
        dueDate: "2026-11-05",
      });

      expect(newProj.id).toBeDefined();
      expect(newProj.status).toBe("Brief Received");

      const retrieved = store.getProjectById(newProj.id);
      expect(retrieved?.name).toBe("Test Podcast Episode 10");

      const tasks = store.getTasks().filter((t) => t.projectId === newProj.id);
      expect(tasks.length).toBeGreaterThan(0);
    });

    it("updates project status and creates notifications", () => {
      const projects = store.getProjects();
      const first = projects[0];

      store.updateProjectStatus(first.id, "Editing", 50);
      const updated = store.getProjectById(first.id);
      expect(updated?.status).toBe("Editing");
      expect(updated?.progress).toBe(50);
    });

    it("handles revision request and marks project as Revisions Requested", () => {
      const projects = store.getProjects();
      const first = projects[0];
      const initialCount = first.revisionsCount;

      store.requestRevision(first.id, "Trim intro by 5 seconds", ["00:05", "01:20"]);
      const updated = store.getProjectById(first.id);

      expect(updated?.status).toBe("Revisions Requested");
      expect(updated?.revisionsCount).toBe(initialCount + 1);

      const revs = store.getRevisions(first.id);
      expect(revs.length).toBeGreaterThan(0);
      expect(revs[0].feedback).toBe("Trim intro by 5 seconds");
    });

    it("approves project and sets status to Approved", () => {
      const projects = store.getProjects();
      const first = projects[0];

      store.approveProject(first.id);
      const updated = store.getProjectById(first.id);
      expect(updated?.status).toBe("Approved");
      expect(updated?.progress).toBe(100);
    });

    it("adds and deletes vault files", () => {
      const initialCount = store.getFiles().length;

      const file = store.addFile({
        name: "new_broll_cut.mp4",
        type: "Video",
        size: "300 MB",
        projectId: "proj-1",
        projectName: "Test Project",
        url: "https://cutflow.media/storage/file.mp4",
        status: "Ready",
      });

      expect(store.getFiles().length).toBe(initialCount + 1);

      store.deleteFile(file.id);
      expect(store.getFiles().length).toBe(initialCount);
    });

    it("sends and stores chat messages", () => {
      const msg = store.sendMessage("proj-1", "Client User", "Hello editor!", true);
      expect(msg.id).toBeDefined();

      const msgs = store.getMessages("proj-1");
      expect(msgs.some((m) => m.text === "Hello editor!")).toBe(true);
    });

    it("toggles task status", () => {
      const task = store.getTasks()[0];
      store.updateTaskStatus(task.id, "Completed");

      const updated = store.getTasks().find((t) => t.id === task.id);
      expect(updated?.status).toBe("Completed");
    });
  });
});
