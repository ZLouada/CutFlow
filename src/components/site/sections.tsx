import { z } from "zod";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Cta } from "./layout";
import reel from "@/assets/videos/reel.mp4.asset.json";
import { editors, images, steps, testimonials, work } from "./data";
import { useLightweightMotion } from "@/hooks/use-lightweight-motion";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- primitives ---------- */

export function RevealLines({ lines, className = "", delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease, delay: delay + i * 0.09 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Eyebrow({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="label flex items-center gap-3 text-gray">
      <span className="text-primary">{n}</span>
      <span className="h-px w-10 bg-primary" />
      {children}
    </div>
  );
}

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  const lightweight = useLightweightMotion();
  useEffect(() => {
    if (!inView) return;
    if (lightweight) {
      setV(to);
      return;
    }
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: setV });
    return () => c.stop();
  }, [inView, to, lightweight]);
  return (
    <span ref={ref}>
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function tc(p: number) {
  const total = p * 92;
  const s = Math.floor(total);
  const f = Math.floor((total - s) * 24);
  return `00:00:${String(s % 60).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

/* ---------- HERO ---------- */

const tracks: { k: string; clips: [number, number][] }[] = [
  { k: "Video", clips: [[0, 22], [23, 48], [49, 71], [72, 100]] },
  { k: "Audio", clips: [[0, 62], [64, 100]] },
  { k: "Text", clips: [[8, 30], [55, 80]] },
  { k: "Color", clips: [[0, 40], [41, 100]] },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const lightweight = useLightweightMotion();
  const p = useMotionValue(0.05);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const timeRef = useRef<HTMLSpanElement>(null);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!inView || reduce || lightweight || dragging) return;
    const c = animate(p, 1, {
      duration: 14 * (1 - p.get()),
      ease: "linear",
      onComplete: () => {
        p.set(0);
        setCycle((v) => v + 1);
      },
    });
    return () => c.stop();
  }, [inView, reduce, lightweight, dragging, p, cycle]);

  useMotionValueEvent(p, "change", (v) => {
    if (timeRef.current) timeRef.current.textContent = tc(v);
  });

  const scale = useTransform(p, [0, 0.25, 0.5, 0.75, 1], [1.08, 1.03, 1.06, 1.02, 1.08]);
  const sat = useTransform(p, [0, 0.4, 0.42, 1], [0.15, 0.15, 1.1, 1.1]);
  const filter = useTransform(sat, (s) => `saturate(${s}) contrast(1.1)`);
  const clip = useTransform(p, [0, 0.22, 0.23, 0.48, 0.49, 0.71, 0.72, 1], [
    "inset(6% 4% 6% 4%)", "inset(6% 4% 6% 4%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)",
    "inset(10% 18% 10% 18%)", "inset(10% 18% 10% 18%)", "inset(3% 0% 3% 0%)", "inset(3% 0% 3% 0%)",
  ]);
  const left = useTransform(p, (v) => `${v * 100}%`);
  const imgX = useTransform(sx, (v) => v * -18);
  const imgY = useTransform(sy, (v) => v * -12);
  const txtX = useTransform(sx, (v) => v * 10);
  const txtY = useTransform(sy, (v) => v * 6);
  const textOn = useTransform(p, [0.07, 0.08, 0.3, 0.31, 0.54, 0.55, 0.8, 0.81], [0, 1, 1, 0, 0, 1, 1, 0]);

  const scrub = (clientX: number) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r) return;
    p.set(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-28"
      onMouseMove={(e) => {
        if (lightweight) return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* footage */}
      <motion.div className="absolute inset-0" style={lightweight ? {} : { x: imgX, y: imgY, clipPath: clip }}>
        <motion.img
          src={images.hero}
          alt="Editor working on a timeline in a dark studio"
          width={1920}
          height={1088}
          className="h-full w-full object-cover opacity-70"
          fetchPriority="high"
          decoding="async"
          style={lightweight ? {} : { scale, filter }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
      </motion.div>

      {/* overlay title-card on TEXT clips */}
      <motion.div
        style={{ opacity: textOn }}
        className="label pointer-events-none absolute right-6 top-32 z-10 hidden border border-primary px-3 py-2 text-primary md:block"
      >
        ▶ REC — SCENE 04 / TAKE 2
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-8 md:px-10">
        <motion.div style={{ x: txtX, y: txtY }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Eyebrow n="●">Professional video editing agency</Eyebrow>
          </motion.div>
          <h1 className="display mt-6 text-[17vw] md:text-[clamp(5rem,10.5vw,9.5rem)]">
            <span className="block overflow-hidden">
              <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>
                From footage
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.1 }}>
                to <span className="text-primary">finished.</span>
              </motion.span>
            </span>
          </h1>
        </motion.div>
        <motion.div
          className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease }}
        >
          <p className="max-w-lg text-base text-snow/70 md:text-lg">
            You create. HiKARii handles the edit. Send us your raw footage and creative brief—our dedicated team handles the entire post-production process from first cut to final master.
          </p>
          <div className="flex flex-wrap gap-3">
            <Cta to="/get-started">Start a Project</Cta>
            <Cta to="/work" variant="ghost">View Our Work</Cta>
          </div>
        </motion.div>

        {/* timeline */}
        <div className="mt-10 border border-border bg-ink/80 backdrop-blur-sm">
          <div className="label flex items-center justify-between border-b border-border px-3 py-2 text-gray">
            <span>HiKARii_SEQ_01</span>
            <span ref={timeRef} className="tabular-nums text-primary">{tc(0.05)}</span>
          </div>
          <div
            ref={barRef}
            className="relative cursor-ew-resize touch-none select-none py-2"
            onPointerDown={(e) => {
              setDragging(true);
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              scrub(e.clientX);
            }}
            onPointerMove={(e) => dragging && scrub(e.clientX)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
          >
            {tracks.map((t, ti) => (
              <div key={t.k} className="flex items-center gap-3 px-3 py-[3px]">
                <span className="label w-12 shrink-0 text-[0.6rem] text-gray">{t.k}</span>
                <div className="relative h-4 flex-1 md:h-5">
                  {t.clips.map(([a, b], i) => (
                    <motion.div
                      key={i}
                      className={`absolute inset-y-0 ${ti === 0 ? "bg-snow/85" : ti === 1 ? "bg-snow/25" : ti === 2 ? "bg-primary/70" : "bg-snow/45"}`}
                      style={{ left: `${a}%`, width: `${b - a}%`, transformOrigin: "left" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.6 + ti * 0.08 + i * 0.05, duration: 0.6, ease }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="pointer-events-none absolute inset-y-0 left-[4.25rem] right-3">
              <motion.div className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-primary" style={{ left }}>
                <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROBLEM ---------- */

const problems = [
  { k: "Too much footage", d: "Hours of rushes. One story buried somewhere inside.", stat: "47h", sub: "avg. raw footage per brand film" },
  { k: "Not enough time", d: "You're running a business, not a post-production house.", stat: "6wk", sub: "typical agency turnaround" },
  { k: "Freelancer roulette", d: "Managing disjointed freelancers with unpredictable quality and missed deadlines drains your momentum.", stat: "1 team", sub: "dedicated HiKARii post-production pipeline" },
];

export function Problem() {
  return (
    <section className="relative bg-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Eyebrow n="01">The problem</Eyebrow>
        <h2 className="display mt-8 text-[13vw] md:text-[clamp(4rem,8vw,8rem)]">
          <RevealLines lines={["Editing shouldn't", "slow your story", "down."]} />
        </h2>
        <div className="mt-24 space-y-0">
          {problems.map((p, i) => (
            <motion.div
              key={p.k}
              initial={{ opacity: 0, x: i % 2 ? 80 : -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease }}
              className={`group grid items-end gap-6 border-t border-border py-10 lg:grid-cols-12 ${i % 2 ? "lg:text-right" : ""}`}
            >
              <div className={`label text-primary lg:col-span-1 ${i % 2 ? "lg:order-3" : ""}`}>0{i + 1}</div>
              <div className={`lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                <h3 className="display text-4xl transition-colors duration-500 group-hover:text-primary md:text-6xl">{p.k}</h3>
                <p className="mt-4 max-w-md text-gray lg:inline-block">{p.d}</p>
              </div>
              <div className={`lg:col-span-4 ${i % 2 ? "lg:order-1 lg:text-left" : "lg:text-right"}`}>
                <div className="display text-6xl text-snow/15 md:text-8xl">{p.stat}</div>
                <div className="label mt-2 text-gray">{p.sub}</div>
              </div>
              <motion.div
                className={`h-[2px] bg-primary lg:col-span-12 ${i % 2 ? "origin-right" : "origin-left"}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease, delay: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SYSTEM (horizontal timeline) ---------- */

function StepVisual({ i }: { i: number }) {
  const lightweight = useLightweightMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const run = !lightweight && inView;
  const bars = [0, 1, 2, 3, 4, 5];
  if (i === 0)
    return (
      <div className="grid h-full grid-cols-3 gap-2">
        {bars.map((b) => (
          <motion.div key={b} className="bg-snow/10" initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: b * 0.06 }}>
            <div className="h-1 w-1/2 bg-primary" />
          </motion.div>
        ))}
      </div>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 200 100" className="h-full w-full">
        <circle cx="30" cy="50" r="8" className="fill-snow" />
        {[20, 50, 80].map((y, k) => (
          <g key={y}>
            <path d={`M38 50 C100 50 100 ${y} 162 ${y}`} className={k === 1 ? "stroke-primary" : "stroke-snow/30"} strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
            <circle cx="170" cy={y} r="7" className={k === 1 ? "fill-primary" : "fill-snow/30"} />
          </g>
        ))}
      </svg>
    );
  if (i === 2)
    return (
      <div ref={ref} className="flex h-full items-end gap-1">
        {Array.from({ length: 28 }).map((_, k) => (
          <motion.div
            key={k}
            style={{ height: `${20 + ((k * 37) % 70)}%` }}
            animate={run ? { scaleY: [1, 0.5, 1] } : { scaleY: 1 }}
            className={k % 7 === 3 ? "flex-1 origin-bottom bg-primary" : "flex-1 origin-bottom bg-snow/25"}
            transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.03 }}
          />
        ))}
      </div>
    );
  if (i === 3)
    return (
      <div className="relative h-full border border-border">
        <div className="absolute inset-x-3 bottom-4 h-[2px] bg-snow/20" />
        {[22, 51, 78].map((x, k) => (
          <motion.div key={x} className="absolute bottom-2 h-3 w-3 -translate-x-1/2 rotate-45 bg-primary" style={{ left: `${x}%` }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.2 + k * 0.15, type: "spring" }} />
        ))}
        <div className="label absolute left-3 top-3 text-gray">"Tighten this cut" — 00:12</div>
      </div>
    );
  return (
    <div className="flex h-full items-end justify-center gap-3">
      {[["16/9", "w-28"], ["9/16", "w-12"], ["1/1", "w-20"]].map(([r, w], k) => (
        <motion.div key={r} className={`${w} border border-primary bg-primary/10`} style={{ aspectRatio: r }} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: k * 0.1 }}>
          <div className="label p-1 text-[0.55rem] text-primary">{r}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function SystemTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => `calc(${-v * 100}% + ${v * 100}vw)`);
  const prog = useTransform(scrollYProgress, [0, 1], [0.02, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(4, Math.floor(v * 5))));

  return (
    <section className="bg-paper text-ink">
      {/* desktop: sticky horizontal */}
      <div ref={ref} className="relative hidden h-[420vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24">
          <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between px-10">
            <div>
              <div className="label flex items-center gap-3 text-ink/60">
                <span className="text-primary">02</span>
                <span className="h-px w-10 bg-primary" /> The HiKARii system
              </div>
              <h2 className="display mt-4 text-[length:clamp(2.5rem,min(6vw,9vh),6rem)]">Five cuts to final.</h2>
            </div>
            <div className="display text-[length:clamp(2.5rem,min(6vw,9vh),6rem)] tabular-nums text-primary">0{active + 1}</div>
          </div>
          <div className="relative mx-10 mt-8 h-[2px] bg-ink-line">
            <motion.div className="absolute inset-0 origin-left bg-primary" style={{ scaleX: prog }} />
            {steps.map((s, i) => (
              <div key={s.n} className="absolute -top-1.5 h-3.5 w-3.5 -translate-x-1/2 rotate-45 transition-colors" style={{ left: `${(i / 4) * 100}%` }}>
                <div className={`h-full w-full ${i <= active ? "bg-primary" : "bg-ink/20"}`} />
              </div>
            ))}
          </div>
          <motion.div style={{ x }} className="flex w-max flex-1 items-center gap-0 pl-10 pr-10">
            {steps.map((s, i) => (
              <div key={s.n} className={`flex h-[min(54vh,640px)] w-[min(60vw,900px)] shrink-0 gap-10 border-r border-ink-line px-10 transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-35"}`}>
                <div className="flex w-1/2 flex-col justify-between">
                  <div className="display text-[length:clamp(5rem,min(16vw,24vh),15rem)] leading-none text-ink">{s.n}</div>
                  <div>
                    <h3 className="display text-5xl">{s.t}</h3>
                    <p className="mt-4 max-w-sm text-ink/70">{s.d}</p>
                  </div>
                </div>
                <div className="flex w-1/2 items-center">
                  <div className="h-[min(14rem,30vh)] w-full bg-ink p-6 text-snow">
                    <StepVisual i={i} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* mobile: vertical */}
      <div className="px-5 py-24 md:px-10 lg:hidden">
        <div className="label flex items-center gap-3 text-ink/60">
          <span className="text-primary">02</span>
          <span className="h-px w-10 bg-primary" /> The HiKARii system
        </div>
        <h2 className="display mt-4 text-6xl">Five cuts to final.</h2>
        <div className="relative mt-12 border-l-2 border-ink-line pl-6">
          {steps.map((s, i) => (
            <motion.div key={s.n} className="relative pb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 0.7, ease }}>
              <span className="absolute -left-[33px] top-3 h-3.5 w-3.5 rotate-45 bg-primary" />
              <div className="display text-7xl">{s.n}</div>
              <h3 className="display mt-2 text-3xl">{s.t}</h3>
              <p className="mt-2 text-ink/70">{s.d}</p>
              <div className="mt-5 h-40 bg-ink p-4 text-snow">
                <StepVisual i={i} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- EDITORS ---------- */

export function Editors() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow n="04">Our team</Eyebrow>
            <h2 className="display mt-6 text-[13vw] md:text-[clamp(4rem,7vw,7rem)]">
              <RevealLines lines={["The craft, ", "on call."]} />
            </h2>
            <p className="mt-4 max-w-lg text-sm text-gray md:text-base">
              Behind every HiKARii cut is a dedicated lead editor from our internal studio team. We assign the right specialist to your brief—you never have to browse or manage freelancers.
            </p>
          </div>
          <Cta to="/get-started" variant="ghost">Start a Project</Cta>
        </div>

        <div className="no-scrollbar mt-16 flex snap-x gap-4 overflow-x-auto pb-8 lg:gap-0 lg:overflow-visible lg:pl-4">
          {editors.map((e, i) => {
            const open = hover === i;
            return (
              <motion.article
                key={e.name}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                initial={{ opacity: 0, x: 120, rotate: 4 }}
                whileInView={{ opacity: 1, x: 0, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: i * 0.12 }}
                animate={{ zIndex: open ? 20 : 3 - Math.abs(1 - i) }}
                className={`group relative aspect-[3/4] w-[78vw] shrink-0 snap-center overflow-hidden bg-charcoal transition-[width,transform] duration-700 ease-out sm:w-[46vw] lg:w-[30%] ${i > 0 ? "lg:-ml-12" : ""} ${open ? "lg:w-[40%] lg:!rotate-0" : ""}`}
                style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="display text-[16rem] leading-none text-soft transition-all duration-700 group-hover:scale-110 group-hover:text-primary/25">{e.name[0]}</span>
                </div>
                <div className="absolute inset-x-0 top-1/3 flex h-8 gap-1 px-5 opacity-40">
                  {Array.from({ length: 14 }).map((_, k) => <div key={k} className={`flex-1 ${k % 5 === 2 ? "bg-primary" : "bg-snow/20"}`} />)}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                {/* preview rec indicator */}
                <div className="label absolute left-4 top-4 flex items-center gap-2 text-snow opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Studio Reel Lead
                </div>
                <div className="label absolute right-4 top-4 border border-primary/40 bg-primary/10 px-2.5 py-1 text-[0.65rem] text-primary">
                  Studio Lead
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <div className="h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
                  <h3 className="display mt-4 text-5xl md:text-6xl">{e.name}</h3>
                  <div className="label mt-2 text-primary">{e.role}</div>
                  <p className="mt-2 text-sm text-snow/70">"{e.style}"</p>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                        <div><div className="display text-2xl">{e.years}+ yrs</div><div className="label text-[0.55rem] text-gray">Post Craft</div></div>
                        <div><div className="display text-2xl">Agency Lead</div><div className="label text-[0.55rem] text-gray">Direct Review</div></div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {e.software.map((s) => (
                          <span key={s} className="label border border-border px-2 py-1 text-[0.6rem] text-snow/90">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- REEL ---------- */

export function Reel() {
  const [open, setOpen] = useState(false);
  const lightweight = useLightweightMotion();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref);
  const playBackground = !lightweight && inView && !open;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(18% 22% 18% 22%)", "inset(0% 0% 0% 0%)"]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playBackground) void video.play().catch(() => {});
    else video.pause();
  }, [playBackground]);

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Eyebrow n="04">The reel</Eyebrow>
        <h2 className="display mt-6 text-[12vw] md:text-[clamp(4rem,7vw,7rem)]">
          <RevealLines lines={["See what HiKARii", "can create."]} />
        </h2>
      </div>
      <motion.div ref={ref} style={lightweight ? {} : { clipPath: clip }} className="grain relative mt-14 aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <video ref={videoRef} src={playBackground ? reel.url : undefined} poster={images.hero} muted loop playsInline preload="auto" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/40" />
        <button onClick={() => setOpen(true)} className="group absolute inset-0 flex items-center justify-center" aria-label="Play reel">
          <span className="relative flex h-28 w-28 items-center justify-center rounded-full border border-snow/60 transition-transform duration-500 group-hover:scale-110 md:h-40 md:w-40">
            <span className="absolute inset-0 scale-0 rounded-full bg-primary transition-transform duration-500 group-hover:scale-100" />
            <span className="label relative text-snow group-hover:text-ink">▶ Play reel</span>
          </span>
        </button>
        <div className="label absolute bottom-5 left-5 text-snow/70 md:left-10">HiKARii Showreel 2026 — 01:32</div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="grain relative aspect-video w-[94vw] max-w-6xl overflow-hidden bg-charcoal"
              initial={{ clipPath: "inset(49% 0 49% 0)" }}
              animate={{ clipPath: "inset(0% 0 0% 0)" }}
              exit={{ clipPath: "inset(49% 0 49% 0)" }}
              transition={{ duration: 0.7, ease }}
            >
              <video src={reel.url} autoPlay loop playsInline controls className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            <button onClick={() => setOpen(false)} className="label link-line absolute right-6 top-6 text-snow">Close ✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- FOR CLIENTS ---------- */

export function ForClients() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const stages = ["Raw footage", "Creative brief", "Team edit", "Master delivery"];
  return (
    <section ref={ref} className="relative grid overflow-hidden lg:grid-cols-2">
      <div className="bg-paper px-5 py-24 text-ink md:px-10 md:py-40">
        <div className="label flex items-center gap-3 text-ink/60"><span className="text-primary">05</span><span className="h-px w-10 bg-primary" />For clients</div>
        <h2 className="display mt-6 text-[13vw] md:text-[clamp(3.5rem,6vw,6rem)]">
          <RevealLines lines={["You bring", "the story."]} />
        </h2>
        <div className="mt-12 flex flex-wrap gap-2">
          {["A001_C004.mov", "interview_cam_b.mp4", "broll_drone.mov", "VO_take3.wav", "logo_pack.zip"].map((f, i) => (
            <motion.span key={f} className="label border border-ink-line bg-snow px-3 py-2" initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease }}>
              {f}
            </motion.span>
          ))}
        </div>
        <div className="mt-12"><Cta to="/get-started" variant="ink">Start a project</Cta></div>
      </div>
      <div className="bg-ink px-5 py-24 md:px-10 md:py-40">
        <h2 className="display text-[13vw] lg:text-right md:text-[clamp(3.5rem,6vw,6rem)]">
          <RevealLines lines={["We craft", "the edit."]} delay={0.2} />
        </h2>
        <div className="mt-12 space-y-0 lg:ml-auto lg:max-w-sm">
          {stages.map((s, i) => (
            <div key={s} className="flex items-center gap-4 border-b border-border py-5">
              <span className="label text-primary">0{i + 1}</span>
              <span className="display text-2xl">{s}</span>
              <span className="ml-auto label text-gray">{["IN", "↓", "↓", "OUT"][i]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* connection line */}
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path d="M 22 62 C 45 62, 55 40, 78 40" fill="none" className="stroke-primary" strokeWidth="0.3" style={{ pathLength: draw }} />
      </svg>
    </section>
  );
}

/* ---------- FOR EDITORS ---------- */

const projects = [
  { p: "Product launch film", b: "$2,400", d: "Nov 14", s: "Cinematic", c: "Northwind Audio" },
  { p: "Weekly YouTube series", b: "$900 / ep", d: "Ongoing", s: "Fast cuts", c: "Wild Ideas" },
  { p: "Festival short — grade", b: "$1,750", d: "Dec 02", s: "Moody color", c: "Dust Films" },
];

export function ForEditors() {
  const [accepted, setAccepted] = useState<number | null>(null);
  return (
    <section className="bg-charcoal py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-2">
        <div className="order-2 space-y-4 lg:order-1">
          {projects.map((p, i) => (
            <motion.div
              key={p.p}
              initial={{ x: -140, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
              className={`group border bg-ink p-6 transition-all duration-500 hover:-translate-y-1 ${accepted === i ? "border-primary" : "border-border"}`}
              style={{ marginLeft: `${i * 6}%` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="label text-gray">Project</div>
                  <div className="display mt-1 text-2xl md:text-3xl">{p.p}</div>
                </div>
                <div className="display text-2xl text-primary">{p.b}</div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
                <div><div className="label text-[0.6rem] text-gray">Deadline</div>{p.d}</div>
                <div><div className="label text-[0.6rem] text-gray">Style</div>{p.s}</div>
                <div><div className="label text-[0.6rem] text-gray">Client</div>{p.c}</div>
              </div>
              <button
                onClick={() => setAccepted(i)}
                className={`btn-slide mt-5 w-full justify-center ${accepted === i ? "btn-primary" : "btn-ghost"}`}
              >
                {accepted === i ? "✓ Project accepted" : "Accept project"}
              </button>
            </motion.div>
          ))}
        </div>
        <div className="order-1 lg:order-2 lg:sticky lg:top-32 lg:self-start lg:text-right">
          <div className="lg:flex lg:justify-end"><Eyebrow n="06">For editors</Eyebrow></div>
          <h2 className="display mt-6 text-[12vw] md:text-[clamp(3.5rem,6vw,6.5rem)]">
            <RevealLines lines={["Your skills", "deserve great", "projects."]} />
          </h2>
          <p className="mt-6 text-gray lg:ml-auto lg:max-w-sm">Briefs that match your style, budgets agreed upfront, payment on delivery. Spend your time cutting — not pitching.</p>
          <div className="mt-8"><Cta to="/editors" hash="apply">Apply to join team</Cta></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- BECOME AN EDITOR (apply form) ---------- */

const specialties = ["YouTube", "Social / short-form", "Commercial", "Podcast", "Film / documentary", "Gaming"];
const softwareOptions = ["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "CapCut"];
const experienceLevels = ["Under 2 years", "2–5 years", "5–10 years", "10+ years"];

const editorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  specialty: z.string().min(1, "Pick your main specialty"),
  software: z.array(z.string()).min(1, "Pick at least one tool"),
  experience: z.string().min(1, "Pick your experience"),
  portfolio: z.string().trim().min(1, "Add a link to your reel").max(500).url("Enter a valid link (https://…)"),
  about: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(1500),
});
type EditorForm = z.infer<typeof editorSchema>;
const emptyEditor: EditorForm = { name: "", email: "", specialty: "", software: [], experience: "", portfolio: "", about: "" };

export function BecomeEditor() {
  const [f, setF] = useState<EditorForm>(emptyEditor);
  const [errors, setErrors] = useState<Partial<Record<keyof EditorForm, string>>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof EditorForm) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const toggleSoftware = (s: string) =>
    setF((p) => ({ ...p, software: p.software.includes(s) ? p.software.filter((x) => x !== s) : [...p.software, s] }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = editorSchema.safeParse(f);
    if (!r.success) {
      const errs: Partial<Record<keyof EditorForm, string>> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as keyof EditorForm] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setDone(true);
  };

  const input = "mt-3 w-full border-b-2 border-border bg-transparent py-3 text-xl text-snow outline-none transition-colors placeholder:text-snow/30 focus:border-primary";
  const Err = ({ k }: { k: keyof EditorForm }) => (errors[k] ? <p className="mt-2 text-sm text-primary">{errors[k]}</p> : null);
  const Step = ({ n, t }: { n: string; t: string }) => (
    <div className="label flex items-center gap-3"><span className="text-primary">{n}</span><span>{t}</span></div>
  );
  const chip = (on: boolean) => `label border px-4 py-3 transition-colors ${on ? "border-primary bg-primary text-ink" : "border-border text-snow/80 hover:border-snow"}`;

  return (
    <section id="apply" className="grain scroll-mt-24 bg-charcoal py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow n="07">Apply to join</Eyebrow>
          <h2 className="display mt-6 text-[12vw] md:text-[clamp(3.5rem,6vw,6.5rem)]">
            <RevealLines lines={["Become an", "editor."]} />
          </h2>
          <p className="mt-6 max-w-md text-gray">Send your reel and we'll review it by hand. Editors on the roster get briefs matched to their specialty, budgets agreed upfront and payment on delivery.</p>
          <div className="mt-10 space-y-4 border-l-2 border-border pl-6">
            {["Portfolio reviewed by humans", "Briefs matched to your style", "Payment on delivery"].map((t) => (
              <div key={t} className="label flex items-center gap-3 text-snow/80"><span className="text-primary">▸</span>{t}</div>
            ))}
          </div>
        </div>
        <div>
          {done ? (
            <div className="border border-primary p-10 md:p-16">
              <div className="label text-primary">Application received</div>
              <h3 className="display mt-6 text-4xl md:text-6xl">Thanks, {f.name.split(" ")[0]}.</h3>
              <p className="mt-6 max-w-md text-lg text-snow/70">We review every application by hand. If your reel fits the roster, we'll email {f.email} with the next steps.</p>
              <button className="btn-slide btn-ghost mt-10" onClick={() => { setDone(false); setF(emptyEditor); }}>
                <span>Submit another application</span>
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-16">
              <div className="space-y-8">
                <Step n="01" t="About you" />
                <div className="grid gap-8 md:grid-cols-2">
                  <label className="block"><span className="label">Full name</span><input className={input} value={f.name} onChange={(e) => set("name")(e.target.value)} maxLength={100} /><Err k="name" /></label>
                  <label className="block"><span className="label">Email</span><input type="email" className={input} value={f.email} onChange={(e) => set("email")(e.target.value)} maxLength={255} /><Err k="email" /></label>
                </div>
              </div>
              <div>
                <Step n="02" t="Your craft" />
                <div className="label mt-4 text-gray">Main specialty</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {specialties.map((o) => (
                    <button type="button" key={o} onClick={() => set("specialty")(o)} className={chip(f.specialty === o)}>{o}</button>
                  ))}
                </div>
                <Err k="specialty" />
                <div className="label mt-6 text-gray">Software you cut with</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {softwareOptions.map((o) => (
                    <button type="button" key={o} onClick={() => toggleSoftware(o)} className={chip(f.software.includes(o))}>{o}</button>
                  ))}
                </div>
                <Err k="software" />
              </div>
              <div>
                <Step n="03" t="Experience" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {experienceLevels.map((o) => (
                    <button type="button" key={o} onClick={() => set("experience")(o)} className={chip(f.experience === o)}>{o}</button>
                  ))}
                </div>
                <Err k="experience" />
              </div>
              <div className="space-y-8">
                <Step n="04" t="Your reel" />
                <label className="block"><span className="label">Portfolio or showreel link</span><input className={input} value={f.portfolio} onChange={(e) => set("portfolio")(e.target.value)} maxLength={500} placeholder="https://" /><Err k="portfolio" /></label>
                <label className="block"><span className="label">About your work</span><textarea rows={5} className={`${input} resize-none text-lg`} value={f.about} onChange={(e) => set("about")(e.target.value)} maxLength={1500} placeholder="Background, clients you've cut for, typical turnaround…" /><Err k="about" /></label>
              </div>
              <button type="submit" className="btn-slide btn-primary group"><span>Apply to join</span><span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- PORTFOLIO ---------- */

export function Portfolio() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => `calc(${-v * 100}% + ${v * 100}vw)`);
  const cats = ["YouTube", "Social Media", "Commercial", "Podcast", "Short Film", "Corporate", "UGC", "Gaming"];
  const Card = ({ w, i, desk }: { w: (typeof work)[number]; i: number; desk?: boolean }) => (
    <div className={`group relative shrink-0 cursor-pointer ${desk ? "" : w.w}`}>
      <div className="relative overflow-hidden" style={desk ? { aspectRatio: w.ratio, height: "min(50vh, 520px)" } : { aspectRatio: w.ratio }}>
        <img src={w.img} alt={`${w.title} — ${w.cat}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 border-0 border-primary transition-all duration-300 group-hover:border-[3px]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="label flex h-20 w-20 scale-75 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 group-hover:scale-100">▶ View</span>
        </div>
        <div className="label absolute right-3 top-3 bg-ink/70 px-2 py-1 text-snow">{w.ratio.replace("/", ":")}</div>
      </div>
      <div className="mt-4 flex items-baseline justify-between overflow-hidden">
        <h3 className="display translate-y-0 text-2xl transition-transform duration-500 md:translate-y-full md:group-hover:translate-y-0">{w.title}</h3>
        <span className="label text-primary">0{i + 1} — {w.cat}</span>
      </div>
    </div>
  );
  return (
    <section className="bg-ink">
      <div ref={ref} className="relative hidden h-[300vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
          <div className="mx-auto mb-[4vh] flex w-full max-w-[1600px] items-end justify-between px-10">
            <div>
              <Eyebrow n="07">Selected work</Eyebrow>
              <h2 className="display mt-4 text-[length:clamp(2.5rem,min(6vw,9vh),6rem)]">Every format.</h2>
            </div>
            <div className="label max-w-xs text-right text-gray">{cats.join(" · ")}</div>
          </div>
          <motion.div style={{ x }} className="flex w-max items-end gap-8 pl-10 pr-10">
            {work.map((w, i) => <Card key={w.title} w={w} i={i} desk />)}
          </motion.div>
        </div>
      </div>
      <div className="py-24 lg:hidden">
        <div className="px-5">
          <Eyebrow n="07">Selected work</Eyebrow>
          <h2 className="display mt-4 text-6xl">Every format.</h2>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x items-end gap-4 overflow-x-auto px-5">
          {work.map((w, i) => <div key={w.title} className="snap-start"><Card w={w} i={i} /></div>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- MATCHING ---------- */

export function Matching() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const assignments = [
    { n: "Omar", role: "Lead Editor", tag: "Primary Cut", y: 18, active: true },
    { n: "Theo", role: "Color & Grade", tag: "Master Look", y: 50, active: false },
    { n: "Yusuf", role: "Motion Designer", tag: "Titles & VFX", y: 82, active: false },
  ];
  return (
    <section className="bg-paper py-28 text-ink md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="label flex items-center gap-3 text-ink/60"><span className="text-primary">05</span><span className="h-px w-10 bg-primary" />Studio assignment</div>
        <h2 className="display mt-6 text-[12vw] md:text-[clamp(3.5rem,6vw,6rem)]">
          <RevealLines lines={["One brief. ", "The right team."]} />
        </h2>
        <p className="mt-4 max-w-xl text-base text-ink/70">
          Your footage. Our editing team. Behind every HiKARii cut is an editor selected from our internal studio team based on your style, format, and pacing. You don't browse freelancers or negotiate rates—HiKARii directs the entire post-production process.
        </p>
        <div ref={ref} className="relative mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr_1fr] lg:items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease }} className="bg-ink p-6 text-snow">
            <div className="label text-primary">Your Project Brief</div>
            <div className="display mt-3 text-3xl">"High-retention YouTube cut"</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Fast cuts", "Color grade", "Kinetic titles", "Sound mix"].map((t) => <span key={t} className="label border border-border px-2 py-1 text-[0.6rem]">{t}</span>)}
            </div>
          </motion.div>
          <div className="relative hidden h-56 lg:block lg:h-80">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="h-full w-full">
              {assignments.map((m, i) => (
                <g key={m.n}>
                  <motion.path d={`M0 50 C 80 50, 120 ${m.y}, 200 ${m.y}`} fill="none" className={i === 0 ? "stroke-primary" : "stroke-ink/25"} strokeWidth={i === 0 ? 2 : 1} vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease }} />
                  <path d={`M0 50 C 80 50, 120 ${m.y}, 200 ${m.y}`} fill="none" className={i === 0 ? "stroke-primary" : "stroke-ink/40"} strokeWidth="3" strokeDasharray="2 38" vectorEffect="non-scaling-stroke" style={{ animation: inView ? `dash ${1 + i * 0.4}s linear infinite` : "none" }} />
                </g>
              ))}
            </svg>
            <div className="label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-3 py-1 font-bold">Studio Directing</div>
          </div>
          <div className="space-y-3">
            {assignments.map((m, i) => (
              <motion.div key={m.n} initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.8 + i * 0.15 }} className={`flex items-center justify-between border p-4 ${m.active ? "border-primary bg-primary text-ink" : "border-ink-line bg-snow"}`}>
                <div>
                  <div className="label text-[0.6rem] opacity-60">{m.role}</div>
                  <div className="display text-2xl">{m.n}</div>
                </div>
                <div className="label border px-2 py-1 text-xs border-current font-bold">{m.tag}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="label mt-10 text-ink/50">Internal team assignment ensures brand alignment, rapid turnaround, and zero freelancer friction.</p>
      </div>
    </section>
  );
}

/* ---------- TRUST ---------- */

export function Trust() {
  const [i, setI] = useState(0);
  const lightweight = useLightweightMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView || lightweight) return;
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [inView, lightweight]);
  const t = testimonials[i] ?? testimonials[0];
  if (!t) return null;
  return (
    <section ref={ref} className="grain relative min-h-[90vh] overflow-hidden bg-ink">
      <AnimatePresence mode="popLayout">
        <motion.img key={t.img} src={t.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover blur-md" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 0.35, scale: 1.08 }} exit={{ opacity: 0 }} transition={{ duration: 1.4, ease }} />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-[1600px] flex-col justify-center px-5 py-24 md:px-10">
        <Eyebrow n="09">In their words</Eyebrow>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.7, ease }}>
            <blockquote className="display mt-10 max-w-6xl text-4xl normal-case leading-[1] md:text-7xl">
              <span className="text-primary">“</span>{t.quote}<span className="text-primary">”</span>
            </blockquote>
            <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-3">
              <div className="display text-3xl md:text-5xl">{t.name}</div>
              <div className="label text-gray">{t.company}</div>
              <div className="label text-primary">{t.type}</div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-14 flex gap-2">
          {testimonials.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className="h-[3px] w-16 overflow-hidden bg-snow/20">
              {k === i && <motion.div className="h-full origin-left bg-primary" initial={{ scaleX: lightweight ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: lightweight ? 0 : 6, ease: "linear" }} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- AGENCY BENEFITS strip ---------- */

export function Stats() {
  const benefits = [
    {
      n: "01",
      title: "Professional Editing",
      desc: "Every project is cut, paced, and polished by our dedicated internal editing team.",
    },
    {
      n: "02",
      title: "Clear Workflow",
      desc: "A proven, transparent pipeline: Brief → Edit → Review → Deliver.",
    },
    {
      n: "03",
      title: "Built for Content",
      desc: "Engineered for YouTube, social shorts, podcasts, brand films, and commercial cuts.",
    },
    {
      n: "04",
      title: "Collaborative Review",
      desc: "Frame-accurate timeline feedback with iterative revisions and direct communication.",
    },
  ];
  return (
    <section className="border-y border-border bg-ink">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <div key={b.n} className={`px-5 py-8 md:px-8 ${i ? "border-t border-border sm:border-t-0 sm:border-l" : ""}`}>
            <div className="label text-primary">{b.n}</div>
            <h3 className="display mt-3 text-2xl text-snow md:text-3xl">{b.title}</h3>
            <p className="mt-2 text-xs md:text-sm text-gray leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */

export function FinalCta() {
  const lightweight = useLightweightMotion();
  return (
    <section className="relative overflow-hidden bg-ink py-32 md:py-48">
      <div className="pointer-events-none absolute inset-x-0 top-10 flex gap-1 px-5 opacity-30 md:px-10">
        {Array.from({ length: 60 }).map((_, i) => <div key={i} className={`h-3 flex-1 ${i % 10 === 0 ? "h-5 bg-snow" : "bg-snow/40"}`} />)}
      </div>
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-primary"
        initial={{ left: "5%" }}
        whileInView={lightweight ? { left: "5%" } : { left: "95%" }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <h2 className="display text-[14vw] md:text-[clamp(5rem,9.5vw,9.5rem)]">
          <RevealLines lines={["Ready to turn", "your footage into", "finished content?"]} />
        </h2>
        <p className="mt-8 max-w-lg text-lg text-snow/70">
          Tell us what you're working on. We'll take it from there.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Cta to="/get-started">Start a Project</Cta>
          <Cta to="/work" variant="ghost">View Our Work</Cta>
        </div>
      </div>
    </section>
  );
}

/* ---------- PAGE HEADER for inner routes ---------- */

export function PageHeader({ n, eyebrow, lines, intro }: { n: string; eyebrow: string; lines: string[]; intro: string }) {
  return (
    <section className="grain relative overflow-hidden bg-ink pb-20 pt-40 md:pb-28 md:pt-52">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Eyebrow n={n}>{eyebrow}</Eyebrow>
        <h1 className="display mt-8 text-[15vw] md:text-[clamp(5rem,10vw,9.5rem)]">
          <RevealLines lines={lines} />
        </h1>
        <motion.p className="mt-8 max-w-lg text-lg text-snow/70" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease }}>
          {intro}
        </motion.p>
        <motion.div className="mt-14 h-[2px] origin-left bg-primary" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease, delay: 0.3 }} />
      </div>
    </section>
  );
}
