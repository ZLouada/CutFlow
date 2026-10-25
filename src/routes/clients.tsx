import { createFileRoute } from "@tanstack/react-router";
import { Editors, FinalCta, ForClients, Matching, PageHeader, Trust } from "@/components/site/sections";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "For Clients — HiKARii" },
      { name: "description", content: "Bring your story. HiKARii's professional editing team fits your style, budget, and deadline." },
      { property: "og:title", content: "For Clients — HiKARii" },
      { property: "og:description", content: "You bring the story. HiKARii delivers the cut." },
    ],
  }),
  component: () => (
    <>
      <PageHeader n="C" eyebrow="For clients" lines={["Your footage. ", "Our editing team."]} intro="Tell us what you're making. HiKARii's dedicated post-production team crafts your story to elevate the video in your head." />
      <ForClients />
      <Matching />
      <Editors />
      <Trust />
      <FinalCta />
    </>
  ),
});
