import { describe, expect, it } from "vitest";
import { formatInquiryEmail, sendInquiryEmail, type ProjectInquiryData } from "../server/email";
import { contactSubmissionSchema } from "../routes/api/contact";

describe("Email Notification Service & Formatting", () => {
  const sampleData: ProjectInquiryData = {
    name: "Alex Rivera",
    email: "alex@creativeagency.com",
    company: "Rivera Media Labs",
    format: "Social / short-form",
    budget: "$1,000 – $5,000",
    timeline: "Within a week",
    brief:
      "We need 12 vertical reels edited from raw podcast footage with bold animated captions and sound design.",
    link: "https://drive.google.com/drive/folders/sample-footage-link",
    submittedAt: "Thursday, Oct 29, 2026, 5:30 PM UTC",
  };

  it("formats email with required subject, recipient, and replyTo", () => {
    const formatted = formatInquiryEmail(sampleData);

    expect(formatted.subject).toBe("New HiKARii Project Inquiry — Alex Rivera");
    expect(formatted.to).toBe("contact@hikarii.studio");
    expect(formatted.replyTo).toBe("alex@creativeagency.com");
  });

  it("includes all client-submitted fields in both plain text and HTML bodies", () => {
    const formatted = formatInquiryEmail(sampleData);

    // Plain text checks
    expect(formatted.text).toContain("Alex Rivera");
    expect(formatted.text).toContain("alex@creativeagency.com");
    expect(formatted.text).toContain("Rivera Media Labs");
    expect(formatted.text).toContain("Social / short-form");
    expect(formatted.text).toContain("$1,000 – $5,000");
    expect(formatted.text).toContain("Within a week");
    expect(formatted.text).toContain("12 vertical reels edited");
    expect(formatted.text).toContain("https://drive.google.com/drive/folders/sample-footage-link");
    expect(formatted.text).toContain("Thursday, Oct 29, 2026, 5:30 PM UTC");

    // HTML checks
    expect(formatted.html).toContain("Alex Rivera");
    expect(formatted.html).toContain("alex@creativeagency.com");
    expect(formatted.html).toContain("Rivera Media Labs");
    expect(formatted.html).toContain("Social / short-form");
    expect(formatted.html).toContain("$1,000 – $5,000");
    expect(formatted.html).toContain("Within a week");
    expect(formatted.html).toContain("12 vertical reels edited");
    expect(formatted.html).toContain("https://drive.google.com/drive/folders/sample-footage-link");
    expect(formatted.html).toContain("mailto:alex@creativeagency.com");
  });

  it("handles optional fields gracefully when omitted", () => {
    const minimalData: ProjectInquiryData = {
      name: "Sam Jordan",
      email: "sam@example.com",
      format: "YouTube",
      budget: "$300 – $1,000",
      timeline: "ASAP (48h)",
      brief: "Looking for a weekly YouTube vlog editor with fast turnaround.",
    };

    const formatted = formatInquiryEmail(minimalData);

    expect(formatted.subject).toBe("New HiKARii Project Inquiry — Sam Jordan");
    expect(formatted.text).toContain("Not provided");
    expect(formatted.text).toContain("None provided");
    expect(formatted.html).toContain("Not provided");
  });

  it("escapes potentially malicious HTML characters in inputs", () => {
    const xssData: ProjectInquiryData = {
      name: "<script>alert('xss')</script>",
      email: "test@example.com",
      company: 'Evil & "Co"',
      format: "Commercial",
      budget: "Under $300",
      timeline: "Ongoing",
      brief: "<b>Bold statement</b> & <iframe src='malicious.site'></iframe>",
    };

    const formatted = formatInquiryEmail(xssData);

    expect(formatted.html).not.toContain("<script>");
    expect(formatted.html).toContain("&lt;script&gt;");
    expect(formatted.html).not.toContain("<iframe");
    expect(formatted.html).toContain("&lt;iframe");
    expect(formatted.html).toContain("Evil &amp; &quot;Co&quot;");
  });

  it("respects custom CONTACT_EMAIL environment variable override", () => {
    const original = process.env?.["CONTACT_EMAIL"];
    try {
      process.env["CONTACT_EMAIL"] = "custom-inbox@hikarii.studio";
      const formatted = formatInquiryEmail(sampleData);
      expect(formatted.to).toBe("custom-inbox@hikarii.studio");
    } finally {
      if (original) {
        process.env["CONTACT_EMAIL"] = original;
      } else {
        delete process.env["CONTACT_EMAIL"];
      }
    }
  });

  it("mock mode executes successfully in test environment", async () => {
    const result = await sendInquiryEmail(sampleData);
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });
});

describe("/api/contact Submission Validation & Spam Protection", () => {
  it("validates valid submissions successfully", () => {
    const validPayload = {
      name: "Marcus Vance",
      email: "marcus@vancemedia.co",
      company: "Vance Media",
      format: "YouTube",
      budget: "$1,000 – $5,000",
      timeline: "Within a month",
      brief: "We need long-form documentary edits for our YouTube channel.",
      link: "https://vimeo.com/sample",
      _hp: "",
      _ts: Date.now() - 5000,
    };

    const result = contactSubmissionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects submissions with invalid email or brief too short", () => {
    const invalidEmail = {
      name: "Marcus Vance",
      email: "not-an-email",
      format: "YouTube",
      budget: "$1,000 – $5,000",
      timeline: "Within a month",
      brief: "Too short",
    };

    const result = contactSubmissionSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Enter a valid email");
      expect(messages).toContain("Tell us a bit more (10+ characters)");
    }
  });

  it("detects honeypot bot trap", () => {
    const botPayload = {
      name: "Spam Bot",
      email: "bot@spammer.org",
      format: "Commercial",
      budget: "Under $300",
      timeline: "ASAP (48h)",
      brief: "Buy cheap crypto and links now!",
      _hp: "I am a hidden bot entry", // Bots fill this
    };

    const result = contactSubmissionSchema.safeParse(botPayload);
    expect(result.success).toBe(true);
    // Server handler verifies _hp is populated and blocks it
    expect(result.data?._hp).toBe("I am a hidden bot entry");
  });
});
