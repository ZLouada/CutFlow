export interface ProjectInquiryData {
  name: string;
  email: string;
  company?: string;
  format: string;
  budget: string;
  timeline: string;
  brief: string;
  link?: string;
  submittedAt?: string;
}

export interface FormattedEmail {
  subject: string;
  text: string;
  html: string;
  to: string;
  from: string;
  replyTo: string;
}

export function formatInquiryEmail(data: ProjectInquiryData): FormattedEmail {
  const submittedAt = data.submittedAt || new Date().toUTCString();
  const contactEmail = process.env?.["CONTACT_EMAIL"] || "contact@hikarii.studio";
  const fromEmail = process.env?.["EMAIL_FROM"] || "HiKARii Inquiries <onboarding@resend.dev>";
  const company = data.company?.trim() ? data.company.trim() : "Not provided";
  const link = data.link?.trim() ? data.link.trim() : "None provided";

  const subject = `New HiKARii Project Inquiry — ${data.name.trim()}`;

  const text = `
==================================================
NEW HIKARII PROJECT INQUIRY
==================================================

Client:              ${data.name.trim()}
Email:               ${data.email.trim()}
Company / Channel:   ${company}
Project Format:      ${data.format}
Budget:              ${data.budget}
Timeline / Deadline: ${data.timeline}

--------------------------------------------------
Project Brief:
--------------------------------------------------
${data.brief.trim()}

--------------------------------------------------
Footage / Reference Link:
${link}

--------------------------------------------------
Submitted At:        ${submittedAt}
Reply-To:            ${data.email.trim()}
==================================================
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; color: #F5F5F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #121212; border: 1px solid #262626; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 24px 32px; border-bottom: 2px solid #FF5500;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: 0.05em; color: #FFFFFF;">HiKARii</span>
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #FF5500; margin-left: 10px; font-weight: 600;">Project Inquiry</span>
                  </td>
                  <td align="right" style="font-size: 12px; color: #888888;">
                    ${escapeHtml(submittedAt)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 28px 32px 16px 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #FFFFFF;">
                New Project Inquiry from ${escapeHtml(data.name.trim())}
              </h1>
              <p style="margin: 0; font-size: 14px; color: #A0A0A0; line-height: 1.5;">
                A client has submitted the project intake form on <strong style="color: #FFFFFF;">hikarii.studio</strong>.
              </p>
            </td>
          </tr>

          <!-- Client Details Grid -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #181818; border: 1px solid #262626; border-radius: 6px; padding: 16px; margin: 16px 0;">
                <tr>
                  <td width="35%" style="padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888;">Client Name</td>
                  <td style="padding: 8px 12px; font-size: 14px; font-weight: 600; color: #FFFFFF;">${escapeHtml(data.name.trim())}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; border-top: 1px solid #222222;">Email</td>
                  <td style="padding: 8px 12px; font-size: 14px; color: #FF5500; border-top: 1px solid #222222;">
                    <a href="mailto:${escapeHtml(data.email.trim())}" style="color: #FF5500; text-decoration: none;">${escapeHtml(data.email.trim())}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; border-top: 1px solid #222222;">Company / Brand</td>
                  <td style="padding: 8px 12px; font-size: 14px; color: #E0E0E0; border-top: 1px solid #222222;">${escapeHtml(company)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; border-top: 1px solid #222222;">Project Format</td>
                  <td style="padding: 8px 12px; font-size: 14px; font-weight: 600; color: #FFFFFF; border-top: 1px solid #222222;">${escapeHtml(data.format)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; border-top: 1px solid #222222;">Budget</td>
                  <td style="padding: 8px 12px; font-size: 14px; color: #E0E0E0; border-top: 1px solid #222222;">${escapeHtml(data.budget)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; border-top: 1px solid #222222;">Timeline</td>
                  <td style="padding: 8px 12px; font-size: 14px; color: #E0E0E0; border-top: 1px solid #222222;">${escapeHtml(data.timeline)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Project Brief Section -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #FF5500; font-weight: 700; margin-bottom: 8px;">
                Project Brief
              </div>
              <div style="background-color: #181818; border: 1px solid #262626; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; color: #E0E0E0; white-space: pre-wrap;">
                ${escapeHtml(data.brief.trim())}
              </div>
            </td>
          </tr>

          <!-- Reference Link -->
          ${
            data.link?.trim()
              ? `
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #888888; font-weight: 600; margin-bottom: 8px;">
                Footage / Reference Link
              </div>
              <div style="background-color: #181818; border: 1px solid #262626; border-radius: 6px; padding: 12px 16px; font-size: 14px;">
                <a href="${escapeHtml(data.link.trim())}" target="_blank" rel="noopener noreferrer" style="color: #FF5500; text-decoration: underline; word-break: break-all;">
                  ${escapeHtml(data.link.trim())}
                </a>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- CTA / Reply -->
          <tr>
            <td align="center" style="padding: 12px 32px 32px 32px;">
              <a href="mailto:${escapeHtml(data.email.trim())}?subject=${encodeURIComponent(`Re: New HiKARii Project Inquiry — ${data.name.trim()}`)}" style="display: inline-block; background-color: #FF5500; color: #FFFFFF; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 4px; text-decoration: none;">
                Reply Directly to ${escapeHtml(data.name.trim())} &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 20px 32px; border-top: 1px solid #262626; font-size: 11px; color: #666666; text-align: center;">
              This notification was generated automatically by the HiKARii intake system at <a href="https://hikarii.studio" style="color: #888888; text-decoration: none;">hikarii.studio</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return {
    subject,
    text,
    html,
    to: contactEmail,
    from: fromEmail,
    replyTo: data.email.trim(),
  };
}

export async function sendInquiryEmail(
  data: ProjectInquiryData,
): Promise<{ success: boolean; id?: string }> {
  const formatted = formatInquiryEmail(data);
  const apiKey = process.env?.["RESEND_API_KEY"] || process.env?.["EMAIL_API_KEY"];

  // Test mode fallback: Allows unit and integration tests to verify formatting and pipeline without external network calls
  if (process.env?.["NODE_ENV"] === "test" && !apiKey) {
    return { success: true, id: "test-mock-id" };
  }

  if (!apiKey) {
    console.error("[Email Error] Missing RESEND_API_KEY / EMAIL_API_KEY environment variable.");
    throw new Error("Email service is not configured on the server.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: formatted.from,
      to: [formatted.to],
      reply_to: formatted.replyTo,
      subject: formatted.subject,
      text: formatted.text,
      html: formatted.html,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "Unknown error");
    console.error(`[Email Provider Error] HTTP ${response.status}: ${errorDetails}`);
    throw new Error(`Transactional email provider responded with status ${response.status}`);
  }

  const result = (await response.json().catch(() => ({}))) as { id?: string };
  return { success: true, id: result.id };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
