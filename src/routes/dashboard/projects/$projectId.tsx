import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusBadge, PriorityBadge } from "@/components/dashboard/dashboard-ui";
import { useHikariiAuth } from "@/lib/auth-context";
import {
  DashboardStore,
  type Project,
  type ProjectStatus,
  type Revision,
  type FileItem,
} from "@/lib/dashboard-store";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileVideo,
  Upload,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileText,
  ExternalLink,
  Send,
  X,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
  head: () => ({
    meta: [{ title: "Project Details — HiKARii" }],
  }),
  component: ProjectDetailPage,
});

const TIMELINE_STAGES: ProjectStatus[] = [
  "Brief Received",
  "Files Uploaded",
  "Editor Assigned",
  "Editing",
  "Internal Review",
  "Client Review",
  "Revisions Requested",
  "Approved",
  "Delivered",
];

function getStageIndex(status: ProjectStatus): number {
  return TIMELINE_STAGES.indexOf(status);
}

function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/dashboard/projects/$projectId" });
  const { user } = useHikariiAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [project, setProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<FileItem[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);

  // Modals & form state
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [revisionTimestamps, setRevisionTimestamps] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"Video" | "Audio" | "Image" | "Document">("Video");

  const [newNote, setNewNote] = useState("");
  const [notesList, setNotesList] = useState<string[]>([]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");

  const refreshProjectData = () => {
    const p = store.getProjectById(projectId);
    if (p) {
      setProject(p);
      setProjectFiles(store.getFilesByProject(projectId));
      setRevisions(store.getRevisions(projectId));
      setNotesList(p.specialInstructions ? [p.specialInstructions] : []);
    }
  };

  useEffect(() => {
    refreshProjectData();
  }, [store, projectId]);

  const handleApprove = () => {
    store.approveProject(projectId);
    refreshProjectData();
    setActionSuccessMessage("Project approved! Master delivery files are now being packaged.");
    setTimeout(() => setActionSuccessMessage(""), 5000);
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) return;

    store.requestRevision(
      projectId,
      revisionFeedback.trim(),
      revisionTimestamps.trim() ? [revisionTimestamps.trim()] : undefined,
    );
    setShowRevisionModal(false);
    setRevisionFeedback("");
    setRevisionTimestamps("");
    refreshProjectData();
    setActionSuccessMessage("Revision requested! Your assigned editor has been notified.");
    setTimeout(() => setActionSuccessMessage(""), 5000);
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    store.addFile({
      name: newFileName.trim(),
      type: newFileType,
      size: "148.4 MB",
      projectId,
      projectName: project?.name || "Project",
      url: "https://hikarii.media/storage/files/sample.mp4",
      status: "Ready",
    });

    setShowUploadModal(false);
    setNewFileName("");
    refreshProjectData();
    setActionSuccessMessage("Asset uploaded successfully to project files.");
    setTimeout(() => setActionSuccessMessage(""), 5000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList((prev) => [...prev, newNote.trim()]);
    setNewNote("");
  };

  if (!project) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <p className="text-sm text-gray">Project not found or loading...</p>
          <Link
            to="/dashboard/projects"
            className="mt-4 inline-flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Return to Projects</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const currentStageIndex = getStageIndex(project.status);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs text-gray hover:text-snow transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMessage && (
          <div className="border border-emerald-500/40 bg-emerald-500/10 p-4 rounded-xs flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage("")}
              className="text-emerald-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Project Header Block */}
        <div className="border border-border bg-charcoal/80 p-6 sm:p-8 rounded-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/80">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <StatusBadge status={project.status} />
                <span className="label text-[0.68rem] text-gray bg-ink px-2.5 py-0.5 rounded-xs border border-border">
                  {project.platform}
                </span>
                <span className="label text-[0.68rem] text-primary/90 bg-primary/10 px-2.5 py-0.5 rounded-xs border border-primary/20">
                  {project.type}
                </span>
              </div>
              <h1 className="display text-2xl sm:text-4xl text-snow font-extrabold tracking-tight">
                {project.name}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-gray max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-slide btn-ghost !py-2.5 !px-4 text-xs flex items-center gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Assets</span>
              </button>

              <Link
                to="/dashboard/messages"
                className="btn-slide btn-ghost !py-2.5 !px-4 text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Message Editor</span>
              </Link>

              {project.status === "Client Review" && (
                <>
                  <button
                    onClick={() => setShowRevisionModal(true)}
                    className="btn-slide btn-ghost !py-2.5 !px-4 text-xs text-amber-400 border-amber-500/30 hover:border-amber-400 flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Request Revisions</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve Final Video</span>
                  </button>
                </>
              )}

              {project.status === "Approved" && (
                <button
                  onClick={() => store.updateProjectStatus(projectId, "Delivered")}
                  className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Mark as Delivered</span>
                </button>
              )}

              {project.status === "Delivered" && (
                <a
                  href={project.finalVideoUrl || "#"}
                  download
                  className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Master 4K Video</span>
                </a>
              )}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div>
              <div className="text-[0.65rem] font-mono uppercase text-gray">Assigned Editor</div>
              <div className="font-semibold text-snow mt-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>{project.assignedEditor.name}</span>
                <span className="text-[0.65rem] text-gray">({project.assignedEditor.role})</span>
              </div>
            </div>

            <div>
              <div className="text-[0.65rem] font-mono uppercase text-gray">Target Due Date</div>
              <div className="font-mono text-snow font-medium mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{project.dueDate}</span>
              </div>
            </div>

            <div>
              <div className="text-[0.65rem] font-mono uppercase text-gray">Aspect Ratio & Format</div>
              <div className="font-mono text-snow font-medium mt-1">
                {project.aspectRatio} • {project.duration}
              </div>
            </div>

            <div>
              <div className="text-[0.65rem] font-mono uppercase text-gray">Revision Status</div>
              <div className="font-mono text-snow font-medium mt-1">
                Round {project.revisionsCount} / 2 Included
              </div>
            </div>
          </div>
        </div>

        {/* Visual Production Process Timeline */}
        <div className="border border-border bg-charcoal/60 p-6 sm:p-8 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="label text-primary font-bold">Workflow Pipeline</div>
              <h2 className="display text-xl text-snow font-bold mt-1">Production Stage Timeline</h2>
            </div>
            <span className="font-mono text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-xs border border-primary/20">
              Stage {currentStageIndex + 1} of {TIMELINE_STAGES.length}
            </span>
          </div>

          {/* Stepper Timeline Bar */}
          <div className="overflow-x-auto pb-4 scrollbar-none">
            <div className="flex items-center min-w-[760px] justify-between relative">
              {/* Background Connecting Line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-border -z-0" />
              {/* Active Progress Line */}
              <div
                className="absolute top-4 left-6 h-0.5 bg-primary -z-0 transition-all duration-700"
                style={{
                  width: `${(Math.max(0, currentStageIndex) / (TIMELINE_STAGES.length - 1)) * 92}%`,
                }}
              />

              {TIMELINE_STAGES.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isFuture = idx > currentStageIndex;

                return (
                  <div key={stage} className="flex flex-col items-center text-center z-10 w-24">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                        isCurrent
                          ? "bg-primary text-ink ring-4 ring-primary/20 scale-110 shadow-lg shadow-primary/20"
                          : isPassed
                            ? "bg-emerald-500 text-ink"
                            : "bg-charcoal border border-border text-gray"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-[0.68rem] mt-2.5 leading-tight font-medium ${
                        isCurrent
                          ? "text-primary font-bold"
                          : isPassed
                            ? "text-snow/90"
                            : "text-gray/70"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Project Specifications & Project Files / Revisions */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column (2 cols): Project Files, Revisions, Notes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Deliverable / Current Cut Preview */}
            <div className="border border-border bg-charcoal/60 p-6 rounded-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-4">
                <div className="flex items-center gap-2">
                  <FileVideo className="h-4 w-4 text-primary" />
                  <h3 className="display text-lg text-snow font-bold">Cut Preview & Video Review</h3>
                </div>
                {project.finalVideoUrl && (
                  <span className="label text-[0.65rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                    Master Ready
                  </span>
                )}
              </div>

              {project.status === "Client Review" || project.status === "Approved" || project.status === "Delivered" ? (
                <div className="space-y-4">
                  {/* Video Player Mockup Container */}
                  <div className="aspect-video w-full bg-ink rounded-xs border border-border flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="text-center p-6">
                      <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto text-primary mb-3 group-hover:scale-110 transition-transform">
                        <FileVideo className="h-7 w-7" />
                      </div>
                      <p className="text-xs font-semibold text-snow">
                        {project.name} — Review Cut (Round {project.revisionsCount})
                      </p>
                      <p className="text-[0.68rem] text-gray mt-1">
                        4K 2160p • 60fps • 100% Halal Foley & Acoustic Ambient Mix
                      </p>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-snow/80 bg-ink/80 backdrop-blur-sm p-2 rounded-xs border border-border/80">
                      <span>Preview Timecode: 00:00 / 08:42</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="text-[0.7rem] text-amber-400 hover:underline"
                        >
                          Note Timestamp Revision
                        </button>
                        <button
                          onClick={handleApprove}
                          className="text-[0.7rem] text-primary hover:underline font-bold"
                        >
                          Approve Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-border/80 bg-ink/40 rounded-xs">
                  <FileVideo className="h-8 w-8 text-gray mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-snow font-medium">Video is currently being edited</p>
                  <p className="text-[0.7rem] text-gray mt-1 max-w-sm mx-auto">
                    Editor {project.assignedEditor.name} is working on assembly, grading, and sound design. Once Internal Review completes, the preview cut will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Project Files */}
            <div className="border border-border bg-charcoal/60 p-6 rounded-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="display text-lg text-snow font-bold">Project Files ({projectFiles.length})</h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="text-xs label text-primary hover:underline flex items-center gap-1"
                >
                  <Upload className="h-3 w-3" />
                  <span>+ Upload File</span>
                </button>
              </div>

              {projectFiles.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray">
                  No files uploaded for this project yet.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {projectFiles.map((file) => (
                    <div
                      key={file.id}
                      className="py-3 flex items-center justify-between gap-4 group hover:bg-soft/30 px-2 rounded-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-xs bg-ink border border-border flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-snow truncate">{file.name}</div>
                          <div className="text-[0.65rem] text-gray mt-0.5">
                            {file.size} • Uploaded {file.uploadDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray hover:text-snow transition-colors"
                          title="Download file"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision History Log */}
            <div className="border border-border bg-charcoal/60 p-6 rounded-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <h3 className="display text-lg text-snow font-bold">Revision History</h3>
                </div>
                <span className="text-xs font-mono text-gray">
                  {revisions.length} round{revisions.length === 1 ? "" : "s"} logged
                </span>
              </div>

              {revisions.length === 0 ? (
                <p className="text-xs text-gray py-4">No revisions requested yet. Initial edit in progress.</p>
              ) : (
                <div className="space-y-4">
                  {revisions.map((rev) => (
                    <div key={rev.id} className="p-4 bg-ink/70 border border-border rounded-xs">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold font-mono text-primary">Round {rev.roundNumber}</span>
                        <span className="text-[0.65rem] text-gray">{new Date(rev.requestedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-snow/90 leading-relaxed">{rev.feedback}</p>
                      {rev.timestamps && rev.timestamps.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {rev.timestamps.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[0.65rem] font-mono bg-charcoal border border-border px-2 py-0.5 text-snow/80 rounded-xs"
                            >
                              ⏱ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 col): Project Brief, Style, Notes */}
          <div className="space-y-8">
            {/* Information Specifications */}
            <div className="border border-border bg-charcoal/60 p-6 rounded-sm space-y-4">
              <h3 className="display text-base text-snow font-bold border-b border-border/80 pb-3">
                Project Information
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[0.65rem] font-mono text-gray uppercase block">Editing Style</span>
                  <span className="text-snow mt-0.5 block">{project.editingStyle}</span>
                </div>

                <div>
                  <span className="text-[0.65rem] font-mono text-gray uppercase block">Aspect Ratio</span>
                  <span className="text-snow mt-0.5 block font-mono">{project.aspectRatio}</span>
                </div>

                <div>
                  <span className="text-[0.65rem] font-mono text-gray uppercase block">Target Duration</span>
                  <span className="text-snow mt-0.5 block font-mono">{project.duration}</span>
                </div>

                <div>
                  <span className="text-[0.65rem] font-mono text-gray uppercase block">Platform</span>
                  <span className="text-snow mt-0.5 block">{project.platform}</span>
                </div>

                {project.references && (
                  <div>
                    <span className="text-[0.65rem] font-mono text-gray uppercase block">References</span>
                    <a
                      href={project.references}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline mt-0.5 inline-flex items-center gap-1 truncate max-w-full"
                    >
                      <span>{project.references}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Client Notes & Scratchpad */}
            <div className="border border-border bg-charcoal/60 p-6 rounded-sm space-y-4">
              <h3 className="display text-base text-snow font-bold border-b border-border/80 pb-3">
                Client Notes & Instructions
              </h3>

              <div className="space-y-2">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-3 bg-ink/60 border border-border/80 rounded-xs text-xs text-snow/90 leading-relaxed">
                    {note}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="pt-2">
                <textarea
                  rows={2}
                  placeholder="Add a private note or reminder for this project..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-ink border border-border p-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary resize-none"
                />
                <button
                  type="submit"
                  className="mt-2 w-full py-1.5 text-xs font-semibold bg-soft hover:bg-border text-snow rounded-xs transition-colors"
                >
                  Save Note
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal: Request Revisions */}
        {showRevisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-charcoal border border-border p-6 rounded-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="display text-lg text-snow font-bold">Request Revisions</h3>
                <button onClick={() => setShowRevisionModal(false)} className="text-gray hover:text-snow">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-gray leading-relaxed">
                Provide concise feedback for round {project.revisionsCount + 1}. Be specific regarding pacing, graphic titles, or cut changes.
              </p>

              <form onSubmit={handleRequestRevision} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">
                    Revision Notes <span className="text-primary">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Cut 3 seconds from the intro hook. Replace lower third graphic at 01:25 with White text..."
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    className="w-full bg-ink border border-border p-3 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">
                    Timecodes (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 00:45, 02:15, 05:30"
                    value={revisionTimestamps}
                    onChange={(e) => setRevisionTimestamps(e.target.value)}
                    className="w-full bg-ink border border-border px-3 py-2 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowRevisionModal(false)}
                    className="px-4 py-2 text-xs text-gray hover:text-snow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-slide btn-primary !py-2 !px-5 text-xs font-semibold"
                  >
                    <span>Submit Revisions</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Upload Assets */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-charcoal border border-border p-6 rounded-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="display text-lg text-snow font-bold">Upload Project Assets</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray hover:text-snow">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUploadFile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">
                    File Label / Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raw_Interview_A_Cam.mp4, Brand_Logo.svg"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full bg-ink border border-border px-3 py-2 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">Asset Type</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full bg-ink border border-border px-3 py-2 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                  >
                    <option value="Video">Video Footage (Raw / B-Roll)</option>
                    <option value="Audio">Audio (Voice-Over / Foley)</option>
                    <option value="Image">Image / Graphics</option>
                    <option value="Document">Brief / Script / Transcript</option>
                  </select>
                </div>

                <div className="p-4 border border-dashed border-border text-center rounded-xs bg-ink/40">
                  <Upload className="h-6 w-6 text-gray mx-auto mb-1" />
                  <span className="text-[0.7rem] text-snow block">Drag and drop file or select local file</span>
                  <span className="text-[0.62rem] text-gray block mt-0.5">Supports MP4, MOV, WAV, PNG, PDF up to 10GB</span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs text-gray hover:text-snow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-slide btn-primary !py-2 !px-5 text-xs font-semibold"
                  >
                    <span>Upload to Project</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
