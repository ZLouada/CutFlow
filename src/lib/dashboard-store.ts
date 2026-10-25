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
  progress: number; // 0 - 100
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

// Initial Seed Data per Client
export function getInitialSeedProjects(clientId: string): Project[] {
  return [
    {
      id: "proj-1",
      clientId,
      name: "Night Drive Commercial Cut",
      type: "Commercial",
      platform: "YouTube & Instagram",
      description: "High-octane urban night drive cinematic commercial with heavy sound design, kinetic typography, and graded automotive footage.",
      status: "Client Review",
      assignedEditor: {
        name: "Omar",
        role: "Lead Commercial Editor",
      },
      progress: 80,
      aspectRatio: "16:9 & 9:16",
      duration: "00:45",
      numVideos: 2,
      editingStyle: "Fast cuts, color graded teal & orange, rhythm-matched foley",
      references: "https://cutflow.agency/work",
      specialInstructions: "Strictly adhere to Cutflow Halal policy: no musical track, rely on custom exhaust foley, tire squeals, and subtle atmospheric synth drone.",
      revisionsCount: 1,
      createdAt: "2026-10-18T10:00:00Z",
      updatedAt: "2026-10-25T14:30:00Z",
      dueDate: "2026-10-28",
    },
    {
      id: "proj-2",
      clientId,
      name: "The Wild Ideas Podcast Ep. 42",
      type: "Podcast",
      platform: "YouTube",
      description: "Full multi-cam podcast cut with dynamic speaker tracking, title lower thirds, chapter cards, and audio de-noising.",
      status: "Editing",
      assignedEditor: {
        name: "Theo",
        role: "Long-form & Colorist",
      },
      progress: 55,
      aspectRatio: "16:9",
      duration: "48:15",
      numVideos: 1,
      editingStyle: "Clean cuts, documentary pacing, subtle lower-third animations",
      references: "https://cutflow.agency/work",
      specialInstructions: "Voice-over clean up on guest mic; insert B-roll over timestamps 12:10 - 15:40.",
      revisionsCount: 0,
      createdAt: "2026-10-21T09:15:00Z",
      updatedAt: "2026-10-24T18:00:00Z",
      dueDate: "2026-10-30",
    },
    {
      id: "proj-3",
      clientId,
      name: "Daily SPF — UGC Product Launch",
      type: "UGC Ads",
      platform: "TikTok & Reels",
      description: "Organic style UGC creator compilation hooks, retention pacing, and high-converting captions for paid TikTok advertising.",
      status: "Brief Received",
      assignedEditor: {
        name: "Yusuf",
        role: "Motion & Social Designer",
      },
      progress: 15,
      aspectRatio: "9:16",
      duration: "00:25",
      numVideos: 3,
      editingStyle: "Kinetic type, split screens, quick zoom transitions",
      references: "TikTok ad reference links provided in brief",
      revisionsCount: 0,
      createdAt: "2026-10-24T16:00:00Z",
      updatedAt: "2026-10-25T08:00:00Z",
      dueDate: "2026-11-02",
    },
    {
      id: "proj-4",
      clientId,
      name: "Autumn Studio Lookbook",
      type: "Short Film",
      platform: "YouTube & Vimeo",
      description: "Atmospheric fashion brand showcase highlighting material textures, silhouettes, and natural ambient lighting.",
      status: "Delivered",
      assignedEditor: {
        name: "Theo",
        role: "Long-form & Colorist",
      },
      progress: 100,
      aspectRatio: "16:9",
      duration: "02:10",
      numVideos: 1,
      editingStyle: "Cinematic 35mm film grain, gentle dissolves, ambient Foley",
      references: "Cinema lookbooks",
      revisionsCount: 2,
      createdAt: "2026-09-12T11:00:00Z",
      updatedAt: "2026-09-28T16:00:00Z",
      dueDate: "2026-09-28",
      deliveredDate: "2026-09-28",
      finalVideoUrl: "https://cutflow.agency/assets/videos/lookbook-master.mp4",
      isArchived: true,
    },
    {
      id: "proj-5",
      clientId,
      name: "Q3 Founder Keynote Recap",
      type: "Advertisement",
      platform: "LinkedIn & YouTube",
      description: "Dynamic highlight reel summarizing annual investor updates and product roadmap announcements.",
      status: "Delivered",
      assignedEditor: {
        name: "Omar",
        role: "Lead Commercial Editor",
      },
      progress: 100,
      aspectRatio: "16:9",
      duration: "01:30",
      numVideos: 1,
      editingStyle: "Punchy keynote cuts with animated infographic callouts",
      references: "Tech keynote recaps",
      revisionsCount: 1,
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-15T15:00:00Z",
      dueDate: "2026-09-15",
      deliveredDate: "2026-09-15",
      finalVideoUrl: "https://cutflow.agency/assets/videos/keynote-master.mp4",
      isArchived: true,
    },
  ];
}

export function getInitialSeedTasks(clientId: string): Task[] {
  return [
    {
      id: "task-1",
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      clientId,
      title: "Review 'Night Drive Commercial Cut v1'",
      description: "Omar has delivered Cut v1. Check color balance, timing, and sound design. Approve or request adjustments.",
      status: "Waiting for Client",
      priority: "High",
      dueDate: "2026-10-27",
      createdAt: "2026-10-25T14:30:00Z",
      actionUrl: "/dashboard/projects/proj-1",
      actionLabel: "Review Cut v1",
    },
    {
      id: "task-2",
      projectId: "proj-3",
      projectName: "Daily SPF — UGC Product Launch",
      clientId,
      title: "Upload missing product beauty shots",
      description: "Upload the high-res 4K macro bottle shots to the project files so Yusuf can insert them at 00:08.",
      status: "To Do",
      priority: "Medium",
      dueDate: "2026-10-28",
      createdAt: "2026-10-24T16:00:00Z",
      actionUrl: "/dashboard/files",
      actionLabel: "Upload Files",
    },
    {
      id: "task-3",
      projectId: "proj-2",
      projectName: "The Wild Ideas Podcast Ep. 42",
      clientId,
      title: "Confirm title lower-third spelling for guest",
      description: "Please confirm guest full title: 'Dr. Tariq Mansoor, Chief of Neurological Research'.",
      status: "Waiting for Client",
      priority: "Low",
      dueDate: "2026-10-29",
      createdAt: "2026-10-23T11:00:00Z",
      actionUrl: "/dashboard/projects/proj-2",
      actionLabel: "Verify Spelling",
    },
    {
      id: "task-4",
      projectId: "proj-4",
      projectName: "Autumn Studio Lookbook",
      clientId,
      title: "Download approved ProRes 422 Master",
      description: "All revisions resolved and master render delivered for production archive.",
      status: "Completed",
      priority: "Low",
      dueDate: "2026-09-28",
      createdAt: "2026-09-28T16:00:00Z",
      completedAt: "2026-09-29T10:00:00Z",
      actionUrl: "/dashboard/projects/proj-4",
      actionLabel: "View Deliverable",
    },
  ];
}

export function getInitialSeedFiles(clientId: string): FileItem[] {
  return [
    {
      id: "file-1",
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      clientId,
      name: "NightDrive_A_Cam_ProRes.mov",
      type: "video",
      format: "MOV",
      size: "4.8 GB",
      url: "#",
      status: "Ready",
      uploadedAt: "2026-10-18T10:30:00Z",
    },
    {
      id: "file-2",
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      clientId,
      name: "Engine_Exhaust_Foley_Pack.wav",
      type: "audio",
      format: "WAV",
      size: "340 MB",
      url: "#",
      status: "Ready",
      uploadedAt: "2026-10-18T11:00:00Z",
    },
    {
      id: "file-3",
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      clientId,
      name: "Night_Drive_v1_ReviewExport.mp4",
      type: "video",
      format: "MP4",
      size: "420 MB",
      url: "#",
      status: "Ready",
      uploadedAt: "2026-10-25T14:30:00Z",
    },
    {
      id: "file-4",
      projectId: "proj-2",
      projectName: "The Wild Ideas Podcast Ep. 42",
      clientId,
      name: "Ep42_Host_Mic_Boom.wav",
      type: "audio",
      format: "WAV",
      size: "1.2 GB",
      url: "#",
      status: "Ready",
      uploadedAt: "2026-10-21T09:30:00Z",
    },
    {
      id: "file-5",
      projectId: "proj-2",
      projectName: "The Wild Ideas Podcast Ep. 42",
      clientId,
      name: "Cam1_Wide_4K.mp4",
      type: "video",
      format: "MP4",
      size: "8.4 GB",
      url: "#",
      status: "Ready",
      uploadedAt: "2026-10-21T09:45:00Z",
    },
    {
      id: "file-6",
      projectId: "proj-3",
      projectName: "Daily SPF — UGC Product Launch",
      clientId,
      name: "UGC_Creator_Hook1.mov",
      type: "video",
      format: "MOV",
      size: "620 MB",
      url: "#",
      status: "Ready",
      uploadedAt: "2026-10-24T16:15:00Z",
    },
  ];
}

export function getInitialSeedMessages(clientId: string): Message[] {
  return [
    {
      id: "msg-1",
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      clientId,
      senderId: "omar-editor",
      senderName: "Omar",
      senderRole: "editor",
      message: "Hey! Just uploaded Cut v1 for the Night Drive commercial. Notice how the sound design builds into the turn at 00:22. Let me know your thoughts!",
      createdAt: "2026-10-25T14:35:00Z",
      attachments: [{ name: "Night_Drive_v1_ReviewExport.mp4", size: "420 MB", url: "#" }],
    },
    {
      id: "msg-2",
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      clientId,
      senderId: clientId,
      senderName: "You",
      senderRole: "client",
      message: "The pace is looking incredible, Omar. The Foley design without music actually hits so much harder than expected.",
      createdAt: "2026-10-25T15:10:00Z",
    },
    {
      id: "msg-3",
      projectId: "proj-2",
      projectName: "The Wild Ideas Podcast Ep. 42",
      clientId,
      senderId: "theo-editor",
      senderName: "Theo",
      senderRole: "editor",
      message: "First assembly of Ep. 42 is roughly 52 minutes. We're trimming the pre-show conversation and balancing the two guest mics right now.",
      createdAt: "2026-10-24T18:15:00Z",
    },
  ];
}

export function getInitialSeedInvoices(clientId: string): Invoice[] {
  return [
    {
      id: "inv-01",
      invoiceNumber: "CF-2026-088",
      clientId,
      projectId: "proj-1",
      projectName: "Night Drive Commercial Cut",
      amount: 1250,
      status: "Paid",
      issuedAt: "2026-10-18",
      dueDate: "2026-10-25",
      pdfUrl: "#",
    },
    {
      id: "inv-02",
      invoiceNumber: "CF-2026-092",
      clientId,
      projectId: "proj-2",
      projectName: "The Wild Ideas Podcast Ep. 42",
      amount: 650,
      status: "Pending",
      issuedAt: "2026-10-21",
      dueDate: "2026-11-04",
      pdfUrl: "#",
    },
    {
      id: "inv-03",
      invoiceNumber: "CF-2026-074",
      clientId,
      projectId: "proj-4",
      projectName: "Autumn Studio Lookbook",
      amount: 1800,
      status: "Paid",
      issuedAt: "2026-09-12",
      dueDate: "2026-09-26",
      pdfUrl: "#",
    },
  ];
}

export function getInitialSeedNotifications(): NotificationItem[] {
  return [
    {
      id: "notif-1",
      title: "Cut v1 uploaded",
      description: "Omar uploaded Cut v1 for 'Night Drive Commercial Cut'.",
      timestamp: "2 hours ago",
      read: false,
      type: "project",
      link: "/dashboard/projects/proj-1",
    },
    {
      id: "notif-2",
      title: "Action required on Task",
      description: "Upload missing footage for 'Daily SPF UGC Launch'.",
      timestamp: "1 day ago",
      read: false,
      type: "task",
      link: "/dashboard/tasks",
    },
    {
      id: "notif-3",
      title: "New message from Theo",
      description: "Rough assembly progress update for Ep. 42.",
      timestamp: "Yesterday",
      read: true,
      type: "message",
      link: "/dashboard/messages",
    },
  ];
}

// Client Storage Manager
export class DashboardStore {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId || "client-default";
  }

  private getKey(collection: string) {
    return `cutflow_${this.clientId}_${collection}`;
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
    return this.getCollection<Project>("projects", getInitialSeedProjects(this.clientId));
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
      description: "Make sure all drive links, sound foley preferences, and brief notes are accessible to the assigned editor.",
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
    return this.getCollection<Revision>(`revisions_${projectId}`, [
      {
        id: `rev-sample-${projectId}`,
        projectId,
        round: 1,
        roundNumber: 1,
        description: "Initial color grade balance and pacing review.",
        feedback: "Color grade looks crisp. Let's make sure the audio riser at 00:45 is subtle and clean.",
        status: "Resolved",
        createdAt: "2026-10-23T14:00:00Z",
        requestedAt: "2026-10-23T14:00:00Z",
      },
    ]);
  }

  getTasks(): Task[] {
    return this.getCollection<Task>("tasks", getInitialSeedTasks(this.clientId));
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
    return this.getCollection<FileItem>("files", getInitialSeedFiles(this.clientId));
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
    const all = this.getCollection<Message>("messages", getInitialSeedMessages(this.clientId));
    if (projectId) {
      return all.filter((m) => m.projectId === projectId);
    }
    return all;
  }

  sendMessage(projectId: string, senderName: string, text: string, isClient: boolean = true): Message {
    const messages = this.getCollection<Message>("messages", getInitialSeedMessages(this.clientId));
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
    return this.getCollection<Invoice>("invoices", getInitialSeedInvoices(this.clientId));
  }

  getNotifications(): NotificationItem[] {
    return this.getCollection<NotificationItem>("notifications", getInitialSeedNotifications());
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
