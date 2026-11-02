'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const ACHIEVEMENT_CATEGORIES = [
  {
    title: 'Patents and Industrial Designs',
    sortorder: 1,
    points: [
      'Improvement to the existing rubber tapping knife, which is currently being used as technically specified tapping knife',
    ],
  },
  {
    title: 'Awards',
    sortorder: 2,
    points: [
      'Mr. M N. Alwis, Research Officer, Plant Science Department, was awarded Second Best Innovation in Sri Lanka in 2023 at the National Rubber, Plastic and Fibre-Based Industry Innovation Competition organized by the Ministry of Industries to newly developed porous root trainer pot.',
      'Dr. N.M.C. Nayanakantha received an award for the “Contribution Made to RubberIndustry during 2016-2018”at the 7th Symposium on Plantation Crop Research, 04-06th November 2019, Marino Beach Hotel, Colombo',
      'Dr. N.M.C. Nayanakantha received an award for the “Contribution Made to Rubber Industry during 2014-2015”at the 6th Symposium on Plantation Crop Research, 2nd -4th November, 2016, Colombo.',
    ],
  },
  {
    title: 'Grants (Internation / Local)',
    sortorder: 3,
    points: [
      'Rubber Master Plan project on Improve the rubber sector by addressing productivity improvement, labour shortage and sustainable harvesting techniques in untapped rubber lands',
      'Rubber Master Plan project on NVQ certification for Rubber Harvesting Assistants',
      'introduced internationally recognized National Vocational Qualification (NVQ) Level 3 for Rubber Harvesters to enhance their social status, financial stability and attracting young workers to the industry. 169 candidates were awarded with NVQ certificates.',
    ],
  },
];

function toPoints(entries) {
  return entries.map((paragraph) => ({ paragraph }));
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
      throw new Error(`English Plant Science Department document was not found (${CONTENT_TYPE_UID}).`);
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        achievementspresent: true,
        achievementssection: {
          sectiontitle: 'Our Achievements',
          categories: ACHIEVEMENT_CATEGORIES.map((category) => ({
            title: category.title,
            sortorder: category.sortorder,
            points: toPoints(category.points),
          })),
        },
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
      `Updated and published the ${LOCALE} Plant Science achievements section with ${ACHIEVEMENT_CATEGORIES.length} categories and ${totalEntries} entries (right image left for CMS).`
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
    console.error('Failed to update the Plant Science achievements section.');
    console.error(error);
    process.exit(1);
  });
