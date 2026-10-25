import { createFileRoute } from "@tanstack/react-router";
import { FinalCta, Matching, PageHeader, SystemTimeline } from "@/components/site/sections";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "How It Works — EditLink" },
      { name: "description", content: "Upload, match, edit, review, deliver. See how EditLink turns raw footage into a finished video." },
      { property: "og:title", content: "How It Works — EditLink" },
      { property: "og:description", content: "Five steps from raw footage to final cut." },
    ],
  }),
  component: () => (
    <>
      <PageHeader n="H" eyebrow="How it works" lines={["Raw footage", "→ final cut."]} intro="A production timeline built for speed: you upload, we match, your editor delivers." />
      <SystemTimeline />
      <Matching />
      <FinalCta />
    </>
  ),
});
