import { createFileRoute } from "@tanstack/react-router";
import {
  Editors,
  FinalCta,
  Hero,
  Matching,
  Portfolio,
  Problem,
  Reel,
  Stats,
  SystemTimeline,
  Trust,
} from "@/components/site/sections";

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
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Stats />
      <Problem />
      <Portfolio />
      <Reel />
      <SystemTimeline />
      <Editors />
      <Matching />
      <Trust />
      <FinalCta />
    </>
  );
}
