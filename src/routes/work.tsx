import { createFileRoute } from "@tanstack/react-router";
import { FinalCta, PageHeader, Portfolio, Reel, Trust } from "@/components/site/sections";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Work — EditLink" },
      { name: "description", content: "Commercials, YouTube, podcasts, short films, UGC and gaming — edited by EditLink editors in every format." },
      { property: "og:title", content: "Work — EditLink" },
      { property: "og:description", content: "Selected projects cut by EditLink editors in 16:9, 9:16 and 1:1." },
    ],
  }),
  component: () => (
    <>
      <PageHeader n="W" eyebrow="Selected work" lines={["Cut for", "every screen."]} intro="From cinema-wide brand films to vertical social, our editors deliver the format your audience watches." />
      <Portfolio />
      <Reel />
      <Trust />
      <FinalCta />
    </>
  ),
});
