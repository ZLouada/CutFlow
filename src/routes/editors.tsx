import { createFileRoute } from "@tanstack/react-router";
import { BecomeEditor, Editors, FinalCta, ForEditors, PageHeader, Stats } from "@/components/site/sections";

export const Route = createFileRoute("/editors")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "For Editors — HiKARii" },
      { name: "description", content: "Join HiKARii to edit exceptional video projects with clear briefs, dedicated post-production pipelines, and respected craft." },
      { property: "og:title", content: "For Editors — HiKARii" },
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
