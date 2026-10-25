import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Cta } from "@/components/site/layout";
import { FinalCta, PageHeader } from "@/components/site/sections";

const plans = [
  { n: "Short", p: "$149", u: "per video", f: ["Up to 60s final", "Vertical + square cuts", "Captions included", "2 review rounds", "48h first cut"] },
  { n: "Story", p: "$590", u: "per video", f: ["Up to 12 min final", "Color & sound mix", "Motion titles", "3 review rounds", "Dedicated editor"], hot: true },
  { n: "Studio", p: "Custom", u: "monthly retainer", f: ["Unlimited requests", "Editor team on call", "Brand toolkit", "Priority turnaround", "Account producer"] },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Pricing — HiKARii" },
      { name: "description", content: "Clear pricing for professional video editing: short-form, long-form stories and studio retainers." },
      { property: "og:title", content: "Pricing — HiKARii" },
      { property: "og:description", content: "Pay per video or keep an editing team on call." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <>
      <PageHeader n="P" eyebrow="Pricing" lines={["Priced per", "finished video."]} intro="No hourly guesswork. Pick a format, upload footage, and know the cost before the first cut." />
      <section className="bg-paper py-24 text-ink md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-0 px-5 md:grid-cols-3 md:px-10">
          {plans.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col border border-ink-line p-8 md:p-10 ${p.hot ? "bg-ink text-snow" : ""}`}
            >
              <div className="label flex justify-between">
                <span className="text-primary">0{i + 1}</span>
                {p.hot && <span className="bg-primary px-2 py-1 text-ink">Most booked</span>}
              </div>
              <h2 className="display mt-8 text-6xl">{p.n}</h2>
              <div className="display mt-6 text-5xl">{p.p}</div>
              <div className="label mt-1 opacity-60">{p.u}</div>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.f.map((f) => (
                  <li key={f} className="flex gap-3 border-t border-current/10 pt-3">
                    <span className="text-primary">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Cta to="/get-started" variant={p.hot ? "primary" : "ink"}>Start a project</Cta>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
