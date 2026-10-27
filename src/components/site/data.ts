import commercial from "@/assets/work-commercial.webp";
import social from "@/assets/work-social.webp";
import podcast from "@/assets/work-podcast.webp";
import film from "@/assets/work-film.webp";
import ugc from "@/assets/work-ugc.webp";
import gaming from "@/assets/work-gaming.webp";
import hero from "@/assets/hero.webp";
import heroMobile from "@/assets/hero-mobile.webp";

export const images = { hero, heroMobile, commercial, social, podcast, film, ugc, gaming };

export const editors = [
  {
    name: "Omar",
    role: "Lead Short-Form Editor",
    style: "Fast cuts • Social • High Retention",
    years: 6,
    rating: 4.9,
    projects: 312,
    software: ["Premiere Pro", "After Effects"],
    available: true,
  },
  {
    name: "Theo",
    role: "Colorist & Long-Form Lead",
    style: "Cinematic • Documentary • Brand Grade",
    years: 11,
    rating: 5.0,
    projects: 188,
    software: ["DaVinci Resolve", "Avid"],
    available: false,
  },
  {
    name: "Yusuf",
    role: "Lead Motion Designer",
    style: "Kinetic type • Product Launch • 3D",
    years: 8,
    rating: 4.9,
    projects: 241,
    software: ["After Effects", "Cinema 4D"],
    available: true,
  },
];

export const work = [
  { title: "Night Drive", cat: "Commercial", img: commercial, ratio: "16/9", w: "w-[78vw] md:w-[46rem]", width: 1280, height: 720 },
  { title: "Rooftop Sessions", cat: "Social Media", img: social, ratio: "9/16", w: "w-[58vw] md:w-[18rem]", width: 720, height: 1280 },
  { title: "The Wild Ideas", cat: "Podcast", img: podcast, ratio: "1/1", w: "w-[70vw] md:w-[26rem]", width: 1024, height: 1024 },
  { title: "Dust", cat: "Short Film", img: film, ratio: "16/9", w: "w-[78vw] md:w-[46rem]", width: 1280, height: 720 },
  { title: "Daily SPF", cat: "UGC", img: ugc, ratio: "9/16", w: "w-[58vw] md:w-[18rem]", width: 720, height: 1280 },
  { title: "Clutch", cat: "Gaming", img: gaming, ratio: "1/1", w: "w-[70vw] md:w-[26rem]", width: 1024, height: 1024 },
];

export const steps = [
  { n: "01", t: "Start a Project", d: "Tell us what you're creating, share references, and outline your target deadline." },
  { n: "02", t: "Send Footage", d: "Upload your raw rushes, camera logs, and audio tracks in any resolution or codec." },
  { n: "03", t: "Team Craft", d: "Our dedicated HiKARii editing team cuts, grades, mixes audio, and polishes your story." },
  { n: "04", t: "Review", d: "Review the cut with frame-accurate timestamp notes. Iterative revisions included." },
  { n: "05", t: "Deliver", d: "Approve the master cut and receive high-bitrate deliverables in 16:9, 9:16, and 1:1." },
];

export const testimonials = [
  {
    quote: "We sent forty hours of rushes on Monday. By Friday we had a launch film our board watched twice.",
    name: "Karim Okafor",
    company: "Northwind Audio",
    type: "Product launch film",
    img: commercial,
  },
  {
    quote: "Omar understood our channel's rhythm in one cut. Retention went up from the very first upload.",
    name: "Sam Reyes",
    company: "Wild Ideas Podcast",
    type: "YouTube series",
    img: podcast,
  },
  {
    quote: "It felt like having a post-production house on call — without the agency overhead.",
    name: "Julien Marchetti",
    company: "Dust Films",
    type: "Short film grade",
    img: film,
  },
];
