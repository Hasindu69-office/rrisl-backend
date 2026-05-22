/**
 * vacancy-application service
 */

import { errors } from '@strapi/utils';
import type { Core } from '@strapi/strapi';

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
  applicantEmail,
  applicantName,
  vacancyTitle,
}: {
  applicantEmail: string;
  applicantName: string;
  vacancyTitle: string;
}) {
  const adminRecipient = process.env.VACANCY_APPLICATION_NOTIFY_TO;
  const fromAddress =
    process.env.SMTP_DEFAULT_FROM || process.env.SMTP_DEFAULT_REPLY_TO || undefined;

  try {
    if (adminRecipient) {
      await strapi.plugin('email').service('email').send({
        to: adminRecipient,
        from: fromAddress,
        subject: `New vacancy application: ${vacancyTitle}`,
        text: [
          `A new application was submitted for "${vacancyTitle}".`,
          '',
          `Applicant: ${applicantName}`,
          `Email: ${applicantEmail}`,
        ].join('\n'),
      });
    }

    await strapi.plugin('email').service('email').send({
      to: applicantEmail,
      from: fromAddress,
      subject: `Application received: ${vacancyTitle}`,
      text: [
        `Dear ${applicantName},`,
        '',
        `Your application for "${vacancyTitle}" has been received successfully.`,
        'Our team will review it and contact you if shortlisted.',
      ].join('\n'),
    });
  } catch (error) {
    strapi.log.error('Failed to send vacancy application email notifications', error);
  }
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async submitApplication({ cvFile, payload, slug }: SubmitApplicationInput) {
    const normalizedSlug = normalizeString(slug);
    const { fullname, email, contactnumber } = assertValidPayload(payload);

    assertValidCvFile(cvFile);

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

    await sendNotificationEmails({
      applicantEmail: email,
      applicantName: fullname,
      vacancyTitle,
    });

    return {
      applicationId: application.id,
      vacancyTitle,
    };
  },
});
