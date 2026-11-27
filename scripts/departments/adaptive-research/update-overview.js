'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::adaptive-research-department.adaptive-research-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Adaptive Research';

const OVERVIEW = {
  eyebrow: 'Overview',
  title:
    'Adaptability evaluation of recommended technologies and expansion of rubber into non-traditional areas',
  highlightedText: 'non-traditional areas',
  paragraph:
    'This unit uses both “Top-down” and “Bottom-up” approaches to refine the technologies available in the large-scale plantation sector in favour of smallholders and plan the future research to cater the smallholder requirements, respectively. Among the research activities of the unit, developing rubber-based farming systems particularly to the non-traditional areas whilst characterizing the socio-economic conditions of smallholdings is in top priority.',
  points: [
    'Refining large-scale plantation technologies through top-down and bottom-up approaches to suit smallholder requirements and guide future research.',
    'Developing adaptable rubber-based farming systems tailored to non-traditional rubber-growing areas.',
    'Characterizing the socio-economic conditions of rubber smallholdings to support smallholder-focused research and development.',
  ],
};

async function findDepartment(repository) {
  const populate = {
    introductionsection: {
      populate: {
        sectionheader: true,
        points: {
          populate: {
            icon: true,
          },
        },
        videothumbnail: true,
        backgroundimage: true,
        featureimage: true,
      },
    },
  };

  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate })
  );
}

function getReusableIconId(department) {
  const points = department?.introductionsection?.points;

  if (!Array.isArray(points)) {
    return null;
  }

  for (const point of points) {
    const iconId = point?.icon?.id;

    if (iconId) {
      return iconId;
    }
  }

  return null;
}

async function findFallbackIconId(strapi) {
  const files = await strapi.db.query('plugin::upload.file').findMany({
    where: {
      mime: { $containsi: 'image' },
    },
    limit: 20,
  });

  for (const file of files || []) {
    const name = `${file?.name || ''} ${file?.hash || ''}`.toLowerCase();

    if (
      name.includes('thumbnail_') ||
      name.includes('small_') ||
      name.includes('medium_') ||
      name.includes('large_')
    ) {
      continue;
    }

    if (Number.isInteger(file?.id)) {
      return file.id;
    }
  }

  return null;
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

async function main() {
  const appContext = await compileStrapi({ appDir: process.cwd() });
  const app = createStrapi(appContext);

  try {
    await app.load();

    const repository = app.documents(CONTENT_TYPE_UID);
    const department = await findDepartment(repository);

    if (!department?.documentId) {
      throw new Error(
        `English ${DEPARTMENT_LABEL} Department document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
      );
    }

    const introduction = department.introductionsection || {};
    let iconId = getReusableIconId(department);

    if (!iconId) {
      iconId = await findFallbackIconId(app);
    }

    if (!iconId) {
      throw new Error(
        'No overview point icon is available to reuse. Upload any image in Media Library (or set one overview point icon in CMS), then re-run this script.'
      );
    }

    const preservedUrl = introduction.url?.trim() || null;
    const videoUrl = preservedUrl || 'https://www.rrisl.gov.lk';

    if (!preservedUrl) {
      console.warn(
        'No existing overview video URL found. Wrote a temporary placeholder URL; replace it in CMS when you upload the department video.'
      );
    }

    const introductionPayload = {
      sectionheader: {
        eyebrow: OVERVIEW.eyebrow,
        title: OVERVIEW.title,
        hightlightedtext: OVERVIEW.highlightedText,
        alignment: 'left',
      },
      paragraph: OVERVIEW.paragraph,
      points: OVERVIEW.points.map((point) => ({
        point,
        icon: iconId,
      })),
      videotitle: introduction.videotitle?.trim() || DEPARTMENT_LABEL,
      url: videoUrl,
      includethumbnail: introduction.includethumbnail === true,
    };

    const backgroundimage = mediaId(introduction.backgroundimage);
    const featureimage = mediaId(introduction.featureimage);
    const videothumbnail = mediaId(introduction.videothumbnail);

    if (backgroundimage) introductionPayload.backgroundimage = backgroundimage;
    if (featureimage) introductionPayload.featureimage = featureimage;
    if (videothumbnail) introductionPayload.videothumbnail = videothumbnail;

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        introductionsection: introductionPayload,
      },
    });

    await repository.publish({
      documentId: department.documentId,
      locale: LOCALE,
    });

    const updatedDepartment = await repository.findOne({
      documentId: department.documentId,
      locale: LOCALE,
      status: 'published',
      populate: {
        introductionsection: {
          populate: {
            points: true,
          },
        },
      },
    });

    const pointCount = updatedDepartment?.introductionsection?.points?.length || 0;

    if (pointCount !== OVERVIEW.points.length) {
      throw new Error(
        `Overview verification failed: expected ${OVERVIEW.points.length} points, found ${pointCount}.`
      );
    }

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} overview with ${pointCount} focus areas (video/images left for CMS when missing).`
    );
  } finally {
    if (app.isLoaded) {
      await app.destroy();
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Failed to update the ${DEPARTMENT_LABEL} overview.`);
    console.error(error);
    process.exit(1);
  });
