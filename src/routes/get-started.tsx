import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { PageHeader } from "@/components/site/sections";
import { trackEvent } from "@/lib/analytics";

const formats = [
  "Commercial",
  "Social / short-form",
  "YouTube",
  "Podcast",
  "Film / documentary",
  "UGC ads",
  "Gaming",
];
const budgets = ["Under $300", "$300 – $1,000", "$1,000 – $5,000", "$5,000+ / retainer"];
const timelines = ["ASAP (48h)", "Within a week", "Within a month", "Ongoing"];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(100).optional(),
  format: z.string().min(1, "Pick a format"),
  budget: z.string().min(1, "Pick a budget"),
  timeline: z.string().min(1, "Pick a timeline"),
  brief: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(1500),
  link: z.string().trim().max(500).url("Enter a valid link").optional().or(z.literal("")),
});
type Form = z.infer<typeof schema>;

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get Started — Video Editing Agency | HiKARii" },
      {
        name: "description",
        content:
          "Tell us about your project and begin working with HiKARii's professional video editing team.",
      },
      { property: "og:title", content: "Get Started — HiKARii" },
      {
        property: "og:description",
        content:
          "Submit your project in two minutes and start working with HiKARii's editing team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetStarted,
});

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          onClick={() => onChange(o)}
          className={`label border px-4 py-3 transition-colors ${value === o ? "border-primary bg-primary text-primary-foreground" : "border-ink-line hover:border-ink"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function GetStarted() {
  const [f, setF] = useState<Form>({
    name: "",
    email: "",
    company: "",
    format: "",
    budget: "",
    timeline: "",
    brief: "",
    link: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof Form) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    trackEvent("get_started_started");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) {
      const errs: Partial<Record<keyof Form, string>> = {};
      r.error.issues.forEach((i) => {
        errs[i.path[0] as keyof Form] ??= i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setDone(true);
    trackEvent("contact_submitted", { source: "website" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const input =
    "mt-3 w-full border-b-2 border-ink-line bg-transparent py-3 text-xl outline-none transition-colors focus:border-primary";
  const Err = ({ k }: { k: keyof Form }) =>
    errors[k] ? <p className="mt-2 text-sm text-primary">{errors[k]}</p> : null;
  const Step = ({ n, t }: { n: string; t: string }) => (
    <div className="label flex items-center gap-3">
      <span className="text-primary">{n}</span>
      <span>{t}</span>
    </div>
  );

  return (
    <>
      <PageHeader
        n="G"
        eyebrow="Get started"
        lines={["Start your", "project."]}
        intro="Tell us about your project. HiKARii reviews every submission and assigns dedicated senior editors who specialize in your format, style, and timeline."
      />
      <section className="bg-paper py-20 text-ink md:py-28">
        <div className="mx-auto max-w-[1000px] px-5 md:px-10">
          {done ? (
            <div className="border border-ink-line p-10 md:p-16">
              <div className="label text-primary">Application received</div>
              <h2 className="display mt-6 text-5xl md:text-7xl">Thanks, {f.name.split(" ")[0]}.</h2>
              <p className="mt-6 max-w-lg text-lg text-ink/70">
                We'll review your {f.format.toLowerCase()} project and email {f.email} with your
                dedicated HiKARii team within 24 hours.
              </p>
              <button
                className="btn-slide btn-ink mt-10"
                onClick={() => {
                  setDone(false);
                  setF({
                    name: "",
                    email: "",
                    company: "",
                    format: "",
                    budget: "",
                    timeline: "",
                    brief: "",
                    link: "",
                  });
                }}
              >
                <span>Submit another project</span>
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-16">
              <div className="space-y-8">
                <Step n="01" t="About you" />
                <div className="grid gap-8 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Full name</span>
                    <input
                      className={input}
                      value={f.name}
                      onChange={(e) => set("name")(e.target.value)}
                      maxLength={100}
                    />
                    <Err k="name" />
                  </label>
                  <label className="block">
                    <span className="label">Email</span>
                    <input
                      type="email"
                      className={input}
                      value={f.email}
                      onChange={(e) => set("email")(e.target.value)}
                      maxLength={255}
                    />
                    <Err k="email" />
                  </label>
                </div>
                <label className="block">
                  <span className="label">Company / channel (optional)</span>
                  <input
                    className={input}
                    value={f.company}
                    onChange={(e) => set("company")(e.target.value)}
                    maxLength={100}
                  />
                </label>
              </div>
              <div>
                <Step n="02" t="What are we editing?" />
                <Chips options={formats} value={f.format} onChange={set("format")} />
                <Err k="format" />
              </div>
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <Step n="03" t="Budget" />
                  <Chips options={budgets} value={f.budget} onChange={set("budget")} />
                  <Err k="budget" />
                </div>
                <div>
                  <Step n="04" t="Timeline" />
                  <Chips options={timelines} value={f.timeline} onChange={set("timeline")} />
                  <Err k="timeline" />
                </div>
              </div>
              <div className="space-y-8">
                <Step n="05" t="The brief" />
                <label className="block">
                  <span className="label">Describe your project</span>
                  <textarea
                    rows={5}
                    className={`${input} resize-none text-lg`}
                    value={f.brief}
                    onChange={(e) => set("brief")(e.target.value)}
                    maxLength={1500}
                    placeholder="Goal, length, style references, where it will be published…"
                  />
                  <Err k="brief" />
                </label>
                <label className="block">
                  <span className="label">Footage or reference link (optional)</span>
                  <input
                    className={input}
                    value={f.link}
                    onChange={(e) => set("link")(e.target.value)}
                    maxLength={500}
                    placeholder="https://"
                  />
                  <Err k="link" />
                </label>
              </div>
              <div className="pt-2">
                <button type="submit" className="btn-slide btn-primary group">
                  <span>Start your project</span>
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>
                <p className="mt-4 text-xs text-ink/60">
                  By submitting, you confirm that you hold necessary rights to your footage and
                  agree to HiKARii's{" "}
                  <Link
                    to="/terms"
                    className="font-medium underline underline-offset-2 hover:text-ink"
                  >
                    Halal Content Policy & Content Authorization Terms
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
