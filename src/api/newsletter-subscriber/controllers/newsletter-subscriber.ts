/**
 * newsletter-subscriber controller
 */

import { factories } from '@strapi/strapi';
import {
  getCreatedRecordReference,
  normalizeString,
  parseRecipientList,
  sendIndependentNotifications,
  type DeliveryTask,
} from '../../../utils/email-notifications';
import {
  buildAdminNewsletterSubscriberEmail,
  buildUserNewsletterSubscriberEmail,
  type NewsletterSubscriberEmailDetails,
} from '../services/newsletter-subscriber-emails';

async function sendNewsletterSubscriberNotifications({
  details,
  strapi,
}: {
  details: NewsletterSubscriberEmailDetails;
  strapi: any;
}) {
  const adminRecipients = parseRecipientList(process.env.NEWSLETTER_SUBSCRIPTION_NOTIFY_TO);
  const fromAddress = process.env.SMTP_DEFAULT_FROM || undefined;
  const adminEmail = buildAdminNewsletterSubscriberEmail(details);
  const userEmail = buildUserNewsletterSubscriberEmail(details);
  const deliveryTasks: DeliveryTask[] = [];

  if (adminRecipients.length > 0) {
    deliveryTasks.push({
      recipientType: 'admin',
      send: strapi.plugin('email').service('email').send({
        to: adminRecipients.join(', '),
        from: fromAddress,
        subject: adminEmail.subject,
        text: adminEmail.text,
        html: adminEmail.html,
      }),
    });
  } else {
    strapi.log.error(
      `[newsletter-subscription ${details.reference}] Admin notification skipped: NEWSLETTER_SUBSCRIPTION_NOTIFY_TO is not configured.`
    );
  }

  deliveryTasks.push({
    recipientType: 'user',
    send: strapi.plugin('email').service('email').send({
      to: details.email,
      from: fromAddress,
      subject: userEmail.subject,
      text: userEmail.text,
      html: userEmail.html,
    }),
  });

  await sendIndependentNotifications({
    feature: 'newsletter-subscription',
    reference: details.reference,
    strapi,
    tasks: deliveryTasks,
  });
}

export default factories.createCoreController(
  'api::newsletter-subscriber.newsletter-subscriber',
  ({ strapi }) => ({
    async create(ctx) {
      const response = await super.create(ctx);
      const payload = ctx.request.body?.data || {};
      const reference = getCreatedRecordReference(response, 'RRISL-NS');
      const subscribedAt =
        normalizeString(payload.SubscribedAt) ||
        normalizeString(payload.subscribedAt) ||
        new Date().toISOString();

      try {
        await sendNewsletterSubscriberNotifications({
          strapi,
          details: {
            email: normalizeString(payload.Email || payload.email).toLowerCase(),
            reference,
            sourcePage: normalizeString(payload.SourcePage || payload.sourcePage) || '/',
            state: normalizeString(payload.State || payload.state) || 'Active',
            subscribedAt,
          },
        });
      } catch (error) {
        strapi.log.error(
          `[newsletter-subscription ${reference}] Unexpected notification failure.`,
          error
        );
      }

      return response;
    },
  })
);
