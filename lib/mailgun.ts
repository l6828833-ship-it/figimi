import "server-only";

// Minimal Mailgun HTTP API client using fetch (no SDK dependency required).
// Configure via environment variables:
//   MAILGUN_API_KEY   - your Mailgun private API key (server-only, never public)
//   MAILGUN_DOMAIN    - your sending domain, e.g. mg.figimi.com
//   MAILGUN_REGION    - optional: "eu" to use the EU API host
//   MAILGUN_API_BASE_URL - optional: overrides the API host entirely
//   MAILGUN_FROM_EMAIL   - optional: default From header

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
};

export function isMailgunConfigured(): boolean {
  return Boolean(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
}

function apiBaseUrl(): string {
  if (process.env.MAILGUN_API_BASE_URL) return process.env.MAILGUN_API_BASE_URL.replace(/\/$/, "");
  return process.env.MAILGUN_REGION === "eu" ? "https://api.eu.mailgun.net" : "https://api.mailgun.net";
}

export async function sendMailgunMessage({ to, subject, text, from, replyTo }: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return { ok: false, error: "not-configured" };

  const sender = from || process.env.MAILGUN_FROM_EMAIL || `Figimi Contact <postmaster@${domain}>`;
  const body = new URLSearchParams({ from: sender, to, subject, text });
  if (replyTo) body.set("h:Reply-To", replyTo);

  try {
    const response = await fetch(`${apiBaseUrl()}/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { ok: false, error: `mailgun-${response.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "send-failed" };
  }
}
