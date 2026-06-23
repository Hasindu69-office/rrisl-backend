type EmailContent = {
  html: string;
  subject: string;
  text: string;
};

type DeliveryTask = {
  recipientType: 'admin' | 'user';
  send: Promise<unknown>;
};

type DetailRow = [label: string, value: string];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseRecipientList(value: string | undefined): string[] {
  return normalizeString(value)
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function normalizeRoutingKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseRecipientRouting(value: string | undefined): Record<string, string[]> {
  return normalizeString(value)
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string[]>>((routes, entry) => {
      const separatorIndex = entry.indexOf('=');

      if (separatorIndex <= 0) {
        return routes;
      }

      const rawKey = entry.slice(0, separatorIndex);
      const rawRecipients = entry.slice(separatorIndex + 1);
      const key = normalizeRoutingKey(rawKey);
      const recipients = parseRecipientList(rawRecipients);

      if (key && recipients.length > 0) {
        routes[key] = recipients;
      }

      return routes;
    }, {});
}

function formatSubmittedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Colombo',
  }).format(date)} (Sri Lanka time)`;
}

function buildDetailsRows(rows: DetailRow[]): string {
  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#4b5563;font-weight:600;vertical-align:top;width:180px;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;vertical-align:top;word-break:break-word;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');
}

function buildDetailsText(rows: DetailRow[]): string[] {
  return rows.map(([label, value]) => `${label}: ${value}`);
}

function buildEmailLayout({
  footerNote,
  greeting,
  introduction,
  rows,
  title,
  closing,
  message,
}: {
  closing?: string;
  footerNote: string;
  greeting: string;
  introduction: string;
  message?: string;
  rows: DetailRow[];
  title: string;
}): string {
  const messageBlock = message
    ? `
                <div style="margin-top:22px;">
                  <div style="font-size:14px;font-weight:700;color:#374151;margin-bottom:8px;">Message</div>
                  <div style="white-space:pre-wrap;border:1px solid #e5e7eb;border-radius:6px;padding:14px 16px;color:#111827;font-size:15px;line-height:1.7;background:#f9fafb;">${escapeHtml(message)}</div>
                </div>`
    : '';
  const closingBlock = closing
    ? `<p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#374151;">${escapeHtml(closing)}</p>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#1f3552;padding:24px 28px;color:#ffffff;">
                <div style="font-size:20px;font-weight:700;line-height:1.4;">Rubber Research Institute of Sri Lanka</div>
                <div style="font-size:14px;line-height:1.5;color:#dbeafe;">${escapeHtml(title)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#374151;">${escapeHtml(introduction)}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e7eb;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;">
                  ${buildDetailsRows(rows)}
                </table>${messageBlock}
                ${closingBlock}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#eef6ee;color:#4b5563;font-size:12px;line-height:1.6;">
                ${escapeHtml(footerNote)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function getCreatedRecordReference(response: unknown, prefix: string): string {
  const record = (response as { data?: { id?: unknown; documentId?: unknown } })?.data;
  const referenceValue = String(record?.id ?? record?.documentId ?? '').trim();

  return `${prefix}-${referenceValue || 'UNKNOWN'}`;
}

async function sendIndependentNotifications({
  feature,
  reference,
  strapi,
  tasks,
}: {
  feature: string;
  reference: string;
  strapi: any;
  tasks: DeliveryTask[];
}) {
  const results = await Promise.allSettled(tasks.map(({ send }) => send));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const recipientType = tasks[index].recipientType;
      strapi.log.error(
        `[${feature} ${reference}] Failed to send ${recipientType} notification.`,
        result.reason
      );
    }
  });
}

export {
  buildDetailsText,
  buildEmailLayout,
  escapeHtml,
  formatSubmittedAt,
  getCreatedRecordReference,
  normalizeRoutingKey,
  normalizeString,
  parseRecipientList,
  parseRecipientRouting,
  sanitizeHeaderValue,
  sendIndependentNotifications,
};

export type { DeliveryTask, DetailRow, EmailContent };
