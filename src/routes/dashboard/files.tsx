import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EmptyState } from "@/components/dashboard/dashboard-ui";
import { useCutflowAuth } from "@/lib/auth-context";
import { DashboardStore, type FileItem, type Project } from "@/lib/dashboard-store";
import {
  Folder,
  FileText,
  FileVideo,
  FileAudio,
  FileImage,
  Upload,
  Download,
  Trash2,
  Eye,
  Plus,
  X,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/files")({
  component: FilesPage,
});

function FilesPage() {
  const { user } = useCutflowAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [files, setFiles] = useState<FileItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"Video" | "Audio" | "Image" | "Document">("Video");
  const [uploadTargetProjectId, setUploadTargetProjectId] = useState<string>("");

  // Preview modal state
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const refreshFiles = () => {
    setFiles(store.getFiles());
    const p = store.getProjects();
    setProjects(p);
    if (!uploadTargetProjectId && p.length > 0) {
      setUploadTargetProjectId(p[0].id);
    }
  };

  useEffect(() => {
    refreshFiles();
  }, [store, clientId]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const targetProject = projects.find((p) => p.id === uploadTargetProjectId) || projects[0];

    store.addFile({
      name: newFileName.trim(),
      type: newFileType,
      size: "245.8 MB",
      projectId: targetProject ? targetProject.id : "proj-global",
      projectName: targetProject ? targetProject.name : "General Assets",
      url: "https://cutflow.media/storage/sample.mp4",
      status: "Ready",
    });

    setShowUploadModal(false);
    setNewFileName("");
    refreshFiles();
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      store.deleteFile(fileId);
      refreshFiles();
    }
  };

  const filteredFiles = files.filter((f) => {
    const matchesProject = selectedProjectId === "All" || f.projectId === selectedProjectId;
    const matchesType = typeFilter === "All" || f.type === typeFilter;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesType && matchesSearch;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <FileVideo className="h-4 w-4 text-primary" />;
      case "Audio":
        return <FileAudio className="h-4 w-4 text-emerald-400" />;
      case "Image":
        return <FileImage className="h-4 w-4 text-amber-400" />;
      default:
        return <FileText className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="label text-primary font-bold">Cloud Media Vault</div>
            <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">Project Files</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray">
              Centralized storage for raw B-Roll, transcripts, logos, and delivered master cuts.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold self-start sm:self-auto shrink-0 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New File</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Project Filter */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-charcoal border border-border px-3 py-1.5 text-xs text-snow rounded-xs focus:outline-none focus:border-primary"
            >
              <option value="All">All Projects ({files.length} files)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Video", "Audio", "Image", "Document"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`label text-[0.7rem] px-3 py-1 rounded-xs transition-colors shrink-0 border cursor-pointer ${
                    typeFilter === t
                      ? "bg-primary text-ink border-primary font-bold"
                      : "border-border text-gray hover:text-snow hover:bg-soft"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray" />
            <input
              type="text"
              placeholder="Search file name or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-charcoal border border-border rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Files Grid / Table */}
        {filteredFiles.length === 0 ? (
          <EmptyState
            icon={Folder}
            title={files.length === 0 ? "No files uploaded yet" : "No matching files"}
            description={
              files.length === 0
                ? "Upload raw footage, audio, or brand kits to give your editor what they need."
                : "No files match the active filters or search terms."
            }
            actionLabel="Upload a File"
            onAction={() => setShowUploadModal(true)}
          />
        ) : (
          <div className="border border-border bg-charcoal/60 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-ink/50 text-[0.68rem] font-mono uppercase text-gray">
                    <th className="p-4 font-semibold">File Name</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Size</th>
                    <th className="p-4 font-semibold">Related Project</th>
                    <th className="p-4 font-semibold">Uploaded</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-soft/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xs bg-ink border border-border flex items-center justify-center shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <span className="font-semibold text-snow hover:text-primary transition-colors truncate max-w-xs">
                            {file.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-snow/80">{file.type}</td>
                      <td className="p-4 font-mono text-gray">{file.size}</td>

                      <td className="p-4">
                        <Link
                          to={`/dashboard/projects/${file.projectId}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {file.projectName}
                        </Link>
                      </td>

                      <td className="p-4 font-mono text-gray">{file.uploadDate}</td>

                      <td className="p-4">
                        <span className="label text-[0.65rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-xs">
                          {file.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 text-gray hover:text-snow transition-colors"
                            title="Preview file"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <a
                            href={file.url}
                            download
                            className="p-1.5 text-gray hover:text-primary transition-colors"
                            title="Download file"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1.5 text-gray hover:text-rose-400 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Preview File */}
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl bg-charcoal border border-border p-6 rounded-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  {getFileIcon(previewFile.type)}
                  <h3 className="display text-base text-snow font-bold truncate max-w-md">
                    {previewFile.name}
                  </h3>
                </div>
                <button onClick={() => setPreviewFile(null)} className="text-gray hover:text-snow">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="aspect-video w-full bg-ink rounded-xs border border-border flex items-center justify-center p-6 text-center">
                <div>
                  <div className="h-12 w-12 rounded-full bg-soft flex items-center justify-center mx-auto mb-2 text-primary">
                    {getFileIcon(previewFile.type)}
                  </div>
                  <p className="text-xs text-snow font-medium">Quick Preview Mode</p>
                  <p className="text-[0.68rem] text-gray mt-1 font-mono">
                    {previewFile.type} • {previewFile.size} • Attached to {previewFile.projectName}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[0.68rem] text-gray">Uploaded {previewFile.uploadDate}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="px-3 py-1.5 text-xs text-gray hover:text-snow"
                  >
                    Close
                  </button>
                  <a
                    href={previewFile.url}
                    download
                    className="btn-slide btn-primary !py-1.5 !px-4 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Upload New File */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-charcoal border border-border p-6 rounded-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="display text-lg text-snow font-bold">Upload to Vault</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray hover:text-snow">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">
                    File Label <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-Cam_Interview_Part2.mov"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full bg-ink border border-border px-3 py-2 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">Attach to Project</label>
                  <select
                    value={uploadTargetProjectId}
                    onChange={(e) => setUploadTargetProjectId(e.target.value)}
                    className="w-full bg-ink border border-border px-3 py-2 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-snow mb-1.5">Media Category</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full bg-ink border border-border px-3 py-2 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                  >
                    <option value="Video">Video Footage</option>
                    <option value="Audio">Voice / Audio</option>
                    <option value="Image">Graphics / Thumbnails</option>
                    <option value="Document">Script / Brief</option>
                  </select>
                </div>

                <div className="p-4 border border-dashed border-border text-center rounded-xs bg-ink/40">
                  <Upload className="h-6 w-6 text-gray mx-auto mb-1" />
                  <span className="text-[0.7rem] text-snow block">Upload from local drive</span>
                  <span className="text-[0.62rem] text-gray block mt-0.5">High-speed transfer up to 10GB</span>
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
                    <span>Upload File</span>
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
