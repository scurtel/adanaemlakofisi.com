interface LeadNotificationPayload {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  source: string;
  listingId?: string | null;
  listingTitle?: string | null;
}

function buildLeadEmailHtml(lead: LeadNotificationPayload): string {
  const listingLine = lead.listingTitle
    ? `<p><strong>İlan:</strong> ${escapeHtml(lead.listingTitle)}</p>`
    : lead.listingId
      ? `<p><strong>İlan ID:</strong> ${escapeHtml(lead.listingId)}</p>`
      : "";

  return `
    <h2>Yeni lead bildirimi</h2>
    <p><strong>Ad:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(lead.phone)}</p>
    ${lead.email ? `<p><strong>E-posta:</strong> ${escapeHtml(lead.email)}</p>` : ""}
    <p><strong>Kaynak:</strong> ${escapeHtml(lead.source)}</p>
    ${listingLine}
    <p><strong>Mesaj:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="color:#666;font-size:12px;">Lead ID: ${escapeHtml(lead.id)}</p>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaResend(
  lead: LeadNotificationPayload,
  to: string,
  apiKey: string
): Promise<boolean> {
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Adana Emlak Ofisi <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Yeni lead: ${lead.name}`,
      html: buildLeadEmailHtml(lead),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[lead-notification] Resend hatası:", res.status, body);
    return false;
  }

  return true;
}

export async function notifyNewLead(lead: LeadNotificationPayload): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL_TO;
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey && to) {
    try {
      const sent = await sendViaResend(lead, to, resendKey);
      if (sent) {
        console.info("[lead-notification] E-posta gönderildi:", { to, leadId: lead.id });
        return;
      }
    } catch (error) {
      console.error("[lead-notification] E-posta gönderilemedi:", error);
    }
  }

  console.info("[lead-notification] Yeni lead:", {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    source: lead.source,
    listing: lead.listingTitle || lead.listingId || null,
    message: lead.message.slice(0, 120),
  });
}
