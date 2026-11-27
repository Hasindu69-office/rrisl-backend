'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const OVERVIEW = {
  eyebrow: 'Overview',
  title: 'Centre of Excellence in Rubber Disease Management and Soil Microbiology',
  highlightedText: 'Centre of Excellence',
  paragraph:
    'The Plant Pathology and Microbiology Department serves as the Centre of Excellence in research, development and management of rubber diseases, beneficial soil microbiology and other microbiological applications, playing a vital role in safeguarding the health, productivity and long-term sustainability of rubber plantations in Sri Lanka. The Department is responsible for the identification, investigation, monitoring and management of diseases affecting rubber (Hevea brasiliensis), while also exploring and harnessing the beneficial roles of microorganisms in enhancing soil health, plant growth and the overall sustainability of rubber plantation ecosystems.',
  closingparagraph:
    "In addition to its research and development activities, the Department provides essential technical, diagnostic and advisory services to rubber growers, plantation companies and other stakeholders, including disease identification and diagnosis, laboratory investigations, field inspections, technical recommendations, dissemination of research findings and specialised training and capacity-building programmes. Through its integrated research, diagnostic and extension activities, the Department is committed to developing scientifically validated, environmentally sustainable and cost-effective solutions that strengthen the resilience, productivity and long-term viability of Sri Lanka's rubber industry.",
  points: [
    'Screening of rubber clones for disease resistance to identify and promote planting materials with enhanced tolerance or resistance to major diseases.',
    'Screening and evaluation of pesticides for their efficacy, safety and suitability in managing economically important diseases and pests.',
    'Development of Integrated Disease and Pest Management (IDM/IPM) strategies incorporating chemical, biological, cultural and other sustainable management approaches.',
    'Studies on the biology and epidemiology of pathogens and pests to understand their behaviour, distribution, disease development and outbreak patterns.',
    'Surveillance and monitoring of potential pathogens and disease outbreaks to facilitate early detection, risk assessment and timely management interventions.',
    'Research on beneficial soil microorganisms and biological control agents to improve soil health, nutrient availability, plant growth and natural disease suppression.',
    'Molecular and microbiological investigations to characterise pathogens, understand pathogen diversity and develop improved diagnostic and management approaches.',
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
      closingparagraph: OVERVIEW.closingparagraph,
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
