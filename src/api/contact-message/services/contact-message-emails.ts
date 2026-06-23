import {
  buildDetailsText,
  buildEmailLayout,
  formatSubmittedAt,
  sanitizeHeaderValue,
  type DetailRow,
  type EmailContent,
} from '../../../utils/email-notifications';

type ContactMessageEmailDetails = {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  phoneNumber: string;
  reference: string;
  subject: string;
  submittedAt: string;
};

function getFullName(details: ContactMessageEmailDetails): string {
  return [details.firstName, details.lastName].filter(Boolean).join(' ').trim();
}

function buildContactRows(details: ContactMessageEmailDetails): DetailRow[] {
  return [
    ['Reference', details.reference],
    ['Name', getFullName(details)],
    ['Email', details.email],
    ['Phone number', details.phoneNumber],
    ['Subject', details.subject],
    ['Submitted', formatSubmittedAt(details.submittedAt)],
  ];
}

function buildAdminContactMessageEmail(details: ContactMessageEmailDetails): EmailContent {
  const safeSubject = sanitizeHeaderValue(details.subject || 'Contact message');
  const rows = buildContactRows(details);

  return {
    subject: `[RRISL Contact] ${safeSubject} (${details.reference})`,
    text: [
      'Dear RRISL Team,',
      '',
      'A new contact form message has been submitted through the RRISL website.',
      '',
      ...buildDetailsText(rows),
      '',
      'Message:',
      details.message,
      '',
      'The message is also retained in the RRISL administration system for review and follow-up.',
      '',
      'RRISL Contact Form Notification System',
    ].join('\n'),
    html: buildEmailLayout({
      footerNote: 'This is an automated message from the RRISL contact form system.',
      greeting: 'Dear RRISL Team,',
      introduction: 'A new contact form message has been submitted through the RRISL website.',
      rows,
      message: details.message,
      closing:
        'The message is also retained in the RRISL administration system for review and follow-up.',
      title: 'Contact Form Message',
    }),
  };
}

function buildUserContactMessageEmail(details: ContactMessageEmailDetails): EmailContent {
  const safeSubject = sanitizeHeaderValue(details.subject || 'Contact message');
  const fullName = getFullName(details) || 'there';
  const rows = buildContactRows(details);

  return {
    subject: `Thank you for contacting RRISL (${details.reference}) - ${safeSubject}`,
    text: [
      `Dear ${fullName},`,
      '',
      'Thank you for contacting the Rubber Research Institute of Sri Lanka. Your message has been received successfully and will be reviewed by the relevant team.',
      '',
      ...buildDetailsText(rows),
      '',
      'Message:',
      details.message,
      '',
      'If a response is required, RRISL will contact you using the details you provided.',
      '',
      'Yours sincerely,',
      'Rubber Research Institute of Sri Lanka',
    ].join('\n'),
    html: buildEmailLayout({
      footerNote: 'This is an automated acknowledgement from the RRISL contact form system.',
      greeting: `Dear ${fullName},`,
      introduction:
        'Thank you for contacting the Rubber Research Institute of Sri Lanka. Your message has been received successfully and will be reviewed by the relevant team.',
      rows,
      message: details.message,
      closing: 'If a response is required, RRISL will contact you using the details you provided.',
      title: 'Contact Form Acknowledgement',
    }),
  };
}

export {
  buildAdminContactMessageEmail,
  buildUserContactMessageEmail,
  type ContactMessageEmailDetails,
};
