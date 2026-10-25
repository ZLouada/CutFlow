import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import logoWhite from "@/assets/hikarii-logo-white.png";
import logoBlack from "@/assets/hikarii-logo-black.png";
import logoOrange from "@/assets/hikarii-logo-orange.png";
import markWhite from "@/assets/hikarii-mark-white.png";
import markBlack from "@/assets/hikarii-mark-black.png";
import markOrange from "@/assets/hikarii-mark-orange.png";
import { useEffect, useState, type ReactNode } from "react";
import { useLightweightMotion } from "@/hooks/use-lightweight-motion";
import { useHikariiAuth } from "@/lib/auth-context";

export function Logo({
  className = "h-8",
  variant = "orange",
  symbolOnly = false,
  responsive = false,
}: {
  className?: string;
  variant?: "white" | "black" | "orange";
  symbolOnly?: boolean;
  responsive?: boolean;
}) {
  const full =
    variant === "black"
      ? logoBlack
      : variant === "white"
      ? logoWhite
      : logoOrange;
  const mark =
    variant === "black"
      ? markBlack
      : variant === "white"
      ? markWhite
      : markOrange;

  if (symbolOnly) {
    return (
      <img
        src={mark}
        alt="HiKARii"
        width={621}
        height={479}
        className={`w-auto object-contain ${className}`}
      />
    );
  }

  if (responsive) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={mark}
          alt="HiKARii"
          width={621}
          height={479}
          className="h-full w-auto sm:hidden object-contain"
        />
        <img
          src={full}
          alt="HiKARii"
          width={1099}
          height={300}
          className="hidden sm:block h-full w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <img
      src={full}
      alt="HiKARii"
      width={1099}
      height={300}
      className={`w-auto object-contain ${className}`}
    />
  );
}

type CtaProps = {
  to: "/" | "/work" | "/how-it-works" | "/clients" | "/editors" | "/pricing" | "/get-started" | "/terms" | "/dashboard" | "/sign-in";
  hash?: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ink";
  className?: string;
};

export function Cta({ to, hash, children, variant = "primary", className = "" }: CtaProps) {
  return (
    <Link to={to} {...(hash ? { hash } : {})} className={`btn-slide btn-${variant} group ${className}`}>
      <span>{children}</span>
      <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
    </Link>
  );
}

const nav = [
  { to: "/work", label: "Work" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/clients", label: "For Clients" },
  { to: "/editors", label: "For Editors" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function Nav() {
  const lightweight = useLightweightMotion();
  const { isSignedIn, user } = useHikariiAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        open ? "border-b border-border bg-ink py-3" : scrolled ? "border-b border-border bg-ink/95 py-3 backdrop-blur-md" : "border-b border-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link to="/" aria-label="HiKARii home">
          <Logo responsive className={`transition-all duration-500 ${scrolled ? "h-7" : "h-9"}`} />
        </Link>
        <nav className="hidden items-center gap-6 whitespace-nowrap xl:flex 2xl:gap-9">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-line label text-snow/80 hover:text-snow"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 whitespace-nowrap xl:flex">
          {isSignedIn && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 border border-primary/40 bg-primary/10 rounded-xs text-xs text-snow hover:border-primary transition-colors font-mono"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Dashboard</span>
              <span className="text-primary font-bold">({user?.firstName || "Client"})</span>
            </Link>
          )}
          <Link to="/editors" hash="apply" className="link-line label hidden 2xl:inline text-snow/70 hover:text-snow">
            Become an Editor
          </Link>
          <Cta to="/get-started" className={scrolled ? "!py-3" : ""}>
            Get Your Video Edited
          </Cta>
        </div>
        <button
          className="label flex items-center gap-2 xl:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-primary transition-transform ${open ? "rotate-45" : ""}`} />
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={lightweight ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={lightweight ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={lightweight ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: lightweight ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 -z-10 flex h-dvh flex-col justify-end overflow-y-auto bg-ink px-5 pb-10 pt-24 xl:hidden"
          >
            {nav.map((n, i) => (
              <motion.div
                key={n.to}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link to={n.to} className="display block py-2 text-[length:clamp(2rem,9vw,3rem)]">
                  <span className="label mr-3 align-middle text-primary">0{i + 1}</span>
                  {n.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              {isSignedIn && (
                <Cta to="/dashboard">Go to Dashboard ({user?.firstName})</Cta>
              )}
              <Cta to="/get-started">Get Your Video Edited</Cta>
              <Cta to="/editors" variant="ghost" hash="apply">
                Become an Editor
              </Cta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Black wipe + orange line sweep on every route change */
export function PageTransition() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (key === null) {
      setKey("init");
      return;
    }
    if (!reduce) setKey(path);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  if (!key || key === "init") return null;
  return (
    <motion.div
      key={key}
      className="pointer-events-none fixed inset-0 z-[100]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.35, duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-ink" />
      <motion.div
        className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

const cols = [
  {
    h: "Platform",
    l: [
      { to: "/how-it-works", t: "How It Works" },
      { to: "/clients", t: "For Clients" },
      { to: "/editors", t: "For Editors" },
      { to: "/pricing", t: "Pricing" },
    ],
  },
  {
    h: "Company",
    l: [
      { to: "/", t: "About" },
      { to: "/work", t: "Work" },
      { to: "/clients", t: "Contact" },
      { to: "/terms", t: "Terms & Policies" },
    ],
  },
  {
    h: "Standards",
    l: [
      { to: "/terms", t: "Halal Content Policy" },
      { to: "/terms", t: "Content Authorization" },
      { to: "/how-it-works", t: "Editing Process" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-ink pt-20">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-12 px-5 md:px-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Logo className="h-10 md:h-12" />
          <p className="mt-6 max-w-xs text-sm text-gray">
            HiKARii connects the people with the story to the people with the craft.
          </p>
          <div className="mt-6 flex gap-5">
            <a
              key="X"
              href="https://x.com/hikarii"
              target="_blank"
              rel="noreferrer"
              className="link-line label text-gray hover:text-snow"
            >
              X
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div className="label mb-5 text-primary">{c.h}</div>
            <ul className="space-y-3">
              {c.l.map((l) => (
                <li key={l.t}>
                  <Link to={l.to} className="link-line text-sm text-snow/80 hover:text-snow">
                    {l.t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="group mt-16 select-none px-3">
        <div className="font-display font-bold relative text-center text-[20vw] leading-[0.8] tracking-tight text-soft transition-colors duration-700 group-hover:text-primary">
          HiKARii
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-gray md:px-10">
        <div className="flex flex-wrap items-center gap-6">
          <span>© 2026 HiKARii</span>
          <Link to="/terms" className="link-line hover:text-snow">
            Halal Policy & Content Terms
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-policy-modal"))}
            className="link-line cursor-pointer text-gray hover:text-snow transition-colors"
          >
            Policy Preferences
          </button>
        </div>
        <span className="label">00:00:00:00 — End of reel</span>
      </div>
    </footer>
  );
}
