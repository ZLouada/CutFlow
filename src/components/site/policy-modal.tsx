import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/site/layout";
import { useLightweightMotion } from "@/hooks/use-lightweight-motion";

export const POLICY_STORAGE_KEY = "hikarii_policy_consent";

export function PolicyModal() {
  const [open, setOpen] = useState(false);
  const [declinedView, setDeclinedView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lightweight = useLightweightMotion();

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(POLICY_STORAGE_KEY);
      if (!saved) {
        // Small delay so page renders first, then mini window appears smoothly
        const timer = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may be disabled in private mode
      setOpen(true);
    }

    const handleOpen = () => {
      setDeclinedView(false);
      setOpen(true);
    };

    window.addEventListener("open-policy-modal", handleOpen);
    return () => window.removeEventListener("open-policy-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleAccept = () => {
    try {
      localStorage.setItem(POLICY_STORAGE_KEY, "accepted");
    } catch {
      // ignore storage failure
    }
    setOpen(false);
    setDeclinedView(false);
  };

  const handleRejectClick = () => {
    try {
      localStorage.setItem(POLICY_STORAGE_KEY, "rejected");
    } catch {
      // ignore storage failure
    }
    setDeclinedView(true);
  };

  const handleCloseAfterDecline = () => {
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-modal-title"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-ink/85 backdrop-blur-md"
          />

          {/* Mini Window Card */}
          <motion.div
            initial={lightweight ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={lightweight ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={lightweight ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden border border-border bg-charcoal text-snow shadow-2xl"
          >
            {/* Top orange brand stripe */}
            <div className="h-1 w-full bg-primary" />

            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-border bg-ink/70 px-5 py-3">
              <div className="flex items-center gap-3">
                <Logo className="h-5" />
                <span className="text-border">|</span>
                <span className="label text-[0.65rem] text-gray">Standards & Policy</span>
              </div>
              <span className="label text-[0.65rem] text-primary">v1.0</span>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              {!declinedView ? (
                <div>
                  <div className="label text-primary">Creative & Ethical Standards</div>
                  <h2
                    id="policy-modal-title"
                    className="display mt-2 text-2xl sm:text-3xl leading-tight"
                  >
                    Halal Content Policy & Terms
                  </h2>

                  <div className="mt-4 border-l-2 border-primary bg-ink/60 p-3.5 text-xs text-snow/90 sm:text-sm">
                    "We want to create professional, high-quality video content without compromising our Islamic and ethical standards."
                  </div>

                  <p className="mt-4 text-xs text-snow/70 sm:text-sm leading-relaxed">
                    Before using HiKARii, please review and accept our policy standards governing every project:
                  </p>

                  <ul className="mt-4 space-y-2.5 text-xs text-snow/80 sm:text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-primary font-bold">✕</span>
                      <span>
                        <strong className="text-snow">No Prohibited Content:</strong> No nudity, sexually provocative material, gambling, alcohol, drugs, or illegal activity.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-primary font-bold">✕</span>
                      <span>
                        <strong className="text-snow">No Music Policy:</strong> We do not add songs, background music tracks, or compositions — relying instead on dialogue, Foley sound design, and ambient atmosphere.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-primary font-bold">✓</span>
                      <span>
                        <strong className="text-snow">Client Content Authorization:</strong> You confirm legal ownership or licensing permissions for all footage and assets provided.
                      </span>
                    </li>
                  </ul>

                  <div className="mt-5 pt-3 border-t border-border/60">
                    <Link
                      to="/terms"
                      onClick={() => setOpen(false)}
                      className="link-line label text-xs text-primary hover:text-snow"
                    >
                      Read the full Halal Policy & Client Authorization →
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="label text-destructive">Policy Declined</div>
                  <h2
                    id="policy-modal-title"
                    className="display mt-2 text-2xl sm:text-3xl leading-tight text-snow"
                  >
                    You have declined our policies
                  </h2>

                  <p className="mt-4 text-xs text-snow/80 sm:text-sm leading-relaxed">
                    HiKARii operates strictly under our Halal Content Policy and Client Content Authorization.
                  </p>

                  <div className="mt-4 border border-border bg-ink/70 p-4 text-xs text-snow/70 space-y-2">
                    <p>
                      Because our editors adhere to our zero-music standard and ethical guidelines, we cannot accept or edit projects that conflict with these principles.
                    </p>
                    <p>
                      You may still browse our showcase work and documentation, but you will not be able to submit projects without accepting these terms.
                    </p>
                  </div>

                  <div className="mt-5">
                    <Link
                      to="/terms"
                      onClick={() => setOpen(false)}
                      className="link-line label text-xs text-primary hover:text-snow"
                    >
                      Review the full policy details →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border bg-ink/80 px-5 py-4 sm:px-7">
              {!declinedView ? (
                <>
                  <button
                    type="button"
                    onClick={handleRejectClick}
                    className="btn-slide btn-ghost !py-2.5 !px-4 text-xs"
                  >
                    <span>Reject</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="btn-slide btn-primary !py-2.5 !px-5 text-xs"
                  >
                    <span>Accept & Continue</span>
                    <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCloseAfterDecline}
                    className="btn-slide btn-ghost !py-2.5 !px-4 text-xs"
                  >
                    <span>Close</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="btn-slide btn-primary !py-2.5 !px-5 text-xs"
                  >
                    <span>Reconsider & Accept</span>
                    <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
