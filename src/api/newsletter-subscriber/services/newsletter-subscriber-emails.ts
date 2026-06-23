import {
  buildDetailsText,
  buildEmailLayout,
  formatSubmittedAt,
  sanitizeHeaderValue,
  type DetailRow,
  type EmailContent,
} from '../../../utils/email-notifications';

type NewsletterSubscriberEmailDetails = {
  email: string;
  reference: string;
  sourcePage: string;
  state: string;
  subscribedAt: string;
};

function buildNewsletterRows(details: NewsletterSubscriberEmailDetails): DetailRow[] {
  return [
    ['Reference', details.reference],
    ['Email', details.email],
    ['Source page', details.sourcePage],
    ['State', details.state],
    ['Subscribed', formatSubmittedAt(details.subscribedAt)],
  ];
}

function buildUserNewsletterRows(details: NewsletterSubscriberEmailDetails): DetailRow[] {
  return [
    ['Reference', details.reference],
    ['State', details.state],
    ['Subscribed', formatSubmittedAt(details.subscribedAt)],
  ];
}

function buildAdminNewsletterSubscriberEmail(
  details: NewsletterSubscriberEmailDetails
): EmailContent {
  const rows = buildNewsletterRows(details);

  return {
    subject: `[RRISL Newsletter] New subscriber (${sanitizeHeaderValue(details.reference)})`,
    text: [
      'Dear RRISL Newsletter Team,',
      '',
      'A new newsletter subscription has been submitted through the RRISL website.',
      '',
      ...buildDetailsText(rows),
      '',
      'The subscriber record is also retained in the RRISL administration system.',
      '',
      'RRISL Newsletter Subscription System',
    ].join('\n'),
    html: buildEmailLayout({
      footerNote: 'This is an automated message from the RRISL newsletter subscription system.',
      greeting: 'Dear RRISL Newsletter Team,',
      introduction:
        'A new newsletter subscription has been submitted through the RRISL website.',
      rows,
      closing: 'The subscriber record is also retained in the RRISL administration system.',
      title: 'Newsletter Subscription',
    }),
  };
}

function buildUserNewsletterSubscriberEmail(
  details: NewsletterSubscriberEmailDetails
): EmailContent {
  const rows = buildUserNewsletterRows(details);

  return {
    subject: `RRISL newsletter subscription received (${sanitizeHeaderValue(details.reference)})`,
    text: [
      'Dear subscriber,',
      '',
      'Thank you for subscribing to updates from the Rubber Research Institute of Sri Lanka. Your subscription has been received successfully.',
      '',
      ...buildDetailsText(rows),
      '',
      'Yours sincerely,',
      'Rubber Research Institute of Sri Lanka',
    ].join('\n'),
    html: buildEmailLayout({
      footerNote: 'This is an automated acknowledgement from the RRISL newsletter subscription system.',
      greeting: 'Dear subscriber,',
      introduction:
        'Thank you for subscribing to updates from the Rubber Research Institute of Sri Lanka. Your subscription has been received successfully.',
      rows,
      title: 'Newsletter Subscription Acknowledgement',
    }),
  };
}

export {
  buildAdminNewsletterSubscriberEmail,
  buildUserNewsletterSubscriberEmail,
  type NewsletterSubscriberEmailDetails,
};
