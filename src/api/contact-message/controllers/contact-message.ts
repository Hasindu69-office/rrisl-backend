/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi';
import {
  getCreatedRecordReference,
  normalizeRoutingKey,
  normalizeString,
  parseRecipientList,
  parseRecipientRouting,
  sendIndependentNotifications,
  type DeliveryTask,
} from '../../../utils/email-notifications';
import {
  buildAdminContactMessageEmail,
  buildUserContactMessageEmail,
  type ContactMessageEmailDetails,
} from '../services/contact-message-emails';

function getContactRecipients(subject: string): string[] {
  const routes = parseRecipientRouting(process.env.CONTACT_MESSAGE_NOTIFY_BY_SUBJECT);
  const routedRecipients = routes[normalizeRoutingKey(subject)];

  if (routedRecipients?.length) {
    return routedRecipients;
  }

  return parseRecipientList(process.env.CONTACT_MESSAGE_NOTIFY_TO);
}

async function sendContactMessageNotifications({
  details,
  strapi,
}: {
  details: ContactMessageEmailDetails;
  strapi: any;
}) {
  const adminRecipients = getContactRecipients(details.subject);
  const fromAddress = process.env.SMTP_DEFAULT_FROM || undefined;
  const adminEmail = buildAdminContactMessageEmail(details);
  const userEmail = buildUserContactMessageEmail(details);
  const deliveryTasks: DeliveryTask[] = [];

  if (adminRecipients.length > 0) {
    deliveryTasks.push({
      recipientType: 'admin',
      send: strapi.plugin('email').service('email').send({
        to: adminRecipients.join(', '),
        from: fromAddress,
        replyTo: details.email,
        subject: adminEmail.subject,
        text: adminEmail.text,
        html: adminEmail.html,
      }),
    });
  } else {
    strapi.log.error(
      `[contact-message ${details.reference}] Admin notification skipped: CONTACT_MESSAGE_NOTIFY_TO is not configured and no CONTACT_MESSAGE_NOTIFY_BY_SUBJECT route matched.`
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
    feature: 'contact-message',
    reference: details.reference,
    strapi,
    tasks: deliveryTasks,
  });
}

export default factories.createCoreController(
  'api::contact-message.contact-message',
  ({ strapi }) => ({
    async create(ctx) {
      const response = await super.create(ctx);
      const payload = ctx.request.body?.data || {};
      const reference = getCreatedRecordReference(response, 'RRISL-CM');
      const submittedAt = new Date().toISOString();

      try {
        await sendContactMessageNotifications({
          strapi,
          details: {
            email: normalizeString(payload.email).toLowerCase(),
            firstName: normalizeString(payload.firstname),
            lastName: normalizeString(payload.lastname),
            message: normalizeString(payload.message),
            phoneNumber: normalizeString(payload.phonenumber),
            reference,
            subject: normalizeString(payload.subject),
            submittedAt,
          },
        });
      } catch (error) {
        strapi.log.error(`[contact-message ${reference}] Unexpected notification failure.`, error);
      }

      return response;
    },
  })
);
