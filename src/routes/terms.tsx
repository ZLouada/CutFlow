import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { FinalCta, PageHeader } from "@/components/site/sections";
import { Cta } from "@/components/site/layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Terms, Halal Policy & Rights — Cutflow" },
      {
        name: "description",
        content:
          "Cutflow's Halal Content Policy and Client Content Authorization. High-quality professional video editing grounded in Islamic and ethical standards.",
      },
      { property: "og:title", content: "Terms, Halal Policy & Rights — Cutflow" },
      {
        property: "og:description",
        content: "Professional video editing without compromising Islamic and ethical standards.",
      },
    ],
  }),
  component: TermsPage,
});

const prohibitedItems = [
  "Pornographic or sexually explicit content",
  "Nudity or sexually provocative material",
  "Sexualized or indecent imagery",
  "Gambling or betting content",
  "Alcohol advertising or promotion",
  "Drug-related promotional content",
  "Illegal activity",
  "Content that promotes prostitution or sexual services",
  "Music videos",
  "Projects requiring songs or musical soundtracks",
  "Content that deliberately promotes obscene or immoral behavior",
  "Other content that conflicts with Cutflow's ethical standards",
];

const musicProhibited = [
  "Songs & vocal musical tracks",
  "Instrumental music compositions",
  "Musical background tracks & beds",
  "Music-video soundtracks",
  "Other musical compositions",
];

const audioAlternatives = [
  "Studio voice-over & narration",
  "Crisp dialogue & interviews",
  "Natural Foley sound design",
  "Immersive ambient atmospheres",
  "Non-musical impact & whoosh sound effects",
  "Other ethically appropriate audio elements",
];

const authorizationPoints = [
  {
    title: "Ownership & Permissions",
    desc: "The Client owns the submitted material or has obtained all necessary rights and permissions to provide it to Cutflow.",
  },
  {
    title: "Authority to Instruct",
    desc: "The Client has the legal authority to instruct Cutflow to edit the submitted material.",
  },
  {
    title: "Talent & Model Consents",
    desc: "The Client is responsible for obtaining permission from people appearing in the footage where such permission is legally required.",
  },
  {
    title: "Third-Party Assets",
    desc: "The Client is responsible for obtaining the necessary rights for third-party footage, photographs, logos, trademarks, fonts, audio, music, voice recordings, and other materials supplied to Cutflow.",
  },
  {
    title: "Lawful Media Sourcing",
    desc: "The Client will not knowingly provide stolen, pirated, illegally obtained, or unlawfully recorded material.",
  },
  {
    title: "Processing Authorization",
    desc: "The Client authorizes Cutflow to copy, store, process, modify, render, export, and transmit the submitted materials solely as reasonably necessary to provide the requested services.",
  },
  {
    title: "Client Indemnity",
    desc: "The Client remains responsible for any claims arising from materials supplied by the Client.",
  },
  {
    title: "Client Ownership Retained",
    desc: "Cutflow does not become the owner of Client materials merely by receiving or editing them.",
  },
  {
    title: "Internal IP & Presets",
    desc: "Unless otherwise agreed in writing, Cutflow does not grant the Client ownership of Cutflow's internal templates, workflows, presets, project structures, or pre-existing intellectual property.",
  },
  {
    title: "Deliverables & Rights Transfer",
    desc: "Rights to the final agreed deliverable are transferred or licensed according to the applicable project agreement and only after all amounts due to Cutflow have been paid in full.",
  },
];

function TermsPage() {
  return (
    <>
      <PageHeader
        n="T"
        eyebrow="Standards & Policies"
        lines={["Craft with", "principles."]}
        intro="Professional, cinematic video editing without compromising our Islamic and ethical values. Read our Halal Content Policy and Client Content Authorization standards."
      />

      {/* Sticky Table of Contents bar */}
      <div className="sticky top-[57px] z-30 border-y border-border bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3 md:px-10">
          <div className="label flex items-center gap-2 text-snow/60">
            <span className="h-2 w-2 rotate-45 bg-primary" />
            <span>Policy navigation</span>
          </div>
          <div className="flex items-center gap-3 text-xs md:gap-6">
            <a
              href="#halal-policy"
              className="label link-line text-snow/80 hover:text-primary transition-colors"
            >
              01 Halal Content Policy
            </a>
            <span className="text-border">/</span>
            <a
              href="#client-authorization"
              className="label link-line text-snow/80 hover:text-primary transition-colors"
            >
              02 Client Authorization & Rights
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-policy-modal"))}
              className="label hidden sm:inline-block border border-primary/50 bg-primary/10 px-2.5 py-1 text-primary hover:bg-primary hover:text-ink transition-colors cursor-pointer"
            >
              Consent Window
            </button>
          </div>
        </div>
      </div>

      <section className="bg-paper py-20 text-ink md:py-32">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10 space-y-28">

          {/* SECTION 1: HALAL CONTENT POLICY */}
          <section id="halal-policy" className="scroll-mt-36">
            <div className="label flex items-center gap-3 text-ink/60">
              <span className="text-primary">01</span>
              <span className="h-px w-10 bg-primary" />
              <span>Ethical & Islamic Standard</span>
            </div>
            <h2 className="display mt-4 text-5xl md:text-7xl">Halal Content Policy</h2>

            {/* Creative Standard Statement */}
            <div className="mt-10 border-l-4 border-primary bg-ink p-8 text-snow md:p-12">
              <div className="label text-primary">Our Creative Standard</div>
              <p className="display mt-4 text-2xl md:text-4xl leading-tight">
                "We want to create professional, high-quality video content without compromising our Islamic and ethical standards."
              </p>
              <p className="mt-6 text-sm text-snow/70 max-w-2xl">
                Cutflow was founded on this clear principle. Our Halal Content Policy applies unconditionally to every project and asset submitted to Cutflow.
              </p>
            </div>

            {/* What We Do Not Edit */}
            <div className="mt-16">
              <div className="flex items-baseline justify-between border-b border-ink-line pb-4">
                <h3 className="display text-3xl md:text-4xl">We Do Not Edit</h3>
                <span className="label text-primary">Zero Tolerance</span>
              </div>
              <p className="mt-4 text-ink/70">
                Cutflow does not knowingly accept, process, or produce projects involving any of the following:
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {prohibitedItems.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border border-ink-line bg-paper/60 p-4 transition-colors hover:border-ink hover:bg-snow"
                  >
                    <span className="label mt-0.5 text-xs text-primary font-bold">✕</span>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* No Music Policy & Alternative Sound Design */}
            <div className="mt-20">
              <div className="flex items-baseline justify-between border-b border-ink-line pb-4">
                <h3 className="display text-3xl md:text-4xl">No Music Standard</h3>
                <span className="label text-primary">Sound Architecture</span>
              </div>
              <p className="mt-4 text-ink/70">
                We believe video achieves peak emotional impact through meticulous Foley, ambient soundscapes, voice-over, and natural pacing — completely free of musical tracks.
              </p>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div className="border border-ink-line p-6 md:p-8 bg-ink/5">
                  <div className="label text-ink/50">Prohibited Audio Elements</div>
                  <h4 className="display mt-2 text-2xl text-ink">We Do Not Add</h4>
                  <ul className="mt-6 space-y-3">
                    {musicProhibited.map((m) => (
                      <li key={m} className="flex items-center gap-3 text-sm text-ink/80">
                        <span className="text-primary font-bold">―</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-primary bg-ink p-6 md:p-8 text-snow">
                  <div className="label text-primary">Dynamic Sound Design</div>
                  <h4 className="display mt-2 text-2xl text-snow">What We Craft Instead</h4>
                  <ul className="mt-6 space-y-3">
                    {audioAlternatives.map((a) => (
                      <li key={a} className="flex items-center gap-3 text-sm text-snow/90">
                        <span className="text-primary font-bold">✓</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* People & Visual Presentation + Respectful Religious Content */}
            <div className="mt-20 grid gap-8 md:grid-cols-2">
              <div className="border border-ink-line p-8">
                <div className="label text-primary">Visual Presentation</div>
                <h3 className="display mt-3 text-2xl">People & Modesty</h3>
                <p className="mt-4 text-sm text-ink/80 leading-relaxed">
                  We do not accept projects that require sexualized, revealing, or indecent portrayals of people.
                </p>
                <p className="mt-4 text-sm text-ink/60 leading-relaxed border-t border-ink-line/60 pt-4">
                  Our policy concerns the nature and presentation of the content. It is not intended to discriminate against people based on gender, nationality, race, or any other personal characteristic.
                </p>
              </div>

              <div className="border border-ink-line p-8">
                <div className="label text-primary">Content Integrity</div>
                <h3 className="display mt-3 text-2xl">Respectful Religious Content</h3>
                <p className="mt-4 text-sm text-ink/80 leading-relaxed">
                  We welcome beneficial, respectful educational, Islamic, charitable, and family-friendly content. Religious material must always be handled with the highest reverence.
                </p>
                <div className="mt-4 space-y-2 border-t border-ink-line/60 pt-4 text-xs text-ink/70">
                  <p>• We will not mock religious beliefs</p>
                  <p>• We will not falsify religious quotations</p>
                  <p>• We will not manipulate religious material deceptively</p>
                  <p>• We will not create misleading content or alter sacred text</p>
                </div>
              </div>
            </div>

            {/* Right to Refuse & Important Clarification */}
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="border-t-2 border-primary bg-snow p-8 shadow-xs">
                <div className="label text-primary">Agency Policy</div>
                <h3 className="display mt-2 text-xl">Our Right to Refuse</h3>
                <p className="mt-3 text-sm text-ink/70 leading-relaxed">
                  If a project conflicts with this policy, Cutflow may refuse the project or request that prohibited material be removed before editing begins. We would rather decline a project than compromise our principles.
                </p>
              </div>

              <div className="border-t-2 border-ink-line bg-snow p-8 shadow-xs">
                <div className="label text-ink/50">Clarification</div>
                <h3 className="display mt-2 text-xl">Religious & Ethical Scope</h3>
                <p className="mt-3 text-sm text-ink/70 leading-relaxed">
                  This policy represents Cutflow's internal religious and ethical standards. It is not presented as a formal fatwa or a replacement for advice from a qualified Islamic scholar. Where a matter is genuinely unclear, Cutflow may seek qualified guidance before accepting the work.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: CLIENT CONTENT AUTHORIZATION */}
          <section id="client-authorization" className="scroll-mt-36 border-t border-ink-line pt-24">
            <div className="label flex items-center gap-3 text-ink/60">
              <span className="text-primary">02</span>
              <span className="h-px w-10 bg-primary" />
              <span>Legal & Intellectual Property</span>
            </div>
            <h2 className="display mt-4 text-5xl md:text-7xl">Client Content Authorization</h2>
            <p className="mt-6 max-w-2xl text-ink/70">
              By submitting content to Cutflow, the Client confirms and agrees to the following ten terms governing rights, ownership, permissions, and deliverables:
            </p>

            <div className="mt-12 space-y-4">
              {authorizationPoints.map((item, idx) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2 border border-ink-line bg-snow p-6 transition-all hover:border-primary md:flex-row md:items-start md:gap-6"
                >
                  <span className="display text-2xl text-primary md:w-12 shrink-0">
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="display text-xl text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink/75 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Asset Rights Refusal Clause */}
            <div className="mt-10 border border-primary/40 bg-ink p-8 text-snow">
              <div className="label text-primary">Rights Verification Notice</div>
              <p className="mt-3 text-sm text-snow/80 leading-relaxed">
                If the Client does not have the necessary rights to a submitted asset, Cutflow reserves the right to refuse to use that asset or require the Client to replace it with properly licensed material before delivery.
              </p>
            </div>
          </section>

          {/* Start Project CTA Callout */}
          <div className="border border-ink-line bg-snow p-10 text-center md:p-16">
            <div className="label text-primary">Ready to collaborate?</div>
            <h3 className="display mt-4 text-4xl md:text-6xl">Let's edit your story.</h3>
            <p className="mx-auto mt-4 max-w-lg text-sm text-ink/70">
              Ready to create high-impact video aligned with our Halal standards? Submit your project and get paired with an editor within 24 hours.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta to="/get-started">Start Your Project</Cta>
            </div>
          </div>

        </div>
      </section>

      <FinalCta />
    </>
  );
}
