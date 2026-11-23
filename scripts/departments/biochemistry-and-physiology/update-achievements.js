'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::biochemistry-and-physiology-department.biochemistry-and-physiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biochemistry and Physiology';

const ACHIEVEMENT_CATEGORIES = [
  {
    title: 'Patents and Industrial Designs',
    sortorder: 1,
    points: [
      'Eco-friendly Sealant from an Industrial Waste for Fixing Rain Guards on Rubber Trees – K.V.V.S. Kudaligama, V.H.L. Rodrigo, G. V. L. Nilmini, P.D.J. Rodrigo, D. Ramawikrama, G. D. W. Kulathunga (Patent No. 14093).',
      'In-situ Coir-based Biological Odour Filter for Controlling Odours from Wastewater Treatment Facilities and Polluted Natural Environments – M.T. Warnakula, K.V.V.S. Kudaligama, D. Ramawikrama, P.D.J. Rodrigo (Patent No. 11532).',
      'Rubber-Stabilized Earth Block for Load-Bearing Walls – R.U. Halwathura, C. D. Udawatta, K.V.V.S. Kudaligama (Patent No. 19379).',
      'Oleic Acid-based Ethephon Formulation to Enhance Yield of Rubber Trees – Application No. LK/P/1/22928.',
      'Low-cost Handmade Compost-enriched Rubberized Coir Pith Medium for Production of Biofungicide – Application No. LK/P/1/22927.',
    ],
  },
  {
    title: 'Awards',
    sortorder: 2,
    points: [
      'National Awards for Excellence in Agricultural Research — Dr. V. H. L. Rodrigo and Dr. K. V. V. S. Kudaligama — Awarded by the Sri Lanka Council for Agricultural Research Policy (SLCARP) for pioneering research on low-intensity harvesting systems.',
      'GRC Postgraduate Award 2015 — Dr. K. V. V. S. Kudaligama — Awarded by Sri Lanka Association for the Advancement of Science (SLAAS) in recognition of excellence in postgraduate research.',
      'Merit Award — Presidential Awards for Inventions (2018) — Dr. K. V. V. S. Kudaligama — In recognition of innovative research contributions and technological advancement.',
      'Best Presenter Award — N P S N Karunarathne — Awarded at 7th Symposium on Plantation Crop Research (2019) for the presentation on the effectiveness of selected water-based and oil-based ethephon formulations as yield stimulants in Hevea brasiliensis.',
    ],
  },
  {
    title: 'Grants (Internation / Local)',
    sortorder: 3,
    points: [
      'Foreign: Technical Cooperation Project – Food and Agriculture Organization of the United Nations - Revitalization of Rubber Smallholders through Productivity Enhancement Monaragala and Kalutara districts',
      'Special Treasury Grant – Development project 2018 – 2022: Effective introduction of newly developed Low Intensity Harvesting (LIH) systems to address the current issues in rubber plantation industry',
      'National Science Foundation grant RG/2017/AG/01: Development of in-country ethephon formulations to promote low cost harvesting systems for rubber plantations in Sri Lanka',
      'National Science Foundation grant RG/2016/AG/01: Investigations on biological control measure for white root diseases of rubber to improve integrated disease management strategies',
      'Research Grant ASP/06/RE/SCI/2013/02 University of Sri Jayawardhenapura: Geo special analysis for modeling the optimized latex yield of rubber',
      'National Science Foundation grant NSF grant RG/2011/AG/10: Addressing the needs of rubber (Hevea brasiliensis) grown in dryer regions of Sri Lanka through the assessments on physiological parameters and the quality of raw rubber produced.',
      'National Science Foundation grant RG/2006/AG/7: Development of low frequency tapping systems to address the tapper shortage and to reduce the cost of production in the rubber industry in Sri Lanka',
      'Junior Scientists Research Grants from Climate Change Enabling Project Phase II - 2004: Effect of rainfall on the pollution problem associated with processing of natural rubber',
    ],
  },
];

function toPoints(entries) {
  return entries.map((paragraph) => ({ paragraph }));
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function getPopulate() {
  return {
    achievementssection: {
      populate: {
        rightimage: true,
        categories: {
          populate: {
            points: true,
          },
        },
      },
    },
  };
}

async function findDepartment(repository) {
  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate: getPopulate() })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate: getPopulate() })
  );
}

function assertPublishedResult(department) {
  if (department?.achievementspresent !== true) {
    throw new Error('Achievements verification failed: achievementspresent is not enabled.');
  }

  const section = department?.achievementssection;

  if (section?.sectiontitle?.trim() !== 'Our Achievements') {
    throw new Error('Achievements verification failed: section title is not Our Achievements.');
  }

  const categories = section?.categories || [];

  if (categories.length !== ACHIEVEMENT_CATEGORIES.length) {
    throw new Error(
      `Achievements verification failed: expected ${ACHIEVEMENT_CATEGORIES.length} categories, found ${categories.length}.`
    );
  }

  for (const expected of ACHIEVEMENT_CATEGORIES) {
    const actual = categories.find((category) => category?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Achievements verification failed: missing category sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Achievements verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const pointCount = actual.points?.length || 0;

    if (pointCount !== expected.points.length) {
      throw new Error(
        `Achievements verification failed: expected ${expected.points.length} entries for "${expected.title}", found ${pointCount}.`
      );
    }
  }
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

    const rightimage = mediaId(department.achievementssection?.rightimage);
    const achievementsPayload = {
      sectiontitle: 'Our Achievements',
      categories: ACHIEVEMENT_CATEGORIES.map((category) => ({
        title: category.title,
        sortorder: category.sortorder,
        points: toPoints(category.points),
      })),
    };

    if (rightimage) {
      achievementsPayload.rightimage = rightimage;
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        achievementspresent: true,
        achievementssection: achievementsPayload,
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
      populate: getPopulate(),
    });

    assertPublishedResult(updatedDepartment);

    const totalEntries = ACHIEVEMENT_CATEGORIES.reduce(
      (sum, category) => sum + category.points.length,
      0
    );

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} achievements section with ${ACHIEVEMENT_CATEGORIES.length} categories and ${totalEntries} entries (right image left for CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} achievements section.`);
    console.error(error);
    process.exit(1);
  });
