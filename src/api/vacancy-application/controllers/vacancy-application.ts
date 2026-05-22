/**
 * vacancy-application controller
 */

import { errors } from '@strapi/utils';
import type { Core } from '@strapi/strapi';

const { ValidationError, ApplicationError } = errors;

type SubmitResult = {
  vacancyTitle: string;
};

function getSingleFile(fileValue: unknown) {
  if (!fileValue) {
    return null;
  }

  return Array.isArray(fileValue) ? fileValue[0] || null : fileValue;
}

export default {
  async submit(ctx: any) {
    const slug = String(ctx.params?.slug || '').trim();

    if (!slug) {
      throw new ValidationError('Vacancy slug is required.');
    }

    const body = ctx.request?.body || {};
    const files = ctx.request?.files || {};
    const cvFile = getSingleFile(files.cv);

    if (!cvFile) {
      throw new ValidationError('CV file is required.');
    }

    const payload = {
      fullname: typeof body.fullname === 'string' ? body.fullname : body.fullName,
      email: body.email,
      contactnumber:
        typeof body.contactnumber === 'string' ? body.contactnumber : body.contactNumber,
    };

    let result: SubmitResult;

    try {
      result = await (strapi as Core.Strapi)
        .service('api::vacancy-application.vacancy-application')
        .submitApplication({
          cvFile,
          payload,
          slug,
        });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ApplicationError) {
        throw error;
      }

      strapi.log.error('Failed to submit vacancy application', error);
      throw new ApplicationError('Unable to submit vacancy application.');
    }

    ctx.status = 201;
    ctx.body = {
      data: {
        message: 'Vacancy application submitted successfully.',
        vacancyTitle: result.vacancyTitle,
      },
    };
  },
};
