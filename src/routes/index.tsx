import { createFileRoute } from "@tanstack/react-router";
import {
  FinalCta,
  Hero,
  HiKARiiStandard,
  Matching,
  Portfolio,
  Problem,
  Reel,
  SystemTimeline,
  Trust,
} from "@/components/site/sections";

import { images } from "@/components/site/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "HiKARii — Professional Video Editing Agency" },
      { name: "description", content: "HiKARii is a professional video editing agency. Upload raw footage, collaborate with our creative post-production team, and receive master edits." },
      { property: "og:title", content: "HiKARii — Professional Video Editing Agency" },
      { property: "og:description", content: "HiKARii is a professional video editing agency. Send us your footage, and our dedicated team handles the entire post-production workflow." },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: images.heroMobile,
        type: "image/webp",
        media: "(max-width: 768px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: images.hero,
        type: "image/webp",
        media: "(min-width: 769px)",
        fetchPriority: "high",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Problem />
      <SystemTimeline />
      <HiKARiiStandard />
      <Reel />
      <Portfolio />
      <Matching />
      <Trust />
      <FinalCta />
    </>
  );
}
