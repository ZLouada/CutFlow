import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EmptyState } from "@/components/dashboard/dashboard-ui";
import { useCutflowAuth } from "@/lib/auth-context";
import { DashboardStore, type Message, type Project } from "@/lib/dashboard-store";
import {
  MessageSquare,
  Send,
  Paperclip,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { user } = useCutflowAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshData = () => {
    const p = store.getProjects();
    setProjects(p);
    const activeProject = selectedProjectId ? p.find((x) => x.id === selectedProjectId) : p[0];
    if (activeProject && !selectedProjectId) {
      setSelectedProjectId(activeProject.id);
      setMessages(store.getMessages(activeProject.id));
    } else if (selectedProjectId) {
      setMessages(store.getMessages(selectedProjectId));
    }
  };

  useEffect(() => {
    refreshData();
  }, [store, clientId, selectedProjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setMessages(store.getMessages(projectId));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedProjectId) return;

    store.sendMessage(
      selectedProjectId,
      user?.fullName || "Client",
      newMessageText.trim(),
      true,
    );

    setNewMessageText("");
    setMessages(store.getMessages(selectedProjectId));
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-border/80 pb-4">
          <div className="label text-primary font-bold">Direct Communication</div>
          <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">Messages</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray">
            Chat directly with your assigned editor and post-production supervisor.
          </p>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No project messaging channels"
            description="Start your first project to open a direct, dedicated chat channel with your assigned editor."
            actionLabel="Start a New Project"
            actionTo="/dashboard/projects/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-border bg-charcoal/70 rounded-sm overflow-hidden min-h-[620px] shadow-2xl">
            {/* Thread List Sidebar (1 col) */}
            <div className="border-r border-border bg-ink/60 flex flex-col">
              <div className="p-4 border-b border-border/80">
                <span className="text-[0.68rem] font-mono uppercase text-gray font-bold tracking-wider">
                  Project Channels ({projects.length})
                </span>
              </div>

              <div className="divide-y divide-border/60 overflow-y-auto flex-1 max-h-[560px]">
                {projects.map((proj) => {
                  const isSelected = proj.id === selectedProjectId;
                  const lastMsg = store.getMessages(proj.id).slice(-1)[0];

                  return (
                    <button
                      key={proj.id}
                      onClick={() => handleSelectProject(proj.id)}
                      className={`w-full text-left p-4 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? "bg-charcoal border-l-2 border-primary text-snow"
                          : "hover:bg-soft/50 text-gray"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs w-full">
                        <span className="font-semibold text-snow truncate max-w-[170px]">
                          {proj.name}
                        </span>
                        <span className="text-[0.62rem] font-mono text-gray shrink-0">
                          {proj.status === "Delivered" ? "Delivered" : "Active"}
                        </span>
                      </div>

                      <div className="text-[0.7rem] text-primary/80 font-mono">
                        Editor: {proj.assignedEditor.name}
                      </div>

                      <p className="text-[0.68rem] text-gray truncate w-full">
                        {lastMsg ? `${lastMsg.sender}: ${lastMsg.text}` : "No messages yet"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chat Conversation Area (2 cols) */}
            <div className="md:col-span-2 flex flex-col justify-between bg-charcoal/40">
              {/* Chat Room Top Bar */}
              <div className="p-4 border-b border-border/80 bg-ink/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-snow">
                    {activeProject ? activeProject.name : "Select a project"}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[0.68rem] text-gray">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>
                      Direct line with <strong>{activeProject?.assignedEditor.name}</strong> (
                      {activeProject?.assignedEditor.role})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="label text-[0.62rem] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-xs">
                    Halal Standard Audio
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 max-h-[460px]">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-gray">
                    <MessageSquare className="h-8 w-8 text-gray mx-auto mb-2 opacity-40" />
                    No messages in this channel yet. Say hello or leave specific editing instructions below.
                  </div>
                ) : (
                  messages.map((m) => {
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[80%] ${
                          m.isClient ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[0.68rem] font-semibold text-snow/90">{m.sender}</span>
                          <span className="text-[0.62rem] font-mono text-gray">{m.timestamp}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-sm text-xs leading-relaxed ${
                            m.isClient
                              ? "bg-primary text-ink font-medium rounded-tr-none shadow-md"
                              : "bg-ink border border-border text-snow rounded-tl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-border/80 bg-ink/70 flex items-center gap-3"
              >
                <button
                  type="button"
                  className="p-2 text-gray hover:text-snow transition-colors cursor-pointer"
                  title="Attach file reference"
                  onClick={() => alert("Upload footage or assets directly via the Files tab or project screen.")}
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Type your message for ${activeProject?.assignedEditor.name || "editor"}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-charcoal border border-border px-3.5 py-2 text-xs text-snow rounded-xs placeholder:text-gray/50 focus:outline-none focus:border-primary"
                />

                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="btn-slide btn-primary !py-2 !px-4 text-xs font-semibold flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <span>Send</span>
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
