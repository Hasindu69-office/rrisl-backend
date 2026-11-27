'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::adaptive-research-department.adaptive-research-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Adaptive Research';

const ACHIEVEMENT_CATEGORIES = [
  {
    title: 'Awards',
    sortorder: 1,
    points: [
      'Presidential Awards for Research – 2004 — Dr. (Mrs.) E.S. Munasinghe',
      'National Award for the Excellence in Agricultural Research – 2014 — Dr. (Mrs.) E.S. Munasinghe',
      'National Research Council Merit Award for Scientific Publication – 2014 — Dr. (Mrs.) E.S. Munasinghe',
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
