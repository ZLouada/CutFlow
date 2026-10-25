import { createFileRoute } from "@tanstack/react-router";
import { Editors, FinalCta, ForClients, Matching, PageHeader, Trust } from "@/components/site/sections";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "For Clients — Cutflow" },
      { name: "description", content: "Bring your story. Cutflow finds the professional editor who fits your style, budget and deadline." },
      { property: "og:title", content: "For Clients — Cutflow" },
      { property: "og:description", content: "You bring the story. We find the editor." },
    ],
  }),
  component: () => (
    <>
      <PageHeader n="C" eyebrow="For clients" lines={["Your footage.", "The right editor."]} intro="Tell us what you're making. We'll match you with editors whose work already looks like the video in your head." />
      <ForClients />
      <Matching />
      <Editors />
      <Trust />
      <FinalCta />
    </>
  ),
});
