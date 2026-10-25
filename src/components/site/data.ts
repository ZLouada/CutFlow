import commercial from "@/assets/work-commercial.jpg";
import social from "@/assets/work-social.jpg";
import podcast from "@/assets/work-podcast.jpg";
import film from "@/assets/work-film.jpg";
import ugc from "@/assets/work-ugc.jpg";
import gaming from "@/assets/work-gaming.jpg";
import hero from "@/assets/hero.jpg";

export const images = { hero, commercial, social, podcast, film, ugc, gaming };

export const editors = [
  {
    name: "Omar",
    role: "Short-form editor",
    style: "Fast cuts • Social • YouTube",
    years: 6,
    rating: 4.9,
    projects: 312,
    software: ["Premiere Pro", "After Effects"],
    available: true,
  },
  {
    name: "Theo",
    role: "Colorist & long-form",
    style: "Cinematic • Documentary • Brand",
    years: 11,
    rating: 5.0,
    projects: 188,
    software: ["DaVinci Resolve", "Avid"],
    available: false,
  },
  {
    name: "Yusuf",
    role: "Motion designer",
    style: "Kinetic type • Launch • Explainers",
    years: 8,
    rating: 4.9,
    projects: 241,
    software: ["After Effects", "Cinema 4D"],
    available: true,
  },
];

export const work = [
  { title: "Night Drive", cat: "Commercial", img: commercial, ratio: "16/9", w: "w-[78vw] md:w-[46rem]" },
  { title: "Rooftop Sessions", cat: "Social Media", img: social, ratio: "9/16", w: "w-[58vw] md:w-[18rem]" },
  { title: "The Wild Ideas", cat: "Podcast", img: podcast, ratio: "1/1", w: "w-[70vw] md:w-[26rem]" },
  { title: "Dust", cat: "Short Film", img: film, ratio: "16/9", w: "w-[78vw] md:w-[46rem]" },
  { title: "Daily SPF", cat: "UGC", img: ugc, ratio: "9/16", w: "w-[58vw] md:w-[18rem]" },
  { title: "Clutch", cat: "Gaming", img: gaming, ratio: "1/1", w: "w-[70vw] md:w-[26rem]" },
];

export const steps = [
  { n: "01", t: "Upload", d: "Drop raw footage, references and notes. Any format, any length." },
  { n: "02", t: "Assign", d: "We assign your brief to senior HiKARii editors specialized in your style." },
  { n: "03", t: "Edit", d: "Your HiKARii team cuts, grades, mixes and designs the story." },
  { n: "04", t: "Review", d: "Frame-accurate comments right on the timeline. Two rounds included." },
  { n: "05", t: "Deliver", d: "Final masters in every format you need — 16:9, 9:16, 1:1." },
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
