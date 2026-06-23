type VacancyApplicationEmailDetails = {
  applicantEmail: string;
  applicantName: string;
  applicationReference: string;
  contactNumber: string;
  cvFilename: string;
  submittedAt: string;
  vacancyTitle: string;
};

type EmailContent = {
  html: string;
  subject: string;
  text: string;
};

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

function buildDetailsRows(details: VacancyApplicationEmailDetails): string {
  const rows = [
    ['Application reference', details.applicationReference],
    ['Position', details.vacancyTitle],
    ['Applicant', details.applicantName],
    ['Email', details.applicantEmail],
    ['Contact number', details.contactNumber],
    ['CV file', details.cvFilename],
    ['Submitted', formatSubmittedAt(details.submittedAt)],
  ];

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

function buildDetailsText(details: VacancyApplicationEmailDetails): string[] {
  return [
    `Application reference: ${details.applicationReference}`,
    `Position: ${details.vacancyTitle}`,
    `Applicant: ${details.applicantName}`,
    `Email: ${details.applicantEmail}`,
    `Contact number: ${details.contactNumber}`,
    `CV file: ${details.cvFilename}`,
    `Submitted: ${formatSubmittedAt(details.submittedAt)}`,
  ];
}

function buildEmailLayout({
  greeting,
  introduction,
  details,
  closing,
}: {
  greeting: string;
  introduction: string;
  details: VacancyApplicationEmailDetails;
  closing: string;
}): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>RRISL Vacancy Application</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#1f3552;padding:24px 28px;color:#ffffff;">
                <div style="font-size:20px;font-weight:700;line-height:1.4;">Rubber Research Institute of Sri Lanka</div>
                <div style="font-size:14px;line-height:1.5;color:#dbeafe;">Vacancy Application</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#374151;">${escapeHtml(introduction)}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e7eb;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;">
                  ${buildDetailsRows(details)}
                </table>
                <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#374151;">${escapeHtml(closing)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#eef6ee;color:#4b5563;font-size:12px;line-height:1.6;">
                This is an automated message from the RRISL vacancy application system.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildAdminApplicationEmail(
  details: VacancyApplicationEmailDetails
): EmailContent {
  const safeTitle = sanitizeHeaderValue(details.vacancyTitle);

  return {
    subject: `[RRISL Careers] New application for ${safeTitle} (${details.applicationReference})`,
    text: [
      'Dear RRISL Recruitment Team,',
      '',
      `A new vacancy application has been submitted for "${details.vacancyTitle}".`,
      '',
      ...buildDetailsText(details),
      '',
      'The applicant\'s CV is attached to this email. The application is also retained in the RRISL administration system for review.',
      '',
      'RRISL Vacancy Application System',
    ].join('\n'),
    html: buildEmailLayout({
      greeting: 'Dear RRISL Recruitment Team,',
      introduction: `A new vacancy application has been submitted for "${details.vacancyTitle}".`,
      details,
      closing:
        "The applicant's CV is attached to this email. The application is also retained in the RRISL administration system for review.",
    }),
  };
}

export function buildApplicantApplicationEmail(
  details: VacancyApplicationEmailDetails
): EmailContent {
  const safeTitle = sanitizeHeaderValue(details.vacancyTitle);

  return {
    subject: `Application received - ${safeTitle} (${details.applicationReference})`,
    text: [
      `Dear ${details.applicantName},`,
      '',
      `Thank you for applying for the position of "${details.vacancyTitle}" at the Rubber Research Institute of Sri Lanka. Your application has been received successfully and will be reviewed by the relevant team.`,
      '',
      ...buildDetailsText(details),
      '',
      'If your qualifications and experience match the requirements of the position, RRISL will contact you regarding the next stage of the recruitment process.',
      '',
      'Yours sincerely,',
      'Rubber Research Institute of Sri Lanka',
    ].join('\n'),
    html: buildEmailLayout({
      greeting: `Dear ${details.applicantName},`,
      introduction: `Thank you for applying for the position of "${details.vacancyTitle}" at the Rubber Research Institute of Sri Lanka. Your application has been received successfully and will be reviewed by the relevant team.`,
      details,
      closing:
        'If your qualifications and experience match the requirements of the position, RRISL will contact you regarding the next stage of the recruitment process.',
    }),
  };
}

export type { VacancyApplicationEmailDetails };
