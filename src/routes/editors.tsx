import { createFileRoute } from "@tanstack/react-router";
import { BecomeEditor, Editors, FinalCta, ForEditors, PageHeader, Stats } from "@/components/site/sections";

export const Route = createFileRoute("/editors")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "For Editors — Cutflow" },
      { name: "description", content: "Join Cutflow to get matched with great video projects, clear budgets and clients who value craft." },
      { property: "og:title", content: "For Editors — Cutflow" },
      { property: "og:description", content: "Your skills deserve great projects." },
    ],
  }),
  component: () => (
    <>
      <PageHeader n="E" eyebrow="For editors" lines={["Cut more.", "Pitch less."]} intro="Projects matched to your specialty, agreed budgets, and payment on delivery." />
      <ForEditors />
      <Stats />
      <Editors />
      <BecomeEditor />
      <FinalCta />
    </>
  ),
});
