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
      { property: "og:site_name", content: "HiKARii" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hikarii.studio" },
      { title: "HiKARii — Professional Video Editing Agency" },
      {
        name: "description",
        content:
          "HiKARii is a professional video editing agency. Upload raw footage, collaborate with our creative post-production team, and receive master edits.",
      },
      { property: "og:title", content: "HiKARii — Professional Video Editing Agency" },
      {
        property: "og:description",
        content:
          "HiKARii is a professional video editing agency. Send us your footage, and our dedicated team handles the entire post-production workflow.",
      },
      { property: "og:image", content: "https://hikarii.studio/og-image.png" },
      { property: "og:image:secure_url", content: "https://hikarii.studio/og-image.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "HiKARii — Professional Video Editing Agency" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HiKARii — Professional Video Editing Agency" },
      {
        name: "twitter:description",
        content:
          "HiKARii is a professional video editing agency. Send us your footage, and our dedicated team handles the entire post-production workflow.",
      },
      { name: "twitter:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://hikarii.studio/",
      },
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
