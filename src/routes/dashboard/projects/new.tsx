import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useHikariiAuth } from "@/lib/auth-context";
import { DashboardStore, type VideoType, type AspectRatio } from "@/lib/dashboard-store";
import { Video, ShieldCheck, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/dashboard/projects/new")({
  head: () => ({
    meta: [{ title: "Start a New Project — HiKARii" }],
  }),
  component: NewProjectPage,
});

function NewProjectPage() {
  const { user } = useHikariiAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState<VideoType>("YouTube Video");
  const [platform, setPlatform] = useState("YouTube");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [duration, setDuration] = useState("8-12 minutes");
  const [editingStyle, setEditingStyle] = useState("Clean, high-retention cinematic cut");
  const [description, setDescription] = useState("");
  const [references, setReferences] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [halalConfirmed, setHalalConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const newProject = store.addProject({
      name: name.trim(),
      type,
      platform,
      aspectRatio,
      duration,
      editingStyle,
      description: description.trim() || "Client intake brief provided.",
      references: references.trim() || undefined,
      dueDate,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    trackEvent("contact_submitted", { source: "dashboard" });

    setTimeout(() => {
      navigate({ to: `/dashboard/projects/${newProject.id}` });
    }, 350);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs text-gray hover:text-snow transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="label text-primary font-bold">New Production Brief</div>
              <h1 className="display text-3xl sm:text-4xl text-snow font-extrabold mt-1">
                Start a New Project
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray">
                Provide your footage parameters and creative direction. We'll assign your dedicated
                lead editor.
              </p>
            </div>
          </div>
        </div>

        {/* Halal Notice Banner */}
        <div className="border border-primary/30 bg-primary/5 p-4 rounded-xs flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-snow/90 leading-relaxed">
            <span className="font-bold text-snow">HiKARii Halal Creative Standard:</span> We enforce
            100% music-free sound design (using organic foley, ambiances, risers, and voiceover) and
            reject any sexually explicit or illicit content. By submitting, you confirm your footage
            complies with our ethical editorial guidelines.
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="border border-border bg-charcoal/80 p-6 sm:p-8 rounded-sm space-y-8"
        >
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-primary flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              01. Project Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Project Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Episode #4: Studio Lighting Breakdown"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Video Type <span className="text-primary">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as VideoType)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                >
                  <option value="YouTube Video">YouTube Video</option>
                  <option value="Shorts / Reels / TikTok">Shorts / Reels / TikTok</option>
                  <option value="Podcast">Podcast Episode</option>
                  <option value="Commercial / Ad">Commercial / Brand Ad</option>
                  <option value="Course / Educational">Course / Educational Video</option>
                  <option value="Documentary">Documentary / Longform</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Primary Platform <span className="text-primary">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter/X">Twitter / X</option>
                  <option value="Website">Website / Landing Page</option>
                  <option value="Course Platform">Course Platform (Teachable/Kajabi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Aspect Ratio <span className="text-primary">*</span>
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                >
                  <option value="16:9">16:9 — Horizontal (YouTube, Desktop)</option>
                  <option value="9:16">9:16 — Vertical (Shorts, Reels, TikTok)</option>
                  <option value="1:1">1:1 — Square (Feed)</option>
                  <option value="4:5">4:5 — Portrait (Instagram Post)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Target Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 60 seconds, 8-10 mins"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Creative Direction */}
          <div className="space-y-4 pt-6 border-t border-border/80">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-primary flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              02. Creative Style & References
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Editing Style & Pacing
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fast-paced retention editing, minimal text overlays, clean color grade"
                  value={editingStyle}
                  onChange={(e) => setEditingStyle(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Project Brief & Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your story, hook, core message, intended viewer takeaway, and any specific footage timestamps to emphasize..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-ink border border-border p-3.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Reference Links (Inspiration Videos)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://youtube.com/watch?v=xyz, https://instagram.com/reel/123"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery & Instructions */}
          <div className="space-y-4 pt-6 border-t border-border/80">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-primary flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              03. Timeline & Hand-off
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Target Delivery Date <span className="text-primary">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-snow mb-1.5">
                  Special Notes / Brand Guidelines
                </label>
                <input
                  type="text"
                  placeholder="e.g. Use Montserrat font, brand hex #FF5A00"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-ink border border-border px-3.5 py-2.5 rounded-xs text-xs text-snow placeholder:text-gray/50 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={halalConfirmed}
                  onChange={(e) => setHalalConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-xs border-border bg-ink text-primary accent-primary focus:ring-0"
                />
                <span className="text-xs text-gray leading-relaxed">
                  I confirm that all footage provided complies with HiKARii's{" "}
                  <strong className="text-snow">Halal Content Policy</strong> and that I own or hold
                  valid licenses for all uploaded footage and materials.
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/dashboard/projects"
              className="text-xs text-gray hover:text-snow order-2 sm:order-1"
            >
              Cancel and return
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-slide btn-primary !py-3 !px-8 text-xs font-semibold w-full sm:w-auto order-1 sm:order-2"
            >
              <span>{isSubmitting ? "Submitting Brief..." : "Submit Project & Assign Editor"}</span>
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
