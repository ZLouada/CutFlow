import { createFileRoute } from "@tanstack/react-router";
import {
  Editors,
  FinalCta,
  ForClients,
  ForEditors,
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
      { title: "Cutflow — From footage to finished" },
      { name: "description", content: "Cutflow connects people with raw footage to professional video editors. Upload, match, edit, review, deliver." },
      { property: "og:title", content: "Cutflow — From footage to finished" },
      { property: "og:description", content: "The video-editing marketplace that connects the people with the story to the people with the craft." },
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
      <SystemTimeline />
      <Editors />
      <Reel />
      <ForClients />
      <ForEditors />
      <Portfolio />
      <Matching />
      <Trust />
      <FinalCta />
    </>
  );
}
