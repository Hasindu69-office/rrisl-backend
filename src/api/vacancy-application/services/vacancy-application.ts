/**
 * vacancy-application service
 */

import { errors } from '@strapi/utils';
import type { Core } from '@strapi/strapi';
import {
  buildAdminApplicationEmail,
  buildApplicantApplicationEmail,
  type VacancyApplicationEmailDetails,
} from './vacancy-application-emails';

const { ApplicationError, ValidationError } = errors;

const VACANCY_UID = 'api::vacancy.vacancy';
const VACANCY_APPLICATION_UID = 'api::vacancy-application.vacancy-application';

const ALLOWED_CV_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_CV_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

type ApplicationPayload = {
  fullname?: unknown;
  email?: unknown;
  contactnumber?: unknown;
};

type SubmitApplicationInput = {
  cvFile: any;
  payload: ApplicationPayload;
  slug: string;
};

type VacancyRecord = {
  id: number;
  title?: string;
  slug?: string;
  state?: string;
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex >= 0 ? filename.slice(lastDotIndex).toLowerCase() : '';
}

function assertValidPayload(payload: ApplicationPayload) {
  const fullname = normalizeString(payload.fullname);
  const email = normalizeEmail(payload.email);
  const contactnumber = normalizeString(payload.contactnumber);

  if (fullname.length < 3 || fullname.length > 255) {
    throw new ValidationError('Full name must be between 3 and 255 characters.');
  }

  if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('A valid email address is required.');
  }

  if (
    contactnumber.length < 7 ||
    contactnumber.length > 20 ||
    !/^[+\d\s\-()]+$/.test(contactnumber)
  ) {
    throw new ValidationError('Contact number must be between 7 and 20 valid phone characters.');
  }

  return {
    contactnumber,
    email,
    fullname,
  };
}

function assertValidCvFile(file: any) {
  const mimeType = normalizeString(file?.mimetype).toLowerCase();
  const originalFilename = normalizeString(file?.originalFilename || file?.name);
  const extension = getFileExtension(originalFilename);

  if (!originalFilename) {
    throw new ValidationError('CV file name is required.');
  }

  if (!ALLOWED_CV_MIME_TYPES.has(mimeType) || !ALLOWED_CV_EXTENSIONS.has(extension)) {
    throw new ValidationError('CV must be a PDF, DOC, or DOCX file.');
  }

  if (!file?.size || Number(file.size) <= 0) {
    throw new ValidationError('CV file is empty.');
  }
}

async function sendNotificationEmails({
  cvFile,
  details,
}: {
  cvFile: any;
  details: VacancyApplicationEmailDetails;
}) {
  const adminRecipients = (process.env.VACANCY_APPLICATION_NOTIFY_TO || '')
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean);
  const fromAddress = process.env.SMTP_DEFAULT_FROM || undefined;
  const adminEmail = buildAdminApplicationEmail(details);
  const applicantEmail = buildApplicantApplicationEmail(details);
  const deliveryTasks: Array<{ recipientType: 'admin' | 'applicant'; send: Promise<unknown> }> = [];

  if (adminRecipients.length > 0) {
    deliveryTasks.push({
      recipientType: 'admin',
      send: strapi.plugin('email').service('email').send({
        to: adminRecipients.join(', '),
        from: fromAddress,
        replyTo: details.applicantEmail,
        subject: adminEmail.subject,
        text: adminEmail.text,
        html: adminEmail.html,
        attachments: [
          {
            filename: details.cvFilename,
            path: cvFile.filepath,
            contentType: cvFile.mimetype,
          },
        ],
      }),
    });
  } else {
    strapi.log.error(
      `[Vacancy application ${details.applicationReference}] Admin notification skipped: VACANCY_APPLICATION_NOTIFY_TO is not configured.`
    );
  }

  deliveryTasks.push({
    recipientType: 'applicant',
    send: strapi.plugin('email').service('email').send({
      to: details.applicantEmail,
      from: fromAddress,
      subject: applicantEmail.subject,
      text: applicantEmail.text,
      html: applicantEmail.html,
    }),
  });

  const results = await Promise.allSettled(deliveryTasks.map(({ send }) => send));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const recipientType = deliveryTasks[index].recipientType;
      strapi.log.error(
        `[Vacancy application ${details.applicationReference}] Failed to send ${recipientType} notification.`,
        result.reason
      );
    }
  });
}

function getCvFilename(file: any): string {
  const filename = normalizeString(file?.originalFilename || file?.name);
  const normalizedPath = filename.replace(/\\/g, '/');
  return normalizedPath.slice(normalizedPath.lastIndexOf('/') + 1);
}

function getApplicationReference(applicationId: unknown): string {
  const normalizedId = String(applicationId ?? '').trim();
  return `RRISL-VA-${normalizedId || 'UNKNOWN'}`;
}

function assertCvAttachmentIsAvailable(file: any) {
  if (!normalizeString(file?.filepath)) {
    throw new ValidationError('CV temporary file path is unavailable.');
  }
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async submitApplication({ cvFile, payload, slug }: SubmitApplicationInput) {
    const normalizedSlug = normalizeString(slug);
    const { fullname, email, contactnumber } = assertValidPayload(payload);

    assertValidCvFile(cvFile);
    assertCvAttachmentIsAvailable(cvFile);

    const vacancy = (await strapi.db.query(VACANCY_UID).findOne({
      where: { slug: normalizedSlug },
    })) as VacancyRecord | null;

    if (!vacancy) {
      throw new ValidationError('Vacancy not found.');
    }

    if (vacancy.state !== 'open') {
      throw new ApplicationError('Applications are not accepted for this vacancy.');
    }

    const existingApplication = await strapi.db.query(VACANCY_APPLICATION_UID).findOne({
      where: {
        email,
        vacancy: vacancy.id,
      },
    });

    if (existingApplication) {
      throw new ApplicationError('An application has already been submitted for this vacancy.');
    }

    const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
      data: {},
      files: [cvFile],
    });

    const uploadedCv = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;

    if (!uploadedCv?.id) {
      throw new ApplicationError('CV upload failed.');
    }

    const submittedAt = new Date().toISOString();
    const vacancyTitle = vacancy.title || normalizedSlug;
    const vacancySlug = vacancy.slug || normalizedSlug;

    const application = await strapi.db.query(VACANCY_APPLICATION_UID).create({
      data: {
        fullname,
        email,
        contactnumber,
        cv: uploadedCv.id,
        state: 'submitted',
        submittedat: submittedAt,
        vacancy: vacancy.id,
        vacancytitle: vacancyTitle,
        vacancyslug: vacancySlug,
      },
    });

    if (!application) {
      throw new ApplicationError('Failed to create vacancy application.');
    }

    const applicationReference = getApplicationReference(application.id);

    try {
      await sendNotificationEmails({
        cvFile,
        details: {
          applicantEmail: email,
          applicantName: fullname,
          applicationReference,
          contactNumber: contactnumber,
          cvFilename: getCvFilename(cvFile),
          submittedAt,
          vacancyTitle,
        },
      });
    } catch (error) {
      strapi.log.error(
        `[Vacancy application ${applicationReference}] Unexpected notification failure.`,
        error
      );
    }

    return {
      applicationId: application.id,
      vacancyTitle,
    };
  },
});
