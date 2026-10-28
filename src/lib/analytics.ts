import { track } from "@vercel/analytics";

export type EventLocation = "header" | "hero" | "pricing" | "footer" | "other";
export type BillingType = "pack" | "monthly";

export type AnalyticsEvents = {
  start_project_clicked: {
    location: EventLocation;
    plan?: string;
  };
  pricing_viewed?: Record<string, never>;
  pricing_plan_selected: {
    plan: string;
    billing: BillingType;
  };
  get_started_started?: Record<string, never>;
  contact_submitted?: {
    source?: "website" | "dashboard";
  };
  work_viewed?: Record<string, never>;
};

/**
 * Disallowed property keys to guarantee no PII or sensitive data is ever sent to Vercel Analytics.
 */
const FORBIDDEN_KEYS = new Set([
  "email",
  "name",
  "phone",
  "message",
  "brief",
  "link",
  "url",
  "description",
  "footage",
  "file",
  "files",
  "token",
  "password",
  "userId",
  "user_id",
  "clerkId",
  "clerk_id",
  "payment",
  "creditCard",
  "card",
]);

/**
 * Track custom events with Vercel Analytics safely.
 * Non-blocking, privacy-conscious, and SSR-safe.
 */
export function trackEvent<E extends keyof AnalyticsEvents>(
  event: E,
  properties?: AnalyticsEvents[E],
): void {
  if (typeof window === "undefined") return;

  try {
    if (!properties) {
      track(event);
      return;
    }

    // Sanitize properties to prevent any accidental PII leakage
    const cleanProps: Record<string, string | number | boolean | null> = {};
    for (const [key, value] of Object.entries(properties)) {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
        continue;
      }
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        cleanProps[key] = value;
      }
    }

    track(event, cleanProps);
  } catch (error) {
    if (typeof process !== "undefined" && process.env?.["NODE_ENV"] === "development") {
      console.warn(`[Vercel Analytics] Failed to track event "${event}":`, error);
    }
  }
}
