import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@proclaimingpraise.org";
const BASE_URL = "https://www.proclaimingpraise.org";

// ─── Shared layout ────────────────────────────────────────────────────────────

function layout(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Proclaiming Praise</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr>
          <td align="center" style="background:#111111;border-radius:16px 16px 0 0;padding:32px 40px 28px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="width:40px;height:40px;background:#c8a44e;border-radius:50%;text-align:center;vertical-align:middle;font-size:20px;color:#111111;font-weight:bold;letter-spacing:-1px;">✝</td>
                <td style="width:12px;"></td>
                <td style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">Proclaiming Praise</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:24px 0 0;">
            <p style="margin:0;font-size:12px;color:#999999;font-family:Arial,sans-serif;">
              Advancing the Kingdom of Heaven, one praise at a time.<br/>
              <a href="${BASE_URL}" style="color:#c8a44e;text-decoration:none;">proclaimingpraise.org</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Reusable gold pill badge
function badge(text: string) {
  return `<span style="display:inline-block;background:#c8a44e;color:#111111;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;padding:4px 12px;border-radius:99px;font-family:Arial,sans-serif;">${text}</span>`;
}

// Reusable info row
function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f0ece6;font-family:Arial,sans-serif;">
      <span style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.5px;">${label}</span><br/>
      <span style="font-size:14px;color:#2a2a2a;font-weight:600;">${value}</span>
    </td>
  </tr>`;
}

// Gold CTA button
function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#c8a44e;color:#111111;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;padding:14px 32px;border-radius:99px;text-decoration:none;">${label}</a>`;
}

// ─── Send helper ──────────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch {
    // Email failures are non-critical — log silently
    console.error("[email] Failed to send to", to);
  }
}

// ─── Worship request ──────────────────────────────────────────────────────────

export async function sendWorshipRequestEmails(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  purpose: string;
  description: string;
  eventDate?: string;
}) {
  const purposeLabel = data.purpose === "high"
    ? "High Season — Celebration"
    : "Low Season — Encouragement";

  await Promise.all([
    // Admin notification
    send(
      ADMIN_EMAIL,
      `New Worship Request from ${data.name}`,
      layout(`
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;">${badge("New Request")}</p>
        <h1 style="margin:12px 0 4px;font-size:24px;color:#111111;">Worship Request</h1>
        <p style="margin:0 0 28px;font-size:14px;color:#999999;font-family:Arial,sans-serif;">Someone wants you to come worship with them.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow("Name", data.name)}
          ${infoRow("Email", data.email)}
          ${infoRow("Phone", data.phone)}
          ${infoRow("City", data.city)}
          ${infoRow("Purpose", purposeLabel)}
          ${data.eventDate ? infoRow("Event Date", data.eventDate) : ""}
        </table>
        <div style="margin:24px 0;padding:16px;background:#faf8f5;border-left:3px solid #c8a44e;border-radius:0 8px 8px 0;">
          <p style="margin:0;font-size:14px;color:#2a2a2a;font-family:Arial,sans-serif;line-height:1.6;">${data.description}</p>
        </div>
        <p style="text-align:center;margin:28px 0 0;">${button("View in Admin", `${BASE_URL}/admin/worship-requests`)}</p>
      `)
    ),

    // Submitter confirmation
    send(
      data.email,
      "We received your worship request 🙏",
      layout(`
        <h1 style="margin:0 0 8px;font-size:26px;color:#111111;">Your request is in our hands.</h1>
        <p style="margin:0 0 28px;font-size:15px;color:#666666;font-family:Arial,sans-serif;line-height:1.6;">
          Hi ${data.name}, thank you for reaching out to Proclaiming Praise. Tyler &amp; Sabrina have received your request and will be in touch soon. You are loved and prayed for.
        </p>
        <div style="background:#faf8f5;border-radius:12px;padding:24px;margin-bottom:28px;">
          <p style="margin:0 0 12px;font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">Your request summary</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${infoRow("Purpose", purposeLabel)}
            ${infoRow("City", data.city)}
            ${data.eventDate ? infoRow("Event Date", data.eventDate) : ""}
          </table>
        </div>
        <p style="font-size:14px;color:#666666;font-family:Arial,sans-serif;line-height:1.6;">
          Questions? Reach us at <a href="mailto:info@proclaimingpraise.org" style="color:#c8a44e;">info@proclaimingpraise.org</a>
        </p>
      `)
    ),
  ]);
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

export async function sendRsvpEmails(data: {
  name: string;
  email: string;
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
}) {
  await Promise.all([
    // Admin notification
    send(
      ADMIN_EMAIL,
      `New RSVP: ${data.name} → ${data.eventTitle}`,
      layout(`
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;">${badge("New RSVP")}</p>
        <h1 style="margin:12px 0 4px;font-size:24px;color:#111111;">${data.eventTitle}</h1>
        <p style="margin:0 0 28px;font-size:14px;color:#999999;font-family:Arial,sans-serif;">Someone just reserved their spot.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow("Name", data.name)}
          ${infoRow("Email", data.email)}
          ${data.eventDate ? infoRow("Event Date", data.eventDate) : ""}
          ${data.eventTime ? infoRow("Time", data.eventTime) : ""}
          ${data.eventLocation ? infoRow("Location", data.eventLocation) : ""}
        </table>
        <p style="text-align:center;margin:28px 0 0;">${button("View RSVPs", `${BASE_URL}/admin/event-rsvps`)}</p>
      `)
    ),

    // Attendee confirmation
    send(
      data.email,
      `You're registered for ${data.eventTitle} ✨`,
      layout(`
        <h1 style="margin:0 0 8px;font-size:26px;color:#111111;">You're on the list, ${data.name}!</h1>
        <p style="margin:0 0 28px;font-size:15px;color:#666666;font-family:Arial,sans-serif;line-height:1.6;">
          We can't wait to worship with you. Here are your event details:
        </p>
        <div style="background:#111111;border-radius:12px;padding:28px;margin-bottom:28px;">
          <p style="margin:0 0 6px;font-size:12px;color:#c8a44e;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">Upcoming Event</p>
          <h2 style="margin:0 0 20px;font-size:20px;color:#ffffff;">${data.eventTitle}</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${data.eventDate ? `<tr><td style="padding:4px 0;font-size:13px;color:#cccccc;font-family:Arial,sans-serif;">📅 &nbsp;${data.eventDate}</td></tr>` : ""}
            ${data.eventTime ? `<tr><td style="padding:4px 0;font-size:13px;color:#cccccc;font-family:Arial,sans-serif;">🕐 &nbsp;${data.eventTime}</td></tr>` : ""}
            ${data.eventLocation ? `<tr><td style="padding:4px 0;font-size:13px;color:#cccccc;font-family:Arial,sans-serif;">📍 &nbsp;${data.eventLocation}</td></tr>` : ""}
          </table>
        </div>
        <p style="font-size:14px;color:#666666;font-family:Arial,sans-serif;line-height:1.6;">
          This is a free event — just show up and bring a friend! Questions? Email us at <a href="mailto:info@proclaimingpraise.org" style="color:#c8a44e;">info@proclaimingpraise.org</a>
        </p>
      `)
    ),
  ]);
}

// ─── Newsletter / community signup ────────────────────────────────────────────

export async function sendNewsletterEmails(data: {
  name: string;
  email: string;
  city: string;
}) {
  await Promise.all([
    // Admin notification
    send(
      ADMIN_EMAIL,
      `New Community Signup: ${data.name} (${data.city})`,
      layout(`
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;">${badge("New Subscriber")}</p>
        <h1 style="margin:12px 0 4px;font-size:24px;color:#111111;">Community Signup</h1>
        <p style="margin:0 0 28px;font-size:14px;color:#999999;font-family:Arial,sans-serif;">Someone new joined the community.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow("Name", data.name)}
          ${infoRow("Email", data.email)}
          ${infoRow("City", data.city)}
        </table>
        <p style="text-align:center;margin:28px 0 0;">${button("View Community", `${BASE_URL}/admin/newsletter`)}</p>
      `)
    ),

    // Welcome email
    send(
      data.email,
      `Welcome to Proclaiming Praise, ${data.name}! 🙌`,
      layout(`
        <h1 style="margin:0 0 8px;font-size:26px;color:#111111;">Welcome to the family, ${data.name}.</h1>
        <p style="margin:0 0 28px;font-size:15px;color:#666666;font-family:Arial,sans-serif;line-height:1.6;">
          You're now part of a community advancing the Kingdom of Heaven through worship. We're so glad you're here.
        </p>
        <div style="background:#faf8f5;border-radius:12px;padding:24px;margin-bottom:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#999999;font-family:Arial,sans-serif;">Based in</p>
          <p style="margin:0;font-size:20px;color:#111111;font-weight:bold;">${data.city}</p>
        </div>
        <p style="margin:0 0 20px;font-size:14px;color:#666666;font-family:Arial,sans-serif;line-height:1.6;">
          Here's what to expect from us:
        </p>
        <ul style="margin:0 0 28px;padding-left:20px;font-size:14px;color:#666666;font-family:Arial,sans-serif;line-height:1.8;">
          <li>Upcoming worship event announcements</li>
          <li>Community praise stories</li>
          <li>Opportunities to get involved</li>
        </ul>
        <p style="text-align:center;margin:0 0 28px;">${button("Explore Events", `${BASE_URL}/events`)}</p>
        <p style="font-size:13px;color:#999999;font-family:Arial,sans-serif;text-align:center;line-height:1.6;">
          Follow us on Instagram <a href="https://instagram.com/proclaimingpraise" style="color:#c8a44e;">@proclaimingpraise</a>
        </p>
      `)
    ),
  ]);
}

// ─── Praise report (admin only — no email captured on the form) ───────────────

export async function sendPraiseReportNotification(data: {
  name: string;
  quote: string;
  role: string;
}) {
  await send(
    ADMIN_EMAIL,
    `New Praise Report from ${data.name}`,
    layout(`
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;">${badge("New Report")}</p>
      <h1 style="margin:12px 0 4px;font-size:24px;color:#111111;">Praise Report</h1>
      <p style="margin:0 0 28px;font-size:14px;color:#999999;font-family:Arial,sans-serif;">A new praise report is waiting for your review.</p>
      <div style="margin:0 0 24px;padding:20px;background:#faf8f5;border-left:3px solid #c8a44e;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 12px;font-size:16px;color:#2a2a2a;font-family:Georgia,serif;line-height:1.7;">&ldquo;${data.quote}&rdquo;</p>
        <p style="margin:0;font-size:13px;color:#999999;font-family:Arial,sans-serif;">— ${data.name}, ${data.role}</p>
      </div>
      <p style="text-align:center;margin:0;">${button("Review &amp; Publish", `${BASE_URL}/admin/praise-reports`)}</p>
    `)
  );
}
