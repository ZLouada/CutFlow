export type ProjectStatus =
  | "Brief Received"
  | "Files Uploaded"
  | "Editor Assigned"
  | "Editing"
  | "Internal Review"
  | "Client Review"
  | "Revisions Requested"
  | "Approved"
  | "Delivered";

export type TaskStatus = "To Do" | "In Progress" | "Waiting for Client" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type VideoType =
  | "YouTube Video"
  | "Shorts / Reels / TikTok"
  | "Podcast"
  | "Commercial / Ad"
  | "Course / Educational"
  | "Documentary";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export type Project = {
  id: string;
  clientId: string;
  name: string;
  type: string;
  platform: string;
  description: string;
  status: ProjectStatus;
  assignedEditor: {
    name: string;
    role: string;
    avatar?: string;
  };
  progress: number;
  aspectRatio: string;
  duration: string;
  numVideos: number;
  editingStyle: string;
  references: string;
  specialInstructions?: string;
  revisionsCount: number;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  deliveredDate?: string;
  finalVideoUrl?: string;
  isArchived?: boolean;
};

export type Task = {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  actionUrl?: string;
  actionLabel?: string;
};

export type FileItem = {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  name: string;
  type: string;
  format?: string;
  size: string;
  url: string;
  status: "Ready" | "Processing" | "Archived";
  uploadedAt: string;
  uploadDate?: string;
};

export type Message = {
  id: string;
  projectId?: string;
  projectName?: string;
  clientId: string;
  senderId?: string;
  senderName?: string;
  sender?: string;
  senderRole?: "client" | "agency" | "editor";
  senderAvatar?: string;
  message?: string;
  text?: string;
  isClient?: boolean;
  timestamp?: string;
  attachments?: { name: string; size: string; url: string }[];
  createdAt: string;
};

export type Revision = {
  id: string;
  projectId: string;
  round?: number;
  roundNumber?: number;
  timecode?: string;
  timestamps?: string[];
  description?: string;
  feedback?: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  requestedAt?: string;
  resolvedAt?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  projectName?: string;
  description?: string;
  amount: number | string;
  status: "Paid" | "Pending" | "Overdue";
  issuedAt: string;
  date?: string;
  dueDate: string;
  pdfUrl?: string;
  downloadUrl?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "project" | "task" | "message" | "file";
  link: string;
};

// Initial Seed Functions - returns empty arrays (no mock data)
export function getInitialSeedProjects(_clientId?: string): Project[] {
  return [];
}

export function getInitialSeedTasks(_clientId?: string): Task[] {
  return [];
}

export function getInitialSeedFiles(_clientId?: string): FileItem[] {
  return [];
}

export function getInitialSeedMessages(_clientId?: string): Message[] {
  return [];
}

export function getInitialSeedInvoices(_clientId?: string): Invoice[] {
  return [];
}

export function getInitialSeedNotifications(): NotificationItem[] {
  return [];
}

// Client Storage Manager
export class DashboardStore {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId || "client-default";
  }

  private getKey(collection: string) {
    return `cutflow_data_${this.clientId}_${collection}`;
  }

  private getCollection<T>(collection: string, defaultData: T[]): T[] {
    if (typeof window === "undefined") return defaultData;
    try {
      const stored = localStorage.getItem(this.getKey(collection));
      if (!stored) {
        localStorage.setItem(this.getKey(collection), JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(stored) as T[];
    } catch {
      return defaultData;
    }
  }

  private saveCollection<T>(collection: string, data: T[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.getKey(collection), JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  getProjects(): Project[] {
    return this.getCollection<Project>("projects", []);
  }

  getProject(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  getProjectById(id: string): Project | undefined {
    return this.getProject(id);
  }

  addProject(projectData: Partial<Project> & { name: string }): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      clientId: this.clientId,
      name: projectData.name,
      type: projectData.type || "YouTube Video",
      platform: projectData.platform || "YouTube",
      description: projectData.description || "Project brief submitted by client.",
      status: projectData.status || "Brief Received",
      assignedEditor: projectData.assignedEditor || {
        name: "Omar",
        role: "Lead Commercial Editor",
      },
      progress: projectData.progress ?? 10,
      aspectRatio: projectData.aspectRatio || "16:9",
      duration: projectData.duration || "05:00",
      numVideos: projectData.numVideos || 1,
      editingStyle: projectData.editingStyle || "Clean cuts, cinematic pacing",
      references: projectData.references || "",
      specialInstructions: projectData.specialInstructions,
      revisionsCount: projectData.revisionsCount || 0,
      dueDate: projectData.dueDate || new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.unshift(newProject);
    this.saveCollection("projects", projects);

    // Auto-create initial onboarding task
    this.addTask({
      projectId: newProject.id,
      projectName: newProject.name,
      title: `Confirm raw footage & reference assets for '${newProject.name}'`,
      description: "Make sure all footage links, sound preferences, and brief notes are accessible to your editor.",
      status: "To Do",
      priority: "High",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      actionUrl: `/dashboard/projects/${newProject.id}`,
      actionLabel: "View Project",
    });

    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    projects[idx] = {
      ...projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveCollection("projects", projects);
    return projects[idx];
  }

  updateProjectStatus(id: string, status: ProjectStatus, progress?: number): void {
    const project = this.getProject(id);
    if (!project) return;

    let defaultProgress = project.progress;
    if (progress !== undefined) {
      defaultProgress = progress;
    } else {
      switch (status) {
        case "Brief Received": defaultProgress = 10; break;
        case "Files Uploaded": defaultProgress = 25; break;
        case "Editor Assigned": defaultProgress = 35; break;
        case "Editing": defaultProgress = 60; break;
        case "Internal Review": defaultProgress = 75; break;
        case "Client Review": defaultProgress = 85; break;
        case "Revisions Requested": defaultProgress = 80; break;
        case "Approved": defaultProgress = 95; break;
        case "Delivered": defaultProgress = 100; break;
      }
    }

    this.updateProject(id, {
      status,
      progress: defaultProgress,
      deliveredDate: status === "Delivered" ? new Date().toISOString().split("T")[0] : project.deliveredDate,
    });
  }

  requestRevision(projectId: string, feedback: string, timestamps?: string[]): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const nextRound = (project.revisionsCount || 0) + 1;
    const revs = this.getRevisions(projectId);
    const newRev: Revision = {
      id: `rev-${Date.now()}`,
      projectId,
      round: nextRound,
      roundNumber: nextRound,
      feedback,
      description: feedback,
      timestamps,
      status: "In Progress",
      createdAt: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    };
    revs.unshift(newRev);
    this.saveCollection(`revisions_${projectId}`, revs);

    this.updateProject(projectId, {
      status: "Revisions Requested",
      revisionsCount: nextRound,
      progress: 78,
    });

    this.addTask({
      projectId,
      projectName: project.name,
      title: `Review updated Revision Round ${nextRound} when delivered`,
      description: `Editor is applying notes: "${feedback.slice(0, 80)}..."`,
      status: "In Progress",
      priority: "High",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      actionUrl: `/dashboard/projects/${projectId}`,
      actionLabel: "View Details",
    });
  }

  approveProject(projectId: string): void {
    const project = this.getProject(projectId);
    if (!project) return;

    this.updateProject(projectId, {
      status: "Approved",
      progress: 100,
      finalVideoUrl: "https://cutflow.agency/assets/videos/final-master-render.mp4",
    });

    this.addTask({
      projectId,
      projectName: project.name,
      title: `Download master deliverables for '${project.name}'`,
      description: "Approved master cut is ready for download in 4K ProRes and H.264 formats.",
      status: "To Do",
      priority: "Medium",
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
      actionUrl: `/dashboard/projects/${projectId}`,
      actionLabel: "Download Master",
    });
  }

  getRevisions(projectId: string): Revision[] {
    return this.getCollection<Revision>(`revisions_${projectId}`, []);
  }

  getTasks(): Task[] {
    return this.getCollection<Task>("tasks", []);
  }

  addTask(taskData: Omit<Task, "id" | "clientId" | "createdAt">): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      clientId: this.clientId,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    this.saveCollection("tasks", tasks);
    return newTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): void {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasks[idx].status = status;
      if (status === "Completed") {
        tasks[idx].completedAt = new Date().toISOString();
      }
      this.saveCollection("tasks", tasks);
    }
  }

  getFiles(): FileItem[] {
    return this.getCollection<FileItem>("files", []);
  }

  getFilesByProject(projectId: string): FileItem[] {
    return this.getFiles().filter((f) => f.projectId === projectId);
  }

  addFile(fileData: Partial<FileItem> & { name: string; projectId: string }): FileItem {
    const files = this.getFiles();
    const dateStr = new Date().toISOString().split("T")[0];
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      clientId: this.clientId,
      projectId: fileData.projectId,
      projectName: fileData.projectName || "Project",
      name: fileData.name,
      type: fileData.type || "Video",
      format: fileData.format || "MP4",
      size: fileData.size || "120 MB",
      url: fileData.url || "https://cutflow.media/storage/sample.mp4",
      status: (fileData.status as any) || "Ready",
      uploadedAt: new Date().toISOString(),
      uploadDate: dateStr,
    };
    files.unshift(newFile);
    this.saveCollection("files", files);
    return newFile;
  }

  deleteFile(id: string): void {
    const files = this.getFiles().filter((f) => f.id !== id);
    this.saveCollection("files", files);
  }

  getMessages(projectId?: string): Message[] {
    const all = this.getCollection<Message>("messages", []);
    if (projectId) {
      return all.filter((m) => m.projectId === projectId);
    }
    return all;
  }

  sendMessage(projectId: string, senderName: string, text: string, isClient: boolean = true): Message {
    const messages = this.getCollection<Message>("messages", []);
    const project = this.getProject(projectId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      clientId: this.clientId,
      projectId,
      projectName: project?.name || "Project",
      senderId: isClient ? this.clientId : "editor",
      senderName,
      sender: senderName,
      senderRole: isClient ? "client" : "editor",
      message: text,
      text,
      isClient,
      timestamp: timeStr,
      createdAt: now.toISOString(),
    };
    messages.push(newMsg);
    this.saveCollection("messages", messages);
    return newMsg;
  }

  getInvoices(): Invoice[] {
    return this.getCollection<Invoice>("invoices", []);
  }

  getNotifications(): NotificationItem[] {
    return this.getCollection<NotificationItem>("notifications", []);
  }

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notifs[idx].read = true;
      this.saveCollection("notifications", notifs);
    }
  }

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.saveCollection("notifications", notifs);
  }
}
