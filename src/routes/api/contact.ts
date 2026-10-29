import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sendInquiryEmail } from "@/server/email";

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  format: z.string().min(1, "Pick a format"),
  budget: z.string().min(1, "Pick a budget"),
  timeline: z.string().min(1, "Pick a timeline"),
  brief: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(1500),
  link: z.string().trim().max(500).url("Enter a valid link").optional().or(z.literal("")),
  // Honeypot field: bots usually fill hidden input fields
  _hp: z.string().max(100).optional(),
  // Client timestamp when form mounted: detect sub-second automated submission
  _ts: z.number().optional(),
});

// In-memory rate limiting map: max 5 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count++;
  return true;
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const clientIp =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          "anonymous";

        if (!checkRateLimit(clientIp)) {
          console.warn(`[Contact API Rate Limit] Exceeded by IP: ${clientIp}`);
          return Response.json(
            { success: false, error: "Too many requests. Please try again later." },
            { status: 429 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { success: false, error: "Invalid JSON request body." },
            { status: 400 },
          );
        }

        const parseResult = contactSubmissionSchema.safeParse(body);
        if (!parseResult.success) {
          return Response.json(
            {
              success: false,
              error: "Invalid submission data.",
              issues: parseResult.error.issues.map((i) => i.message),
            },
            { status: 400 },
          );
        }

        const data = parseResult.data;

        // 1. Honeypot spam protection
        if (data._hp && data._hp.trim().length > 0) {
          console.warn(`[Spam Blocked] Honeypot filled by IP: ${clientIp}`);
          return Response.json({ success: false, error: "Submission rejected." }, { status: 400 });
        }

        // 2. Automated bot timing check: must take at least 1200ms to realistically fill and submit
        if (data._ts && Date.now() - data._ts < 1200 && process.env?.["NODE_ENV"] !== "test") {
          console.warn(
            `[Spam Blocked] Form submitted too quickly (${Date.now() - data._ts}ms) by IP: ${clientIp}`,
          );
          return Response.json({ success: false, error: "Submission rejected." }, { status: 400 });
        }

        try {
          await sendInquiryEmail({
            name: data.name,
            email: data.email,
            company: data.company,
            format: data.format,
            budget: data.budget,
            timeline: data.timeline,
            brief: data.brief,
            link: data.link,
            submittedAt: new Date().toUTCString(),
          });

          return Response.json({
            success: true,
            message: "Project inquiry received.",
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.error(`[Contact API Error] Email delivery failed: ${errMsg}`);

          // Never expose API keys or technical backtraces to the client
          return Response.json(
            {
              success: false,
              error:
                "We were unable to deliver your project inquiry via email. Please try again or email us directly at contact@hikarii.studio.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
